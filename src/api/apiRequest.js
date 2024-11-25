import FieldError from '../errors/field.error';
import APIError from '../errors/api.error';

const callAPIWithToken = async (url, method, headers, dataToSend, token) => {
  try {
    const headersRef = headers;

    headersRef.append('Authorization', `Bearer ${token}`);

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

    if (data?.code >= 400) throw new APIError(data.message, data.code);

    return [null, data];
  } catch (e) {
    if (e instanceof APIError) return [e, null];

    throw e;
  }
};

const callAPIWithoutToken = async (url, method, headers, dataToSend) => {
  try {
    const res = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(dataToSend),
      credentials: 'include',
    });

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
    // refresh token end point to get a new token and user meta
    if (!token) {
      const [_, rData] = await this.#provider.refresh();

      this.#provider.user = rData.user;
      this.#provider.token = rData.accessToken;

      token = this.#provider.token;
    }

    try {
      return callAPIWithToken(url, method, headers, dataToSend, token);
    } catch (e) {
      if (e.httpCode !== 401) throw e;

      // if we received a 401 error refresh the token and get the user meta
      const [_, rData] = await this.#provider.refresh();

      this.#provider.user = rData.user;
      this.#provider.token = rData.accessToken;

      token = this.#provider.token;

      try {
        // retry to call the api again

        return callAPIWithToken(url, method, headers, dataToSend, token);
      } catch (e2) {
        return e2;
      }
    }
  }
}
