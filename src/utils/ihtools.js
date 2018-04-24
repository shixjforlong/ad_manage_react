import { refreshToken } from '../services/user';

export function getQueryParam(name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r !== undefined) {
    return unescape(r[2]);
  }
  return '';
}

// 把字符串中含"."的字符替换成"\."
export function escapeSpot(string) {
  return string.replace(/\./g, '\\.');
}

/**
 *流量计算
 */
export function calculateFlow(flow) {
  const flowTemp = parseInt(flow, 10);
  let flowData = '0B';
  let dataTemp;
  if (flowTemp < 1024) {
    flowData = `${flowTemp}B`;
  } else {
    dataTemp = (flowTemp / 1024.0).toFixed(2);
    if (parseInt(dataTemp, 10) < 1024) {
      flowData = `${dataTemp}KB`;
    } else {
      dataTemp = (dataTemp / 1024.0).toFixed(2);
      if (parseInt(dataTemp, 10) < 1024) {
        flowData = `${dataTemp}MB`;
      } else {
        dataTemp = (dataTemp / 1024.0).toFixed(2);
        flowData = `${dataTemp}GB`;
      }
    }
  }
  return flowData;
}

/**
 * 获取当前网址
 *
 */
export function getWebsite() {
  // 获取当前网址，如： http://localhost:8080/Tmall/index.jsp
  const curWwwPath = window.document.location.href;
  // 获取主机地址之后的目录如：/Tmall/index.jsp
  const pathName = window.document.location.pathname;
  const pos = curWwwPath.indexOf(pathName);
  // 获取主机地址，如： http://localhost:8080
  const localhostPath = curWwwPath.substring(0, pos);
  return localhostPath;
}

/**
 * 获取协议
 * @returns {string|*}
 */
export function getProto() {
  const curWwwPath = window.document.location.href;
  const proto = curWwwPath.substr(0, curWwwPath.indexOf(':')); // https
  return proto;
}

/**
 * 获取服务器域名
 * @returns {string|*}
 */
export function getServer() {
  // shebeiyun.net
  return getWebsite().substr(getProto().length + 3);
}

/**
 * 获取创建websocket需要url
 */
export function getWebSocketURL() {
  // const url = `${getProto() === 'http' ? 'ws' : 'wss'}://${getServer()}/websocket`;
  const url = 'ws://svc-test.inhand.com.cn/websocket';//test.shebeiyun.net
  // var url = "ws://localhost:8282/websocket";
  return url;
}

// 初始化websocket 事件
export function initWebsocketEventHandle(ws, params, callback, context) {
  Object.assign(ws, {
    onclose() {
      console.log('onclose...');
    },
    onerror() {
      if (ws !== undefined && ws.readyState === 1) {
        // 连接打开
        ws.close();
      }
    },
    onopen() {
      ws.send(JSON.stringify(params));
    },
    onmessage(evt) {
      // 拿到任何消息都说明当前连接是正常的
      const data = JSON.parse(evt.data);
      if ([1, 3, 4, 5].indexOf(parseInt(data.type, 10)) > -1) {
        if (data.message && data.message.error) {
          if (
            data.message.error_code === '21327' ||
            data.message.error_code === '21336'
          ) {
            refreshToken().then(() => {
              const tokenItem =
                sessionStorage.getItem('token') ||
                localStorage.getItem('token');
              if (tokenItem) {
                const param = Object.assign(params, {
                  token: JSON.parse(tokenItem).access_token,
                });
                // params.token = JSON.parse(tokenItem).access_token;
                ws.send(JSON.stringify(param));
              }
            });
          }
        } else {
          setTimeout(() => {
            if (ws !== undefined && ws.readyState === 1) {
              ws.send(JSON.stringify(params));
            }
          }, 5000);
        }
        callback.call(context, data);
      } else if (data.type !== 0) {
        callback.call(context, data);
      }
    },
  });
}

// 关闭WebSocket连接
export function closeWebSocket(ws) {
  console.log('关闭ws');
  ws.close();
}

// 转换百分比
export function toPercent(val) {
  return `${(Math.round(val * 10000) / 100).toFixed(2)}%`;
}
