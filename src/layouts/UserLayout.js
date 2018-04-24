import React from 'react';
import { Link, Redirect, Route, Switch } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './UserLayout.less';
import { config } from '../utils';
import { getRoutes } from '../utils/utils';
import Footer from './Footer';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let { name: title } = config;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${title}`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={config.logo} />
                  <span className={styles.title}>{config.name}</span>
                </Link>
              </div>
              <div className={styles.desc}>{config.desc}</div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
          <Footer links={links} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
