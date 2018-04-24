import classNames from 'classnames';
import React from 'react';
import { Tooltip } from 'antd';
import './index.less';

export default function Signal({ value }) {
  const content = (
    <div>
      <div>{value * 2 - 113} dBm</div>
      <div>{value} asu</div>
    </div>
  );

  return value ? (
    <Tooltip title={content}>
      <div className="signal">
        <span className={classNames('signal-1', { visible: value > 0 })} />
        <span className={classNames('signal-2', { visible: value > 3 })} />
        <span className={classNames('signal-3', { visible: value > 5 })} />
        <span className={classNames('signal-4', { visible: value > 6 })} />
        <span className={classNames('signal-5', { visible: value > 11 })} />
      </div>
    </Tooltip>
  ) : (
    <span />
  );
}
