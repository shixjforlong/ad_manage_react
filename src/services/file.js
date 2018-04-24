import request from '../utils/request';

export async function removeFile({ id }) {
  return request(`/api/file/${id}`, {
    method: 'delete',
  });
}
