import React, { PureComponent } from 'react';
import { Avatar, Col, Dropdown, Icon, Menu, Row, Spin } from 'antd';
import { Link } from 'dva/router';
import DynamicMenu from './Menu';

import styles from '../../layouts/HeaderMenuLayout.less';

export default class RouterMenu extends PureComponent {
  handleMenuClick = ({ key }) => {
    if (key === 'logout') {
      this.props.dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const { logo, title, user } = this.props;
    const menu = (
      <Menu selectedKeys={[]} onClick={this.handleMenuClick}>
        <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <Row>
        <Col xxl={4} xl={5} lg={8} md={8} sm={24} xs={24}>
          <Link className={styles.logo} to="/">
            <img src={logo} alt="logo" />
            <h1>{title}</h1>
          </Link>
        </Col>
        <Col
          xxl={20}
          xl={19}
          lg={16}
          md={16}
          sm={0}
          xs={0}
          className={styles.menu}
        >
          <div className={styles.right}>
            {user.name ? (
              <Dropdown overlay={menu}>
                <span className={`${styles.action} ${styles.account}`}>
                  <Avatar size="small" className={styles.avatar} icon="user" />
                  <span className={styles.name}>{user.name}</span>
                </span>
              </Dropdown>
            ) : (
              <Spin size="small" style={{ marginLeft: 8 }} />
            )}
          </div>
          <DynamicMenu location={location} />
        </Col>
      </Row>
    );
  }
}
