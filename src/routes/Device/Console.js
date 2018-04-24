import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, InputNumber, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ReactBash from '../../components/Console';
import styles from './Console.less';
import { runTask } from '../../services/task';

@connect(({ device, loading }) => ({
  device,
  loading,
}))
export default class Console extends Component {
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
  }

  componentWillUnmount() {
    this.props.dispatch({ type: 'task/clear' });
  }

  getId() {
    const { match } = this.props;
    const { id } = match.params;
    return id;
  }

  send = cmd => {
    const { current } = this.props.device;
    const { name } = current;
    return runTask({
      name: `remote console: ${cmd}`,
      type: 2,
      objectId: this.getId(),
      objectName: name,
      timeout: this.state.timeout * 1000,
      data: {
        deviceDesc: 'CMD',
        sensorId: 0,
        deviceType: 0,
        deviceContent: cmd,
      },
    })
      .catch(e => message.error(e))
      .then(({ result, error }) => {
        if (error) {
          message.error(error);
          return error;
        } else if (result.error) {
          return result.error;
        } else {
          return result.data.response;
        }
      });
  };

  handleTimeoutChange = value => {
    this.setState({
      timeout: value,
    });
  };

  render() {
    const { device } = this.props;
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
        title: current.name || '',
        href: `/device/${this.getId()}`,
      },
      {
        title: '远程控制',
      },
    ];

    const extensions = {
      fallback: {
        exec: (state, { input }) => {
          return this.send(input)
            .then(v => <pre>{v}</pre>)
            .then(value => ({
              ...state,
              history: state.history.concat({ value }),
            }));
        },
      },
    };

    const extra = (
      <div>
        <InputNumber
          min={10}
          max={120}
          value={this.state.timeout}
          onChange={this.handleTimeoutChange}
        />{' '}
        秒超时
      </div>
    );

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <Card bordered={false} title="远程控制" extra={extra}>
          <div className={styles.term}>
            <ReactBash prefix="Router" extensions={extensions} />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
