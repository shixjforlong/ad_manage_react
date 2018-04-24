import React, { PureComponent } from 'react';
import { Button, Table, Tooltip,  Divider, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import intl from 'react-intl-universal';
import styles from './index.less';
import MediaManage from '../MediaManage';

export default class MediasTable extends PureComponent {
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
        title: intl.get('ad.media.mediaName'),//素材名称
        dataIndex: 'mediaName',
      },
      {
        title: intl.get('ad.media.fileName'),//文件名称
        dataIndex: 'fileName',
        width: 160,
      },
      {
        title: intl.get('ad.media.fileShow'),//文件预览
        dataIndex: 'imageCdnpath',
        width: 150,
        render(value) {
          return <img src={value} className={styles.fileShow} />
        }
      },
      {
        title: intl.get('ad.media.length')+'(kb)',//文件大小
        dataIndex: 'length',
        width: 160,
        render(value) {
          return (value/(1024)).toFixed(1)
        }
      },
      {
        title: intl.get('ad.media.createTime'),//创建时间
        dataIndex: 'createTime',
        width: 160,
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
        {modalVisible && (
          <MediaManage
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
