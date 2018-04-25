import React, { PureComponent } from 'react';
import { Form, Input, Modal,Select,DatePicker} from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';
const { RangePicker } = DatePicker;
const { confirm } = Modal;
import PhoneAdTab from '../../components/PhoneAdTab/Tab';

@Form.create()
export default class PhoneAdManage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      mediaList:[]
    }
  }
  //点击取消按钮
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };
  //点击保存时的提示框
  showConfirm = () => {
    const { onConfirm } = this.props;
    this.props.form.validateFields((err, { ...values }) => {
      const { data: { _id: id }, onCancel, onConfirm } = this.props;
      if (err) return;
      const comment  = { ...values };
      const finalData={
        adName:comment.adName,
        mediaList:this.state.mediaList,
        payStyles:comment.payStyles,
        startTime:  new Date(moment(comment.DateValue[0]).format('YYYY/MM/DD')).getTime() / 1000,
        endTime: new Date(moment(comment.DateValue[1]).format('YYYY/MM/DD')).getTime() / 1000 +3600 * 24 -1,
      };
      confirm({
        title: intl.get('common.notice'),
        content: intl.get('common.confirmupdate'),
        onOk() {
          onConfirm(id, finalData);
          onCancel();
        },
      });
    });

  };

  adContent = (data) => {
      this.state.mediaList = data;
  }

  getTime = (data) => {
    console.log(data);
    const nowDate = moment(data.startTime).format('YYYY/MM/DD');
    const oldDate = moment(data.endTime).format('YYYY/MM/DD');
    return [moment(nowDate, 'YYYY/MM/DD'), moment(oldDate, 'YYYY/MM/DD')];
  };

  render() {
    const { visible, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const itemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    const adContentLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 25 },
    };
    return (
      <Modal
        title={intl.get('ad.phone.phoneAdDetail')}
        style={{ top: 20 }}
        visible={visible}
        onOk={this.showConfirm.bind(this)}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleComment}>
          <Form.Item {...itemLayout}  label="广告名称" hasFeedback required>
            {getFieldDecorator('adName', { initialValue: data.adName })(
              <Input  />
            )}
          </Form.Item>

          <Form.Item {...itemLayout} label="播放时间" hasFeedback required>
          {getFieldDecorator('DateValue', { initialValue: this.getTime(data) })(
            <RangePicker format="YYYY/MM/DD" />
          )}
          </Form.Item>

          <Form.Item {...itemLayout} label="支付方式" hasFeedback required>
          {getFieldDecorator('payStyles', { initialValue: data.payStyles })(
            <Select
              dropdownMatchSelectWidth={false}
              mode='multiple'
            >
              <Option value="2">{intl.get('ad.phone.wechat')}</Option>
              <Option value="3">{intl.get('ad.phone.alipay')}</Option>
            </Select>
          )}
          </Form.Item>

          <Form.Item {...adContentLayout}>
             <PhoneAdTab
               onConfirmTab = {this.adContent}
               adData = {data.mediaList}
             />
          </Form.Item>

        </Form>
      </Modal>
    );
  }
}
