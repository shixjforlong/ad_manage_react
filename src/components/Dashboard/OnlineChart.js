import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Axis, Chart, Geom, Guide, Tooltip, View } from 'bizcharts';
import moment from 'moment';
import omit from 'omit.js';

const { Text } = Guide;

function transformData(data) {
  return data
    .map(([start, value], index) => {
      if (index < data.length - 1) {
        const [end] = data[index + 1];
        return {
          start,
          end,
          online: value,
          width: end - start,
          value: 1,
          x: [start, end, end, start],
          y: [0, 0, 1, 1],
        };
      }
      return {};
    })
    .filter(x => x.value === 1);
}

export default class OnlineChart extends PureComponent {
  static propTypes = {
    data: PropTypes.any.isRequired,
    signal: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  };

  static defaultProps = {
    signal: [],
  };

  state = {
    guide: '',
  };

  getSourceData() {
    const { data } = this.props;
    if (data && data.length > 0) {
      return transformData(data.map(([date, value]) => [date * 1000, value]));
    } else {
      return null;
    }
  }

  handleItemSelected = ({ data }) => {
    // eslint-disable-next-line no-underscore-dangle
    const { start, end, online } = data._origin;
    const begin = moment(start).format('YYYY-MM-DD HH:mm:ss');
    const to = moment(end).format('YYYY-MM-DD HH:mm:ss');
    this.setState({
      guide: `${begin} - ${to} ${online ? '在线' : '离线'}`,
    });
  };

  handleItemUnSelected = () => {
    this.setState({
      guide: '',
    });
  };

  renderSignal() {
    const { signal } = this.props;
    const data = signal.map(([date, value]) => ({ date: date * 1000, value }));
    const cols = {
      date: {
        type: 'time',
        formatter: v => moment(v).format('YYYY-MM-DD HH:mm:ss'),
        ticks: [],
      },
      value: {
        alias: '信号',
        max: 20,
        min: 0,
      },
    };
    return (
      <View
        data={data}
        scale={cols}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 1 }}
      >
        <Geom type="line" shape="spline" position="date*value" opacity={0.6} />
      </View>
    );
  }

  render() {
    const { signal } = this.props;
    const chartProps = omit(this.props, ['data']);
    const source = this.getSourceData();
    if (this.chart) {
      this.chart.forceFit();
    }

    const cols = {
      x: {
        type: 'time',
        formatter: v => moment(v).format('YYYY-MM-DD HH:mm:ss'),
        ticks: [],
      },
      start: {
        type: 'timeCat',
        mask: 'YYYY-MM-DD',
      },
      end: {
        type: 'time',
        mask: 'YYYY-MM-DD HH:mm:ss',
      },
      value: {
        type: 'cat',
      },
      y: {
        max: 1.2,
        min: 0,
      },
    };

    return (
      <Chart
        height={195}
        forceFit
        animate={false}
        padding={[30, 'auto', 0, 'auto']}
        onGetG2Instance={chart => {
          this.chart = chart;
        }}
        onPolygonMouseenter={this.handleItemSelected}
        onPolygonMouseleave={this.handleItemUnSelected}
        {...chartProps}
      >
        <View data={source} scale={cols}>
          <Axis name="y" grid={null} visible={false} />
          <Geom
            type="polygon"
            position="x*y"
            color={['online', ['#8777D9', '#5243AA']]}
            tooltip={null}
          />
          <Guide>
            <Text
              top
              position={['20%', '10%']}
              content={this.state.guide} // 显示的文本内容
            />
          </Guide>
        </View>
        <Tooltip />
        {signal && this.renderSignal()}
      </Chart>
    );
  }
}
