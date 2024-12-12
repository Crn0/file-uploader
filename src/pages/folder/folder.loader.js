import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import FolderService from './folder.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = FolderService(client);

const getFolder = async (request, pathName) => {
  const folderId = Number(pathName.replace(/[^0-9]/g, ''));
  if (!AuthProvider.token) return replace(`/login?from=/folders/${folderId}`);

  const folderDTO = {
    folderId,
  };

  return { data: service.getFolder(request, folderDTO) };
};

export default async function loader({ request }) {
  const location = new URL(request.url);
  const params = new URLSearchParams(location.search);
  const intent = params.get('intent');

  return getFolder(request, location.pathname);
}
