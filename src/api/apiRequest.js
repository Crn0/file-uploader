import FieldError from '../errors/field.error';
import APIError from '../errors/api.error';

const httpRequest = async (url, method, headers, dataToSend, token, signal, isFileUpload) => {
  const ifTheRequestIsNotPostAndPut =
    method.toUpperCase() !== 'POST' && method.toUpperCase() !== 'PUT';

  if (!token) {
    if (ifTheRequestIsNotPostAndPut) {
      return fetch(url, {
        method,
        signal,
        headers,
        credentials: 'include',
        redirect: 'follow',
      });
    }

    if (isFileUpload) {
      return fetch(url, {
        method,
        signal,
        headers,
        body: dataToSend,
        credentials: 'include',
        redirect: 'follow',
      });
    }

    return fetch(url, {
      method,
      signal,
      headers,
      body: JSON.stringify(dataToSend),
      credentials: 'include',
      redirect: 'follow',
    });
  }

  if (ifTheRequestIsNotPostAndPut) {
    return fetch(url, {
      method,
      signal,
      headers,
      token,
      credentials: 'include',
      redirect: 'follow',
    });
  }

  if (isFileUpload) {
    return fetch(url, {
      method,
      signal,
      headers,
      token,
      body: dataToSend,
      credentials: 'include',
      redirect: 'follow',
    });
  }

  return fetch(url, {
    method,
    signal,
    headers,
    token,
    body: JSON.stringify(dataToSend),
    credentials: 'include',
    redirect: 'follow',
  });
};

const callAPIWithToken = async (url, method, headers, dataToSend, token, signal, isFileUpload) => {
  try {
    const headersRef = headers;

    headersRef.append('Authorization', `Bearer ${token}`);

    if (headersRef.get('Authorization')) {
      headersRef.set('Authorization', `Bearer ${token}`);
    }

    const responce = await httpRequest(
      url,
      method,
      headersRef,
      dataToSend,
      token,
      signal,
      isFileUpload,
    );

    if (responce.status === 204) return [null, null];

    const data = await responce.json();

    if (responce?.status === 302) {
      window.location.href = data.url;
      return [null, null];
    }

    if (responce.status === 401) throw new APIError('Unauthorized', 401);

    if (data?.code >= 400 && data?.errors?.[0]?.type === 'field')
      throw new FieldError(data.message, data.errors, data.code);

    if (data?.code >= 400) throw new APIError(data.message, data.code);

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const callAPIWithoutToken = async (url, method, headers, dataToSend, signal) => {
  try {
    const responce = await httpRequest(url, method, headers, dataToSend, null, signal);

    if (responce.status === 204) return [null, null];

    const data = await responce.json();

    if (data?.code >= 400 && data?.errors?.[0]?.type === 'field') {
      throw new FieldError(data.message, data.errors, data.code);
    }

    if (data?.code >= 400) {
      throw new APIError(data.message, data.code);
    }

    return [null, data];
  } catch (error) {
    if (error instanceof FieldError || error instanceof APIError) return [error, null];

    throw new Error(error);
  }
};

export default class ApiRequest {
  #baseURL;

  #provider;

  constructor(baseURL, provider) {
    this.#baseURL = baseURL;

    this.#provider = provider;

    if (!this.#baseURL.endsWith('/')) {
      this.#baseURL += '/';
    }
  }

  async callApi(
    path,
    method,
    headers,
    dataToSend,
    request,
    withToken = true,
    isFileUpload = false,
  ) {
    const url = `${this.#baseURL}${path}`;
    let { token } = this.#provider;

    if (!withToken) return callAPIWithoutToken(url, method, headers, dataToSend, request.signal);

    // if the user login using google open id connect
    // there will be no acess token so we need to hit the
    // refresh token end point to get a new token
    // if (!token) {
    //   const [_, rData] = await this.#provider.refresh();

    //   this.#provider.token = rData.accessToken;

    //   token = this.#provider.token;
    // }

    try {
      const [error, data] = await callAPIWithToken(
        url,
        method,
        headers,
        dataToSend,
        token,
        request.signal,
        isFileUpload,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      // if we received a 401 error refresh the token
      if (e.httpCode !== 401) throw e;

      const [rError, rData] = await this.#provider.refresh();
      // if the refresh token is expired throw an error
      if (rError) throw rError;

      this.#provider.token = rData.accessToken;
      token = this.#provider.token;

      try {
        // retry to call the api again
        const [error, data] = await callAPIWithToken(
          url,
          method,
          headers,
          dataToSend,
          token,
          request.signal,
          isFileUpload,
        );

        if (error) throw error;

        return [null, data];
      } catch (e2) {
        if ((e2 instanceof APIError && e2.code === 401) || e2 instanceof FieldError)
          return [e2, null];

        throw e2;
      }
    }
  }
}
