import {
  bindPhone,
  changePassword,
  getUserInfo,
  query as queryUsers,
  queryCurrent,
  resetPassword,
  unbindPhone,
  updateUserInfo,
} from '../services/user';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    currentUserInfo: {},
    status: undefined,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: {
          list: response,
        },
      });
    },
    *fetchCurrent(_, { call, put }) {
      const result = yield call(queryCurrent);
      if (result.uid) {
        yield put({
          type: 'save',
          payload: {
            currentUser: result,
          },
        });
      }
    },

    *resetPassword({ payload, onSuccess, onFail }, { call, put }) {
      const response = yield call(resetPassword, payload);
      if (response.error) {
        onFail();
        if (response.error.includes('Varification code error')) {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'captchaError', error: response },
          });
        } else {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'emailError', error: response },
          });
        }
      } else {
        onSuccess();
        yield put({
          type: 'changeResponseStatus',
          payload: { status: 'ok' },
        });
      }
    },

    *getCurrentUserInfo({ id, verbose }, { call, put }) {
      const { result } = yield call(getUserInfo, id, verbose);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            currentUserInfo: result,
            status: undefined,
          },
        });
      }
    },

    *bindPhone({ payload, onSuccess }, { call, put }) {
      const response = yield call(bindPhone, payload);
      if (response.error_code) {
        if (response.error_code === 20014) {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'captchaError', error: response },
          });
        } else if (response.error_code === 20007) {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'phoneError', error: response },
          });
        }
      } else {
        yield put({
          type: 'changeResponseStatus',
          payload: { status: 'ok', result: response.result },
        });
        onSuccess();
      }
    },
    *unbindPhone({ code, onSuccess }, { call, put }) {
      const response = yield call(unbindPhone, code);
      if (response.error_code) {
        if (response.error_code === 20014) {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'captchaError', error: response },
          });
        }
      } else {
        yield put({
          type: 'changeResponseStatus',
          payload: { status: 'ok', result: response.result },
        });
        onSuccess();
      }
    },
    *changePassword({ id, language, payload, onSuccess }, { call, put }) {
      const response = yield call(changePassword, id, language, payload);
      if (response.error) {
        if (response.error.includes('oldPassword')) {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'oldPasswordError', error: response },
          });
        } else if (response.error.includes('newPassword')) {
          yield put({
            type: 'changeResponseStatus',
            payload: { status: 'newPasswordError', error: response },
          });
        }
      } else {
        yield put({
          type: 'changeResponseStatus',
          payload: { status: 'ok', result: response },
        });
        onSuccess();
      }
    },

    *updateUserInfo({ id, payload }, { call, put }) {
      const { result } = yield call(updateUserInfo, id, payload);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            status: 'ok',
            currentUserInfo: result,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            status: 'error',
          },
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changeResponseStatus(state, { payload }) {
      const { status } = payload;
      if (status === 'ok') {
        return {
          ...state,
          ...payload,
        };
      } else {
        return {
          ...state,
          ...payload,
        };
      }
    },
  },
};
