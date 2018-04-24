import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchData(params) {
  return request(`/api/reports/forms/auto_export?${stringify(params)}`);
}

export async function deletePlanBatch(params) {
  return request(
    `/api/reports/forms/auto_export?oid=${params.oid}&resourceIds=${
      params.resourceIds
    }`,
    {
      method: 'delete',
    }
  );
}
