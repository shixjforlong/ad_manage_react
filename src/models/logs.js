import { fetchLogs } from '../services/log';

export default {
  namespace: 'logs',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchLogs, {
        verbose: 50,
        language: 1,
        ...payload,
      });
      if (response.result) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.result,
          pagination: {
            total: payload.total,
            pageSize: payload.limit,
            current: payload.cursor / payload.limit + 1,
          },
        },
      };
    },
  },
};
