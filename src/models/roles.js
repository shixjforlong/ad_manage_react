import { fetchRoles } from '../services/user';

export default {
  namespace: 'roles',

  state: {
    list: [],
  },

  effects: {
    *fetchRoles(_, { call, put }) {
      const { result } = yield call(fetchRoles, { verbose: 15, limit: 10 });
      if (result) {
        yield put({
          type: 'save',
          payload: {
            list: result,
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
  },
};
