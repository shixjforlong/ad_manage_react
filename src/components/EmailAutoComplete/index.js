import React from 'react';

import { AutoComplete } from 'antd';
import styles from './index.less';

const defaultDomains = [
  'yahoo.com',
  'hotmail.com',
  'gmail.com',
  'me.com',
  'aol.com',
  'mac.com',
  'live.com',
  'googlemail.com',
  'msn.com',
  'facebook.com',
  'verizon.net',
  'outlook.com',
  'icloud.com',
  'qq.com',
  '163.com',
  '263.com',
  'inhand.com.cn',
];

export default class EmailAutoComplete extends AutoComplete {
  static defaultProps = {};

  state = {
    suggestions: [],
    domains: this.props.domains || defaultDomains,
  };

  handleEmailChange = value => {
    let suggestions;
    if (!value || value.indexOf('@') < 1) {
      suggestions = [];
    } else {
      suggestions = this.getSuggestions(value);
    }
    this.setState({ suggestions });
    this.props.onChange(value);
  };

  getSuggestions = value => {
    const [prefix, suffix] = value.split('@');
    return this.state.domains
      .filter(domain => {
        return domain.includes(suffix);
      })
      .map(domain => `${prefix}@${domain}`);
  };

  render() {
    const { children, ...others } = this.props;
    const { suggestions } = this.state;

    const dataSource = suggestions.map(email => (
      <AutoComplete.Option key={email}>{email}</AutoComplete.Option>
    ));

    return (
      <AutoComplete
        {...others}
        className={styles.complete}
        dataSource={dataSource}
        onChange={this.handleEmailChange}
      >
        {children}
      </AutoComplete>
    );
  }
}
