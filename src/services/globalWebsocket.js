import * as ihtools from '../utils/ihtools';

let websocket;
function getWebsocket() {
  if (!websocket) {
    const url = ihtools.getWebSocketURL();
    websocket = new WebSocket(url);
  }
  return websocket;
}
/**
 * @tockenInfo tocken的信息
 * @put 用于执行 global 的 reducers 方法
 * */
export async function watchList(tockenInfo, callSaveData) {
  if ('WebSocket' in window) {
    // 判断浏览器是否支持websocket
    const tokenItem = sessionStorage.getItem('token') || localStorage.getItem('token');
    const params = {
      type: 1,
      token: tokenItem ? JSON.parse(tokenItem).access_token : '',
      oid: tockenInfo.oid,
    };
    const ws = getWebsocket();
    ihtools.initWebsocketEventHandle(ws, params, (data) => {
      const mes = data.message;
      if (mes.result) {
        callSaveData(mes.result);
      }
    }, this);
  } else {
    websocket = undefined;
  }
}

export async function close() {
  if (websocket) {
    websocket.close();
  }
}
