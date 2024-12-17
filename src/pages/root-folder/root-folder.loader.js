import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import RootFolderService from './root-folder.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';
import FieldError from '../../errors/field.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = RootFolderService(client);

const sortResources = async (request, pathName, params) => {
  const folderId = Number(pathName.replace(/[^0-9]/g, ''));
  if (!AuthProvider.token) return replace(`/login?from=/folders/${folderId}`);

  const folderDTO = {
    folderId,
    sort: params.get('sort'),
  };

  try {
    const [error, data] = await service.sortResources(request, folderDTO);

    if (error) throw error;

    return [null, data];
  } catch (error) {
    if (error instanceof APIError || error instanceof FieldError) return [error, null];

    throw error;
  }
};

const getRootFolder = async (request) => {
  if (!AuthProvider.token) return replace('/login?from=/root-folder');

  try {
    return { data: service.getRoot(request) };
  } catch (e) {
    return replace('/login');
  }
};

export default async function loader({ request }) {
  const location = new URL(request.url);
  const params = new URLSearchParams(location.search);
  const intent = params.get('intent');

  if (intent === 'folder:sort') return sortResources(request, location.pathname, params);

  return getRootFolder(request);
}
