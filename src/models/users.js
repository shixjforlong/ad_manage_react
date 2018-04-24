import {
  fetchUsers,
  addUser,
  removeUser,
  resetUserPassword,
  lockUser,
  unlockUser,
} from '../services/user';

export default {
  namespace: 'users',

  state: {
    list: [],
    status: undefined,
  },

  effects: {
    *fetchUsers({ payload }, { call, put }) {
      const { result } = yield call(fetchUsers, { verbose: 100, ...payload });
      if (result) {
        yield put({
          type: 'save',
          payload: {
            list: result,
          },
        });
      }
    },

    *removeUser({ payload }, { call, put }) {
      const { onSuccess } = payload;
      const { result } = yield call(removeUser, payload);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            status: 'ok',
          },
        });
        onSuccess();
      }
    },

    *addUser({ payload }, { call, put }) {
      const { onSuccess } = payload;
      const { result } = yield call(addUser, payload);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            status: 'ok',
          },
        });
        onSuccess();
      } else {
        yield put({
          type: 'save',
          payload: {
            status: 'error',
          },
        });
      }
    },

    *resetPassword({ id, payload }, { call, put }) {
      const { onSuccess, onFail } = payload;
      const { result } = yield call(resetUserPassword, id, payload);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            status: 'ok',
          },
        });
        onSuccess();
      } else {
        yield put({
          type: 'save',
          payload: {
            status: 'error',
          },
        });
        onFail();
      }
    },

    *lock({ payload }, { call, put }) {
      const { id, onSuccess } = payload;
      const { result } = yield call(lockUser, id);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            status: 'ok',
          },
        });
        onSuccess();
      }
    },

    *unlock({ payload }, { call, put }) {
      const { id, onSuccess } = payload;
      const { result } = yield call(unlockUser, id);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            status: 'ok',
          },
        });
        onSuccess();
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
  },
};
