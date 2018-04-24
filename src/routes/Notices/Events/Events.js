import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { DatePicker, Select, Input, Button, Form, Card } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import style from './Events.less';
import EventsTable from '../../../components/EventsTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BizIcon from '../../../components/BizIcon';

const { RangePicker } = DatePicker;
const { Option } = Select;
const seriousWarning = intl.get('notice.serious_warning');
const importantWarning = intl.get('notice.important_warning');
const minorWarning = intl.get('notice.minor_warning');
const caution = intl.get('notice.caution');
const remind = intl.get('notice.remind');

@connect(({ alarm, loading }) => ({
  alarm,
  loading: loading.effects['alarm/getAlarm'],
}))
@Form.create()
export default class Events extends Component {
  constructor(props) {
    super(props);
    const now =
      new Date(new Date().toLocaleDateString()).getTime() + 3600 * 24 * 1000;

    this.state = {
      searchValues: {
        verbose: 100,
        start_time: now / 1000 - 1000 * 60 * 60 * 24 * 7 / 1000,
        end_time: now / 1000 - 1,
      },
    };
  }

  componentDidMount() {
    // 组件

    const { dispatch } = this.props;
    dispatch({
      type: 'alarm/getAlarm',
      payload: { ...this.state.searchValues },
    });
  }
  getAlarmsData = alarms => {
    if (alarms.length === 0 || alarms === undefined) {
      return [];
    }
    const newNotices = alarms.map(notice => {
      let newNotice = { ...notice };
      const { level } = notice;
      let img = {};
      if (level === 5) {
        img = { type: 'alarm-serious', style: { color: 'rgb(217, 32, 5)' } };
      } else if (level === 4) {
        img = { type: 'alarm', style: { color: 'rgb(249, 93, 0)' } };
      } else if (level === 3) {
        img = { type: 'alarm', style: { color: 'rgb(218, 203, 63)' } };
      } else if (level === 2) {
        img = { type: 'alarm', style: { color: 'rgb(43, 150, 219)' } };
      } else if (level === 1) {
        img = { type: 'alarm-attention', style: { color: 'rgb(40, 167, 94)' } };
      }
      newNotice = {
        ...notice,
        /* eslint no-underscore-dangle: 0 */
        _id: notice._id, // transform id to item key
        desc: notice.desc, // 信息描述的内容
        createTime: moment(notice.createTime * 1000).format(
          'YYYY.MM.DD HH:mm:ss'
        ),
        clearTime: notice.clearTime
          ? moment(notice.clearTime * 1000).format('YYYY.MM.DD HH:mm:ss')
          : '',
        levelImg: <BizIcon {...img} className={style.levelImg} />,
      };
      return newNotice;
    });
    return newNotices;
  };
  getTime = () => {
    const newDate = new Date().getTime();
    const nowDate = moment(newDate).format('YYYY/MM/DD');
    const oldDate = moment(new Date().getTime() - 3600 * 24 * 7 * 1000).format(
      'YYYY/MM/DD'
    );
    return [moment(oldDate, 'YYYY/MM/DD'), moment(nowDate, 'YYYY/MM/DD')];
  };
  handleStandardTableChange = pagination => {
    this.fetchAlarms(pagination, this.state.searchValues);
  };
  fetchAlarms = (
    pagination,
    { levels, states, confirm_states, ...searchValues }
  ) => {
    let params = {};
    if (pagination && pagination.current) {
      params = {
        cursor: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
    }
    const verbose = { verbose: 100 };
    const payload = { ...verbose, ...params, ...searchValues };
    if (levels !== 'all') {
      payload.levels = levels;
    }
    if (states !== 'all') {
      payload.states = states;
    }
    if (confirm_states !== 'all') {
      payload.confirm_states = confirm_states;
    }
    this.props.dispatch({ type: 'alarm/getAlarm', payload });
  };
  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, { DateValue, ...values }) => {
      if (err) return;
      const searchValues = {
        start_time:
          new Date(moment(DateValue[0]).format('YYYY/MM/DD')).getTime() / 1000,
        end_time:
          new Date(moment(DateValue[1]).format('YYYY/MM/DD')).getTime() / 1000 +
          3600 * 24 -
          1,
        ...values,
      };
      this.fetchAlarms({}, searchValues);
      this.setState({ searchValues });
    });
  };
  handleConfirm = (id, comment) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;
    dispatch({
      type: 'alarm/confirmAlarm',
      payload: {
        id,
        body: JSON.stringify({
          confirmWay: 1,
          comment,
        }),
      },
      callBack: () => {
        this.fetchAlarms({}, searchValues);
      },
    });
  };

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSearch}>
        <Form.Item>
          {getFieldDecorator('DateValue', { initialValue: this.getTime() })(
            <RangePicker format="YYYY/MM/DD" />
          )}
        </Form.Item>
        <Form.Item label={intl.get('notice.level')}>
          {getFieldDecorator('levels', { initialValue: 'all' })(
            <Select dropdownMatchSelectWidth={false}>
              <Option value="all">---{intl.get('common.all')}---</Option>
              <Option value="5">{seriousWarning}</Option>
              <Option value="4">{importantWarning}</Option>
              <Option value="3">{minorWarning}</Option>
              <Option value="2">{caution}</Option>
              <Option value="1">{remind}</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get('notice.alarm_state')}>
          {getFieldDecorator('states', { initialValue: 'all' })(
            <Select dropdownMatchSelectWidth={false}>
              <Option value="all">---{intl.get('common.all')}---</Option>
              <Option value="1">{intl.get('notice.alarm_occur')}</Option>
              <Option value="-1">{intl.get('notice.alarm_remove')}</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get('notice.sure_state')}>
          {getFieldDecorator('confirm_states', { initialValue: 'all' })(
            <Select
              onChange={this.onConfirmStatusChange}
              dropdownMatchSelectWidth={false}
            >
              <Option value="all">---{intl.get('common.all')}---</Option>
              <Option value="1">{intl.get('notice.unconfirmed')}</Option>
              <Option value="0">{intl.get('notice.confirmed')}</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label={intl.get('notice.sites')}>
          {getFieldDecorator('site_name')(<Input />)}
        </Form.Item>
        <Form.Item label={intl.get('notice.type')}>
          {getFieldDecorator('types')(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="search" htmlType="submit" />
        </Form.Item>
      </Form>
    );
  }
  render() {
    const { alarm, loading, dispatch } = this.props;
    const { data } = alarm;
    const tableProps = { loading, data, dispatch };
    const fontStyle = { fontSize: '20px', marginRight: '10px' };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex' }}>
              <span style={{ color: 'rgb(217, 32, 5)', ...fontStyle }}>
                <BizIcon type="alarm-serious" />
                <span>{seriousWarning}</span>
              </span>
              <span style={{ color: 'rgb(249, 93, 0)', ...fontStyle }}>
                <BizIcon type="alarm" />
                <span>{importantWarning}</span>
              </span>
              <span style={{ color: 'rgb(218, 203, 63)', ...fontStyle }}>
                <BizIcon type="alarm" />
                <span>{minorWarning}</span>
              </span>
              <span style={{ color: 'rgb(43, 150, 219)', ...fontStyle }}>
                <BizIcon type="alarm" />
                <span>{caution}</span>
              </span>
              <span style={{ color: 'rgb(40, 167, 94)', fontSize: '20px' }}>
                <BizIcon type="alarm-attention" />
                <span>{remind}</span>
              </span>
            </div>
            <div>{this.renderForm()}</div>
            <div>
              <EventsTable
                {...tableProps}
                dataSource={this.getAlarmsData(data.list)}
                onChange={this.handleStandardTableChange}
                onConfirm={this.handleConfirm}
              />
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
