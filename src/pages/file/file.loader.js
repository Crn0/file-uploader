import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import FileService from './file.service';
import ApiRequest from '../../api/apiRequest';
import FieldError from '../../errors/field.error';
import APIError from '../../errors/api.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = FileService(client);

const share = async (request, params) => {
  const fileDTO = {
    id: Number(params.get('id')),
  };

  if (!AuthProvider.token) return replace(`/login?from=/files/${fileDTO.id}&action=file:share`);

  try {
    const [error, data] = await service.share(request, fileDTO);

    if (error) throw error;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const preview = async (request, params) => {
  const fileDTO = {
    id: Number(params.get('id')),
    transformations: 'width=900,height=900',
  };

  if (!AuthProvider.token) return replace(`/login?from=/files/${fileDTO.id}&action=file:preview`);

  try {
    const [error, data] = await service.preview(request, fileDTO);

    if (error) throw error;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const download = async (request, params) => {
  const fileDTO = {
    id: Number(params.get('id')),
    transformations: 'width=900,height=900',
  };

  if (!AuthProvider.token) return replace(`/login?from=/files/${fileDTO.id}&action=file:download`);

  try {
    const [error, data] = await service.download(request, fileDTO);

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
  const intent = params.get('intent');

  if (intent === 'file:preview') return preview(request, params);
  if (intent === 'file:share') return share(request, params);
  if (intent === 'file:download') return download(request, params);

  throw Error(`Invalid action of ${intent}`);
}
