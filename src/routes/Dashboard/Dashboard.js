import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Icon, Row, Tooltip } from 'antd';
import numeral from 'numeral';
import moment from 'moment';
import {
  ChartCard,
  Field,
  MiniArea,
  MiniBar,
  Pie,
} from '../../components/Charts/index';
import less from './Dashboard.less';
import TopCard from './TopCard';


@connect(({ dashboard }) => ({ dashboard }))
export default class Dashboard extends PureComponent {
  componentDidMount() {

    this.props.dispatch({
      type: 'dashboard/fetchAmountStats',
      payload: {
        start: moment()
          .add(-3, 'd')
          .unix(),
        end: moment().unix(),
      },
    });

    this.props.dispatch({
      type: 'dashboard/fetchOnlineStats',
      payload: {
      },
    });

  }
  //销售额
  renderAmountCard() {
    const { dashboard } = this.props;
    const sales = dashboard.sales;
    console.log(dashboard.sales);
    console.log(sales);

    return (
      <ChartCard
        bordered={false}
        title="今日销售额"
        action={
          <Tooltip title="当前销售额">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(sales.amount).format('0,0')}
        contentHeight={46}
      >
      
      </ChartCard>
    );
  }
  //销量
  renderCountCard(){
    const { dashboard } = this.props;
    const sales = dashboard.sales;
    return (
      <ChartCard
        bordered={false}
        title="今日销量"
        action={
          <Tooltip title="当前销量">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(sales.count).format('0,0')}
        contentHeight={46}
      >
      
      </ChartCard>
    );
  }
  //在线数
  renderOnlineCard(){
    const { dashboard } = this.props;
    const  devices = dashboard.devices;
    return (
      <ChartCard
        bordered={false}
        title="在线数"
        action={
          <Tooltip title="在线数">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(devices.online).format('0,0')}
        contentHeight={46}
      >
      
      </ChartCard>
    );
  }
  //离线数<=24
  renderOfflineCard(){
    const { dashboard } = this.props;
    const  devices = dashboard.devices;
    return (
      <ChartCard
        bordered={false}
        title="离线数(≤24h)"
        action={
          <Tooltip title="离线数(≤24h)">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(devices.offline).format('0,0')}
        contentHeight={46}
      >
      
      </ChartCard>
    );
  }
  //离线数>24
  renderOffline24Card(){
    const { dashboard } = this.props;
    const  devices = dashboard.devices;
    return (
      <ChartCard
        bordered={false}
        title="离线数(>24h)"
        action={
          <Tooltip title="离线数(>24h)">
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total={numeral(devices.offline24).format('0,0')}
        contentHeight={46}
      >
      
      </ChartCard>
    );
  }

  render() {
    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 8,
      xl: 8,
      style: { marginBottom: 24 },
    };

    return (
      <div className={less.dashboard}>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>{this.renderAmountCard()}</Col>
          <Col {...topColResponsiveProps}>{this.renderCountCard()}</Col>
          <Col {...topColResponsiveProps}>{this.renderOnlineCard()}</Col>
          <Col {...topColResponsiveProps}>{this.renderOfflineCard()}</Col>
          <Col {...topColResponsiveProps}>{this.renderOffline24Card()}</Col>
        </Row>
       
      </div>
    );
  }
}
