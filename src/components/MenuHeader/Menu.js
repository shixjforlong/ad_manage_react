import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { Link } from 'dva/router';
import { getMenuData } from '../../common/menu';

const { SubMenu } = Menu;

export default class DynamicMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.menus = getMenuData();
    this.state = {
      openKeys: this.getDefaultCollapsedSubMenus(props),
    };
  }

  getDefaultCollapsedSubMenus(props) {
    const { location: { pathname } } = props || this.props;
    const snippets = pathname.split('/').slice(1, -1);
    const currentPathSnippets = snippets.map((item, index) => {
      const arr = snippets.filter((_, i) => i <= index);
      return arr.join('/');
    });
    let currentMenuSelectedKeys = [];
    currentPathSnippets.forEach(item => {
      currentMenuSelectedKeys = currentMenuSelectedKeys.concat(
        this.getSelectedMenuKeys(item)
      );
    });
    if (currentMenuSelectedKeys.length === 0) {
      return ['dashboard'];
    }
    return currentMenuSelectedKeys;
  }

  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys.push(item.path);
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      } else {
        keys.push(item.path);
      }
    });
    return keys;
  }

  getSelectedMenuKeys = path => {
    const flatMenuKeys = this.getFlatMenuKeys(this.menus);

    if (flatMenuKeys.indexOf(path.replace(/^\//, '')) > -1) {
      return [path.replace(/^\//, '')];
    }
    if (flatMenuKeys.indexOf(path.replace(/^\//, '').replace(/\/$/, '')) > -1) {
      return [path.replace(/^\//, '').replace(/\/$/, '')];
    }
    return flatMenuKeys.filter(item => {
      const itemRegExpStr = `^${item.replace(/:[\w-]+/g, '[\\w-]+')}$`;
      const itemRegExp = new RegExp(itemRegExpStr);
      return itemRegExp.test(path.replace(/^\//, ''));
    });
  };

  getNavMenuItems(menusData) {
    if (!menusData) {
      return [];
    }
    return menusData.map(item => {
      if (!item.name) {
        return null;
      }
      let itemPath;
      if (item.path && item.path.indexOf('http') === 0) {
        itemPath = item.path;
      } else {
        itemPath = `/${item.path || ''}`.replace(/\/+/g, '/');
      }
      if (item.children && item.children.some(child => child.name)) {
        return item.hideInMenu ? null : (
          <SubMenu title={item.name} key={item.key || item.path}>
            {this.getNavMenuItems(item.children)}
          </SubMenu>
        );
      }
      return item.hideInMenu ? null : (
        <Menu.Item key={item.key || item.path}>
          {/^https?:\/\//.test(itemPath) ? (
            <a href={itemPath} target={item.target}>
              <span>{item.name}</span>
            </a>
          ) : (
            <Link
              to={itemPath}
              target={item.target}
              replace={itemPath === this.props.location.pathname}
              onClick={
                this.props.isMobile &&
                (() => {
                  this.props.onCollapse(true);
                })
              }
            >
              <span>{item.name}</span>
            </Link>
          )}
        </Menu.Item>
      );
    });
  }

  handleOpenChange = openKeys => {
    const lastOpenKey = openKeys[openKeys.length - 1];
    const isMainMenu = this.menus.some(
      item =>
        lastOpenKey && (item.key === lastOpenKey || item.path === lastOpenKey)
    );
    this.setState({
      openKeys: isMainMenu ? [lastOpenKey] : [...openKeys],
    });
  };

  render() {
    const { location: { pathname } } = this.props;
    return (
      <Menu
        theme="dark"
        mode="horizontal"
        openKeys={this.state.openKeys}
        style={{ lineHeight: '64px' }}
        onOpenChange={this.handleOpenChange}
        selectedKeys={this.getSelectedMenuKeys(pathname)}
      >
        {this.getNavMenuItems(this.menus)}
      </Menu>
    );
  }
}
