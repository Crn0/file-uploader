import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import loginService from './login.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';

// SILENT LOGIN AND REDIRECT THE USER

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = loginService(client);

const checkAuth = async ({ request }) => {
  if (AuthProvider.user) return AuthProvider.user;

  try {
    const [rError, rData] = await AuthProvider.refresh();

    if (rError) throw rError;

    AuthProvider.token = rData.accessToken;

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
