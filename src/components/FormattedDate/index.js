import React, { PureComponent } from 'react';
import moment from 'moment';

export default class FormattedDate extends PureComponent {
  render() {
    const { date, timestamp, format = 'YYYY-MM-DD HH:mm:ss' } = this.props;
    const time = date ? moment(date) : moment.unix(timestamp);
    return <div>{time.format(format)}</div>;
  }
}
