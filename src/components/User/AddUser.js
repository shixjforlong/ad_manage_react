import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select, Alert } from 'antd';
import EmailAutoComplete from '../../components/EmailAutoComplete';
import { roleName } from '../../utils/utils';

const FormItem = Form.Item;
@Form.create()
export default class AddUser extends PureComponent {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    roles: PropTypes.array.isRequired,
  };

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
    const { visible, form, roles, status } = this.props;
    const { getFieldDecorator } = form;
    const { _id: initRoleId } = roles[0] || {};
    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        title="新增用户"
        visible={visible}
        onOk={this.handleAdd}
        onCancel={this.handleCancel}
      >
        <Form>
          {status === 'error' && this.renderMessage('邮箱已经存在')}
          <FormItem {...itemLayout} label="名称" hasFeedback>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名！',
                },
              ],
            })(<Input placeholder="名称" />)}
          </FormItem>
          <FormItem {...itemLayout} label="邮箱" hasFeedback>
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
            })(<EmailAutoComplete size="default" placeholder="邮箱" />)}
          </FormItem>
          <FormItem {...itemLayout} label="角色">
            {getFieldDecorator('roleId', {
              initialValue: initRoleId,
            })(
              <Select>
                {roles.map(({ _id: id, name }) => (
                  <Select.Option key={id} value={id}>
                    {roleName(name)}
                  </Select.Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
