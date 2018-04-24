import React, { PureComponent } from 'react';
import { connect } from 'dva';
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
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './TableList.less';
import DeviceTable from '../../components/DeviceTable';
import AddDevice from '../../components/Device/AddDevice';

const { Option } = Select;

@connect(({ devices, loading }) => ({
  devices,
  loading: loading.effects['devices/fetch'],
}))
@Form.create()
export default class TableList extends PureComponent {

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'devices/fetch',
    });
    dispatch({ type: 'devices/fetchModels' });
  }

  handleStandardTableChange = pagination => {
    this.fetchDevices(pagination, this.state.searchValues);
  };

  fetchDevices = (pagination, { online, ...searchValues }) => {
    let params = {};
    if (pagination && pagination.current) {
      params = {
        cursor: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
    }
    const payload = { ...params, ...searchValues };
    if (online !== 'all') {
      payload.online = online;
    }
    this.props.dispatch({ type: 'devices/fetch', payload });
  };

  handleFormReset = () => {
    const { form } = this.props;
    const { searchValues } = this.state;
    form.resetFields();
    this.setState({
      searchValues: {},
    });
    if (Object.keys(searchValues).length > 0) {
      this.fetchDevices({}, {});
    }
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { selectedRowKeys } = this.state;

    if (!selectedRowKeys) return;

    switch (e.key) {
      case 'remove':
        break;
      default:
        break;
    }
  };

  handleRemove = () => {
    const { dispatch, devices } = this.props;
    const { selectedRowKeys, searchValues } = this.state;

    if (!selectedRowKeys) return;

    dispatch({
      type: 'devices/remove',
      payload: {
        ids: selectedRowKeys,
      },
      callback: () => {
        this.fetchDevices(devices.data.pagination, searchValues);
        this.setState({
          selectedRowKeys: [],
        });
      },
    });
  };

  handleSelectRows = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  handleOnlineChange = e => {
    let { searchValues } = this.state;
    searchValues = { ...searchValues, online: e.target.value };
    this.setState({ searchValues });
    this.fetchDevices({}, searchValues);
  };

  handleSearch = e => {
    e.preventDefault();

    this.props.form.validateFields(
      (err, { searchName, searchValue, ...values }) => {
        if (err) return;
        const searchValues = {
          ...values,
          [searchName]: searchValue,
        };
        this.fetchDevices({}, searchValues);
        this.setState({ searchValues });
      }
    );
  };

  handleAddCancel = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = values => {
    this.props.dispatch({
      type: 'devices/add',
      payload: {
        ...values,
        onSuccess: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          this.fetchDevices({}, {});
        },
      },
    });
  };

  renderSerialNumberSearchItem() {
    const { getFieldDecorator } = this.props.form;
    const label = getFieldDecorator('searchName', {
      initialValue: 'name',
    })(
      <Select placeholder="请选择" style={{ width: 90 }}>
        <Option value="name">名称</Option>
        <Option value="serial_number">序列号</Option>
      </Select>
    );
    return (
      <Col md={8} lg={8} sm={24} style={{ paddingRight: 0 }}>
        <Form.Item>
          {getFieldDecorator('searchValue')(
            <Input addonBefore={label} placeholder="IR9120000000000" />
          )}
        </Form.Item>
      </Col>
    );
  }

  renderOnlineFilterItem() {
    return (
      <Col md={6} lg={6} sm={24}>
        <Form.Item>
          {this.props.form.getFieldDecorator('online', { initialValue: 'all' })(
            <Radio.Group onChange={this.handleOnlineChange}>
              <Radio.Button value="all">全部</Radio.Button>
              <Radio.Button value="1">在线</Radio.Button>
              <Radio.Button value="0">离线</Radio.Button>
            </Radio.Group>
          )}
        </Form.Item>
      </Col>
    );
  }

  renderSimpleForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {this.renderOnlineFilterItem()}
          {this.renderSerialNumberSearchItem()}
          <Col md={8} sm={24}>
            <Form.Item className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {this.renderOnlineFilterItem()}
          {this.renderSerialNumberSearchItem()}
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    return this.state.expandForm
      ? this.renderAdvancedForm()
      : this.renderSimpleForm();
  }

  render() {
    // console.log(this.props);
    const { devices, loading, dispatch } = this.props;
    const { data, add } = devices;
    const { selectedRowKeys, modalVisible } = this.state;

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="approval">批量配置</Menu.Item>
      </Menu>
    );

    const tableProps = { selectedRowKeys, loading, data, dispatch };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tooltip title="新增网关" placement="left">
            <Button
              icon="plus"
              type="primary"
              shape="circle"
              className={styles.addButton}
              size="large"
              onClick={() => this.handleAddCancel(true)}
            />
          </Tooltip>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRowKeys.length > 0 && (
                <span>
                  <Popconfirm
                    title="是否确认删除这些设备?"
                    onConfirm={this.handleRemove}
                  >
                    <Button>删除</Button>
                  </Popconfirm>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <DeviceTable
              {...tableProps}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <AddDevice
          visible={modalVisible}
          onAdd={this.handleAdd}
          onCancel={this.handleAddCancel}
          error={add.error}
          status={add.status}
          models={devices.models}
        />
      </PageHeaderLayout>
    );
  }
}
