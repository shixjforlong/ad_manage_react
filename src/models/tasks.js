import { batchCancel, cancelTask, fetchTasks } from '../services/task';

export default {
  namespace: 'tasks',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchTasks, { verbose: 50, ...payload });
      if (!response.error) {
        for (const value of response.result) {
          value.status = {
            state: value.state,
            progress: value.progress,
          };
        }
        yield put({
          type: 'saveData',
          payload: {
            listData: response,
          },
        });
      }
    },
    *cancelTask({ payload }, { put, call }) {
      const { filterParam, id } = payload;
      const { result } = yield call(cancelTask, id);
      if (result) {
        yield put({
          type: 'fetch',
          payload: filterParam,
        });
      }
    },
    *batchDelete({ payload }, { put, call }) {
      const { filterParam, ids } = payload;
      const { result } = yield call(batchCancel, ids);
      if (result) {
        yield put({
          type: 'fetch',
          payload: filterParam,
        });
      }
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.listData.result,
          pagination: {
            total: payload.listData.total,
            pageSize: payload.listData.limit,
            current: payload.listData.cursor / payload.listData.limit + 1,
          },
        },
      };
    },
  },
};
