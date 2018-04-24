import moment from 'moment';
import isObject from 'lodash/isObject';
import isFunction from 'lodash/isFunction';
import { G2, Util } from 'bizcharts';

export function getFillAttrs(cfg) {
  const defaultAttrs = G2.Global.shape.interval;
  return Util.mix(
    {},
    defaultAttrs,
    {
      fill: cfg.color,
      stroke: cfg.color,
      fillOpacity: cfg.opacity,
    },
    cfg.style
  );
}

export function isPromise(p) {
  return isObject(p) && isFunction(p.then);
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      ),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      ''
    );
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  return renderArr.map(item => {
    const exact = !routes.some(
      route => route !== item && getRelation(route, item) === 1
    );
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact,
    };
  });
}

export function errorMessage({ error_code: code, error }) {
  switch (code) {
    case 20013:
      return '验证码错误';
    case 20007:
      return '账号已存在';
    default:
      return error;
  }
}

export function modelOfSN(serialNumber) {
  // 判断是Router还是DTU
  const p1 = serialNumber.substring(0, 1);
  const p2 = serialNumber.substring(1, 2); // 判断网络
  const p3 = serialNumber.substring(2, 3); // 判断700还是300还是600,900
  const p4 = serialNumber.substring(3, 4); // 是300还是320
  if (p1 === 'R' || p1 === 'r') {
    // Router
    if (p3 === '7') {
      // 700
      if (p2 === 'w' || p2 === 'W') {
        return 'IR7XX_WCDMA';
      } else if (p2 === 'v' || p2 === 'V') {
        return 'IR7XX_EVDO/CDMA';
      } else if (p2 === 'g' || p2 === 'G') {
        return 'IR7XX_GPRS/EDGE';
      } else if (p2 === 'u' || p2 === 'U') {
        return 'IR7XX_UE';
      } else if (p2 === 'c' || p2 === 'C') {
        return 'IR7XX_EVDO/CDMA';
      } else if (p2 === 'e' || p2 === 'E') {
        return 'IR7XX_GPRS/EDGE';
      } else if (p2 === 't' || p2 === 'T') {
        return 'IR7XX_TD-SCDMA';
      }
    } else if (p3 === '3') {
      // 300
      if (p4 === '2') {
        return 'IR320';
      } else {
        return 'IR300';
      }
    } else if (p3 === '9') {
      if (p2 === 'p' || p2 === 'P') {
        return 'IR9XX_WCDMA';
      } else if (p2 === 'v' || p2 === 'V') {
        return 'IR9XX_EVDO';
      } else if (p2 === 't' || p2 === 'T') {
        return 'IR9XX_TDD-LTE';
      } else if (p2 === 'f' || p2 === 'F') {
        return 'IR9XX_FDD-LTE';
      }
    } else if (p3 === '6') {
      if (p2 === 'w' || p2 === 'W') {
        return 'IR6XX_WCDMA';
      } else if (p2 === 'v' || p2 === 'V') {
        return 'IR6XX_EVDO';
      } else if (p2 === 't' || p2 === 'T') {
        return 'IR6XX_TD';
      }
    }
  } else if (p1 === 'D' || p1 === 'd') {
    // DTU
    return 'InDTU3XX_GPRS/EDGE';
  } else if (p1 === 'p' || p1 === 'P') {
    if (p2 === 'p' || p2 === 'P') {
      return 'IR8XX_WCDMA';
    } else if (p2 === 'f' || p2 === 'F') {
      return 'IR8XX_FDD-LTE';
    } else if (p2 === 't' || p2 === 'T') {
      return 'IR8XX_TDD-LTE';
    } else if (p2 === 'v' || p2 === 'V') {
      return 'IR8XX_EVDO';
    }
  } else if (p1 === 'g' || p1 === 'G') {
    if (p2 === 'p' || p2 === 'P') {
      return 'IG601_HSPA+';
    } else if (p2 === 'V' || p2 === 'V') {
      return 'IG601_EVDO';
    }
  }
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

export function roleName(role) {
  switch (role) {
    case 'admin':
      return '机构管理员';
    case 'DeviceManager':
      return '设备管理员';
    case 'DeviceSense':
      return '设备监视员';
    default:
      return role;
  }
}
