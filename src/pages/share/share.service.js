import APIError from '../../errors/api.error';

export default function FolderService(client) {
  const getFolder = async (request, folderDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/share/${folderDTO.token}?includes=folders,files&limit=1000`,
        'GET',
        headers,
        {},
        request,
        false,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  const getSubFolder = async (request, folderDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/share/${folderDTO.token}?folderId=${folderDTO.folderId}?includes=folders,files&limit=1000`,
        'GET',
        headers,
        {},
        request,
        false,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  const sortResources = async (request, folderDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/share/${folderDTO.token}?sortBy=${folderDTO.sort}&includes=folders,files&limit=1000`,
        'GET',
        headers,
        {},
        request,
      );

      console.log(error);
      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({ getFolder, getSubFolder, sortResources });
}
