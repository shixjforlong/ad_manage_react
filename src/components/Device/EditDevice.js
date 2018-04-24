import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal } from 'antd';
import { debounce } from 'lodash/function';

import AlertError from '../../components/AlertError';
import { validateDevice } from '../../services/device';

@Form.create()
export default class EditDevice extends PureComponent {
  static defaultProps = {
    error: undefined,
  };

  static propTypes = {
    data: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    error: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  validateName = debounce((rule, value, callback) => {
    if (value !== this.props.data.name) {
      validateDevice({ name: value })
        .then(({ error }) => {
          if (error) {
            callback('error');
          } else {
            callback();
          }
        })
        .catch(() => callback());
    } else {
      callback();
    }
  }, 500);

  handleSubmit = () => {
    const { onSubmit } = this.props;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        onSubmit(values);
      }
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { visible, error, form, data, ...modalProps } = this.props;
    const { getFieldDecorator } = form;

    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        title="编辑"
        visible={visible}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
        destroyOnClose
        {...modalProps}
      >
        <Form>
          {error && <AlertError error={error} />}

          <Form.Item {...itemLayout} label="名称" hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入网关名称！',
                },
                {
                  message: '网关名称已存在！',
                  validator: this.validateName,
                },
              ],
              initialValue: data.name,
            })(<Input placeholder="名称" />)}
          </Form.Item>
          <Form.Item {...itemLayout} label="地址">
            {getFieldDecorator('address', {
              initialValue: data.address,
            })(<Input />)}
          </Form.Item>
          <Form.Item {...itemLayout} label="手机号">
            {getFieldDecorator('mobileNumber', {
              initialValue: data.mobileNumber,
            })(<Input />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
