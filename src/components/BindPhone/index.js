import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { Form, Alert, message } from 'antd';
import intl from 'react-intl-universal';
import Login from '../Login';
import styles from './index.less';

const { Mobile, Captcha, Submit } = Login;
@connect(state => ({
  user: state.user,
  login: state.login,
}))
@Form.create()
export default class BindPhone extends Component {
  static childContextTypes = {
    form: PropTypes.object,
  };

  getChildContext() {
    return {
      form: this.props.form,
    };
  }

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
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { mobile, captcha } = values;
        const { country, phone } = mobile;
        if (this.props.action === 'bind') {
          this.props.dispatch({
            type: 'user/bindPhone',
            payload: {
              phone: `${country}${phone}`,
              code: captcha,
            },
            onSuccess: () => {
              message.success('绑定成功');
            },
          });
        } else {
          this.props.dispatch({
            type: 'user/unbindPhone',
            code: captcha,
            onSuccess: () => {
              message.success('解除绑定');
            },
          });
        }
      }
    });
  };

  renderMessage = content => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={content}
        type="error"
        showIcon
        closable={false}
      />
    );
  };

  render() {
    const { user, action, login } = this.props;
    return (
      <Form className={styles.main} onSubmit={this.handleSubmit}>
        {user.status === 'captchaError' && this.renderMessage('验证码错误')}
        {user.status === 'phoneError' && this.renderMessage('手机号已经存在')}
        {login.status === 'beyondLimit' &&
          this.renderMessage('请求太过频繁,请稍后再试')}
        <Mobile name="mobile" validateTrigger="onBlur" size="default" />
        <Captcha
          name="captcha"
          size="default"
          onGetCaptcha={this.onGetCaptcha}
        />
        <Submit size="default">{intl.get(`common.${action}`)}</Submit>
      </Form>
    );
  }
}
