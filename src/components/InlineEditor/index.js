import React, { PureComponent } from 'react';
import { Button, Input } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import omit from 'omit.js';

import './index.less';

export default class InlineEditor extends PureComponent {
  static propTypes = {
    cancelOnBlur: PropTypes.bool,
    value: PropTypes.any,
    confimOnPressEnter: PropTypes.bool,
    onConfirm: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static defaultProps = {
    cancelOnBlur: false,
    confimOnPressEnter: false,
    value: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: this.props.editable,
    };
  }

  handleFocus = event => {
    event.target.select();
    this.setState({ isEditing: true });
    const { onFocus } = this.props;
    if (onFocus) {
      onFocus(event);
    }
  };

  handleBlur = event => {
    const { onBlur } = this.props;
    if (onBlur) {
      onBlur(event);
    }

    if (this.props.cancelOnBlur) {
      this.handleCancel();
    }
  };

  handleCancel = () => {
    this.setState({ isEditing: false });
    const { onCancel } = this.props;
    onCancel();
  };

  handleConfirm = () => {
    this.setState({ isEditing: false });
    const { onConfirm } = this.props;
    onConfirm();
  };

  handlePressEnter = e => {
    e.target.blur();
    this.handleConfirm();
  };

  render() {
    const {
      value,
      confimOnPressEnter,
      style,
      className,
      ...restProps
    } = this.props;
    const { isEditing } = this.state;
    const otherProps = omit(restProps, [
      'onCancel',
      'onConfirm',
      'onFocus',
      'onBlur',
      'cancelOnBlur',
    ]);

    const opts = {
      onFocus: this.handleFocus,
      onBlur: this.handleBlur,
      value,
      ...otherProps,
    };
    if (confimOnPressEnter) {
      opts.onPressEnter = this.handlePressEnter;
    }

    return (
      <div
        className={classNames('inline-edit', className, {
          'inline-edit-read': !isEditing,
          'inline-edit-active': isEditing,
        })}
        style={style}
      >
        <Input {...opts} />
        {isEditing && (
          <div className="inline-edit-button-group">
            <Button icon="check" onClick={this.handleConfirm} />
            <Button icon="close" onClick={this.handleCancel} />
          </div>
        )}
      </div>
    );
  }
}
