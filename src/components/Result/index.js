import React from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
import styles from './index.less';

export default function Result({
  className,
  type,
  title,
  tip,
  email,
  description,
  extra,
  actions,
  ...restProps
}) {
  const iconMap = {
    error: <Icon className={styles.error} type="close-circle" />,
    success: <Icon className={styles.success} type="check-circle" />,
  };
  const clsString = classNames(styles.result, className);
  return (
    <div className={clsString} {...restProps}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className={styles.title}>{title}</div>
      {tip && <span className={styles.tip}>{tip}</span>}
      ({email && <span className={styles.tip}>{email}</span>})
      {description && <div className={styles.description}>{description}</div>}
      {extra && <div className={styles.extra}>{extra}</div>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
