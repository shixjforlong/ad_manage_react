import React, { PureComponent } from 'react';
import intl from 'react-intl-universal';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select,DatePicker,Button,Icon,Table,Tooltip,Popconfirm } from 'antd';
import { debounce } from 'lodash/function';
import moment from 'moment';
import { connect } from 'dva';

import MediaList from '../../components/MediaList/list'

@connect(({ media, loading }) => ({
  media,
  loading: loading.effects['media/getMedias'],
}))
export default class PageSuccess extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchValues: {
        verbose: 100,
      },
       modalVisible: false,
       expandForm: false,
       selectedRowKeys: [],
       paySuccessdataSource:[],//支付成功页面广告数据
       mediainfo:{
         adIndex:"1",
         mediaId:"",
         mediaName:"",
         imageCdnpath:"",
         linkaddress:""
       }
    };
  }

  componentDidMount() {
     this.props.dispatch({
      type: 'media/getMedias',
      payload: { ...this.state.searchValues },
    });
  }

  handleStandardTableChange = pagination => {
    this.fetchMeias(pagination, this.state.searchValues);
  };
  fetchMeias = (
    pagination,
    { ...searchValues }
  ) => {
    let params = {};
    if (pagination && pagination.current) {
      params = {
        cursor: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
    }
    const verbose = { verbose: 100 };
    const payload = { ...verbose, ...params, ...searchValues };

    this.props.dispatch({ type: 'media/getMedias', payload });
  };

  handleManageCancel = (tab, id) => {
    this.setState({
      modalVisible: !!tab,
    });
  };

  onDelete = (key) => {
    const dataSource = [...this.state.paySuccessdataSource];
    this.setState({ paySuccessdataSource: dataSource.filter(item => item.key !== key) });
  }

  onBlur = (e) => { //失去焦点时获取光标所在位置
    const { onConfirmTab } = this.props;
    const value = e.target.value;
    this.state.mediainfo.linkaddress  = value;
    onConfirmTab(this.state.mediainfo);
  }
  onConfirm = (selectMedia) => {
     const { onConfirmTab } = this.props;
     this.state.paySuccessdataSource = selectMedia;

     this.state.mediainfo.mediaId = selectMedia[0]._id;
     this.state.mediainfo.mediaName = selectMedia[0].mediaName;
     this.state.mediainfo.imageCdnpath = selectMedia[0].imageCdnpath;
     onConfirmTab(this.state.mediainfo);
  }

  handleAddCancel = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  getMediaData = areas => {
    if (areas === undefined || areas.length === 0 || areas === undefined) {
      return [];
    }
    const newNotices = areas.map(media => {
      let newNotice = { ...media };
      newNotice = {
        ...media,
        _id: media._id,
        mediaName:media.mediaName,
        fileName:media.fileName,
        length:media.length,
        createTime: moment(media.createTime * 1000).format(
          'YYYY.MM.DD HH:mm:ss'
        ),

      };
      return newNotice;
    });
    return newNotices;
  }

  render() {
      const { media, loading, dispatch } = this.props;
      console.log(media);
      const { data,add} = media;
      const { selectedRowKeys, modalVisible } = this.state;
      const tableProps = { loading, data, dispatch };
      const fontStyle = { fontSize: '20px', marginRight: '10px' };

      const itemLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 15 },
      };
      const itemcontentLayout = {
        labelCol: { span: 5 },
        wrapperCol: { span: 25 },
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
            return <img src={value} style={{width:40,height:40}} />
          }
        },
        {
          title: intl.get('common.operation'),
          render: (text, record) => {
             return (
               this.state.paySuccessdataSource.length > 0 ?
               (
                 <Popconfirm title="确定要删除?" onConfirm={() => this.onDelete(record.key)}>
                   <a href="javascript:;">删除</a>
                 </Popconfirm>
               ) : null
             );
          },
        },
      ];

      return (
        <div>
          <Form>
            <Form.Item {...itemcontentLayout}>
                <Button type="ghost"   onClick={() => this.handleAddCancel(true)}>
                  <Icon type="plus" /> 添加图片
                </Button>
                <Table
                 dataSource={this.state.paySuccessdataSource}
                 columns={columns}
                 pagination={false}
                 size="small"
                 bordered
                 />
            </Form.Item>
            <Form.Item {...itemcontentLayout}  hasFeedback>
             <Input type="text" onBlur={this.onBlur.bind(this)}  defaultValue="http://"/>
           </Form.Item>
          </Form>
          <MediaList
              {...tableProps}
              dispatch={this.props.dispatch}
              visible={modalVisible}
              onCancel={this.handleManageCancel}
              onConfirm={this.onConfirm}
              dataSource={this.getMediaData(data.list)}
              onChange={this.handleStandardTableChange}
            />
        </div>
      )
  }
}
