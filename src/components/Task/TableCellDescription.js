import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class TableCellDescription extends PureComponent {
  static defaultProps = {
    title: '',
    children: '',
  };
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.any, PropTypes.element]),
  };
  render() {
    const { title, children } = this.props;
    return (
      <div>
        {title && <div>{title}</div>}
        {children && <div>{children}</div>}
      </div>
    );
  }
}
