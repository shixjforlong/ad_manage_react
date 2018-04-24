import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import moment from 'moment';

import styles from './top.less';
import OnlineChart from './OnlineChart';

export default class OnlineTop extends PureComponent {
  static propTypes = {
    top: PropTypes.any.isRequired,
    trend: PropTypes.any.isRequired,
    current: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  onClick = item => {
    const { onSelect } = this.props;
    const { date } = item;
    onSelect({
      ...item,
      start: moment(date, 'YYYY-MM-DD')
        .startOf('month')
        .unix(),
      end: moment(date, 'YYYY-MM-DD')
        .endOf('month')
        .unix(),
    });
  };

  render() {
    const { top, current, trend } = this.props;
    return (
      <Row>
        <Col xl={16} lg={15} md={12} sm={24} xs={24}>
          <div className={styles.salesBar}>
            <h4>{current.deviceName}</h4>
            <OnlineChart data={trend} />
          </div>
        </Col>
        <Col xl={8} lg={9} md={12} sm={24} xs={24}>
          <div className={styles.salesRank}>
            <h4 className={styles.rankingTitle}>设备登录次数排行</h4>
            <ul className={styles.rankingList}>
              {top.map((item, i) => (
                <li key={item.deviceId}>
                  <span className={i < 3 ? styles.active : undefined}>
                    {i + 1}
                  </span>
                  <a onClick={() => this.onClick(item)}>{item.deviceName}</a>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    );
  }
}
