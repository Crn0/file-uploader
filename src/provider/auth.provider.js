import APIError from '../errors/api.error';

export default class AuthProvider {
  static token = null;

  static user = null;

  get user() {
    return this.user;
  }

  set user(val) {
    this.user = val;
  }

  get token() {
    return this.token;
  }

  set token(val) {
    this.token = val;
  }

  static async refresh() {
    try {
      const myHeaders = new Headers();

      myHeaders.append('Content-Type', 'application/json');

      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/refresh-token`, {
        method: 'POST',
        headers: myHeaders,
        credentials: 'include',
      });

      const data = await res.json();

      if (data?.code >= 400) {
        throw new APIError(data.message, data.code);
      }

      return [null, data];
    } catch (error) {
      if (error instanceof APIError) return [error, null];

      throw error;
    }
  }
}
