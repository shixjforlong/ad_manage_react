import '@babel/polyfill';
import 'url-polyfill';
import dva from 'dva';
// user BrowserHistory
import createHistory from 'history/createHashHistory';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import intl from 'react-intl-universal';
import './rollbar';

import './index.less';
import './utils/moment';
import locales from './locale';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
app.use(createLoading());

// 3. Register global model
app.model(require('./models/global').default);

// 4. Router
app.router(require('./router').default);

// 5. Start
const locale = navigator.language === 'zh-CN' ? 'zh-CN' : 'en-US';

const intlOpts = {
  currentLocale: locale,
  locales,
};
intl.init(intlOpts).then(() => {
  app.start('#root');
});

export default app;
