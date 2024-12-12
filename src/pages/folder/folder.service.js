import APIError from '../../errors/api.error';

export default function FolderService(client) {
  const getFolder = async (request, folderDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/folders/${folderDTO.folderId}?includes=folders,files&limit=1000`,
        'GET',
        headers,
        {},
        request,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  const createSubFolder = async (folderInputDTO, request) => {
    try {
      const headers = new Headers();
      const DTORef = folderInputDTO;
      const { folderId } = DTORef;

      delete DTORef.folderId;

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/folders/${Number(folderId)}/sub-folder`,
        'POST',
        headers,
        DTORef,
        request,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  const createFile = async (formData, request) => {
    try {
      const headers = new Headers();
      const folderId = formData.get('folderId');

      Array.from(formData.keys()).forEach((key) => {
        if (key !== 'file') formData.delete(key);
      });

      const [error, data] = await client.callApi(
        `api/v1/files?folderId=${folderId}`,
        'POST',
        headers,
        formData,
        request,
        true,
        true,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  const generateLink = async (folderDTO, request) => {
    try {
      const headers = new Headers();
      const { folderId, expiration } = folderDTO;

      const [error, data] = await client.callApi(
        `api/v1/folders/${folderId}/link?expiresIn=${expiration}`,
        'GET',
        headers,
        {},
        request,
        true,
        true,
      );

      if (error) throw error;
      await new Promise((res) => {
        setTimeout(res, 5000);
      });
      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({ getFolder, createSubFolder, createFile, generateLink });
}
