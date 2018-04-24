import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';

import styles from './index.less';

export default class DeviceTouchStep extends PureComponent {
  render() {
    const { items } = this.props;
    const imageAlt = intl.get('common.picture');
    return (
      <div className={styles.info_container}>
        {items.map((item, i) => {
          if (item.type === 'item') {
            return (
              <div
                className={styles.flex_item_step}
                style={{ width: '160px' }}
                key={item.key || i}
              >
                <div className={styles.my_container}>
                  <div className={styles.flex_item_step}>
                    <img src={item.itemImage} height="90px" alt={imageAlt} />
                  </div>
                  <div
                    className={styles.flex_item_step}
                    style={{ fontSize: '17px', color: '#666' }}
                  >
                    {intl.get(item.text)}
                  </div>
                  {item.button ? (
                    <div className={styles.flex_item_step}>{item.button}</div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            );
          } else if (item.type === 'arrow') {
            return (
              <div
                className={styles.flex_item_step}
                style={{ width: '60px' }}
                key={item.key || i}
              >
                <img
                  src={item.itemImage}
                  style={{ position: 'relative', top: '35px' }}
                  alt={imageAlt}
                />
              </div>
            );
          } else {
            return <p>item.type error</p>;
          }
        })}
      </div>
    );
  }
}
