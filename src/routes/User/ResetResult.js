import React, { Component } from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import { parse } from 'qs';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

const title = <div className={styles.title}>密码重置成功</div>;

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large" type="primary">
        点击登录
      </Button>
    </Link>
  </div>
);

export default class ResetResult extends Component {
  render() {
    const { email = '' } = parse(this.props.location.search.substring(1));
    return (
      <Result
        className={styles.registerResult}
        type="success"
        title={title}
        tip="新密码已发送至您的邮箱"
        email={email}
        description="点击下方按钮，返回登录页面。"
        actions={actions}
        style={{ marginTop: 56 }}
      />
    );
  }
}
