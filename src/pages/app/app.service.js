import AuthProvider from '../../provider/auth.provider';
import APIError from '../../errors/api.error';

export default function AppService(request) {
  const getUser = () => {
    const { user } = AuthProvider;

    return user;
  };

  const logout = async () => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await request.callApi('api/v1/auth/logout', 'POST', headers, {}, false);

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({ getUser, logout });
}
