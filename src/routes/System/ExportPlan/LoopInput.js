import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Input, Select } from 'antd';

export default class LoopInput extends Component {
  constructor(props) {
    super(props);
    const value = this.props.value || {};
    this.state = {
      number: value.number || 0,
      unit: value.unit || '3',
    };
  }
  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState(value);
    }
  }
  handleNumberChange = e => {
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ number });
    }
    this.triggerChange({ number });
  };
  handleUnitChange = unit => {
    if (!('value' in this.props)) {
      this.setState({ unit });
    }
    this.triggerChange({ unit });
  };
  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const { number, unit } = this.state;
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={number}
          onChange={this.handleNumberChange}
          style={{ width: '100px', marginRight: '8px' }}
        />
        <Select
          value={unit}
          size={size}
          style={{ width: '90px' }}
          onChange={this.handleUnitChange}
        >
          <Select.Option value="3">{intl.get('system.day')}</Select.Option>
          <Select.Option value="2">{intl.get('system.hour')}</Select.Option>
          <Select.Option value="1">{intl.get('system.minute')}</Select.Option>
        </Select>
        <span>{`(${intl.get('system.exportplan_time_limit')})`}</span>
      </span>
    );
  }
}
