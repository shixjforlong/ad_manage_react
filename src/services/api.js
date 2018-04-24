import { stringify } from 'qs';
import request from '../utils/request';

export async function queryProjectNotice() {
  return request('/mock/api/project/notice');
}

export async function queryActivities() {
  return request('/mock/api/activities');
}

export async function queryRule(params) {
  return request(`/mock/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/mock/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/mock/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/mock/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/mock/api/fake_chart_data');
}

export async function queryTags() {
  return request('/mock/api/tags');
}

export async function queryBasicProfile() {
  return request('/mock/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/mock/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/mock/api/fake_list?${stringify(params)}`);
}

export async function fakeRegister(params) {
  return request('/mock/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/mock/api/notices');
}
