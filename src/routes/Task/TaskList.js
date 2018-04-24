import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Popconfirm,
  Radio,
  Progress,
  Select,
  Tooltip,
  Table,
  Divider,
  Checkbox,
  notification,
} from 'antd';
import pick from 'lodash/pick';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DeviceSearch from '../../components/DeviceSearch';
import TableCellDescription from '../../components/Task/TableCellDescription';
import FormattedDate from '../../components/FormattedDate';

import {
  taskTypeTransform,
  taskStateTransform,
  taskStateGather,
  getTaskCancelId,
} from '../../utils/TaskUtils';

const { Option } = Select;
@connect(({ tasks, loading }) => ({
  tasks,
  loading: loading.effects['tasks/fetch'],
}))
export default class TaskList extends Component {
  state = {
    filterParam: {},
    selectedKeys: [],
    indeterminate: false,
    allChecked: false,
    selectedResource: [],
  };
  componentDidMount() {
    this.fetchTasks({}, {});
  }
  handleTableChange = pagination => {
    this.setState({
      selectedKeys: [],
      indeterminate: false,
      allChecked: false,
      selectedResource: [],
    });
    this.fetchTasks(pagination, this.state.filterParam);
  };
  fetchTasks = (pagination, searchValues) => {
    let params = {};
    if (pagination && pagination.current) {
      params = {
        cursor: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
    }
    const payload = { ...params, ...searchValues };
    this.props.dispatch({ type: 'tasks/fetch', payload });
  };
  cancelTask = param => {
    const payload = {
      filterParam: this.state.filterParam,
      id: param,
    };
    this.props.dispatch({ type: 'tasks/cancelTask', payload });
  };
  batchDelete = () => {
    const { allChecked, selectedResource } = this.state;
    let ids = [];
    if (allChecked) {
      const { tasks } = this.props;
      const { data } = tasks;
      ids = getTaskCancelId(data.list);
    } else {
      ids = getTaskCancelId(selectedResource);
    }
    const payload = {
      filterParam: this.state.filterParam,
      ids,
    };
    this.props.dispatch({ type: 'tasks/batchDelete', payload });
  };
  handleSateChange = e => {
    const { filterParam } = this.state;
    let formParam = pick(filterParam, ['types', 'object_id']);
    if (e.target.value !== 'all') {
      formParam = { ...formParam, states: taskStateGather(e.target.value) };
    }
    this.setState({
      filterParam: formParam,
      selectedKeys: [],
      indeterminate: false,
      allChecked: false,
      selectedResource: [],
    });
    this.fetchTasks({}, formParam);
  };
  handleTypeChange = value => {
    const { filterParam } = this.state;
    let formParam = pick(filterParam, ['states', 'object_id']);
    if (value !== 'all') {
      formParam = { ...formParam, types: value };
    }
    this.setState({
      filterParam: formParam,
      selectedKeys: [],
      indeterminate: false,
      allChecked: false,
      selectedResource: [],
    });
    this.fetchTasks({}, formParam);
  };
  handleDeviceChange = value => {
    const { filterParam } = this.state;
    let formParam = pick(filterParam, ['states', 'types']);
    if (value) {
      formParam = { ...formParam, object_id: value };
    }
    this.setState({
      filterParam: formParam,
      selectedKeys: [],
      indeterminate: false,
      allChecked: false,
      selectedResource: [],
    });
    this.fetchTasks({}, formParam);
  };
  checkboxChange = ({ target }) => {
    const { checked } = target;
    const { tasks } = this.props;
    const { data } = tasks;
    if (checked) {
      const keys = data.list.map(value => {
        const { _id: id } = value;
        return id;
      });
      this.setState({
        selectedKeys: keys,
        allChecked: true,
        indeterminate: false,
      });
    } else {
      this.setState({
        selectedKeys: [],
        allChecked: false,
        indeterminate: false,
      });
    }
  };
  tableColumns = () => {
    const columns = [
      {
        title: 'objectName',
        dataIndex: 'objectName',
        width: '15%',
        render: value => {
          return (
            <TableCellDescription title="设备">{value}</TableCellDescription>
          );
        },
      },
      {
        title: 'Type',
        dataIndex: 'type',
        width: '10%',
        render: value => {
          const type = taskTypeTransform(value);
          return type;
        },
      },
      {
        title: 'Performer',
        dataIndex: 'username',
        width: '20%',
        render: value => {
          return (
            <TableCellDescription title="创建者">{value}</TableCellDescription>
          );
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        width: '25%',
        render: value => {
          const { status, progress } = taskStateTransform(value.state);
          return (
            <TableCellDescription title={status}>
              {progress && (
                <Progress
                  size="small"
                  percent={value.progress * 100}
                  status={progress}
                />
              )}
            </TableCellDescription>
          );
        },
      },
      {
        title: 'Start Time',
        dataIndex: 'startTime',
        width: '15%',
        render: value => {
          if (value) {
            return (
              <TableCellDescription title="开始时间">
                <FormattedDate timestamp={value} />
              </TableCellDescription>
            );
          }
        },
      },
      {
        title: 'Handle',
        dataIndex: 'status.state',
        width: '10%',
        render: (value, row) => {
          const { _id: id } = row;
          if (value === 0 || value === 5) {
            return (
              <div>
                <Tooltip title="重新执行">
                  <Button
                    shape="circle"
                    icon="reload"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      this.replayTask();
                    }}
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip title="取消">
                  <Button
                    shape="circle"
                    icon="close"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      this.cancelTask(id);
                    }}
                  />
                </Tooltip>
              </div>
            );
          } else {
            return (
              <div>
                <Tooltip title="重新执行">
                  <Button
                    shape="circle"
                    icon="reload"
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      this.replayTask();
                    }}
                  />
                </Tooltip>
              </div>
            );
          }
        },
      },
    ];
    return columns;
  };
  RowSelection = () => {
    const { tasks } = this.props;
    const { data } = tasks;
    const { selectedKeys } = this.state;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedKeys: selectedRowKeys,
          selectedResource: selectedRows,
        });
        if (
          selectedRowKeys.length < data.pagination.pageSize &&
          selectedRowKeys.length > 0
        ) {
          this.setState({ indeterminate: true, allChecked: false });
        } else if (selectedRows.length === data.pagination.pageSize) {
          this.setState({ indeterminate: false, allChecked: true });
        } else if (selectedRowKeys.length === 0) {
          this.setState({ indeterminate: false, allChecked: false });
        }
      },
    };

    return rowSelection;
  };
  replayTask = () => {
    notification.open({
      message: '重新执行',
      description: '重新执行任务！',
    });
  };
  renderFooter = () => {
    const { data } = this.props.tasks;
    const { total, pageSize, current } = data.pagination;
    const pages = Math.floor((total - 1) / pageSize) + 1;
    return `共 ${total} 条记录 第 ${current} / ${pages} 页`;
  };
  render() {
    const { tasks, loading } = this.props;
    const { data } = tasks;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '30', '50', '100'],
      defaultPageSize: 10,
      ...data.pagination,
    };
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Checkbox
            style={{ marginRight: 10 }}
            onChange={this.checkboxChange}
            checked={this.state.allChecked}
            indeterminate={this.state.indeterminate}
          />
          {(this.state.allChecked || this.state.selectedKeys.length > 0) && (
            <div
              style={{
                display: 'inline-block',
                marginRight: 10,
                marginBottom: 10,
              }}
            >
              <Popconfirm
                title="是否取消这些任务?"
                onConfirm={this.batchDelete}
              >
                <Button style={{ marginRight: 5 }} icon="close">
                  取消
                </Button>
              </Popconfirm>
              <Popconfirm title="确认重新执行？" onConfirm={this.replayTask}>
                <Button icon="reload">重新执行</Button>
              </Popconfirm>
            </div>
          )}
          <Select
            showSearch
            style={{ width: 200, marginRight: 10, marginBottom: 10 }}
            size="default"
            placeholder="Select a person"
            optionFilterProp="children"
            onChange={this.handleTypeChange}
          >
            <Option key="all">全部</Option>
            <Option key="1">运行配置下发</Option>
            <Option key="2">交互命令</Option>
            <Option key="3">OVDP 配置</Option>
            <Option key="4">获取运行配置</Option>
            <Option key="5">导入升级文件</Option>
            <Option key="6">VPN临时通道</Option>
            <Option key="7">VPN连接指令</Option>
            <Option key="8">定期清理access_token</Option>
            <Option key="9">流量定期统计</Option>
            <Option key="10">闲置任务定期通知</Option>
            <Option key="11">远程web管理</Option>
          </Select>
          <Radio.Group
            style={{ marginRight: 10, marginBottom: 10 }}
            onChange={this.handleSateChange}
          >
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="1">执行中</Radio.Button>
            <Radio.Button value="5">等待</Radio.Button>
            <Radio.Button value="-1">失败</Radio.Button>
            <Radio.Button value="3">完成</Radio.Button>
          </Radio.Group>
          <DeviceSearch
            style={{ marginRight: 10, marginBottom: 10 }}
            onChange={this.handleDeviceChange}
          />
          <Table
            rowKey="_id"
            size="middle"
            style={{ background: '#fff' }}
            dataSource={data.list}
            rowSelection={this.RowSelection()}
            columns={this.tableColumns()}
            pagination={paginationProps}
            loading={loading}
            showHeader={false}
            onChange={this.handleTableChange}
            footer={this.renderFooter}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
