import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import LoginService from './login.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';
import FieldError from '../../errors/field.error';
import validation from '../../validation/index';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = LoginService(client);

const login = async ({ request }) => {
  const formData = await request.formData();

  const DTO = {
    email: formData.get('email').trim(),
    password: formData.get('password').trim(),
  };

  if (validation.notValidPassword(DTO.password)) {
    return new FieldError('Validation Failed', [
      {
        type: 'field',
        field: 'password',
        message:
          'Password must contain at least one uppercase letter, one number and be a minimum of 8 characters',
      },
    ]);
  }

  try {
    const [error, data] = await service.login(DTO);

    if (error) throw error;
    AuthProvider.token = data.accessToken;
  } catch (e) {
    if (e instanceof FieldError) return e;
    if (e instanceof APIError) return e;

    throw e;
  }
  const redirectTo = formData.get('redirectTo') || '/';

  return replace(redirectTo);
};

export default { login };
