import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import { Col, Row } from 'antd';

import styles from './top.less';
import TrafficChart from './TrafficChart';

export default class TrafficTop extends PureComponent {
  static propTypes = {
    top: PropTypes.any.isRequired,
    trend: PropTypes.any.isRequired,
    current: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  onClick = item => {
    const { onSelect } = this.props;
    onSelect(item);
  };

  render() {
    const { top, trend, current } = this.props;

    return (
      <Row>
        <Col xl={16} lg={15} md={12} sm={24} xs={24}>
          <div className={styles.salesBar}>
            <h4>{current.deviceName}</h4>
            <TrafficChart data={trend} />
          </div>
        </Col>
        <Col xl={8} lg={9} md={12} sm={24} xs={24}>
          <div className={styles.salesRank}>
            <h4 className={styles.rankingTitle}>设备流量排行</h4>
            <ul className={styles.rankingList}>
              {top.map((item, i) => (
                <li key={item.deviceId}>
                  <span className={i < 3 ? styles.active : undefined}>
                    {i + 1}
                  </span>
                  <a onClick={() => this.onClick(item)}>{item.deviceName}</a>
                  <span>{numeral(item.total).format('0.00ib')}</span>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    );
  }
}
