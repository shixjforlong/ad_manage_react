import React from 'react';
import PropTypes from 'prop-types';
import { Axis, Chart, Geom, Label, Tooltip } from 'bizcharts';
import moment from 'moment';
import { DataSet } from '@antv/data-set';
import numeral from 'numeral';
import minBy from 'lodash/minBy';
import maxBy from 'lodash/maxBy';
import equal from 'fast-deep-equal';

import './TrafficChart.less';

export default class TrafficChart extends React.Component {
  static propTypes = {
    data: PropTypes.any.isRequired,
  };

  constructor(props) {
    super(props);
    this.ds = new DataSet();
  }

  shouldComponentUpdate(props) {
    if (this.chart) this.chart.forceFit();
    return !equal(this.props, props);
  }

  render() {
    const { data = [], ...chartProps } = this.props;
    if (this.chart) {
      this.chart.forceFit();
    }

    const dv =
      data.length > 0
        ? this.ds
            .createView()
            .source(data)
            .transform({
              type: 'fold',
              fields: ['send', 'receive'],
              key: 'use',
              value: 'value',
            })
        : null;

    const cols = {
      date: {
        type: 'timeCat',
        formatter: v => moment(v, 'YYYYMMDD').format('MM-DD'),
      },
      value: {
        formatter: v => numeral(v).format('0.0ib'),
      },
      total: {
        formatter: v => numeral(v).format('0.0ib'),
      },
    };

    if (this.chart) {
      this.chart.forceFit();
    }

    const { date: maxDate } = maxBy(data, 'total') || {};
    const { date: minDate } =
      minBy(data.filter(({ total }) => total > 0), 'total') || {};

    const style = {
      fill: t =>
        t === 'send'
          ? 'l(90) 0:#4ad4e7 1:#3b86db'
          : 'l(90) 0:#fcad5a 1:#f16f91',
      stroke: t =>
        t === 'send'
          ? 'l(90) 0:#38b4ca 1:#316ccb'
          : 'l(90) 0:#fcad5a 0.2:#e98f49 1:#e65979',
      shadowColor: t =>
        t === 'send' ? 'rgba(63, 134, 205, 0.31)' : 'rgba(241, 111, 144, 0.31)',
      lineWidth: 1,
      shadowBlur: 28,
      shadowOffsetY: 17,
    };

    return (
      <Chart
        height={295}
        data={dv}
        scale={cols}
        forceFit
        placeholder
        animate={false}
        onGetG2Instance={chart => {
          this.chart = chart;
        }}
        {...chartProps}
      >
        <Axis name="date" />
        <Tooltip />
        <Geom
          type="intervalStack"
          shape={['use', v => (v === 'send' ? 'top' : 'bottom')]}
          color={['use', t => (t === 'send' ? '#3b86db' : '#f16f91')]}
          position="date*value"
          style={['use', style]}
          tooltip={[
            'use*value*total*date',
            (type, value, t, d) => {
              const date = moment(d, 'YYYYMMDD').format('MM-DD');
              const total = numeral(t).format('0.0ib');
              return {
                name: type === 'send' ? '上行' : '下行',
                title: `${date}: ${total}`,
                value: numeral(value).format('0.0ib'),
              };
            },
          ]}
        >
          <Label
            content={[
              'date*total*use',
              (d, total, type) => {
                if (type === 'send') {
                  if (minDate === d || maxDate === d) {
                    return numeral(total).format('0.0ib');
                  }
                }
              },
            ]}
            htmlTemplate={text => {
              if (text) {
                return `<span class="traffic-chart-label">
                          <span class="traffic-chart-label-text">${text}</span>
                        </span>`;
              }
            }}
          />
        </Geom>
      </Chart>
    );
  }
}
