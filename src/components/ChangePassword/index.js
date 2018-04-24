import React, { Component } from 'react';
import { Form, Input, Button, Popover, Progress, Alert } from 'antd';
import styles from './index.less';

const FormItem = Form.Item;
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  pool: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception',
};
@Form.create()
export default class ChangePassword extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: '',
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
    return 'pool';
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不一致!');
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
      if (!this.state.visible && value.length < 6) {
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

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        this.props.onSubmit(values);
      }
    });
  };

  changeVisible = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 5) {
      this.setState({ visible: false });
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

  renderWarningMessage = content => {
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
    const { form, user } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <Form className={styles.main} onSubmit={this.handleSubmit}>
        {user.status === 'oldPasswordError' &&
          this.renderWarningMessage('旧密码错误')}
        {user.status === 'newPasswordError' &&
          this.renderWarningMessage('新密码不能与旧密码相同')}
        <FormItem {...formItemLayout} label="旧密码">
          {getFieldDecorator('oldPwd', {
            rules: [
              {
                required: true,
                message: '请输入旧密码！',
              },
            ],
          })(<Input size="default" type="password" placeholder="旧密码" />)}
        </FormItem>
        <FormItem help={this.state.help} {...formItemLayout} label="新密码">
          <div
            ref={c => {
              this.element = c;
            }}
          />
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
            getPopupContainer={() => this.element}
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={this.state.visible}
            onBlur={this.changeVisible}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入新密码！',
                },
                {
                  validator: this.checkPassword,
                },
              ],
            })(
              <Input
                size="default"
                type="password"
                placeholder="至少6位密码，区分大小写"
              />
            )}
          </Popover>
        </FormItem>
        <FormItem {...formItemLayout} label="重复密码">
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
          })(<Input size="default" type="password" placeholder="确认密码" />)}
        </FormItem>
        <FormItem className={styles.operation}>
          <Button
            size="default"
            type="primary"
            htmlType="submit"
            className={styles.save}
          >
            确认
          </Button>
        </FormItem>
      </Form>
    );
  }
}
