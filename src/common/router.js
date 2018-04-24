import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';

import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models
        .filter(model => modelNotExisted(app, model))
        .map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login'], () =>
        import('../layouts/BasicLayout')
      ),
    },
    // 概览
    '/home': {
      component: dynamicWrapper(
        app,
        ['monitor', 'dashboard', 'traffic', 'online', 'overview'],
        () => import('../routes/Dashboard/Dashboard')
      ),
    },

    //媒体库管理
    '/ad/media': {
      component: dynamicWrapper(app, ['media'], () =>
        import('../routes/Media/medias')
      ),
    },
    //手机广告
    '/ad/phoneAd': {
      component: dynamicWrapper(app, ['phoneAd'], () =>
        import('../routes/PhoneAd/phoneAd')
      ),
    },

    // 区域管理
    '/site/area': {
      component: dynamicWrapper(app, ['area'], () =>
        import('../routes/Sites/Areas/Areas')
      ),
    },

    // 通知模块
    '/notices/events': {
      component: dynamicWrapper(app, ['alarm'], () =>
        import('../routes/Notices/Events/Events')
      ),
    },
    '/notices/logs': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Notices/Logs/Logs')
      ),
    },
    // 维修管理模块
    '/repair/orders': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Repair/Order/Orders')
      ),
    },
    '/repair/schedules': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Repair/Schedule/Schedules')
      ),
    },
    // 报表模块
    '/reports/performance': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Reports/Performance/PerformanceReports')
      ),
    },
    '/reports/workload': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Reports/Workload/WorkloadReports')
      ),
    },
    '/reports/gateway': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Reports/Gateway/GatewayReports')
      ),
    },
    // 现场管理模块
    '/site_manage/sites': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/SiteManage/Site/Sites')
      ),
    },
    '/site_manage/gateways': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/SiteManage/Gateway/Gateways')
      ),
    },
    // 系统管理模块
    '/system/users': {
      component: dynamicWrapper(app, ['users', 'roles'], () =>
        import('../routes/Organization/User/TableList')
      ),
      // component: dynamicWrapper(app, [], () => import('../routes/System/Users/Users')),
    },
    '/system/roles': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/System/Roles/Roles')
      ),
    },
    '/system/setting': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/System/Setting/Setting')
      ),
    },
    '/system/export_plan': {
      component: dynamicWrapper(app, ['exportplans'], () =>
        import('../routes/System/ExportPlan/ExportPlan')
      ),
    },
    // 任务管理模块
    '/system/tasks': {
      component: dynamicWrapper(app, ['tasks'], () =>
        import('../routes/Task/TaskList')
      ),
    },
    // 下载模块
    '/download/device_touch': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Download/DeviceTouch/DeviceTouch')
      ),
    },
    '/download/app': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Download/CloudApp/CloudApp')
      ),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Exception/403')
      ),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Exception/404')
      ),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/Exception/500')
      ),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () =>
        import('../routes/User/Login')
      ),
    },
    '/user/reset-password': {
      component: dynamicWrapper(app, ['user'], () =>
        import('../routes/User/ResetPassword')
      ),
    },
    '/user/reset-result': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/User/ResetResult')
      ),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () =>
        import('../routes/User/Register')
      ),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/User/RegisterResult')
      ),
    },
    '/profile': {
      component: dynamicWrapper(app, ['user', 'login'], () =>
        import('../routes/Account/Profile')
      ),
    },
    '/devices': {
      component: dynamicWrapper(app, ['devices'], () =>
        import('../routes/Device/TableList')
      ),
    },
    '/device/:id': {
      component: dynamicWrapper(app, ['device'], () =>
        import('../layouts/DeviceLayout')
      ),
    },
    '/device/:id/profile': {
      component: dynamicWrapper(app, ['device', 'traffic', 'online'], () =>
        import('../routes/Device/Profile')
      ),
    },
    '/device/:id/logs': {
      component: dynamicWrapper(app, ['device', 'task'], () =>
        import('../routes/Device/Logs')
      ),
    },
    '/device/:id/console': {
      component: dynamicWrapper(app, ['device', 'task'], () =>
        import('../routes/Device/Console')
      ),
    },
    '/org/users': {
      component: dynamicWrapper(app, ['users', 'roles'], () =>
        import('../routes/Organization/User/TableList')
      ),
    },
    '/org/logs': {
      component: dynamicWrapper(app, ['logs'], () =>
        import('../routes/Organization/Log/LogList')
      ),
    },
    '/tasks': {
      component: dynamicWrapper(app, ['tasks'], () =>
        import('../routes/Task/TaskList')
      ),
    },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key =>
      pathRegexp.test(`${key}`)
    );
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
    };
    routerData[path] = router;
  });
  return routerData;
};
