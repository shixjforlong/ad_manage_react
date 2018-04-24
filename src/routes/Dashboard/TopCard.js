import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, DatePicker, Tabs } from 'antd';
import moment from 'moment';
import { OnlineTop, TrafficTop } from '../../components/Dashboard/index';
import styles from './Analysis.less';

const { MonthPicker } = DatePicker;

@connect(({ online, traffic }) => ({
  online,
  traffic,
}))
export default class TopCard extends PureComponent {
  state = {
    monthPickerValue: moment().subtract(1, 'd'),
  };

  componentDidMount() {
    const { monthPickerValue } = this.state;
    const date = monthPickerValue.format('YYYY-MM-DD');
    this.props.dispatch({
      type: 'online/fetchTop',
      payload: { date, limit: 10 },
    });

    this.props.dispatch({
      type: 'traffic/fetchTop',
      payload: { date, limit: 10 },
    });
  }

  onDeviceTrafficSelect = item => {
    this.props.dispatch({
      type: 'traffic/fetchTrend',
      payload: item,
    });
  };

  onDeviceOnlineSelect = item => {
    this.props.dispatch({
      type: 'online/fetchTrend',
      payload: item,
    });
  };

  handleMonthPickerChange = value => {
    this.setState({
      monthPickerValue: value,
    });

    const date = value.format('YYYY-MM-DD');
    this.props.dispatch({
      type: 'online/fetchTop',
      payload: { date, limit: 10 },
    });
    this.props.dispatch({
      type: 'traffic/fetchTop',
      payload: { date, limit: 10 },
    });
  };

  selectDate = sub => {
    const value = moment()
      .subtract(sub, 'M')
      .startOf('M');
    this.setState({
      monthPickerValue: value,
    });

    this.props.dispatch({
      type: 'online/fetchTop',
      payload: { date: value.format('YYYY-MM-DD'), limit: 10 },
    });

    this.props.dispatch({
      type: 'traffic/fetchTop',
      payload: { date: value.format('YYYY-MM-DD'), limit: 10 },
    });
  };

  isActive(type) {
    const { monthPickerValue } = this.state;
    if (monthPickerValue.isSame(moment().subtract(type, 'month'), 'month')) {
      return styles.currentDate;
    }
  }

  render() {
    const { monthPickerValue } = this.state;
    const { online, traffic } = this.props;

    const extra = (
      <div>
        <div className={styles.salesExtra}>
          <a className={this.isActive(0)} onClick={() => this.selectDate(0)}>
            本月
          </a>
          <a className={this.isActive(1)} onClick={() => this.selectDate(1)}>
            上月
          </a>
        </div>
        <MonthPicker
          value={monthPickerValue}
          onChange={this.handleMonthPickerChange}
          allowClear={false}
        />
      </div>
    );

    return (
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <div className={styles.salesCard}>
          <Tabs
            size="large"
            tabBarStyle={{ marginBottom: 24 }}
            animated={{ inkBar: true, tabPane: false }}
            defaultActiveKey="traffic"
            tabBarExtraContent={extra}
          >
            <Tabs.TabPane tab="流量" key="traffic">
              <TrafficTop
                trend={traffic.trend}
                top={traffic.top}
                current={traffic.current}
                onSelect={this.onDeviceTrafficSelect}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab="在线" key="online">
              <OnlineTop
                trend={online.trend}
                top={online.top}
                current={online.current}
                onSelect={this.onDeviceOnlineSelect}
              />
            </Tabs.TabPane>
          </Tabs>
        </div>
      </Card>
    );
  }
}
