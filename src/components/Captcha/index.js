import React from 'react';

export default class Captcha extends React.Component {
  static defaultProps = {};

  componentDidMount() {
    this.onGetCaptcha();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onGetCaptcha = () => {
    if (this.props.onUpdate) {
      this.props.onUpdate(this.context.form);
    }
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.onGetCaptcha, 60000);
  };

  render() {
    const { height, width, pid } = this.props;
    return (
      <img
        alt="captcha"
        height={height}
        width={width}
        src={`/api/captchas/image?pid=${pid}&width=234&height=80`}
        onClick={this.onGetCaptcha}
      />
    );
  }
}
