import { replace } from 'react-router-dom';
import AuthProvider from '../../provider/auth.provider';
import RootFolderService from './root-folder.service';
import ApiRequest from '../../api/apiRequest';
import APIError from '../../errors/api.error';
import FieldError from '../../errors/field.error';
import validation from '../../validation/index';

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const client = new ApiRequest(BASE_URL, AuthProvider);

const service = RootFolderService(client);

const createSubFolder = async (request, formData) => {
  const DTO = {
    name: formData.get('name') || 'New Folder',
    folderId: formData.get('folderId'),
  };

  try {
    const [error, data] = await service.createSubFolder(DTO, request);

    if (error) throw error;

    return [null, data];
  } catch (error) {
    if (error instanceof APIError || error instanceof FieldError) return [error, null];

    throw error;
  }
};

const createFile = async (request, formData) => {
  try {
    const [error, data] = await service.createFile(formData, request);

    if (error) throw error;

    return [null, data];
  } catch (error) {
    if (error instanceof APIError || error instanceof FieldError) return [error, null];

    throw error;
  }
};

const action = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'create:folder') return createSubFolder(request, formData);
  if (intent === 'create:file') return createFile(request, formData);

  throw Error(`Invalid intent ${intent}`);
};

export default action;
