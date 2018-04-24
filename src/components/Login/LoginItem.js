import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Row } from 'antd';
import omit from 'omit.js';
import styles from './index.less';
import map from './map';
import { validateMobile } from '../../services/captcha';

function generator({ defaultProps, defaultRules = [], type }) {
  return WrappedComponent => {
    return class BasicComponent extends Component {
      static contextTypes = {
        form: PropTypes.object,
        updateActive: PropTypes.func,
      };

      constructor(props) {
        super(props);
        this.state = {
          count: 0,
        };
      }

      componentDidMount() {
        if (this.context.updateActive) {
          this.context.updateActive(this.props.name);
        }
      }

      componentWillUnmount() {
        clearInterval(this.interval);
      }

      onGetCaptcha = () => {
        if (this.props.onGetCaptcha) {
          this.props.onGetCaptcha(this.context.form, this.onCountDown);
        } else {
          this.onCountDown();
        }
      };

      onCountDown = () => {
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
      };

      onValidateMobile = (rule, { country, phone }, callback) => {
        if (!phone || !/^1\d{10}$/.test(phone)) {
          return callback('missing phone');
        }
        validateMobile({ phone: `${country}${phone}` })
          .then(result => {
            if (result.error) {
              callback(result.error);
            } else {
              callback();
            }
          })
          .catch(e => callback(e));
      };

      render() {
        const { getFieldDecorator } = this.context.form;
        const options = { validateFirst: true };
        let otherProps = {};
        const {
          onChange,
          defaultValue,
          rules,
          name,
          validateTrigger,
          ...restProps
        } = this.props;
        const { count } = this.state;
        options.rules = rules || defaultRules;
        if (onChange) {
          options.onChange = onChange;
        }
        if (defaultValue) {
          options.initialValue = defaultValue;
        }
        if (validateTrigger) {
          options.validateTrigger = validateTrigger;
        }
        otherProps = restProps || otherProps;
        if (type === 'Captcha') {
          const inputProps = omit(otherProps, ['onGetCaptcha', 'loading']);
          return (
            <Form.Item>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator(name, options)(
                    <WrappedComponent {...defaultProps} {...inputProps} />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    className={styles.getCaptcha}
                    size={this.props.size}
                    onClick={this.onGetCaptcha}
                    loading={this.props.loading || false}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          );
        } else if (type === 'Mobile') {
          options.rules = [
            ...options.rules,
            {
              validator: this.onValidateMobile,
              message: '请输入正确的手机号',
            },
          ];
        }

        return (
          <Form.Item>
            {getFieldDecorator(name, options)(
              <WrappedComponent {...defaultProps} {...otherProps} />
            )}
          </Form.Item>
        );
      }
    };
  };
}

const LoginItem = {};
Object.keys(map).forEach(item => {
  LoginItem[item] = generator({
    defaultProps: map[item].props,
    defaultRules: map[item].rules,
    type: item,
  })(map[item].component);
});

export default LoginItem;
