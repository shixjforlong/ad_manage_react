import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select } from 'antd';
import { debounce } from 'lodash/function';

import AlertError from '../../components/AlertError';
import { modelOfSN } from '../../utils/utils';

//import { validateArea } from '../../services/area';

@Form.create()
export default class AddArea extends PureComponent {
  static defaultProps = {
    error: undefined,
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    error: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  validateName = debounce((rule, value, callback) => {
    validateArea({ name: value })
      .then(({ error }) => {
        if (error) {
          callback('error');
        } else {
          callback();
        }
      })
      .catch(() => callback());
  }, 500);

  handleAdd = () => {
    const { onAdd } = this.props;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        onAdd(values);
      }
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  render() {
    const { visible,error,form } = this.props;
    const { getFieldDecorator } = form;

    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        title="新增区域"
        visible={visible}
        onOk={this.handleAdd}
        onCancel={this.handleCancel}
      >
      <Form>
        {error && <AlertError error={error} />}

          <Form.Item {...itemLayout} label="区域名称" hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入区域名称！',
                }
              ],
            })(<Input placeholder="请输入区域名称" />)}
          </Form.Item>

          <Form.Item {...itemLayout} label="负责人">
            {getFieldDecorator('charger', {
              initialValue: '',
            })(
              <Input placeholder="请输入负责人" />)}
          </Form.Item>

          <Form.Item {...itemLayout} label="联系方式">
            {getFieldDecorator('phone', {
              initialValue: '',
            })(
              <Input placeholder="请输入联系方式" />)}
          </Form.Item>

          <Form.Item {...itemLayout} label="描述">
            {getFieldDecorator('description', {
              initialValue: '',
            })(
              <Input placeholder="请输入描述" />)}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}
