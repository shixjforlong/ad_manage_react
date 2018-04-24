// import { xxx } from '../services/xxx';
import {
  fetchAmountStats,
  fetchOnlineStats,
} from '../services/device';

export default {
  namespace: 'dashboard',
  state: {
     sales:{
       count: 0,
       amount:0
     },
    devices: {
      online: 0,
      offline24: 0,
      offline: 0
    }
  },
  effects: {

   //在线数 离线数
    *fetchOnlineStats({payload}, {call, put }){
        const result = yield call(fetchOnlineStats, payload);
        console.log(result);
        const countOnline = result.countOnline;
        const offline = result.offline;
        const offline24 = result.offline24;

        if (result) {
          yield put({
            type: 'save',
            payload: {
              devices: {
                online:countOnline,
                offline:offline,
                offline24:offline24
              },
            },
          });
        }

    },
    //今日销售额 销量
    *fetchAmountStats({payload}, {call, put }){
        const { result } = yield call(fetchAmountStats, payload);
        console.log(result);
        const amount = result[0].amountOnLine + result[0].amountOutLine;
        const count = result[0].sumOnLine + result[0].sumOutLine;

        if (result) {
          yield put({
            type: 'save',
            payload: {
              sales: {
                amount:amount,
                count:count
              },
            },
          });
        }
    }
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
