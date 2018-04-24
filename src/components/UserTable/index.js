import React, { PureComponent } from 'react';
import { Table, Tooltip, Button, Divider, Popconfirm } from 'antd';
import FormattedDate from '../../components/FormattedDate';
import styles from './index.less';
import { roleName } from '../../utils/utils';

export default class UserTable extends PureComponent {
  handleTableChange = (filters, sorter) => {
    this.props.onChange(filters, sorter);
  };

  removeUser = id => {
    this.props.onRemove(id);
  };

  lockUser = id => {
    this.props.lock(id);
  };

  unlockUser = id => {
    this.props.unlock(id);
  };

  handleResetCancel = (flag, id) => {
    this.props.resetPassword(flag, id);
  };

  renderLock(id) {
    return (
      <Tooltip title="锁定">
        <Popconfirm
          title="是否确认锁定该用户?"
          onConfirm={() => this.lockUser(id)}
        >
          <Button shape="circle" icon="lock" size="small" />
        </Popconfirm>
      </Tooltip>
    );
  }

  renderUnLock(id) {
    return (
      <Tooltip title="解锁">
        <Popconfirm title="是否确认解锁?" onConfirm={() => this.unlockUser(id)}>
          <Button shape="circle" icon="unlock" size="small" />
        </Popconfirm>
      </Tooltip>
    );
  }

  renderHandleLock(status, id) {
    return status === 2 ? this.renderUnLock(id) : this.renderLock(id);
  }

  render() {
    const { list, loading } = this.props;
    const columns = [
      {
        title: '用户名',
        dataIndex: 'name',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '状态',
        dataIndex: 'state',
        render(value) {
          switch (value) {
            case -1:
              return '已登出';
            case 0:
              return '已登录';
            default:
              return '锁定';
          }
        },
      },
      {
        title: '角色',
        dataIndex: 'roleName',
        render(value) {
          return roleName(value);
        },
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render(value) {
          return <FormattedDate timestamp={value} />;
        },
      },
      {
        title: '登录次数',
        dataIndex: 'totalLogin',
      },
      {
        title: '操作',
        render: ({ _id: id, state }) => (
          <div>
            <Tooltip title="删除">
              <Popconfirm
                title="是否确认删除该用户?"
                onConfirm={() => this.removeUser(id)}
              >
                <Button shape="circle" icon="delete" size="small" />
              </Popconfirm>
            </Tooltip>
            <Divider type="vertical" />
            <Tooltip title="重置密码">
              <Button
                shape="circle"
                icon="reload"
                size="small"
                onClick={() => this.handleResetCancel(true, id)}
              />
            </Tooltip>
            <Divider type="vertical" />
            {this.renderHandleLock(state, id)}
          </div>
        ),
      },
    ];

    return (
      <div className={styles.standardTable}>
        <Table
          loading={loading}
          rowKey="_id"
          dataSource={list}
          columns={columns}
          size="middle"
          onChange={this.handleTableChange}
          pagination={false}
        />
      </div>
    );
  }
}
