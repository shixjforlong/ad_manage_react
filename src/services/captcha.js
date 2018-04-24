import { stringify } from 'qs';
import request from '../utils/request';

export async function sendSMSCode({ phone }) {
  return request(`/api/sms/code?${stringify({ phone })}`);
}

export async function validateMobile({ phone }) {
  return request(`/api/phone/validate?${stringify({ phone })}`);
}
