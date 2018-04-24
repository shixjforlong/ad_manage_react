import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Divider, Dropdown, Icon, Menu, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import Debounce from 'lodash-decorators/debounce';
import { Link, routerRedux } from 'dva/router';
import intl from 'react-intl-universal';
import classNames from 'classnames';
import NoticeIcon from '../NoticeIcon';
import styles from './index.less';
import noAlarmImage from '../../assets/images/alarmnull.svg';
import alarmSeriousImage from '../../assets/images/icon-alarm-serious.svg';
import alarmImportantImage from '../../assets/images/important-warning.svg';
import alarmMinorImage from '../../assets/images/minor-warning.svg';
import alarmCautionImage from '../../assets/images/caution.svg';
import alarmRemindImage from '../../assets/images/remind.svg';

@connect(state => ({
  alarmsUnconfirmed: state.overview.alarmsUnconfirmed,
  alarmsUnconfirmedTotal: state.overview.alarmsUnconfirmedTotal,
}))
export default class GlobalHeader extends PureComponent {
  static contextTypes = {
    location: PropTypes.object,
  };

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  getAlarmsData = (alarms = []) => {
    if (alarms.length === 0) {
      return [];
    }
    const newNotices = alarms.map(notice => {
      let newNotice = { ...notice };
      const { level } = notice;
      let img = '';
      if (level === 5) {
        img = alarmSeriousImage;
      } else if (level === 4) {
        img = alarmImportantImage;
      } else if (level === 3) {
        img = alarmMinorImage;
      } else if (level === 2) {
        img = alarmCautionImage;
      } else if (level === 1) {
        img = alarmRemindImage;
      }
      newNotice = {
        ...notice,
        /* eslint no-underscore-dangle: 0 */
        key: notice._id, // transform id to item key
        desContent: notice.desc, // 信息描述的内容
        subtitle: notice.siteName, // 副标题
        datetime: moment(notice.timestamp * 1000).format('YYYY.MM.DD HH:mm'),
        avatar: img,
      };
      // newNotice.avatar = 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png';
      // if (newNotice.extra && newNotice.status) {
      //   const color = ({
      //     todo: '',
      //     processing: 'blue',
      //     urgent: 'red',
      //     doing: 'gold',
      //   })[newNotice.status];
      //   newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      // }
      return newNotice;
    });
    return newNotices;
  };
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  handleFooterClick = tabSymbol => {
    this.noticeIconNode.onIconFontClick(); // 模拟触发关闭弹出框
    if (tabSymbol === 'alarms') {
      // 通知的footer操作
      this.props.dispatch(
        routerRedux.push({
          pathname: '/notices/events',
          query: { confirm_states: 1 },
        })
      );
    }
  };
  handleItemClick = (item, tabSymbol) => {
    this.noticeIconNode.onIconFontClick(); // 模拟触发关闭弹出框
    if (tabSymbol === 'alarms') {
      // 跳转到告警下该条信息
      this.props.dispatch(
        routerRedux.push({
          pathname: '/notices/events',
          query: { alarmId: item._id },
        })
      );
    }
  };
  @Debounce(600)
  // eslint-disable-next-line class-methods-use-this
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  render() {
    const {
      currentUser,
      collapsed,
      fetchingNotices,
      isMobile,
      logo,
      alarmsUnconfirmedTotal,
      onMenuClick,
      alarmsUnconfirmed = [],
    } = this.props;
    const { location: { pathname } } = this.context;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item>
          <Link to="/profile">
            <Icon type="user" />个人中心
          </Link>
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    const alarmsUnconfirmedList = this.getAlarmsData(alarmsUnconfirmed);
    return (
      <div
        className={classNames(styles.header, {
          [styles.bigHeader]: pathname === '/home',
        })}
      >
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,

          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <NoticeIcon
            ref={el => {
              this.noticeIconNode = el;
            }}
            className={styles.action}
            count={alarmsUnconfirmedTotal}
            onItemClick={this.handleItemClick}
            onFooterClick={this.handleFooterClick}
            // popupVisible={false}
            loading={fetchingNotices}
            popupAlign={{ offset: [20, -16] }}
          >
            <NoticeIcon.Tab
              list={alarmsUnconfirmedList}
              title={intl.get('notice.alarms')}
              tabSymbol="alarms"
              countTabChildren={alarmsUnconfirmedTotal}
              emptyText={intl.get('common.has_no_affirmed_alarm')}
              emptyImage={noAlarmImage}
            />
            {/* <NoticeIcon.Tab */}
            {/* list={noticeData['消息']} */}
            {/* title="消息" */}
            {/* emptyText="您已读完所有消息" */}
            {/* emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" */}
            {/* /> */}
            {/* <NoticeIcon.Tab */}
            {/* list={noticeData['待办']} */}
            {/* title="待办" */}
            {/* emptyText="你已完成所有待办" */}
            {/* emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg" */}
            {/* /> */}
          </NoticeIcon>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} icon="user" />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
