import moment from 'moment';
import {
  fetchDeviceOnlineTrend,
  fetchDeviceSignalTrend,
  fetchOnlineTop,
} from '../services/device';

export default {
  namespace: 'online',
  state: {
    top: [],
    trend: [],
    signal: [],
    current: {},
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: {
    *fetchTop({ payload }, { call, put }) {
      const { date, limit } = payload;
      const { result } = yield call(fetchOnlineTop, { date, limit });
      if (result) {
        yield put({
          type: 'save',
          payload: {
            top: result,
          },
        });
        if (result.length > 0) {
          const m = moment(date, 'YYYY-MM-DD');
          yield put({
            type: 'fetchTrend',
            payload: {
              ...result[0],
              start: m.startOf('M').unix(),
              end: m.endOf('M').unix(),
            },
          });
        }
      }
    },
    *fetchTrend({ payload }, { call, put }) {
      const { deviceId, start, end } = payload;
      const { result } = yield call(fetchDeviceOnlineTrend, {
        deviceId,
        start,
        end,
      });
      if (result && result.length === 1) {
        yield put({
          type: 'save',
          payload: {
            trend: result[0].data,
            current: payload,
          },
        });
      }
    },
    *fetchSignal({ payload }, { call, put }) {
      const { deviceId, start, end } = payload;
      const { result } = yield call(fetchDeviceSignalTrend, {
        deviceId,
        start,
        end,
      });
      if (result && result.length === 1) {
        yield put({
          type: 'save',
          payload: {
            signal: result[0].signal,
          },
        });
      }
    },
  },
  subscriptions: {},
};
