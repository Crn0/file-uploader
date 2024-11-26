import FieldError from '../../errors/field.error';
import APIError from '../../errors/api.error';

export default function LoginService(request) {
  const login = async (userInputDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await request.callApi(
        'api/v1/auth/login',
        'POST',
        headers,
        userInputDTO,
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

  const checkAuth = async () => {
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

  return Object.freeze({
    login,
    checkAuth,
  });
}
