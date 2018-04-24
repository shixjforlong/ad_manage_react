import React, { Component } from 'react';
import { connect } from 'dva';
import { Alert, Button, Card, InputNumber, Spin } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Logs.less';

@connect(({ device, loading, task }) => ({
  device,
  loading,
  task,
}))
export default class Logs extends Component {
  state = {
    timeout: 30,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const id = this.getId();

    dispatch({
      type: 'device/fetch',
      payload: { id },
    });
    this.fetch();
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'task/clear' });
  }

  getId() {
    const { match } = this.props;
    const { id } = match.params;
    return id;
  }

  fetch = () => {
    const { current } = this.props.device;
    const { name } = current;
    this.props.dispatch({
      type: 'task/run',
      payload: {
        name: 'show log',
        type: 2,
        objectId: this.getId(),
        objectName: name,
        timeout: this.state.timeout * 1000,
        data: {
          deviceDesc: 'CMD',
          sensorId: 0,
          deviceType: 0,
          deviceContent: 'show log',
        },
      },
    });
  };

  handleTimeoutChange = value => {
    this.setState({
      timeout: value,
    });
  };

  render() {
    const { device, loading, task } = this.props;
    const { current } = device;
    const breadcrumbList = [
      {
        title: '首页',
        href: '/',
      },
      {
        title: '网关',
        href: '/devices',
      },
      {
        title: current.name,
        href: `/device/${this.getId()}`,
      },
      {
        title: '日志',
      },
    ];

    const { result = {}, error } = task;

    const extra = (
      <div>
        <InputNumber
          min={10}
          max={120}
          value={this.state.timeout}
          onChange={this.handleTimeoutChange}
        />{' '}
        秒超时
        <Button
          style={{ marginLeft: 30 }}
          shape="circle"
          icon="reload"
          onClick={this.fetch}
        />
      </div>
    );

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false} title="设备日志" extra={extra}>
          <Spin spinning={loading.effects['task/run']}>
            {error && <Alert type="error" message={error} banner />}
            {result.error && (
              <Alert type="error" message={result.error} banner />
            )}
            {result.data && (
              <pre className={styles.pre}>{result.data.response}</pre>
            )}
          </Spin>
        </Card>
      </PageHeaderLayout>
    );
  }
}
