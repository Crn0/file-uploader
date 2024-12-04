import FieldError from '../../errors/field.error';
import APIError from '../../errors/api.error';

export default function LoginService(client) {
  const login = async (userInputDTO, request) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        'api/v1/auth/login',
        'POST',
        headers,
        userInputDTO,
        request,
        false,
      );

      if (error) throw error;

      return [null, data];
    } catch (error) {
      if (error instanceof FieldError) return [error, null];
      if (error instanceof APIError) return [error, null];

      throw error;
    }
  };

  const checkAuth = async (request, provider) => {
    try {
      const headers = new Headers();
      const providerRef = provider;

      const [rError, rData] = await providerRef.refresh();

      if (rError) throw rError;

      providerRef.token = rData.accessToken;

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi('api/v1/users/me', 'GET', headers, {}, request);

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({
    login,
    checkAuth,
  });
}
