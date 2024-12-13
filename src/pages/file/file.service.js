import APIError from '../../errors/api.error';
import FieldError from '../../errors/field.error';

export default function FileService(client) {
  const share = async (request, fileDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/files/${fileDTO.id}/link?expiresIn=${fileDTO.expiresIn || '1h'}`,
        'GET',
        headers,
        {},
        request,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];

      throw e;
    }
  };

  const preview = async (request, fileDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/files/${fileDTO.id}/preview`,
        'GET',
        headers,
        {},
        request,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];

      throw e;
    }
  };

  const download = async (request, fileDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/files/${fileDTO.id}/content`,
        'GET',
        headers,
        {},
        request,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];

      throw e;
    }
  };

  const destroy = async (request, fileDTO) => {
    try {
      const headers = new Headers();

      headers.append('Content-Type', 'application/json');

      const [error, data] = await client.callApi(
        `api/v1/files/${fileDTO.id}`,
        'DELETE',
        headers,
        {},
        request,
      );

      if (error) throw error;

      return [null, data];
    } catch (e) {
      if (e instanceof APIError || e instanceof FieldError) return [e, null];

      throw e;
    }
  };

  return Object.freeze({
    share,
    preview,
    download,
    destroy,
  });
}
