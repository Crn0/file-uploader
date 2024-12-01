import APIError from '../../errors/api.error';

export default function AppService(client) {
  const silentLogin = async (request) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi('api/v1/users/me', 'GET', headers, {}, request);

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({ silentLogin });
}
