import React, { Component } from 'react';
import { connect } from 'dva';
import { Link, routerRedux } from 'dva/router';
import { Alert, Button, Col, Form, Input, Popover, Progress, Row } from 'antd';
import { generate as shortid } from 'shortid';
import md5 from 'md5';
import EmailAutoComplete from '../../components/EmailAutoComplete';
import { errorMessage } from '../../utils/utils';
import styles from './Register.less';

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects['register/submit'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
  };

  componentDidMount() {
    this.onGetCaptcha();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onGetCaptcha = () => {
    this.setState({ pid: shortid() });
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.onGetCaptcha, 60000);
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { email, password, captcha } = values;
        this.props.dispatch({
          type: 'register/submit',
          payload: {
            ...values,
            picId: this.state.pid,
            username: email,
            password: md5(password),
            varificationCode: captcha,
          },
          onSuccess: () => {
            this.props.dispatch(routerRedux.push('/user/register-result'));
          },
          onFail: this.onGetCaptcha,
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  renderMessage = error => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={errorMessage(error)}
        type="error"
        showIcon
      />
    );
  };

  render() {
    const { form, submitting, register } = this.props;
    const { getFieldDecorator } = form;
    const { pid } = this.state;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          {register.status === 'error' &&
            !register.submitting &&
            this.renderMessage(register.error)}
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入机构名称！',
                },
              ],
            })(<Input size="large" placeholder="机构名称" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: '请输入邮箱地址！',
                },
                {
                  type: 'email',
                  message: '邮箱地址格式错误！',
                },
              ],
            })(<EmailAutoComplete size="large" placeholder="邮箱" />)}
          </Form.Item>
          <Form.Item help={this.state.help}>
            <Popover
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                />
              )}
            </Popover>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </Form.Item>
          <Form.Item>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator('captcha', {
                  rules: [
                    {
                      required: true,
                      message: '请输入验证码！',
                    },
                  ],
                })(<Input size="large" placeholder="验证码" />)}
              </Col>
              <Col span={8}>
                <img
                  alt="captcha"
                  className={styles.getCaptcha}
                  height={40}
                  width={117}
                  src={`/api/captchas/image?pid=${pid}&width=234&height=80`}
                  onClick={this.onGetCaptcha}
                />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账户登录
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
