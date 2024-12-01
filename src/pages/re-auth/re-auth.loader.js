import AuthProvider from '../../provider/auth.provider';
import ReAuthService from './re-auth.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = ReAuthService(client);

const silentLogin = async ({ request }) => {
  if (AuthProvider.user) return AuthProvider.user;

  const data = service.silentLogin(request);

  return { data };
};

export default {
  silentLogin,
};
