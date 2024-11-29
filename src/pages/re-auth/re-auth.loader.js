import AuthProvider from '../../provider/auth.provider';
import ReAuthService from './re-auth.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = ReAuthService(client);

const silentLogin = async () => {
  if (AuthProvider.user) return AuthProvider.user;

  const data = service.silentLogin();

  return { data };
};

export default {
  silentLogin,
};
