import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { delay } from 'dva/saga';
import debug from 'debug';
import {
  fetchDevice,
  kickDevice,
  removeDevice,
  updateDevice,
} from '../services/device';
import { runTask } from '../services/task';

export default {
  namespace: 'device',
  state: {
    current: {},
    updateErorr: null,
    updateVisible: false,
    upgradeVisible: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const { id } = payload;
      const { result } = yield call(fetchDevice, id, 100);
      if (result) {
        yield put({
          type: 'save',
          payload: {
            current: result,
          },
        });
      }
    },
    *update({ payload }, { call, put }) {
      const { id } = payload;
      const resp = yield call(updateDevice, id, payload);
      const { result } = resp;
      if (result) {
        yield put({
          type: 'save',
          payload: {
            current: result,
            updateVisible: false,
          },
        });
      } else {
        yield put({
          type: 'save',
          payload: {
            updateError: resp,
          },
        });
      }
    },
    *delete({ payload }, { call, put }) {
      const { id } = payload;
      const { result, error_code: error } = yield call(removeDevice, { id });
      if (result) {
        message.info('删除成功');
        yield put(routerRedux.push('/devices'));
      } else {
        debug.log('delete device failed', error);
        message.error('删除失败');
      }
    },
    *kick({ payload }, { call, put }) {
      const { id } = payload;
      const { result, error_code: error } = yield call(kickDevice, { id });
      if (result) {
        yield call(delay, 1000);
        message.info('操作成功');
        yield put({
          type: 'fetch',
          payload: {
            id,
          },
        });
      } else {
        debug.log('kick device failed', error);
        message.error('操作失败');
      }
    },
    *upgrade({ payload }, { call, put }) {
      const { filename, ip, port, deviceId, deviceName } = payload;
      const { error_code: error } = yield call(runTask, {
        name: 'firmware upgrade',
        type: 6,
        objectId: deviceId,
        objectName: deviceName,
        data: {
          version: '1',
          filename,
          ip,
          port,
          username: '2',
          password: '3',
        },
      });

      if (error) {
        message.error(error);
      } else {
        yield put({ type: 'save', payload: { upgradeVisible: false } });
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
    updateVisible(state, { payload }) {
      return {
        ...state,
        updateVisible: payload,
      };
    },
    upgradeVisible(state, { payload }) {
      return {
        ...state,
        upgradeVisible: payload,
      };
    },
  },
};
