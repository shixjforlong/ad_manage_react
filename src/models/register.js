import { register } from '../services/user';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload, onSuccess, onFail }, { call, put }) {
      const response = yield call(register, payload);
      if (response.error) {
        onFail();
        yield put({
          type: 'registerHandle',
          payload: { status: 'error', error: response },
        });
      } else {
        onSuccess();
        yield put({
          type: 'registerHandle',
          payload: { status: 'ok' },
        });
      }
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
