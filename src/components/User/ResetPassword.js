import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Modal, Alert } from 'antd';
import Captcha from '../../components/Captcha';
import Login from '../../components/Login';

const { CaptchaInput } = Login;
const FormItem = Form.Item;
@Form.create()
export default class ResetPassword extends PureComponent {
  static childContextTypes = {
    form: PropTypes.object,
  };
  static propTypes = {
    onReset: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  getChildContext() {
    return {
      form: this.props.form,
    };
  }

  handleReset = () => {
    const { onReset } = this.props;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        onReset(values);
      }
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  handleCaptchaUpdate = () => {
    const { captchaUpdate } = this.props;
    captchaUpdate();
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
    const { visible, status, pid } = this.props;
    return (
      <Modal
        title="重置用户密码"
        visible={visible}
        width={400}
        destroyOnClose="true"
        onOk={this.handleReset}
        onCancel={this.handleCancel}
      >
        <Form style={{ padding: '0 30px' }}>
          {status === 'error' && this.renderMessage('验证码错误')}
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                <CaptchaInput name="varificationCode" />
              </Col>
              <Col span={8}>
                <Captcha
                  alt="captcha"
                  height={40}
                  width={117}
                  pid={pid}
                  onUpdate={this.handleCaptchaUpdate}
                />
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
