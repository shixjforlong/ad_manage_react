import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, message, List, Select, DatePicker } from 'antd';
import moment from 'moment';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import FormattedDate from '../../../components/FormattedDate';
import { exportLogs } from '../../../services/log';
import { filedownload } from '../../../utils/filedownload';
import { logTransform } from '../../../utils/LogUtils';
import styles from './Logs.less';
import { logCode } from './logJson';
import icon2 from '../../../assets/message2.png';
import icon3 from '../../../assets/message3.png';
import icon4 from '../../../assets/message4.png';
import icon5 from '../../../assets/message5.png';
import icon6 from '../../../assets/message6.png';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ logs, loading }) => ({
  logs,
  loading: loading.effects['logs/fetch'],
}))
export default class TableList extends Component {
  state = {
    level: null,
    time: {
      start: moment()
        .subtract(7, 'd')
        .unix(),
      end: moment().unix(),
    },
    pagination: {
      limit: 15,
      cursor: 0,
    },
  };

  componentDidMount() {
    this.fetchLogs({});
  }

  fetchLogs = param => {
    const { time, pagination } = this.state;
    const payload = {
      start_time: time.start,
      end_time: time.end,
      limit: pagination.limit,
      ...param,
    };
    this.props.dispatch({ type: 'logs/fetch', payload });
  };
  handlePaginationChange = (page, pageSize) => {
    const payload = {
      cursor: (page - 1) * pageSize,
      limit: pageSize,
    };
    this.fetchLogs(payload);
  };
  handleLevelChange = value => {
    const { time } = this.state;
    const payload = {
      start_time: time.start,
      end_time: time.end,
    };
    if (value !== '0') {
      payload.level = value;
      this.setState({ level: value });
    } else {
      this.setState({ level: null });
    }
    this.fetchLogs(payload);
  };
  timeChange = value => {
    const time = value.map(item => {
      return item.unix();
    });
    const payload = {
      start_time: time[0],
      end_time: time[1],
    };
    if (this.state.level) {
      payload.level = this.state.level;
    }
    this.setState({ time });
    this.fetchLogs(payload);
  };
  handleClick = () => {
    const { level, time } = this.state;
    const deleteTime = moment()
      .add(7, 'd')
      .unix();
    const param = {
      language: 2,
      timeout: deleteTime,
      startTime: time.start,
      endTime: time.end,
    };
    if (level) {
      param.logLevel = level;
    }
    exportLogs(param)
      .then(({ result }) => {
        if (result) {
          const { _id: id } = result;
          const url = `/api/file/${id}`;
          filedownload(null, 'OperationLog.xls', null, url);
        } else {
          message.error('下载失败！请重新下载');
        }
      })
      .catch(() => message.error('下载失败！请重新下载'));
  };
  disabledDate = m => {
    return !m.isBetween(moment().subtract(3, 'months'), moment());
  };
  render() {
    const level = [icon2, icon3, icon4, icon5, icon6];
    const { logs, loading } = this.props;
    const { data } = logs;
    let { list } = data;
    list = logTransform(list, logCode);
    const { pagination } = data;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['15', '30', '50', '100'],
      defaultPageSize: 15,
      onChange: this.handlePaginationChange,
      onShowSizeChange: this.handlePaginationChange,
      ...pagination,
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Select
            showSearch
            style={{ width: 150 }}
            className={styles.location}
            size="default"
            placeholder="Select a person"
            defaultValue="全部"
            optionFilterProp="children"
            onChange={this.handleLevelChange}
          >
            <Option key="0">全部</Option>
            <Option key="6">严重错误</Option>
            <Option key="5">错误</Option>
            <Option key="4">警告</Option>
            <Option key="3">信息</Option>
            <Option key="2">调试</Option>
          </Select>
          <RangePicker
            style={{ width: 265 }}
            className={styles.location}
            allowClear={false}
            defaultValue={[moment().subtract(7, 'd'), moment()]}
            disabledDate={this.disabledDate}
            onChange={this.timeChange}
          />
          <Button
            className={styles.location}
            type="primary"
            icon="cloud-download"
            onClick={this.handleClick}
          >
            导出
          </Button>
          <Button
            type="primary"
            shape="circle"
            icon="sync"
            style={{ float: 'right' }}
            onClick={() => this.fetchLogs({})}
          />
          <List
            loading={loading}
            pagination={paginationProps}
            dataSource={list}
            renderItem={item => (
              <List.Item
                className={styles.listItem}
                actions={[
                  <span>{item.ip}</span>,
                  <FormattedDate timestamp={item.timestamp} />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <img
                      alt="message"
                      style={{ width: 25 }}
                      src={level[item.level - 2]}
                    />
                  }
                  title={
                    <div>
                      <span>{item.username}</span>
                    </div>
                  }
                />
                <div style={{ width: '100%' }}>{item.content}</div>
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
