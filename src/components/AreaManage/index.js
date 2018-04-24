import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';

const { confirm } = Modal;

@Form.create()
export default class AreaManage extends PureComponent {
  //点击取消按钮
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };
  //点击保存时的提示框
  showConfirm = () => {
    this.props.form.validateFields((err, { ...values }) => {
      const { data: { _id: id }, onCancel, onConfirm } = this.props;
      if (err) return;
      const comment  = { ...values };
      confirm({
        title: intl.get('common.notice'),
        content: intl.get('common.confirmupdate'),
        onOk() {
          onConfirm(id, comment);
          onCancel();
        },
      });
    });
  };

  render() {
    const { visible, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const itemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
      <Modal
        title={intl.get('site.area.areaDetail')}
        style={{ top: 20 }}
        visible={visible}
        onOk={this.showConfirm.bind(this)}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleComment}>
          <Form.Item label={intl.get('site.area.areaName')} {...itemLayout}>
            {getFieldDecorator('name', { initialValue: data.name })(
              <Input  />
            )}
          </Form.Item>
          <Form.Item label={intl.get('site.area.charger')} {...itemLayout}>
            {getFieldDecorator('charger', { initialValue: data.charger })(
              <Input  />
            )}
          </Form.Item>
          <Form.Item label={intl.get('site.area.phone')} {...itemLayout}>
            {getFieldDecorator('phone', { initialValue: data.phone })(
              <Input  />
            )}
          </Form.Item>
          <Form.Item label={intl.get('site.area.description')} {...itemLayout}>
            {getFieldDecorator('description', { initialValue: data.description })(
              <Input  />
            )}
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}
