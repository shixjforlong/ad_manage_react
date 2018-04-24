import { fetchData, deletePlanBatch } from '../services/exportplanService';
import { queryCurrent } from '../services/user';

export default {
  namespace: 'exportplans',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetchPlans({ payload }, { call, put, select }) {
      let currentUser = yield select(state => state.user.currentUser);
      if (!currentUser.oid) {
        const result = yield call(queryCurrent);
        currentUser = result;
      }
      const { oid } = currentUser;
      const response = yield call(fetchData, {
        ...payload,
        oid,
      });
      if (!response.error) {
        yield put({
          type: 'saveData',
          payload: {
            response,
          },
        });
      }
    },
    *deletePlans({ payload }, { call, put, select }) {
      const backData = yield call(deletePlanBatch, {
        ...payload.params,
      });
      if (backData && backData.result) {
        const currentPag = yield select(
          state => state.exportplans.data.pagination
        );
        const { pageSize: limit = 10 } = currentPag;
        yield put({
          type: 'fetchPlans',
          payload: {
            ...payload.searchParams,
            cursor: 0,
            limit,
          },
        });
      }
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        data: {
          list: payload.response.result,
          pagination: {
            total: payload.response.total,
            pageSize: payload.response.limit,
            current: payload.response.cursor / payload.response.limit + 1,
          },
        },
      };
    },
  },
};
