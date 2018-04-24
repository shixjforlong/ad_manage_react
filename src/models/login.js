import { routerRedux } from 'dva/router';
import md5 from 'md5';
import { login, logout } from '../services/user';
import { sendSMSCode } from '../services/captcha';
import { setAuthority } from '../utils/authority';
import { reloadAuthorized } from '../utils/Authorized';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      yield put({
        type: 'changeSubmitting',
        payload: true,
      });
      let request;
      if (payload.type === 'account') {
        request = {
          ...payload,
          password_type: 2,
          password: md5(payload.password).toUpperCase(),
        };
      } else {
        request = {
          ...payload,
          password_type: 4,
          password: payload.password,
        };
      }
      const response = yield call(login, request);
      console.log(response);
      const status = response.error ? 'error' : undefined;
      yield put({
        type: 'changeLoginStatus',
        payload: { type: payload.type, status, currentAuthority: 'user' },
      });
      // Login successfully
      if (response.access_token) {
        reloadAuthorized();
        yield put(routerRedux.push('/'));
      }
    },

    *logout(_, { call, put, select }) {
      try {
        // get location pathname
        const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);
      } finally {
        yield put({
          type: 'changeLoginStatus',
          payload: {
            status: false,
            currentAuthority: 'guest',
          },
        });
        yield call(logout);
        reloadAuthorized();
        yield put(routerRedux.push('/user/login'));
      }
    },

    *sendSMSCode({ payload }, { call, put }) {
      yield put({
        type: 'changeGettingCaptcha',
        payload: true,
      });
      const response = yield call(sendSMSCode, payload);
      if (response.error) {
        if (response.error_code === 10024) {
          yield put({
            type: 'changeLoginStatus',
            payload: { status: 'beyondLimit', error: response },
          });
        } else {
          yield put({
            type: 'changeLoginStatus',
            payload: { status: 'sendCaptchaError', type: 'mobile' },
          });
        }
      }
      yield put({
        type: 'changeGettingCaptcha',
        payload: false,
      });
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
    changeGettingCaptcha(state, { payload }) {
      return {
        ...state,
        gettingCaptcha: payload,
      };
    },
  },
};
