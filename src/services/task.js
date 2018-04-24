import { stringify } from 'qs';
import request from '../utils/request';

export async function fetchTasks(params) {
  return request(`/api2/tasks?${stringify(params)}`);
}

export async function cancelTask(id) {
  return request(`/api2/tasks/${id}`, {
    method: 'delete',
  });
}
export async function batchCancel(ids) {
  return request('/api/tasks/cancel', {
    method: 'post',
    body: {
      resourceIds: ids,
    },
  });
}

export async function runTask(payload) {
  const { priority = 30, timeout = 20000, ...params } = payload;
  return request('/api2/tasks/run', {
    method: 'post',
    body: { priority, timeout, ...params },
  });
}
