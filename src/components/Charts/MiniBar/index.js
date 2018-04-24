import React from 'react';
import { Chart, Geom, Tooltip } from 'bizcharts';
import equal from 'fast-deep-equal';
import autoHeight from '../autoHeight';
import styles from '../index.less';

@autoHeight()
export default class MiniBar extends React.Component {
  shouldComponentUpdate(props) {
    if (this.chart) this.chart.forceFit();
    return !equal(this.props, props);
  }

  render() {
    const {
      height,
      forceFit = true,
      color = '#1890FF',
      data = [],
    } = this.props;

    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };

    const padding = [36, 5, 30, 5];

    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    // for tooltip not to be hide
    const chartHeight = height + 54;

    if (this.chart) {
      this.chart.forceFit();
    }

    return (
      <div className={styles.miniChart} style={{ height }}>
        <div className={styles.chartContent}>
          <Chart
            scale={scale}
            height={chartHeight}
            forceFit={forceFit}
            data={data}
            padding={padding}
            onGetG2Instance={chart => {
              this.chart = chart;
            }}
          >
            <Tooltip showTitle={false} crosshairs={false} />
            <Geom
              type="interval"
              position="x*y"
              color={color}
              shape="borderRadius"
              tooltip={tooltip}
              style={{
                fill: 'l(90) 0:#4b8ee1 1:#4ad4e7',
                shadowBlur: 10,
              }}
            />
          </Chart>
        </div>
      </div>
    );
  }
}
