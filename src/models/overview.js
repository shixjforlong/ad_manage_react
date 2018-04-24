import * as websocket from '../services/globalWebsocket';

export default {
  namespace: 'overview',

  state: {
    alarmsUnconfirmed: [],
    alarmsUnconfirmedTotal: 0,
  },

  effects: {
    *openWebsocket({ callSaveData }, { call, select }) {
      const tockenInfo = yield select(state => state.user.currentUser);
      yield call(websocket.watchList, tockenInfo, callSaveData);
    },
    *closeWebsocket(_, { call, put }) {
      yield call(websocket.close);
      yield put({
        type: 'clearAlarms',
      });
    },
  },

  reducers: {
    saveAlarmInfo(state, { payload }) {
      return {
        ...state,
        alarmsUnconfirmed: payload.alarms.list,
        alarmsUnconfirmedTotal: payload.alarms.unconfirmed,
      };
    },
    clearAlarms(state) {
      return {
        ...state,
        alarmsUnconfirmed: [],
        alarmsUnconfirmedTotal: 0,
      };
    },
  },
};
