import AuthProvider from '../../provider/auth.provider';
import ShareService from './share.service';
import ApiRequest from '../../api/apiRequest';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = ShareService(client);

const getFolder = async (request, params) => {
  const folderDTO = {
    token: params.get('token'),
  };

  return { data: service.getFolder(request, folderDTO) };
};

const getSubFolder = async (request, params) => {
  const folderDTO = {
    token: params.get('token'),
    folderId: params.get('folderId'),
  };

  return { data: service.getSubFolder(request, folderDTO) };
};

export default async function loader({ request }) {
  const location = new URL(request.url);
  const params = new URLSearchParams(location.search);
  const type = params.get('type');

  if (type === 'sub-folder') return getSubFolder(request, params);

  return getFolder(request, params);
}
