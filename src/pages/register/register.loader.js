import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import registerService from './register.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = registerService(client);

const checkAuth = async ({ request }) => {
  if (AuthProvider.user) return AuthProvider.user;

  try {
    const [error, user] = await service.checkAuth(request);

    if (error) throw error;

    AuthProvider.user = user;

    return replace('/');
  } catch (e) {
    if (e instanceof APIError && e.httpCode === 401) return e;

    return e;
  }
};

export default {
  checkAuth,
};
