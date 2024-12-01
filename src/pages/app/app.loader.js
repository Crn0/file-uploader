import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import AppService from './app.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = AppService(client);

const getUser = () => {
  const user = service.getUser();

  if (!user) return replace('/re-auth');

  return user;
};

const silentLogin = async () => {
  if (AuthProvider.user) return AuthProvider.user;

  const data = service.getUser();

  return { data };
};

export default {
  getUser,
  silentLogin,
};
