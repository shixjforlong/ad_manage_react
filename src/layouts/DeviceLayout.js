import React from 'react';
import { Route, Switch } from 'dva/router';
import { getRoutes } from '../utils/utils';

class DeviceLayout extends React.PureComponent {
  render() {
    const { routerData, match } = this.props;
    return (
      <Switch>
        {getRoutes(match.path, routerData).map(item => (
          <Route
            key={item.key}
            path={item.path}
            component={item.component}
            exact={item.exact}
          />
        ))}
        <Route
          exact
          path="/device/:id"
          component={routerData['/device/:id/profile'].component}
        />
      </Switch>
    );
  }
}

export default DeviceLayout;
