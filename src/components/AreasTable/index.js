import React, { PureComponent } from 'react';
import { Button, Table, Tooltip,  Divider, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import AreaManage from '../AreaManage';

export default class AreasTable extends PureComponent {
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

  removeArea = id => {
    this.props.onRemove(id);
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

  onConfirm = (id, comment) => {
    console.log(id);
    console.log(comment);
    this.props.onConfirm(id,comment);
  }

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
        title: intl.get('site.area.areaName'),//区域名称
        dataIndex: 'name',
      },
      {
        title: intl.get('site.area.charger'),//负责人
        dataIndex: 'charger'
      },
      {
        title: intl.get('site.area.phone'),//联系方式
        dataIndex: 'phone',
      },
      {
        title: intl.get('site.area.description'),//描述
        dataIndex: 'description',
      },
      {
        title: intl.get('site.area.createTime'),//创建时间
        dataIndex: 'createTime',
      },
      {
        title: intl.get('common.operation'),
        render: ({ _id: id, state }) => (
          <div>
            <Tooltip title="修改">
              <Button
                shape="circle"
                icon="edit"
                size="small"
                onClick={() => this.handleManageCancel(true, id)}
              />
            </Tooltip>

             <Divider type="vertical" />

             <Tooltip title="删除">
              <Popconfirm
                title="是否确认删除?"
                onConfirm={() => this.removeArea(id)}
              >
                <Button shape="circle" icon="delete" size="small" />
              </Popconfirm>
            </Tooltip>

          </div>
        ),
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
          <AreaManage
            dispatch={this.props.dispatch}
            visible={modalVisible}
            onCancel={this.handleManageCancel}
            data={this.state.manageData}
            onConfirm={this.onConfirm}
          />
        )}

      </div>
    );
  }
}
