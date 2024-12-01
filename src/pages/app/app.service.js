import AuthProvider from '../../provider/auth.provider';
import APIError from '../../errors/api.error';

export default function AppService(client) {
  const getUser = () => {
    const { user } = AuthProvider;

    return user;
  };

  const logout = async (request) => {
    try {
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        'api/v1/auth/logout',
        'POST',
        headers,
        {},
        request,
        false,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({ getUser, logout });
}
