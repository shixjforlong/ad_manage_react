import intl from 'react-intl-universal';
import React, { Component } from 'react';
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
  message,
  Popconfirm,
  Radio,
  Row,
  Select,
  Tooltip,
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import styles from './Areas.less';
import AreasTable from '../../../components/AreasTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import BizIcon from '../../../components/BizIcon';
import AddArea from '../../../components/Area/AddArea';



const { Option } = Select;

@connect(({ area, loading }) => ({
  area,
  loading: loading.effects['area/getAreas'],
}))
@Form.create()

export default class Areas extends Component {
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

    const { dispatch } = this.props;
    dispatch({
      type: 'area/getAreas',
      payload: { ...this.state.searchValues },
    });
  }

  getAreaData = areas => {
    if (areas === undefined || areas.length === 0 || areas === undefined) {
      return [];
    }
    const newNotices = areas.map(notice => {
      let newNotice = { ...notice };
      newNotice = {
        ...notice,
        _id: notice._id,
        name:notice.name,
        charger:notice.charger,
        phone:notice.phone,
        description: notice.description, // 信息描述的内容
        createTime: moment(notice.createTime * 1000).format(
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
        <Form.Item label={intl.get('site.area.areaName')}>
          {getFieldDecorator('area_name')(<Input />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon="search" htmlType="submit" />
        </Form.Item>
      </Form>
    );
  }
  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields((err, { area_name, ...values }) => {
      if (err) return;
      const searchValues = {
        name:area_name,
        ...values,
      };
      this.fetchAreas({}, searchValues);
      this.setState({ searchValues });
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

    this.props.dispatch({ type: 'area/getAreas', payload });
  };

  handleAddCancel = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };
  handleAdd = values => {
    this.props.dispatch({
      type: 'area/add',
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
  handleRemove = areaId => {
    this.props.dispatch({
      type: 'area/remove',
      payload: {
        id: areaId,
        onSuccess: () => {
          message.success('删除成功');
          this.fetchAreas({}, {});
        },
      },
    });
  };

  handleConfirm = (id, comment) => {
    const { dispatch } = this.props;
    const { searchValues } = this.state;
    this.props.dispatch({
      type: 'area/upates',
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

   render() {
    const { area, loading, dispatch } = this.props;
    console.log(area);
    const { data,add} = area;
    const { selectedRowKeys, modalVisible } = this.state;
    const tableProps = { loading, data, dispatch };
    const fontStyle = { fontSize: '20px', marginRight: '10px' };
    return (
      <PageHeaderLayout>

        <Card bordered={false}>

           <Tooltip title="新增区域" placement="left">
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
               <AreasTable
                   {...tableProps}
                   dataSource={this.getAreaData(data.list)}
                   onChange={this.handleStandardTableChange}
                   onConfirm={this.handleConfirm}
                   onRemove={this.handleRemove}
                />
            </div>
          </div>
        </Card>

        <AddArea
          visible={modalVisible}
          error={add.error}
          status={add.status}
          onAdd={this.handleAdd}
          onCancel={this.handleAddCancel}
        />

      </PageHeaderLayout>
    );
  }


  }
