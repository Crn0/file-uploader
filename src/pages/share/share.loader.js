import AuthProvider from '../../provider/auth.provider';
import ShareService from './share.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';
import FieldError from '../../errors/field.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = ShareService(client);

const root = async (request, params) => {
  const folderDTO = {
    token: params.get('token'),
  };
  const [_, data] = await service.checkAuth(request, AuthProvider);

  const user = data?.user || null;

  return { user, data: service.getFolder(request, folderDTO) };
};

const getSubFolder = async (request, params) => {
  const folderDTO = {
    token: params.get('token'),
    folderId: Number(params.get('folderId')),
  };

  return { data: service.getSubFolder(request, folderDTO) };
};

const sortResources = async (request, params) => {
  const folderDTO = {
    token: params.get('token'),
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

const preview = async (request, params) => {
  const folderDTO = {
    fileId: Number(params.get('id')),
    token: params.get('token'),
  };

  try {
    const [error, data] = await service.preview(request, folderDTO);

    if (error) throw error;
    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const download = async (request, params) => {
  const folderDTO = {
    fileId: Number(params.get('id')),
    token: params.get('token'),
  };

  try {
    const [error, data] = await service.download(request, folderDTO);

    if (error) throw error;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

export default async function loader({ request }) {
  const location = new URL(request.url);
  const params = new URLSearchParams(location.search);
  const type = params.get('type');
  const intent = params.get('intent');

  if (type === 'sub-folder') return getSubFolder(request, params);
  if (intent === 'folder:sort') return sortResources(request, params);
  if (intent === 'file:preview') return preview(request, params);
  if (intent === 'file:download') return download(request, params);

  return root(request, params);
}
