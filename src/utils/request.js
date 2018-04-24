import fetch from 'dva/fetch';
import { stringify } from 'qs';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import { log } from 'debug';
import { refreshToken } from '../services/user';
import app from '../index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status >= 400 && response.status < 500) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

function shouldThrowError({ error, error_code: code }) {
  switch (error) {
    case 'internal_error':
      return true;
    default:
      switch (code) {
        case 10001:
          return true;
        default:
          return false;
      }
  }
}

function isAuthError({ error, error_code: code }) {
  return (
    error === 'invalid_token' ||
    error === 'Miss required parameter (access_token)' ||
    code === 21336
  );
}

export function getToken() {
  const tokenItem =
    sessionStorage.getItem('token') || localStorage.getItem('token');
  if (tokenItem) {
    return JSON.parse(tokenItem).access_token;
  } else {
    message.error('require login');
    return '';
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @param  {boolean} [retry] retry config
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options, retry = true) {
  let defaultOptions = {
    method: 'get',
  };
  const tokenItem =
    sessionStorage.getItem('token') || localStorage.getItem('token');
  
  const newOptions = { ...defaultOptions, ...options };
  if(tokenItem){
    const token = JSON.parse(tokenItem).access_token;
    console.log(newOptions);

    
    if(newOptions.params){
       newOptions.params.access_token = token;
    }
    
    /* defaultOptions = {
       ...defaultOptions,
       headers: {
         Authorization: `Bearer ${token}`,
       },
     };*/
     
  }
  
  const method = newOptions.method.toLowerCase();
  if (method === 'post' || method === 'put') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };

    if (typeof newOptions.body !== 'string') {
      switch (newOptions.headers['Content-Type']) {
        case 'application/json; charset=utf-8':
          newOptions.body = JSON.stringify(newOptions.body);
          break;
        case 'application/x-www-form-urlencoded;charset=UTF-8':
          newOptions.body = stringify(newOptions.body);
          break;
        default:
          break;
      }
    }
  }
console.log(newOptions);
  let newUrl = url;
  if (newOptions.params && url.indexOf('?') === -1) {
    newUrl = `${url}?${stringify(newOptions.params)}`;
  }
   //console.log(newUrl);
  return fetch(newUrl, newOptions)
    .then(checkStatus)
    .then(response => response.json())
    .then(data => {
      if (data.error && retry && isAuthError(data)) {
        return refreshToken()
          .then(() => {
            return request(url, options, false);
          })
          .catch(() => data);
      }
      return data;
    })
    .then(data => {
      if (data.error) {
        if (process.env.NODE_ENV !== 'production') {
          log(`error response in ${url}: ${data.error}`);
        }
        if (shouldThrowError(data)) {
          message.error('系统错误');
          const { _store: { dispatch } } = app;
          dispatch(routerRedux.push('/exception/500'));
        }
      }
      return data;
    })
    .catch(e => {
      const { _store: { dispatch } } = app;

      const status = e.name;
      if (status === 403) {
        dispatch(routerRedux.push('/exception/403'));
      }

      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push('/exception/500'));
      }

      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push('/exception/404'));
      }
      return Promise.reject(e);
    });
}
