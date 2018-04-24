import {
  addDevice,
  fetchDevices,
  fetchModels,
  removeDevice,
} from '../services/device';

export default {
  namespace: 'devices',

  state: {
    data: {
      list: [],
      pagination: {},
    },
    add: {
      status: 'ok',
    },
    models: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(fetchDevices, { verbose: 15, ...payload });
      if (!response.error) {
        yield put({
          type: 'save',
          payload: response,
        });
      }
    },
    *add({ payload }, { call, put }) {
      const { onSuccess } = payload;
      const response = yield call(addDevice, payload);
      const { error } = response;

      if (error) {
        yield put({
          type: 'setAddStatus',
          payload: {
            status: 'error',
            error: response,
          },
        });
      } else {
        yield put({
          type: 'setAddStatus',
          payload: {
            status: 'ok',
          },
        });
        onSuccess();
      }
    },
    *remove({ payload, callback }, { call }) {
      const { ids } = payload;
      for (const id of ids) {
        yield call(removeDevice, { id });
      }

      callback();
    },
    *fetchModels(_, { call, put }) {
      const { error, result } = yield call(fetchModels, {
        verbose: 15,
        limit: 0,
      });
      if (!error) {
        yield put({ type: 'saveModels', payload: result });
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
    saveModels(state, { payload }) {
      return {
        ...state,
        models: payload,
      };
    },
    changeDevices(state, { payload }) {
      return {
        ...state,
        list: payload.result,
        page: {
          limit: payload.limit,
          cursor: payload.cursor,
          total: payload.total,
        },
      };
    },
    setAddStatus(state, { payload }) {
      return {
        ...state,
        add: payload,
      };
    },
  },
};
