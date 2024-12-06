import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import RootFolderService from './root-folder.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = RootFolderService(client);

const getRootFolder = async ({ request }) => {
  if (!AuthProvider.token) return replace('/login?from=/root-folder');

  try {
    return { data: service.getRoot(request) };
  } catch (e) {
    return replace('/login');
  }
};

export default {
  getRootFolder,
};
