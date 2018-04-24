import React, { PureComponent } from 'react';
import { Alert, Badge, Button, Divider, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { routerRedux } from 'dva/router';

import styles from './index.less';
import Signal from '../Signal';
import Ngrok from '../Device/Ngrok';

const statusMap = ['default', 'success'];

export default class DeviceTable extends PureComponent {
  static defaultProps = {
    selectedRowKeys: [],
    onSelectRow: () => {},
  };

  static propTypes = {
    selectedRowKeys: PropTypes.array,
    onSelectRow: PropTypes.func,
  };

  state = {
    selectedRowKeys: [],
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRowKeys.length === 0) {
      this.setState({
        selectedRowKeys: [],
      });
    }
  }

  handleRowSelectChange = selectedRowKeys => {
    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRowKeys);
    }

    this.setState({ selectedRowKeys });
  };

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  renderFooter = () => {
    const { total, pageSize, current } = this.props.data.pagination;
    const pages = Math.floor((total - 1) / pageSize) + 1;
    return `共 ${total} 条记录 第 ${current} / ${pages} 页`;
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data: { list, pagination }, loading } = this.props;

    const columns = [
      {
        title: '名称',
        dataIndex: 'name',
        render(val, { _id: id, online }) {
          return (
            <div>
              <Badge status={statusMap[online]} />
              <Link to={`/device/${id}`}>{val}</Link>
            </div>
          );
        },
      },
      {
        title: '信号',
        dataIndex: 'info.rssi',
        width: 60,
        render(value) {
          return <Signal value={value} />;
        },
      },
      {
        title: '序列号',
        dataIndex: 'serialNumber',
        width: 160,
      },
      {
        title: 'IMSI',
        dataIndex: 'info.imsi',
      },
      {
        title: '当前版本',
        dataIndex: 'info.swVersion',
        render: text => {
          return text && text.replace(/\u0000/g, '');
        },
      },
      {
        title: '操作',
        render: (text, record) => {
          const { _id: id, online = 0 } = record;
          return (
            <div>
              <Ngrok device={record} />
              <Divider type="vertical" />
              <Tooltip title="查看日志">
                <Button
                  shape="circle"
                  icon="file-text"
                  size="small"
                  disabled={online === 0}
                  onClick={() =>
                    this.props.dispatch(routerRedux.push(`/device/${id}/logs`))
                  }
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '30', '50', '100'],
      defaultPageSize: 10,
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div className={styles.standardTable}>
        {selectedRowKeys.length > 0 && (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <div>
                  已选择{' '}
                  <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                  <a
                    onClick={this.cleanSelectedKeys}
                    style={{ marginLeft: 24 }}
                  >
                    清空
                  </a>
                </div>
              }
              type="info"
              showIcon
            />
          </div>
        )}
        <Table
          loading={{ spinning: loading, delay: 200 }}
          rowKey="_id"
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          size="middle"
          onChange={this.handleTableChange}
          footer={this.renderFooter}
        />
      </div>
    );
  }
}
