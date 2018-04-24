import intl from 'react-intl-universal';
import React, { Component } from 'react';
import {Button,Card,Col,Dropdown,Form,Icon,Input,Menu,message,Popconfirm,Radio,Row,Select,Tooltip,} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './medias.less';
import MediasTable from '../../components/MediasTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BizIcon from '../../components/BizIcon';
import AddMedia from '../../components/Media/AddMedia';

const { Option } = Select;

@connect(({ media, loading }) => ({
  media,
  loading: loading.effects['media/getMedias'],
}))
@Form.create()

export default class medias extends Component {

  constructor(props) {
    super(props);
    const now =
      new Date(new Date().toLocaleDateString()).getTime() + 3600 * 24 * 1000;

    this.state = {
      searchValues: {
        verbose: 100,
      },
       modalVisible: false,
       expandForm: false,
       selectedRowKeys: [],
    };
  }

  componentDidMount() {
     this.props.dispatch({
      type: 'media/getMedias',
      payload: { ...this.state.searchValues },
    });

    this.props.dispatch({
      type: 'media/getOSSToken',
      payload: {
        verbose:100
      },
    });
  }

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

  //查询条件
  renderForm() {
   const { getFieldDecorator } = this.props.form;
   return (
     <Form layout="inline" onSubmit={this.handleSearch}>
       <Form.Item label={intl.get('ad.media.mediaName')}>
         {getFieldDecorator('mediaName')(<Input />)}
       </Form.Item>
       <Form.Item>
         <Button type="primary" icon="search" htmlType="submit" />
       </Form.Item>
     </Form>
   );
 }
 handleSearch = e => {
   e.preventDefault();

   this.props.form.validateFields((err, { mediaName, ...values }) => {
     if (err) return;
     const searchValues = {
       name:mediaName,
       ...values,
     };
     this.fetchAreas({}, searchValues);
     this.setState({ searchValues });
   });
 };

 handleAddCancel = flag => {
   this.setState({
     modalVisible: !!flag,
   });
 };

 handleAdd = values => {
   console.log(values);
   this.props.dispatch({
     type: 'media/add',
     payload: {
       ...values,
       onSuccess: () => {
         message.success('添加成功');
         this.setState({
           modalVisible: false,
         });
         this.fetchAreas({}, {});
       },
     },
   });
 };
 handleRemove = mediaId => {
   this.props.dispatch({
     type: 'media/remove',
     payload: {
       id: mediaId,
       onSuccess: () => {
         message.success('删除成功');
         this.fetchAreas({}, {});
       },
     },
   });
 };

 handleConfirm = (id, comment) => {
   this.props.dispatch({
     type: 'media/upates',
     payload: {
       id,
       body: comment,
       onSuccess: () => {
         message.success('修改成功');
         this.fetchAreas({}, {});
       },
     }
   });
 };

 handleStandardTableChange = pagination => {
   this.fetchAreas(pagination, this.state.searchValues);
 };
 fetchAreas = (
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

  render() {
   const { media, loading, dispatch } = this.props;
   console.log(media);
   const { data,add} = media;
   const { selectedRowKeys, modalVisible } = this.state;
   const tableProps = { loading, data, dispatch };
   const fontStyle = { fontSize: '20px', marginRight: '10px' };
   return (
     <PageHeaderLayout>

       <Card bordered={false}>

        <Tooltip title="新增素材" placement="left">
          <Button
            icon="plus"
            type="primary"
            shape="circle"
            className={styles.addButton}
            size="large"
            onClick={() => this.handleAddCancel(true)}
          />
        </Tooltip>

         <div >
           <div>{this.renderForm()}</div>
           <div>
              <MediasTable
                  {...tableProps}
                  dataSource={this.getMediaData(data.list)}
                  onChange={this.handleStandardTableChange}
                  onConfirm={this.handleConfirm}
                  onRemove={this.handleRemove}
               />
           </div>
         </div>
       </Card>
       <AddMedia
         visible={modalVisible}
         error={add.error}
         status={add.status}
         onAdd={this.handleAdd}
         onCancel={this.handleAddCancel}
         dispatch={this.props.dispatch}
       />


     </PageHeaderLayout>
   );
 }
}
