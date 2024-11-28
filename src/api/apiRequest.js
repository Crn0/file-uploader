import FieldError from '../errors/field.error';
import APIError from '../errors/api.error';

const callAPIWithToken = async (url, method, headers, dataToSend, token) => {
  try {
    const headersRef = headers;

    headersRef.append('Authorization', `Bearer ${token}`);

    if (headersRef.get('Authorization')) {
      headersRef.set('Authorization', `Bearer ${token}`);
    }

    let res;
    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD') {
      res = await fetch(url, {
        method,
        headers: headersRef,
      });
    } else {
      res = await fetch(url, {
        method,
        headers: headersRef,
        body: JSON.stringify(dataToSend),
      });
    }

    const data = await res.json();

    if (res.status === 401) throw new APIError('Unauthorized', 401);
    if (data?.code >= 400) throw new APIError(data.message, data.code);

    return [null, data];
  } catch (e) {
    if (e instanceof APIError) return [e, null];

    throw e;
  }
};

const callAPIWithoutToken = async (url, method, headers, dataToSend) => {
  try {
    let res;

    if (method.toUpperCase() === 'GET' || method.toUpperCase() === 'HEAD') {
      res = await fetch(url, {
        method,
        headers,
      });
    } else {
      res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(dataToSend),
        credentials: 'include',
      });
    }

    const data = await res.json();

    if (data?.code >= 400) {
      throw new FieldError(data.message, data.errors, data.code);
    }

    return [null, data];
  } catch (error) {
    if (error instanceof FieldError) return [error, null];

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

  async callApi(path, method, headers, dataToSend, withToken = true) {
    const url = `${this.#baseURL}${path}`;
    let { token } = this.#provider;

    if (!withToken) return callAPIWithoutToken(url, method, headers, dataToSend);

    // if the user login using google open id connect
    // there will be no acess token so we need to hit the
    // refresh token end point to get a new token
    // if (!token) {
    //   const [_, rData] = await this.#provider.refresh();

    //   this.#provider.token = rData.accessToken;

    //   token = this.#provider.token;
    // }

    try {
      const [error, data] = await callAPIWithToken(url, method, headers, dataToSend, token);

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
        const [error, data] = await callAPIWithToken(url, method, headers, dataToSend, token);

        if (error) throw error;

        return [null, data];
      } catch (e2) {
        if (e2 instanceof APIError && e2.code === 401) return [e2, null];

        throw e2;
      }
    }
  }
}
