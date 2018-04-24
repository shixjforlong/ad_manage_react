import intl from 'react-intl-universal';
import React, { Component } from 'react';
import {Button,Card,Col,Dropdown,Form,Icon,Input,Menu,message,Popconfirm,Radio,Row,Select,Tooltip,} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './phoneAd.less';
import PhoneAdTable from '../../components/PhoneAdTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import BizIcon from '../../components/BizIcon';
import AddPhoneAd from '../../components/PhoneAd/AddPhoneAd';

@connect(({ phoneAd, loading }) => ({
  phoneAd,
  loading: loading.effects['phoneAd/getPhoneAds'],
}))
@Form.create()

export default class phoneAd extends Component {
  constructor(props) {
    super(props);

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
      type: 'phoneAd/getPhoneAds',
      payload: { ...this.state.searchValues },
    });
  }

  getPhoneAdData = areas => {
    if (areas === undefined || areas.length === 0 || areas === undefined) {
      return [];
    }
    const newNotices = areas.map(media => {
      let newNotice = { ...media };
      newNotice = {
        ...media,
        _id: media._id,
        adName:media.adName,
        payStyles:media.payStyles,
        startTime:moment(media.startTime * 1000).format(
          'YYYY.MM.DD HH:mm:ss'
        ),
        endTime:moment(media.endTime * 1000).format(
          'YYYY.MM.DD HH:mm:ss'
        ),
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
       <Form.Item label={intl.get('ad.phone.name')}>
         {getFieldDecorator('adName')(<Input />)}
       </Form.Item>
       <Form.Item>
         <Button type="primary" icon="search" htmlType="submit" />
       </Form.Item>
     </Form>
   );
 }

 handleSearch = e => {
   e.preventDefault();
   this.props.form.validateFields((err, { adName, ...values }) => {
     if (err) return;
     const searchValues = {
       name:adName,
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
 //添加手机广告
 handleAdd = values => {
    console.log(values);
    this.props.dispatch({
      type: 'phoneAd/add',
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

   this.props.dispatch({ type: 'phoneAd/getPhoneAds', payload });
 };

 render() {
  const { phoneAd, loading, dispatch } = this.props;
  console.log(phoneAd);
  const { data,add} = phoneAd;
  const { selectedRowKeys, modalVisible } = this.state;
  const tableProps = { loading, data, dispatch };
  const fontStyle = { fontSize: '20px', marginRight: '10px' };
  return (
    <PageHeaderLayout>

      <Card bordered={false}>

       <Tooltip title="新增广告" placement="left">
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
             <PhoneAdTable
                 {...tableProps}
                 dataSource={this.getPhoneAdData(data.list)}
                 onChange={this.handleStandardTableChange}
                 onConfirm={this.handleConfirm}
                 onRemove={this.handleRemove}
              />
          </div>
        </div>
      </Card>
      <AddPhoneAd
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
