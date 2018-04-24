import { runTask } from '../services/task';

export default {
  namespace: 'task',

  state: {
    result: undefined,
    error: undefined,
  },
  effects: {
    *run({ payload }, { put, call }) {
      yield put({ type: 'clear' });
      const { result, error } = yield call(runTask, payload);
      if (result) {
        yield put({ type: 'save', payload: { result } });
      } else {
        yield put({ type: 'save', payload: { error } });
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
    clear() {
      return { result: undefined, error: undefined };
    },
  },
};
