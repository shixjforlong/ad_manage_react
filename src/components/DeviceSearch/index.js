import React, { Component } from 'react';
import { Icon, Input, AutoComplete } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import PropTypes from 'prop-types';
import { fetchDevices } from '../../services/device';

const { Option } = AutoComplete;

export default class DeviceSearch extends Component {
  static defaultProps = {
    returnName: false,
    onChange: () => {},
    style: {},
    className: {},
    size: 'default',
  };
  static propTypes = {
    onChange: PropTypes.func,
    returnName: PropTypes.bool,
    style: PropTypes.object,
    className: PropTypes.object,
    size: PropTypes.string,
  };
  state = {
    data: [],
  };

  @Debounce(300)
  getDevices(value) {
    if (value.length > 0) {
      fetchDevices({ verbose: 1, name: value })
        .then(({ result }) => {
          if (result) {
            this.setState({ data: result });
          } else {
            this.setState({ data: [] });
          }
        })
        .catch(() => this.setState({ data: [] }));
    } else {
      this.setState({ data: [] });
    }
  }
  handleChange = value => {
    this.getDevices(value);
    if (!value) {
      const { onChange } = this.props;
      onChange(value);
    }
  };
  handleSelect = value => {
    const { onChange } = this.props;
    onChange(value);
  };
  render() {
    const { returnName, style, className, size } = this.props;
    const { data } = this.state;
    const children = data.map(device => {
      const { _id: id, name } = device;
      return <Option key={returnName ? name : id}>{name}</Option>;
    });
    return (
      <AutoComplete
        size={size}
        style={{ ...style, width: 250 }}
        className={className}
        placeholder="请输入设备名称"
        dataSource={children}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
      >
        <Input suffix={<Icon type="search" />} />
      </AutoComplete>
    );
  }
}
