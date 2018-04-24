import { stringify } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import request from '../utils/request';
import { setAuthority } from '../utils/authority';
import app from '../index';
import { reloadAuthorized } from '../utils/Authorized';

export async function query() {
  return request('/mock_api/users');
}

export async function queryCurrent() {
  return request('/oauth2/get_token_info');
}

export async function login(params) {
  return request('/oauth2/access_token', {
    method: 'POST',
    body: {
      client_id: '17953450251798098136',
      client_secret: '08E9EC6793345759456CB8BAE52615F3',
      grant_type: 'password',
      ...params,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  }).then(data => {
    const { access_token: token, expires_in: expiresIn } = data;
    if (token) {
      const expiresAt = moment().add(expiresIn, 's');
      sessionStorage.setItem('token', JSON.stringify({ ...data, expiresAt }));
      if (params.autoLogin) {
        localStorage.setItem('token', JSON.stringify({ ...data, expiresAt }));
      }
      setAuthority('user');
    }
    return data;
  });
}

export async function logout() {
  return request('/api2/logout', {}, false).finally(() => {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
    setAuthority('guest');
  });
}

async function redirectToLogin() {
  setAuthority('guest');
  sessionStorage.removeItem('token');
  localStorage.removeItem('token');
  reloadAuthorized();
  const { _store: { dispatch } } = app;
  await dispatch(routerRedux.push('/exception/403'));
}

let refreshing;

export async function refreshToken() {
  if (refreshing === undefined) {
    refreshing = refresh()
      .then(data => {
        if (!data.access_token) {
          return Promise.reject(data);
        }
        return data;
      })
      .catch(() => {
        return redirectToLogin().then(() => {
          return Promise.reject(new Error('login required'));
        });
      })
      .finally(() => {
        refreshing = undefined;
      });
  }
  return refreshing;
}

async function refresh() {
  const tokenItem =
    sessionStorage.getItem('token') || localStorage.getItem('token');
  if (tokenItem) {
    return login({
      grant_type: 'refresh_token',
      refresh_token: JSON.parse(tokenItem).refresh_token,
    });
  }
  return Promise.reject(new Error('login_required'));
}

export async function register(params) {
  return request('/api2/organizations', {
    method: 'POST',
    body: params,
  });
}

export async function resetPassword(params) {
  return request('/api2/forgotten_password', {
    method: 'POST',
    body: params,
  });
}

export async function getUserInfo(id = 'this', verbose = 100) {
  return request(`/api2/users/${id}`, { params: { verbose } });
}

export async function bindPhone(params) {
  return request('/api2/users/phone', {
    method: 'POST',
    body: params,
  });
}

export async function unbindPhone(code) {
  return request('/api2/users/phone', {
    method: 'delete',
    params: { code },
  });
}

export async function changePassword(id, language, payload) {
  return request(`/api2/users/${id}/password`, {
    method: 'PUT',
    body: payload,
    params: { language },
  });
}

export async function updateUserInfo(id, payload) {
  return request(`/api2/users/${id}`, {
    method: 'PUT',
    body: payload,
    params: { verbose: 100 },
  });
}

export async function fetchUsers(params) {
  return request(`/api2/users?${stringify(params)}`);
}

export async function fetchRoles(params) {
  return request(`/api2/roles?${stringify(params)}`);
}

export async function addUser(payload) {
  return request('/api2/users', {
    method: 'POST',
    body: payload,
  });
}

export async function removeUser({ id }) {
  return request(`/api2/users/${id}`, {
    method: 'delete',
  });
}

export async function updateUser(id, user) {
  return request(`/api2/users/${id}`, {
    method: 'PUT',
    body: user,
    params: { verbose: 100 },
  });
}

export async function resetUserPassword(id, payload, language) {
  return request(`/api2/users/${id}/reset_password`, {
    method: 'PUT',
    body: payload,
    params: { language },
  });
}

export async function lockUser(id) {
  return request(`/api/users/${id}/lock`, {
    method: 'PUT',
  });
}

export async function unlockUser(id) {
  return request(`/api/users/${id}/unlock`, {
    method: 'PUT',
  });
}
