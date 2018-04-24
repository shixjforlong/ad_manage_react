import { stringify } from 'qs';
import request from '../utils/request';

export async function getAlarmsList(params) {
  return request(`/api/alarms2?${stringify(params)}`);
}
export async function confirmAlarm(params) {
  return request(`/api/alarms2/${params.id}`, {
    method: 'PUT',
    body: params.body,
  });
}
export async function alarmOperate(params) {
  return request(`/api/alarms2/?${stringify(params.site_id)}`);
}
