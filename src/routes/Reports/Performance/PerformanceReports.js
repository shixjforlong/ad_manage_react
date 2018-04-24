// import intl from 'react-intl-universal';
import React, { Component } from 'react';

export default class PerformanceReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      names: '绩效报表',
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

