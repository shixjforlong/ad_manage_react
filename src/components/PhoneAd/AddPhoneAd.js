import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select,DatePicker } from 'antd';
import { debounce } from 'lodash/function';
import moment from 'moment';

import AlertError from '../../components/AlertError';
import { modelOfSN } from '../../utils/utils';

import PhoneAdTab from '../../components/PhoneAdTab/Tab';
const { RangePicker } = DatePicker;

@Form.create()
export default class AddPhoneAd extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      mediaList:[]
    }
  }

  static defaultProps = {
    error: undefined,
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    error: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };


  handleAdd = () => {
    const { onAdd } = this.props;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const finalData={
          adName:values.adName,
          mediaList:this.state.mediaList,
          payStyles:values.payStyles,
          startTime:  new Date(moment(values.DateValue[0]).format('YYYY/MM/DD')).getTime() / 1000,
          endTime: new Date(moment(values.DateValue[1]).format('YYYY/MM/DD')).getTime() / 1000 +3600 * 24 -1,
        };
        onAdd(finalData);
      }
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  getTime = () => {
    const newDate = new Date().getTime();
    const nowDate = moment(newDate).format('YYYY/MM/DD');
    const oldDate = moment(new Date().getTime() + 3600 * 24 * 7 * 1000).format(
      'YYYY/MM/DD'
    );
    return [moment(nowDate, 'YYYY/MM/DD'), moment(oldDate, 'YYYY/MM/DD')];
  };

  adContent = (data) => {
      this.state.mediaList = data;
  }

  render() {
    const { visible,error,form } = this.props;
    const { getFieldDecorator } = form;

    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };
    const adContentLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 25 },
    };

    return (
      <Modal
        title="新增手机广告"
        visible={visible}
        onOk={this.handleAdd}
        onCancel={this.handleCancel}
        style={{ width: 560 }}
      >
      <Form>
        {error && <AlertError error={error} />}
          <Form.Item {...itemLayout} label="广告名称" hasFeedback required>
            {getFieldDecorator('adName', {
              rules: [
                {
                  required: true,
                  message: '请输入广告名称！',
                }
              ],
            })(<Input placeholder="请输入广告名称" />)}
          </Form.Item>
          <Form.Item {...itemLayout} label="播放时间" hasFeedback required>
          {getFieldDecorator('DateValue', { initialValue: this.getTime() })(
            <RangePicker format="YYYY/MM/DD" />
          )}
          </Form.Item>

          <Form.Item {...itemLayout} label="支付方式" hasFeedback required>
          {getFieldDecorator('payStyles', { initialValue: '2' })(
            <Select
              onChange={this.onConfirmStatusChange}
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
             />
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
