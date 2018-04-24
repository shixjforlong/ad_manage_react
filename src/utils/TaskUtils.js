export function taskTypeTransform(value) {
  const types = [
    '',
    '运行配置下发',
    '交互命令',
    'OVDP 配置',
    '获取运行配置',
    '导入升级文件',
    'VPN临时通道',
    'VPN连接指令',
    'VPN连接指令',
    '定期清理access_token',
    '流量定期统计',
    '闲置任务定期通知',
    '远程web管理',
  ];
  return types[value] || value;
}
export function taskStateTransform(state) {
  let status = null;
  let progress = null;
  switch (state) {
    case -1:
    case 2:
      status = '失败';
      progress = 'exception';
      break;
    case 3:
      status = '完成';
      progress = 'success';
      break;
    case 5:
    case 0:
    case 4:
      status = '等待';
      progress = '';
      break;
    case 1:
      status = '执行中';
      progress = 'active';
      break;
    default:
      status = '等待';
      progress = '';
      break;
  }
  return { status, progress };
}
export function taskStateGather(state = '') {
  let status = '';
  switch (state) {
    case '-1':
      status = '-1,2';
      break;
    case '1':
      status = '1';
      break;
    case '3':
      status = '3';
      break;
    case '5':
      status = '0,4,5';
      break;
    default:
      break;
  }
  return status;
}
export function getTaskCancelId(data) {
  const idArr = [];
  data.map(value => {
    if (value.state === 5 || value.state === 0) {
      const { _id: id } = value;
      idArr.push(id);
    }
    return null;
  });
  return idArr;
}
