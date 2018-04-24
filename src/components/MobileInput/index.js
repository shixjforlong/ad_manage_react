import React from 'react';
import { Input, Select } from 'antd';

export default class MobileInput extends React.Component {
  static defaultProps = {
    defaultCountry: '+86',
  };

  constructor(props) {
    super(props);
    const { value = {}, defaultCountry } = this.props;
    this.state = {
      country: value.country || defaultCountry,
      phone: value.phone || '',
    };
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      this.setState(nextProps.value);
    }
  }

  handlePhoneChange = e => {
    const phone = e.target.value;
    if (!('value' in this.props)) {
      this.setState({ phone });
    }
    this.triggerChange({ phone });
  };

  handleCountryChange = country => {
    if (!('value' in this.props)) {
      this.setState({ country });
    }
    this.triggerChange({ country });
  };

  handleBlur = () => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(this.state);
    }
  };

  triggerChange = value => {
    // Should provide an event to pass value to Form.
    const { onChange } = this.props;
    if (onChange) {
      onChange({ ...this.state, ...value });
    }
  };

  render() {
    const { size, prefix, placeholder } = this.props;
    const { phone, country } = this.state;
    const otherProps = { size, prefix, placeholder };

    const addon = (
      <Select
        style={{ width: 70 }}
        value={country}
        onChange={this.handleCountryChange}
      >
        <Select.Option value="+86">+86</Select.Option>
        <Select.Option value="+87">+87</Select.Option>
      </Select>
    );
    return (
      <Input
        type="text"
        value={phone}
        onChange={this.handlePhoneChange}
        onBlur={this.handleBlur}
        addonBefore={addon}
        {...otherProps}
      />
    );
  }
}
