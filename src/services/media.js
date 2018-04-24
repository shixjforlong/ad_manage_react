import { stringify } from 'qs';
import request from '../utils/request';

export async function getMediasList(params) {
  return request('/api/medias/list', { params});
}
export async function getOSSTokenInfo(params) {
  return request('/ossapi/auth', { body: params, method: 'post' ,params: { verbose: 100 }});
}

export async function getOSSObjectInfo(params) {
  return request('/ossapi/auth/object', { body: params, method: 'post' ,params: params});
}

export async function addMedia(params) {
  const resp = request('/api/medias/add', { body: params, method: 'post' ,params: { verbose: 100 }});
  return resp;
}
export async function updateMedia(params) {
  return request('/api/medias/'+params.id, {
    body: params.body,
    method: 'put',
    params: {
      verbose: 100,
    },
  });
}

export async function removeMedia( params) {
  return request('/api/medias/'+params.id, {
    method: 'delete'
  });
  return resp;
}
