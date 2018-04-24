import React, { PureComponent } from 'react';
import { Button, Table, Tooltip,  Divider, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import styles from './index.less';


export default class PhoneAdTable extends PureComponent {
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

  removeMeida = id => {
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
        title: intl.get('ad.phone.name'),//广告名称
        dataIndex: 'adName',
      },
      {
        title: intl.get('ad.phone.payStyles'),//支付方式
        dataIndex: 'payStyles',
        width: 160,
        render(value) {
          if(value == 2){
             return "微信"
          }else if(value == 3){
             return "支付宝"
          }else{
             return "微信 | 支付宝"
          }
        }
      },
      {
        title: intl.get('ad.phone.startTime'),//开始时间
        width: 160,
        dataIndex: 'startTime'
      },
      {
        title: intl.get('ad.phone.endTime'),//结束时间
        width: 160,
        dataIndex: 'endTime'
      },
      {
        title: intl.get('ad.media.createTime'),//创建时间
        width: 160,
        dataIndex: 'createTime'
      },
      {
        title: intl.get('common.operation'),
        width: 120,
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
                onConfirm={() => this.removeMeida(id)}
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
          scroll={{ y: 300 }}
        />


      </div>
    );
  }
}
