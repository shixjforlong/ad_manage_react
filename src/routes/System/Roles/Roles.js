// import intl from 'react-intl-universal';
import React, { Component } from 'react';

export default class Roles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: '角色管理',
    };
  }
  render() {
    return (
      <div style={{ textAlign: 'center' }} >
        <h1>{this.state.names}</h1>
      </div>
    );
  }
}

