import React, { PureComponent } from 'react';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import AlarmManage from '../AlarmManage';

export default class EventsTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      manageData: {},
    };
  }
  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  };

  handleManageCancel = (tab, id) => {
    const { dataSource } = this.props;
    dataSource.map(data => {
      if (data._id === id) {
        this.setState({ manageData: data });
      }
      return null;
    });
    this.setState({
      modalVisible: !!tab,
    });
  };

  renderFooter = () => {
    const { total, pageSize, current } = this.props.data.pagination;
    const pages = Math.floor((total - 1) / pageSize) + 1;
    return intl.get('common.pagination_footer', {
      total,
      current,
      pages,
    });
  };

  render() {
    const { dataSource, loading, data: { pagination } } = this.props;
    const { modalVisible } = this.state;
    const that = this;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '30', '50', '100'],
      defaultPageSize: 10,
      ...pagination,
    };

    const columns = [
      {
        title: intl.get('notice.level'),
        dataIndex: 'levelImg',
        width: 50,
      },
      {
        title: intl.get('site.site'),
        dataIndex: 'siteName',
        render(val) {
          return (
            <div>
              <Link to="#">{val}</Link>
            </div>
          );
        },
      },
      {
        title: intl.get('notice.alarm_time'),
        dataIndex: 'createTime',
      },
      {
        title: intl.get('notice.clear_time'),
        dataIndex: 'clearTime',
      },
      {
        title: intl.get('notice.description'),
        dataIndex: 'desc',
      },
      {
        title: intl.get('notice.confirm_account'),
        dataIndex: 'confirmUserName',
      },
      {
        title: intl.get('notice.type'),
        dataIndex: 'type',
      },
      {
        title: intl.get('common.operation'),
        render(text) {
          const { _id: id } = text;
          return (
            <div>
              <Tooltip title={intl.get('notice.alarm_processing')}>
                <Button
                  shape="circle"
                  icon="file-text"
                  size="small"
                  onClick={() => {
                    that.handleManageCancel(true, id);
                  }}
                />
              </Tooltip>
            </div>
          );
        },
      },
    ];

    return (
      <div>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          rowKey="_id"
          size="middle"
          pagination={paginationProps}
          onChange={this.handleTableChange}
          footer={this.renderFooter}
        />
        {modalVisible && (
          <AlarmManage
            dispatch={this.props.dispatch}
            visible={modalVisible}
            onCancel={this.handleManageCancel}
            data={this.state.manageData}
            onConfirm={this.props.onConfirm}
          />
        )}
      </div>
    );
  }
}
