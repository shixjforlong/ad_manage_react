import React from 'react';
import { Icon, Input } from 'antd';
import styles from './index.less';
import EmailAutoComplete from '../EmailAutoComplete';
import MobileInput from '../MobileInput';

const userPattern = /^((admin)|(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/;

const map = {
  UserName: {
    component: EmailAutoComplete,
    props: {
      size: 'large',
      children: (
        <Input
          prefix={<Icon type="user" className={styles.prefixIcon} />}
          placeholder="邮箱"
        />
      ),
    },
    rules: [
      {
        required: true,
        message: '请输入邮箱! ',
      },
      {
        pattern: userPattern,
        message: '请输入正确的邮箱',
      },
    ],
  },
  Password: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="lock" className={styles.prefixIcon} />,
      type: 'password',
      placeholder: '密码',
    },
    rules: [
      {
        required: true,
        message: '请输入密码！',
      },
    ],
  },
  Mobile: {
    component: MobileInput,
    props: {
      size: 'large',
      prefix: <Icon type="mobile" className={styles.prefixIcon} />,
      placeholder: '手机号',
    },
    rules: [
      {
        required: true,
        message: '请输入手机号！',
      },
    ],
  },
  Captcha: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="mail" className={styles.prefixIcon} />,
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码！',
        len: 6,
      },
    ],
  },
  CaptchaInput: {
    component: Input,
    props: {
      size: 'large',
      prefix: <Icon type="safety" className={styles.prefixIcon} />,
      placeholder: '验证码',
    },
    rules: [
      {
        required: true,
        message: '请输入验证码！',
        len: 5,
      },
    ],
  },
};

export default map;
