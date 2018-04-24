import { stringify } from 'qs';
import request from '../utils/request';

export async function getPhoneAdsList(params) {
  return request('/api/adPhone/list', { params});
}
export async function addPhoneAd(params) {
  const resp = request('/api/adPhone/add', { body: params, method: 'post' ,params: { verbose: 100 }});
  return resp;
}
export async function updatePhoneAd(params) {
  return request('/api/adPhone/'+params.id, {
    body: params.body,
    method: 'put',
    params: {
      verbose: 100,
    },
  });
}

export async function removePhoneAd( params) {
  return request('/api/adPhone/'+params.id, {
    method: 'delete'
  });
  return resp;
}
