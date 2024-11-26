import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import registerService from './register.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = registerService(client);

const checkAuth = async () => {
  if (AuthProvider.user) return AuthProvider.user;

  try {
    const [error, _] = await service.checkAuth();

    if (error) throw error;

    return replace('/');
  } catch (e) {
    if (e instanceof APIError) return e;

    throw e;
  }
};

export default {
  checkAuth,
};
