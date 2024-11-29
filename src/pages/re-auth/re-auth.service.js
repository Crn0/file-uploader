import APIError from '../../errors/api.error';

export default function AppService(request) {
  const silentLogin = async () => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await request.callApi('api/v1/users/me', 'GET', headers, {});

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({ silentLogin });
}
