import React, { PureComponent } from 'react';
import { Form, Input, Modal } from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';

const { confirm } = Modal;

@Form.create()
export default class AlarmManage extends PureComponent {
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };
  showConfirm = () => {
    this.props.form.validateFields((err, { ...values }) => {
      const { data: { _id: id }, onCancel, onConfirm } = this.props;
      if (err) return;
      const { comment } = values;
      confirm({
        title: intl.get('common.notice'),
        content: intl.get('notice.confirmalarm'),
        onOk() {
          onConfirm(id, comment);
          onCancel();
        },
      });
    });
  };

  level = level => {
    switch (level) {
      case 1:
        return intl.get('notice.remind');
      case 2:
        return intl.get('notice.caution');
      case 3:
        return intl.get('notice.minor_warning');
      case 4:
        return intl.get('notice.important_warning');
      case 5:
        return intl.get('notice.serious_warning');
      default:
        return '';
    }
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
        title={intl.get('notice.alarm_detail')}
        style={{ top: 20 }}
        visible={visible}
        onOk={this.showConfirm.bind(this)}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleComment}>
          <Form.Item label={intl.get('notice.alarm_time')} {...itemLayout}>
            {getFieldDecorator('createTime', { initialValue: data.createTime })(
              <Input readOnly />
            )}
          </Form.Item>
          <Form.Item label={intl.get('notice.site_name')} {...itemLayout}>
            {getFieldDecorator('siteName', { initialValue: data.siteName })(
              <Input readOnly />
            )}
          </Form.Item>
          <Form.Item label={intl.get('notice.alarm_origin')} {...itemLayout}>
            {getFieldDecorator('sourceName', { initialValue: data.sourceName })(
              <Input readOnly />
            )}
          </Form.Item>
          {data.confirmState ? (
            ''
          ) : (
            <Form.Item
              label={intl.get('notice.confirm_account')}
              {...itemLayout}
            >
              {getFieldDecorator('confirmUserName', {
                initialValue: data.confirmUserName,
              })(<Input readOnly />)}
            </Form.Item>
          )}
          {data.confirmState ? (
            ''
          ) : (
            <Form.Item label={intl.get('notice.confirm_time')} {...itemLayout}>
              {getFieldDecorator('confirmTime', {
                initialValue: moment(data.confirmTime * 1000).format(
                  'YYYY.MM.DD HH:mm:ss'
                ),
              })(<Input readOnly />)}
            </Form.Item>
          )}
          <Form.Item label={intl.get('notice.level')} {...itemLayout}>
            {getFieldDecorator('level', {
              initialValue: this.level(data.level),
            })(<Input readOnly />)}
          </Form.Item>
          <Form.Item label={intl.get('notice.state')} {...itemLayout}>
            {getFieldDecorator('confirmState', {
              initialValue: data.confirmState
                ? intl.get('notice.unconfirmed')
                : intl.get('notice.confirmed'),
            })(<Input readOnly />)}
          </Form.Item>
          <Form.Item label={intl.get('notice.type')} {...itemLayout}>
            {getFieldDecorator('type', { initialValue: data.type })(
              <Input readOnly />
            )}
          </Form.Item>
          <Form.Item label={intl.get('notice.description')} {...itemLayout}>
            {getFieldDecorator('desc', { initialValue: data.desc })(
              <Input.TextArea readOnly />
            )}
          </Form.Item>
          <Form.Item label={intl.get('notice.comment')} {...itemLayout}>
            {getFieldDecorator('comment', {
              initialValue: data.comment ? data.comment : '',
            })(<Input.TextArea />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
