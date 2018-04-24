import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchLogs(params) {
  return request(`/api2/behav_log?${stringify(params)}`);
}
export async function exportLogs(params) {
  return request('/api/reports/forms', {
    method: 'post',
    body: {
      ...params,
      type: 6,
    },
  });
}
