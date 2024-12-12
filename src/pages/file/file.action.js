import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import FileService from './file.service';
import ApiRequest from '../../api/apiRequest';
import FieldError from '../../errors/field.error';
import APIError from '../../errors/api.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = FileService(client);

const destroy = async (request, params) => {
  const fileDTO = {
    id: Number(params.get('fileId')),
  };

  if (!AuthProvider.token) return replace(`/login?from=/files/${fileDTO.id}&action=file:delete`);

  try {
    const [error, data] = await service.destroy(request, fileDTO);

    if (error) throw error;

    return [null, data];
  } catch (e) {
    if (e instanceof APIError || e instanceof FieldError) return [e, null];

    throw e;
  }
};

const share = async (request, params) => {
  const fileDTO = {
    id: Number(params.get('fileId')),
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

export default async function action({ request }) {
  const formData = await request.formData();

  const intent = formData.get('intent');
  if (intent === 'file:delete') return destroy(request, formData);
  if (intent === 'file:share') return share(request, formData);

  throw Error(`Invalid action of ${intent}`);
}
