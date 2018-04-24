import React from 'react';
import { Avatar, List, Row, Col } from 'antd';
import classNames from 'classnames';
import intl from 'react-intl-universal';

import styles from './NoticeList.less';

export default function NoticeList({
  data = [],
  onClick,
  onFooterClick,
  locale,
  emptyText,
  emptyImage,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          return (
            <List.Item
              className={itemCls}
              key={item.key || i}
              onClick={() => onClick(item)}
            >
              <List.Item.Meta
                className={styles.meta}
                avatar={
                  item.avatar ? (
                    <Avatar className={styles.avatar} src={item.avatar} />
                  ) : null
                }
                title={
                  <div className={styles.title}>
                    {item.desContent}
                    <div className={styles.extra}>{item.extra}</div>
                  </div>
                }
                description={
                  <div>
                    {/* <div className={styles.description} title={item.subtitle}> */}
                    {/* {item.subtitle} */}
                    {/* </div> */}
                    {/* <div className={styles.datetime}>{item.datetime}</div> */}

                    <Row type="flex" gutter={0} align="bottom">
                      <Col span={14}>
                        <div
                          className={styles.subtitle}
                          style={{ textAlign: 'left' }}
                          title={item.subtitle}
                        >
                          {item.subtitle}
                        </div>
                      </Col>
                      <Col span={10}>
                        <div
                          className={styles.datetime}
                          style={{ textAlign: 'right' }}
                        >
                          {item.datetime}
                        </div>
                      </Col>
                    </Row>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      <div className={styles.clear} onClick={onFooterClick}>
        {intl.get('common.view')}
      </div>
    </div>
  );
}
