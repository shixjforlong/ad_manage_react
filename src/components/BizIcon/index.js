import React from 'react';
import classNames from 'classnames';
import './index.less';

import './ds';
import './iconfont';

const BizIcon = props => {
  const { type, style, layer, transform, className } = props;

  const cls = classNames(className, 'icon', `icon-${type}`, {
    'svg-inline--bi': !!layer,
  });
  // 当多个图标组合为一个图标时，对相应的图标做缩放处理
  if (transform) {
    let size = 16;
    if (style) {
      const { fontSize } = style;
      size = fontSize;
    }
    const shrink = size - transform;
    const transVal = 512 - 512 * (shrink / size);
    const trans = `translate(${transVal} ${transVal})`;
    const innerScale = `scale(${shrink / size},${shrink / size})`;
    const svgTrans = (
      <g transform={trans}>
        <g transform={`translate(0, 0)  ${innerScale}  rotate(0 0 0)`}>
          <use xlinkHref={`#icon-${type}`} />
        </g>
      </g>
    );
    return (
      <svg
        className={cls}
        aria-hidden="true"
        style={style}
        viewBox="0 0 1024 1024"
      >
        {svgTrans}
      </svg>
    );
  } else {
    return (
      <svg className={cls} aria-hidden="true" style={style}>
        <use xlinkHref={`#icon-${type}`} />
      </svg>
    );
  }
};
export default BizIcon;
