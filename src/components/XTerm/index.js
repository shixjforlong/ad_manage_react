/* eslint-disable react/sort-comp */
import React from 'react';
import { Terminal } from 'xterm';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import 'xterm/lib/xterm.css';

const className = require('classnames');
// const debounce = require('lodash.debounce');
// import styles from 'xterm/xterm.css';

export default class XTerm extends React.Component {
  static propTypes = {
    onInput: PropTypes.func,
    onFocusChange: PropTypes.func,
    addons: PropTypes.arrayOf(PropTypes.string),
    onContextMenu: PropTypes.func,
    options: PropTypes.object,
    value: PropTypes.string,
    className: PropTypes.string,
    onXterm: PropTypes.func,
    autoFocus: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      isFocused: false,
    };
  }

  static defaultProps = {
    onInput: noop,
    onFocusChange: noop,
    addons: [],
    onContextMenu: noop,
    options: {
      cursorBlink: true,
      fontFamily: '"Andale Mono", courier-new, courier, monospace',
      fontSize: 14,
      applicationCursor: false,
    },
    value: undefined,
    className: undefined,
    onXterm: noop,
    autoFocus: true,
  };

  state = {
    isFocused: false,
  };

  componentDidMount() {
    if (this.props.addons) {
      // this.props.addons.forEach((s) => {
      //   const addon = import(`xterm/dist/addons/${s}/${s}`);
      //   Terminal.applyAddon(addon);
      // });
    }
    this.xterm = new Terminal(this.props.options);
    this.xterm.open(this.container);
    this.xterm.on('focus', this.focusChanged.bind(this, true));
    this.xterm.on('blur', this.focusChanged.bind(this, false));

    if (this.props.autoFocus) {
      this.xterm.focus();
    }
    if (this.props.onContextMenu) {
      this.xterm.element.addEventListener(
        'contextmenu',
        this.onContextMenu.bind(this)
      );
    }
    if (this.props.onInput) {
      this.xterm.on('data', this.onInput);
    }
    if (this.props.value) {
      this.xterm.write(this.props.value);
    }

    this.props.onXterm(this.xterm);
  }

  componentWillUnmount() {
    // is there a lighter-weight way to remove the cm instance?
    if (this.xterm) {
      this.xterm.destroy();
      this.xterm = null;
    }
  }

  getTerminal() {
    return this.xterm;
  }

  write(data) {
    this.xterm.write(data);
  }

  writeln(data) {
    this.xterm.writeln(data);
  }

  focus() {
    if (this.xterm) {
      this.xterm.focus();
    }
  }

  focusChanged(focused) {
    this.setState({
      isFocused: focused,
    });
    if (this.props.onFocusChange) {
      this.props.onFocusChange(focused);
    }
  }

  resize(cols, rows) {
    this.xterm.resize(Math.round(cols), Math.round(rows));
  }

  onContextMenu(e) {
    if (this.props.onContextMenu) {
      this.props.onContextMenu(e);
    }
  }

  onInput = data => {
    if (this.props.onInput) {
      this.props.onInput(data);
    }
  };

  setOption(key, value) {
    this.xterm.setOption(key, value);
  }

  refresh() {
    this.xterm.refresh(0, this.xterm.rows - 1);
  }

  render() {
    const terminalClassName = className(
      'ReactXTerm',
      this.state.isFocused ? 'ReactXTerm--focused' : null,
      this.props.className
    );
    return (
      <div
        ref={node => {
          this.container = node;
        }}
        className={terminalClassName}
      />
    );
  }
}
