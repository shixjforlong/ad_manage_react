import { stringify } from 'qs';
import request from '../utils/request';

//当前销售额 销量
export async function fetchAmountStats({start, end }) {
  const resp =  request('/api/areaStatistic/everyyeardata', {
    params: {
      startTime: start,
      endTime: end,
    },
    method: 'post',
    body: {
      areaIds: [],
    },
  });
  return resp;
}

//在线数  离线数  24小时离线数
export async function fetchOnlineStats(params) {
  return request('/api/automat/countoffline', { params});
}



export async function fetchDevices(params) {
  return request(`/api/devices?${stringify(params)}`);
}

export async function fetchModels(params) {
  return request(`/api/models?${stringify(params)}`);
}

export async function validateDevice(params) {
  return request('/api/devices/validate', { params });
}

export async function addDevice(params) {
  return request('/api/devices', { body: params, method: 'post' });
}

export async function updateDevice(id, params) {
  return request(`/api/devices/${id}`, {
    body: params,
    method: 'put',
    params: {
      verbose: 100,
    },
  });
}

export async function fetchDevice(id, verbose = 10) {
  return request(`/api/devices/${id}`, { params: { verbose } });
}

export async function removeDevice({ id }) {
  return request(`/api/devices/${id}`, {
    method: 'delete',
  });
}

export async function kickDevice({ id }) {
  return request(`/api/device/${id}/kick`, {
    method: 'get',
  });
}

export async function fetchStats() {
  return request('/api/devices/stats');
}


export async function fetchTotalStats({ start, end }) {
  const params = { start_time: start, end_time: end };
  return request(`/api/device/count/total?${stringify(params)}`);
}

export async function fetchTrafficTop({ limit, date }) {
  const params = { limit, date };
  return request(`/api/device/traffic/monthly?${stringify(params)}`);
}

export async function fetchOnlineTop({ limit, date }) {
  const params = { limit, date };
  return request(`/api/device/online/monthly?${stringify(params)}`);
}

export async function fetchDailyTraffic(params) {
  return request('/api/traffic_day', { params });
}

export async function fetchDeviceOnlineTrend({ deviceId, start, end }) {
  return request('/api/online_tendency', {
    params: {
      start_time: start,
      end_time: end,
    },
    method: 'post',
    body: {
      resourceIds: [deviceId],
    },
  });
}

export async function fetchDeviceSignalTrend({ deviceId, start, end }) {
  return request('/api2/signal', {
    params: {
      start_time: start,
      end_time: end,
    },
    method: 'post',
    body: {
      resourceIds: [deviceId],
    },
  });
}
