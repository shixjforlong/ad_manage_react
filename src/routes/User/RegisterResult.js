import React from 'react';
import { Button } from 'antd';
import { Link } from 'dva/router';
import Result from '../../components/Result';
import styles from './RegisterResult.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large" type="primary">
        点击登录
      </Button>
    </Link>
  </div>
);

export default ({ location }) => (
  <Result
    className={styles.registerResult}
    type="success"
    title={
      <div className={styles.title}>
        你的账户：{location.state ? location.state.account : ''} 注册成功
      </div>
    }
    description="您的账号已注册成功，点击下方登录按钮，开始使用吧。"
    actions={actions}
    style={{ marginTop: 56 }}
  />
);
