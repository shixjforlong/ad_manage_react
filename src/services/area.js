import { stringify } from 'qs';
import request from '../utils/request';

export async function getAreasList(params) {
  return request('/api/areaMan/list', { params});
}

export async function addArea(params) {
  const resp = request('/api/areaMan/add', { body: params, method: 'post' ,params: { verbose: 100 }});
  return resp;
}

export async function updateArea(params) {
  return request('/api/areaMan/'+params.id, {
    body: params.body,
    method: 'put',
    params: {
      verbose: 100,
    },
  });
}

/*export async function validateArea(params) {
  return request'/api/areaMan/validate', { params });
}*/

export async function removeArea( params) {
  const resp = request('/api/areaMan/delBatch', {
    method: 'post',
    params:{
    	ids:params.id
    }
  });
  return resp;
}
