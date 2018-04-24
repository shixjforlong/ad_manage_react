import intl from 'react-intl-universal';
import 'moment/locale/zh-cn';
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Alert, Checkbox } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import locales from '../../locale';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = (form, cb) => {
    form.validateFields(['mobile'], {}, (err, { mobile }) => {
      if (!err) {
        const { country, phone } = mobile;
        this.props.dispatch({
          type: 'login/sendSMSCode',
          payload: { phone: `${country}${phone}` },
        });
        cb();
      }
    });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const { type, autoLogin } = this.state;
      let payload = { ...values, type, autoLogin };
      if (this.state.type !== 'account') {
        const { mobile, captcha } = values;
        const { country, phone } = mobile;
        payload = {
          ...payload,
          username: `${country}${phone}`,
          password: captcha,
        };
      }
      this.props.dispatch({ type: 'login/login', payload });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={content}
        type="error"
        showIcon
      />
    );
  };

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab={intl.get('common.account_login')}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !login.submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="username" />
            <Password name="password" />
          </Tab>
          <Tab key="mobile" tab={intl.get('common.phone_login')}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !login.submitting &&
              this.renderMessage('验证码错误')}
            {login.status === 'sendCaptchaError' &&
              login.type === 'mobile' &&
              login.submitting === false &&
              this.renderMessage('验证码发送失败，请稍后再试')}
            <Mobile name="mobile" validateTrigger="onBlur" />
            <Captcha
              name="captcha"
              size="large"
              loading={login.gettingCaptcha}
              onGetCaptcha={this.onGetCaptcha}
            />
          </Tab>
          <div>
            <Checkbox
              checked={this.state.autoLogin}
              onChange={this.changeAutoLogin}
            >
              自动登录
            </Checkbox>
            <Link style={{ float: 'right' }} to="/user/reset-password">
              忘记密码
            </Link>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/user/register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}
