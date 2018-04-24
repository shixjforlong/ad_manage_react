import { getAlarmsList, confirmAlarm, alarmOperate } from '../services/notice';

export default {
  namespace: 'alarm',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    *getAlarm({ payload }, { call, put }) {
      const response = yield call(getAlarmsList, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *confirmAlarm({ payload, callBack }, { call, put }) {
      const response = yield call(confirmAlarm, payload);
      const { error } = response;
      if (error) {
        yield put({
          type: 'confirmStatus',
          payload: {
            status: 'error',
            error: response,
          },
        });
      } else {
        yield put({
          type: 'confirmStatus',
          payload: {
            status: 'ok',
            result: response,
          },
        });
        callBack();
      }
    },
    *getAlarmOperate({ payload }, { call, put }) {
      const response = yield call(alarmOperate, payload);
      yield put({
        type: 'save',
        payload: response,
      });
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
    confirmStatus(state, { payload }) {
      return {
        ...state,
        confirm: payload,
      };
    },
  },
};
