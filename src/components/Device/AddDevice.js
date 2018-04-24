import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select } from 'antd';
import { debounce } from 'lodash/function';

import AlertError from '../../components/AlertError';
import { validateDevice } from '../../services/device';
import { modelOfSN } from '../../utils/utils';

@Form.create()
export default class AddDevice extends PureComponent {
  static defaultProps = {
    error: undefined,
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    error: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    models: PropTypes.array.isRequired,
  };

  validateSerialNumber = debounce((rule, value, callback) => {
    validateDevice({ sn: value })
      .then(({ error }) => {
        if (error) {
          callback('error');
        } else {
          callback();
          const { _id: model } = this.searchModel(value);
          this.props.form.setFieldsValue({ modelId: model });
        }
      })
      .catch(() => callback());
  }, 100);

  validateName = debounce((rule, value, callback) => {
    validateDevice({ name: value })
      .then(({ error }) => {
        if (error) {
          callback('error');
        } else {
          callback();
        }
      })
      .catch(() => callback());
  }, 500);

  searchModel(serialNumber) {
    const { models } = this.props;
    const model = modelOfSN(serialNumber);
    if (model) {
      return models.find(({ name }) => name === model);
    }
    return models[0];
  }

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
    const { visible, error, form, models } = this.props;
    const { getFieldDecorator } = form;
    const { _id: initModelId } = models[0] || {};

    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        title="新增网关"
        visible={visible}
        onOk={this.handleAdd}
        onCancel={this.handleCancel}
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
            })(<Input placeholder="名称" />)}
          </Form.Item>
          <Form.Item {...itemLayout} label="序列号" hasFeedback>
            {getFieldDecorator('serialNumber', {
              rules: [
                {
                  required: true,
                  pattern: /^[a-zA-Z]{2}(\d{13})$/,
                  message: '请输入正确的网关序列号！',
                },
                {
                  message: '序列号已存在！',
                  validator: this.validateSerialNumber,
                },
              ],
              validateFirst: true,
            })(<Input placeholder="序列号" />)}
          </Form.Item>
          <Form.Item {...itemLayout} label="机型">
            {getFieldDecorator('modelId', {
              initialValue: initModelId,
            })(
              <Select>
                {models.map(({ _id: id, name }) => (
                  <Select.Option key={id} value={id}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
