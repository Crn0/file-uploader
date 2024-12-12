import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import FolderService from './folder.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';
import FieldError from '../../errors/field.error';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = FolderService(client);

const generateLink = async (request, formData) => {
  const folderId = Number(formData.get('folderId'));
  if (!AuthProvider.token) return replace(`/login?from=/folders/${folderId}`);

  const folderDTO = {
    folderId,
    expiration: formData.get('expiration'),
  };

  try {
    const [error, data] = await service.generateLink(folderDTO, request);

    if (error) throw error;

    return [null, data];
  } catch (error) {
    if (error instanceof APIError || error instanceof FieldError) return [error, null];

    throw error;
  }
};

export default async function action({ request }) {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'folder:share') return generateLink(request, formData);

  throw Error(`Invalid intent ${intent}`);
}
