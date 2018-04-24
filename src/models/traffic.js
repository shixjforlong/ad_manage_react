import uniqBy from 'lodash/uniqBy';
import moment from 'moment';
import { fetchDailyTraffic, fetchTrafficTop } from '../services/device';

export default {
  namespace: 'traffic',
  state: {
    top: [],
    trend: [],
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
      const { result } = yield call(fetchTrafficTop, { date, limit });
      if (result) {
        yield put({
          type: 'save',
          payload: {
            top: result,
          },
        });
        if (result.length > 0) {
          yield put({
            type: 'fetchTrend',
            payload: {
              ...result[0],
              date,
            },
          });
        }
      }
    },
    *fetchTrend({ payload }, { call, put }) {
      const { deviceId, date } = payload;
      const month = moment(date, 'YYYY-MM-DD');
      const { result } = yield call(fetchDailyTraffic, {
        month: month.format('YYYYMM'),
        device_id: deviceId,
      });
      if (result) {
        const fill = Array.from(month.range('month').by('day')).map(m => ({
          date: parseInt(m.format('YYYYMMDD'), 10),
          deviceId,
          send: 0,
          receive: 0,
          total: 0,
        }));
        const trend = uniqBy(result.concat(fill), 'date');
        yield put({
          type: 'save',
          payload: {
            trend,
            current: payload,
          },
        });
      }
    },
  },
  subscriptions: {},
};
