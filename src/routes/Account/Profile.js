import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Col, Row, Spin, Tabs, message } from 'antd';
import intl from 'react-intl-universal';
import md5 from 'md5';
import styles from './Profile.less';
import BindPhone from '../../components/BindPhone';
import ChangePassword from '../../components/ChangePassword';
import FormattedDate from '../../components/FormattedDate';
import InlineEditor from '../../components/InlineEditor';
import { roleName } from '../../utils/utils';

const { TabPane } = Tabs;
@connect(({ user }) => ({
  userInfo: user.currentUserInfo,
  user,
}))
export default class Profile extends Component {
  state = {
    name: this.props.userInfo.name,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'user/getCurrentUserInfo',
      id: 'this',
      verbose: 100,
    });
  }

  componentWillReceiveProps({ userInfo: { name } }) {
    if (name && name !== this.state.name) {
      this.setState({ name });
    }
  }

  handleConfirm = () => {
    const { name } = this.state;
    const { userInfo: { name: oldName } } = this.props;
    if (name && name !== oldName) {
      this.props.dispatch({
        type: 'user/updateUserInfo',
        id: 'this',
        payload: {
          name,
        },
      });
    }
  };

  handleCancel = () => {
    const { userInfo: { name } } = this.props;
    this.setState({ name });
  };

  handleNameChange = event => {
    this.setState({
      name: event.target.value,
    });
  };

  changePasswordSubmit = values => {
    const { oldPwd, password } = values;
    this.props.dispatch({
      type: 'user/changePassword',
      id: 'this',
      language: 2,
      payload: {
        oldPassword: md5(oldPwd).toUpperCase(),
        newPassword: md5(password).toUpperCase(),
      },
      onSuccess: () => {
        message.success('修改成功');
      },
    });
  };

  render() {
    const { userInfo, user } = this.props;
    const action = userInfo && userInfo.phone ? 'unbind' : 'bind';
    return (
      <div className={styles.main}>
        {userInfo ? (
          <Card>
            <Tabs defaultActiveKey="1" animated={false}>
              <TabPane tab="用户信息" key="1">
                <Row gutter={8} className={styles.info}>
                  <Col span={16}>
                    <Row>
                      <Col span={6}>
                        <div>邮箱:</div>
                      </Col>
                      <Col span={18}>
                        <div>{userInfo.email}</div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div className={styles.username}>用户名:</div>
                      </Col>
                      <Col span={18}>
                        <InlineEditor
                          style={{ width: 200 }}
                          value={this.state.name}
                          confimOnPressEnter
                          onConfirm={this.handleConfirm}
                          onCancel={this.handleCancel}
                          onChange={this.handleNameChange}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div>手机号:</div>
                      </Col>
                      <Col span={18}>
                        {userInfo.phone && (
                          <div>{userInfo.phone.substring(3)}</div>
                        )}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div>角色:</div>
                      </Col>
                      <Col span={18}>
                        <div>{roleName(userInfo.roleName)}</div>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div>上次登录时间:</div>
                      </Col>
                      <Col span={18}>
                        <FormattedDate timestamp={userInfo.lastLogin} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div>上次登出时间:</div>
                      </Col>
                      <Col span={18}>
                        <FormattedDate timestamp={userInfo.lastLogout} />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={6}>
                        <div>上次登录IP:</div>
                      </Col>
                      <Col span={18}>
                        <div>{userInfo.lastIp}</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab={intl.get(`common.${action}`)} key="2">
                <BindPhone action={action} />
              </TabPane>
              <TabPane tab="修改密码" key="3">
                <ChangePassword
                  onSubmit={this.changePasswordSubmit}
                  user={user}
                />
              </TabPane>
            </Tabs>
          </Card>
        ) : (
          <div className={styles.loading}>
            <Spin size="large" />
          </div>
        )}
      </div>
    );
  }
}
