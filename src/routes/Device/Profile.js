import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  Dropdown,
  Menu,
  Modal,
  Row,
  Spin,
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import DescriptionList from '../../components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Profile.less';
import Signal from '../../components/Signal';
import TrafficChart from '../../components/Dashboard/TrafficChart';
import OnlineChart from '../../components/Dashboard/OnlineChart';
import EditDevice from '../../components/Device/EditDevice';
import Upgrade from '../../components/Device/Upgrade';
import Ngrok from '../../components/Device/Ngrok';

const { Description } = DescriptionList;
const { MonthPicker, RangePicker } = DatePicker;
const { confirm } = Modal;

@connect(({ device, traffic, loading, online }) => ({
  device,
  traffic,
  loading,
  online,
}))
export default class BasicProfile extends Component {
  state = {
    trafficMonth: moment(),
    onlineRange: [moment().subtract(1, 'd'), moment()],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.id = this.getId();
    const { trafficMonth, onlineRange } = this.state;

    dispatch({
      type: 'device/fetch',
      payload: { id: this.id },
    });

    this.fetchTrafficTrend(trafficMonth);
    this.fetchOnlineTrend(onlineRange);
  }

  getId() {
    const { match } = this.props;
    const { id } = match.params;
    return id;
  }

  fetchTrafficTrend(m) {
    this.props.dispatch({
      type: 'traffic/fetchTrend',
      payload: { date: m.format('YYYY-MM-DD'), deviceId: this.getId() },
    });
  }

  fetchOnlineTrend([start, end]) {
    this.props.dispatch({
      type: 'online/fetchTrend',
      payload: {
        start: start.unix(),
        end: end.unix(),
        deviceId: this.getId(),
      },
    });
    this.props.dispatch({
      type: 'online/fetchSignal',
      payload: {
        start: start.unix(),
        end: end.unix(),
        deviceId: this.getId(),
      },
    });
  }

  handleMenuClick = ({ key }) => {
    switch (key) {
      case 'delete':
        this.handleDelete();
        break;
      case 'kick':
        this.handleKick();
        break;
      case 'reboot':
        this.handleReboot();
        break;
      default:
    }
  };

  handleEdit = () => {
    this.props.dispatch({
      type: 'device/updateVisible',
      payload: true,
    });
  };

  handleEditSubmit = values => {
    this.props.dispatch({
      type: 'device/update',
      payload: {
        id: this.id,
        ...values,
      },
    });
  };

  handleEditCancel = () => {
    this.props.dispatch({
      type: 'device/updateVisible',
      payload: false,
    });
  };

  handleTrafficMonthChange = value => {
    this.setState({
      trafficMonth: value,
    });

    this.fetchTrafficTrend(value);
  };

  handleOnlineRangeChange = onlineRange => {
    this.setState({ onlineRange });

    this.fetchOnlineTrend(onlineRange);
  };

  handleDelete = () => {
    const { dispatch } = this.props;
    confirm({
      title: '确认删除设备？',
      okType: 'danger',
      maskClosable: true,
      onOk() {
        dispatch({ type: 'device/delete', payload: { id: this.id } });
      },
    });
  };

  handleKick = () => {
    const { dispatch } = this.props;
    confirm({
      title: '确认将该设备强制踢下线？',
      content: '设备将在离线之后，重新上线',
      okType: 'danger',
      maskClosable: true,
      onOk() {
        dispatch({ type: 'device/kick', payload: { id: this.id } });
      },
    });
  };

  handleShowUpgrade = () => {
    this.props.dispatch({
      type: 'device/upgradeVisible',
      payload: true,
    });
  };

  handleUpgradeSubmit = () => {};

  handleUpgradeCancel = () => {
    this.props.dispatch({
      type: 'device/upgradeVisible',
      payload: false,
    });
  };

  renderUpgradeModal() {
    return (
      <Modal
        visible={this.props.device.upgradeVisible}
        onOk={this.handleUpgradeSubmit}
        onCancel={this.handleUpgradeCancel}
        destroyOnClose
      >
        <Upgrade />
      </Modal>
    );
  }

  renderMenu() {
    return (
      <Menu className={styles.menu} onClick={this.handleMenuClick}>
        <Menu.Item key="kick">强制下线</Menu.Item>
        <Menu.Item key="reboot">重启</Menu.Item>
        <Menu.Item key="delete">删除</Menu.Item>
      </Menu>
    );
  }

  renderAction() {
    const { current } = this.props.device;
    const linkOpts = { style: { marginLeft: 8, color: 'currentColor' } };
    return (
      <div>
        {current.online === 1 && (
          <Button.Group>
            <Ngrok device={current}>
              <Button icon="desktop">Web管理</Button>
            </Ngrok>
            <Button icon="code">
              <Link to={`/device/${this.id}/console`} {...linkOpts}>
                远程控制
              </Link>
            </Button>
            <Button icon="file-text">
              <Link to={`/device/${this.id}/logs`} {...linkOpts}>
                查看日志
              </Link>
            </Button>
            <Dropdown overlay={this.renderMenu()} placement="bottomRight">
              <Button icon="ellipsis" />
            </Dropdown>
          </Button.Group>
        )}
        <Button type="primary" icon="edit" onClick={this.handleEdit}>
          编辑
        </Button>
      </div>
    );
  }

  renderDescription() {
    const { current } = this.props.device;
    const { info = {} } = current;

    return (
      <DescriptionList size="small" col={2} style={{ marginBottom: 4 }}>
        <Description term="序列号">{current.serialNumber}</Description>
        <Description term="机型">{current.model}</Description>
        <Description term="固件版本">
          <span>{info.swVersion}</span>
          <Button
            style={{ marginLeft: 10 }}
            size="small"
            icon="upload"
            shape="circle"
            onClick={this.handleShowUpgrade}
          />
          {this.renderUpgradeModal()}
        </Description>
        <Description term="创建时间">
          {moment.unix(current.createTime).format('YYYY-MM-DD HH:mm:ss')}
        </Description>
      </DescriptionList>
    );
  }

  renderTrafficExtra() {
    const { trafficMonth } = this.state;
    return (
      <MonthPicker
        value={trafficMonth}
        onChange={this.handleTrafficMonthChange}
        style={{ width: 100 }}
        allowClear={false}
        disabledDate={m => m.isAfter(moment())}
      />
    );
  }

  renderOnlineExtra() {
    const { onlineRange } = this.state;
    return (
      <RangePicker
        value={onlineRange}
        onChange={this.handleOnlineRangeChange}
        style={{ width: 265 }}
        allowClear={false}
        disabledDate={m => m.isAfter(moment())}
      />
    );
  }

  renderExtra() {
    const { current } = this.props.device;
    const { online, logtime = 0 } = current;

    return (
      <Row>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>状态</div>
          <div className={styles.heading}>{online ? '在线' : '离线'}</div>
        </Col>
        <Col xs={24} sm={12}>
          <div className={styles.textSecondary}>
            {online ? '在线' : '离线'}时长
          </div>
          <div className={styles.heading}>
            {logtime ? moment(logtime).toNow(true) : '从未上线'}
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const { device, traffic, loading, online } = this.props;
    const { current, updateVisible, updateError } = device;
    const { info = {} } = current;
    const { pubIp, protocol, syncState, logtime = 0 } = current;

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
        title: '详细',
      },
    ];

    const chartResponsiveProps = {
      xs: 24,
      sm: 12,
      style: { marginBottom: 24 },
    };

    return (
      <PageHeaderLayout breadcrumbList={breadcrumbList}>
        <EditDevice
          data={current}
          visible={updateVisible}
          error={updateError}
          onSubmit={this.handleEditSubmit}
          onCancel={this.handleEditCancel}
          confirmLoading={loading.effects['device/update']}
        />
        <Card
          className={styles.main}
          bordered={false}
          style={{ marginBottom: 24 }}
          title={current.name}
          extra={this.renderAction()}
        >
          <Row>
            <Col xl={8}>
              <DescriptionList col={1} size="large">
                <Description term={<span className={styles.term}>状态</span>}>
                  <span className={styles.detail}>
                    {current.online ? '在线' : '离线'}
                    <Badge
                      style={{ marginLeft: 10 }}
                      status={current.online ? 'success' : 'default'}
                    />
                  </span>
                </Description>
                <Description
                  term={
                    <span className={styles.term}>
                      {current.online ? '在线时长' : '离线时长'}
                    </span>
                  }
                >
                  <span className={styles.detail}>
                    {logtime ? moment(logtime).toNow(true) : '从未上线'}
                  </span>
                </Description>
              </DescriptionList>
            </Col>
            <Col xl={16}>{this.renderDescription()}</Col>
          </Row>
        </Card>
        <Card bordered={false} title="详细信息" style={{ marginBottom: 24 }}>
          <Spin spinning={loading.effects['device/fetch']}>
            <DescriptionList size="large">
              <Description term="手机号">{current.mobileNumber}</Description>
              <Description term="IP Address">{pubIp}</Description>
              <Description term="ICCID">{info.iccid}</Description>
              <Description term="地址">{current.address}</Description>
              <Description term="RSSI">
                <Signal value={info.rssi} />
              </Description>
              <Description term="IMSI">{info.imsi}</Description>
              <Description term="配置同步状态">{syncState}</Description>
              <Description term="登录协议">{protocol || '-'}</Description>
              <Description term="IMEI">{info.imei}</Description>
            </DescriptionList>
          </Spin>
        </Card>
        <Row gutter={24}>
          <Col {...chartResponsiveProps}>
            <Card
              bordered={false}
              title="流量统计"
              extra={this.renderTrafficExtra()}
            >
              <TrafficChart data={traffic.trend} height={200} padding="auto" />
            </Card>
          </Col>
          <Col {...chartResponsiveProps}>
            <Card
              bordered={false}
              title="在线统计"
              extra={this.renderOnlineExtra()}
            >
              <OnlineChart
                data={online.trend}
                signal={online.signal}
                height={200}
                padding="auto"
              />
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
