import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import AppService from './app.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = AppService(client);

const logout = async (request) => {
  try {
    await service.logout(request);

    return replace('/login');
  } catch (error) {
    return replace('/login');
  }
};

const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'logout') {
    return logout(request);
  }

  throw new Error(`invalid intent of ${intent}`);
};

export default action;
