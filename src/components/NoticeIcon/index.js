import React, { PureComponent } from 'react';
import { Popover, Icon, Tabs, Badge, Spin } from 'antd';
import classNames from 'classnames';
import List from './NoticeList';
import styles from './index.less';
import alarmImage from '../../assets/images/alarmnull.svg';

const { TabPane } = Tabs;

export default class NoticeIcon extends PureComponent {
  static defaultProps = {
    onItemClick: () => {},
    // popupVisible: false,
    onPopupVisibleChange: (visible) => {},
    onTabChange: () => {},
    onFooterClick: () => {},
    loading: false,
    locale: {
      emptyText: 'common.no_data',
      clear: 'common.clear',
    },
    emptyImage: alarmImage,
  };
  static Tab = TabPane;
  constructor(props) {
    super(props);
    this.state = {};
    if (props.children && props.children[0]) {
      this.state.tabType = props.children[0].props.title;
    }
  }
  onItemClick = (item, tabProps) => {
    const { onItemClick } = this.props;
    onItemClick(item, tabProps.tabSymbol);
  };
  onTabChange = (tabType) => {
    this.setState({ tabType });
    this.props.onTabChange(tabType);
  };
  onIconFontClick = () => {
    this.iconNode.click();
  };
  getNotificationBox() {
    const { children, loading, locale } = this.props;
    if (!children) {
      return null;
    }
    const panes = React.Children.map(children, (child) => {
      const title = child.props.countTabChildren && child.props.countTabChildren > 0
        ? `${child.props.title} (${child.props.countTabChildren})` : child.props.title;
      return (
        <TabPane tab={title} key={child.props.title}>
          <List
            {...child.props}
            data={child.props.list}
            onClick={item => this.onItemClick(item, child.props)}
            onFooterClick={() => this.props.onFooterClick(child.props.tabSymbol)}
            locale={locale}
          />
        </TabPane>
      );
    });
    return (
      <Spin spinning={loading} delay={0}>
        <Tabs className={styles.tabs} onChange={this.onTabChange}>
          {panes}
        </Tabs>
      </Spin>
    );
  }
  render() {
    const { className, count, popupAlign } = this.props;
    const noticeButtonClass = classNames(className, styles.noticeButton);
    const notificationBox = this.getNotificationBox();
    const trigger = (
      <span className={noticeButtonClass} ref={(el) => { this.iconNode = el; }}>
        <Badge count={count} className={styles.badge}>
          <Icon type="bell" className={styles.icon} />
        </Badge>
      </span>
    );
    if (!notificationBox) {
      return trigger;
    }
    const popoverProps = {};
    if ('popupVisible' in this.props) {
      popoverProps.visible = this.props.popupVisible;
    }
    return (
      <Popover
        placement="bottomRight"
        content={notificationBox}
        popupClassName={styles.popover}
        trigger="click"
        arrowPointAtCenter
        popupAlign={popupAlign}
        onVisibleChange={this.props.onPopupVisibleChange}
        {...popoverProps}
      >
        {trigger}
      </Popover>
    );
  }
}
