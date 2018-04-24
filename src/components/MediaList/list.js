import React, { Component } from 'react';
import { Table,Modal,Tooltip,Button } from 'antd';
import intl from 'react-intl-universal';
import styles from './index.less';

export default class list extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      manageData: {},
      selectRow:[]
    };
  }

  renderFooter = () => {
    const { total, pageSize, current } = this.props.data.pagination;
    const { visible } = this.props;

    const pages = Math.floor((total - 1) / pageSize) + 1;
    return intl.get('common.pagination_footer', {
      total,
      current,
      pages,
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  showConfirm = () => {
      const { onConfirm,onCancel } = this.props;
      const selectMedia = this.state.selectRow;
      onConfirm(selectMedia);
      onCancel();
  }

  render() {
    const { dataSource, loading ,visible,data: { pagination }} = this.props;
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
        title: intl.get('ad.media.fileShow'),//文件预览
        dataIndex: 'imageCdnpath',
        width: 100,
        render(value) {
          return <img src={value} className={styles.fileShow} />
        }
      },
      {
        title: intl.get('ad.media.createTime'),//创建时间
        dataIndex: 'createTime'
      }
    ];

    const rowSelection = {
        type:"radio",
        onChange: (selectedRowKeys, selectedRows) => {
          //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
          this.state.selectRow = selectedRows;
        }
    };

     return (
       <Modal
         title={intl.get('ad.mediaManagement')}
         style={{ top: 20,width:600}}
         visible={visible}
         size = "small"
         onOk={this.showConfirm.bind(this)}
         onCancel={this.handleCancel}
       >
       <Table
        dataSource={dataSource}
        columns={columns}
        pagination={paginationProps}
        footer={this.renderFooter}
        rowSelection={rowSelection}
        />
        </Modal>
     )
   }
}
