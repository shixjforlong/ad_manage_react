import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Alert, Col, Form, Row } from 'antd';
import { generate as shortid } from 'shortid';
import PropTypes from 'prop-types';
import Login from '../../components/Login';
import Captcha from '../../components/Captcha';
import styles from './ResetPassword.less';

const { UserName, Submit, CaptchaInput } = Login;
const FormItem = Form.Item;
@connect(state => ({
  user: state.user,
}))
@Form.create()
export default class ResetPasswordPage extends Component {
  static childContextTypes = {
    form: PropTypes.object,
  };

  state = {};

  getChildContext() {
    return {
      form: this.props.form,
    };
  }

  handleCpatchaUpdate = () => {
    this.setState({ pid: shortid() });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { email, captcha } = values;
        this.props.dispatch({
          type: 'user/resetPassword',
          payload: {
            ...values,
            picId: this.state.pid,
            username: email,
            varificationCode: captcha,
            language: 2,
          },
          onSuccess: () => {
            this.props.dispatch(
              routerRedux.push(`/user/reset-result?email=${email}`)
            );
          },
          onFail: this.handleCpatchaUpdate,
        });
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
        closable
      />
    );
  };

  render() {
    const { user } = this.props;
    const { pid } = this.state;
    return (
      <div className={styles.main}>
        <h3>重置密码</h3>
        <Form onSubmit={this.handleSubmit}>
          {user.status === 'emailError' && this.renderMessage('用户不存在')}
          {user.status === 'captchaError' && this.renderMessage('验证码错误')}
          <UserName name="email" />
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                <CaptchaInput name="captcha" />
              </Col>
              <Col span={8}>
                <Captcha
                  alt="captcha"
                  className={styles.getCaptcha}
                  height={40}
                  width={117}
                  pid={pid}
                  onUpdate={this.handleCpatchaUpdate}
                />
              </Col>
            </Row>
          </FormItem>
          <Submit className={styles.submit}>重置密码</Submit>
          <div>
            <Link className={styles.login} to="/user/login">
              返回登录页
            </Link>
          </div>
        </Form>
      </div>
    );
  }
}
