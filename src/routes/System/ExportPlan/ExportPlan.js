import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Card,
  Form,
  Table,
  Tooltip,
  Button,
  Input,
  Modal,
  Tabs,
  Spin,
} from 'antd';
import { join } from 'lodash';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import Ellipsis from '../../../components/Ellipsis';
import PlanInformation from './PlanInformation';
import styles from './ExportPlan.less';
import BizIcon from '../../../components/BizIcon';

@connect(state => ({
  plans: state.exportplans,
  userInfo: state.user,
  loading: state.loading.effects['exportplans/fetchPlans'],
}))
@Form.create()
export default class ExportPlan extends Component {
  state = {
    searchParams: {},
    selectedKeys: [],
    selectedResource: [],
    tabPanelCreate: [],
    tabPanesEdite: [],
    tabActiveIndex: 'information',
    waiting: false,
  };
  componentDidMount() {
    this.fetchPlans({});
  }
  /*
   * 获取计划数据
   * */
  fetchPlans = pagination => {
    this.setState({
      selectedKeys: [],
      selectedResource: [],
    });
    let params = {};
    if (pagination && pagination.current) {
      params = {
        cursor: (pagination.current - 1) * pagination.pageSize,
        limit: pagination.pageSize,
      };
    }
    const payload = { ...params, ...this.state.searchParams };
    this.props.dispatch({ type: 'exportplans/fetchPlans', payload });
  };
  // 显示计划详情面板
  showPlanInfo = plan => {
    const { _id: id } = plan;
    const { tabPanesEdite } = this.state;
    const hasIndex = this.state.tabPanesEdite.some(item => {
      return item.key === id;
    });
    if (hasIndex) {
      this.setState({
        tabActiveIndex: id,
      });
    } else {
      this.setState({
        tabPanesEdite: [
          ...tabPanesEdite,
          {
            title: intl.get('system.update_schedule_plan'),
            key: id,
            content: (
              <PlanInformation
                tag="edit"
                plan={plan}
                onEditPlan={this.handleEditPlan}
              />
            ),
          },
        ],
        tabActiveIndex: id,
      });
    }
  };
  // 点击查询列表
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (err) return;
      const { siteName = '' } = values;
      this.setState(
        {
          searchParams: {
            siteName,
          },
        },
        () => {
          this.fetchPlans({});
        }
      );
    });
  };
  // 点击添加导出计划，展示编辑框
  addOnePlan = e => {
    e.preventDefault();
    const { tabPanelCreate } = this.state;
    if (tabPanelCreate.length > 0) {
      this.setState({
        tabActiveIndex: 'create',
      });
    } else {
      this.setState({
        tabPanelCreate: [
          {
            title: intl.get('system.create_schedule_plan'),
            key: 'create',
            content: (
              <PlanInformation
                tag="create"
                onCreatePlan={this.handleCreatePlan}
              />
            ),
          },
        ],
        tabActiveIndex: 'create',
      });
    }
  };
  // 删除导出计划
  deleteOnePlan = e => {
    e.preventDefault();
    const { dispatch } = this.props;
    const {
      selectedKeys,
      selectedResource,
      searchParams,
      tabPanesEdite,
    } = this.state;
    const self = this;
    if (selectedKeys.length > 0 && selectedResource.length > 0) {
      Modal.confirm({
        title: intl.get('system.delete_plan'),
        content: intl.get('system.delete_plan_describe'),
        cancelText: intl.get('common.cancel'),
        okText: intl.get('common.confirm'),
        className: styles.myVerticalCenterModal,
        onOk() {
          const resourceIds = join([...selectedKeys], ',');
          const payload = {
            params: {
              resourceIds,
              oid: selectedResource[0].oid,
            },
            searchParams,
          };
          dispatch({ type: 'exportplans/deletePlans', payload });
          // 关闭被删除的tab
          const editePanel = tabPanesEdite.filter(item => {
            return !selectedKeys.includes(item.key);
          });
          self.setState({
            tabPanesEdite: editePanel,
          });
        },
      });
    }
  };
  // 处理导出计划列表数据
  handleListData = (list = []) => {
    if (list.length === 0) {
      return [];
    }
    const myList = list.map(plan => {
      let unit = '';
      if (plan.unit === 1) {
        unit = intl.get('system.minute');
      } else if (plan.unit === 2) {
        unit = intl.get('system.hour');
      } else if (plan.unit === 3) {
        unit = intl.get('system.day');
      }
      // 变量名集合
      const varNames = [];
      for (const v of plan.varList.values()) {
        varNames.push(v.desc);
      }
      // ftp 全路径
      let ftp = plan.ftpInfo.domain;
      if (plan.ftpInfo.path && plan.ftpInfo.path !== '') {
        ftp = `${ftp}/${plan.ftpInfo.path}`;
      }
      // 上次执行时间格式化
      let lastExecuteTime = '';
      if (plan.lastExecuteTime > 0) {
        lastExecuteTime = moment(plan.lastExecuteTime * 1000).format(
          'YYYY-MM-DD HH:mm:ss'
        ); // eslint-disable-line prettier/prettier
      }
      const newplan = {
        ...plan,
        loops: `${plan.loop} / ${unit}`,
        varNames: JSON.stringify(varNames).replace(
          new RegExp('[\\[|\\]|\\"]', 'g'),
          ''
        ),
        ftp,
        lastExecuteTime,
      };
      return newplan;
    });
    return myList;
  };
  // 配置列表前input全选配置
  RowSelection = () => {
    const { selectedKeys } = this.state;
    return {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedKeys: [...selectedRowKeys],
          selectedResource: [...selectedRows],
        });
      },
    };
  };
  // 返回table列配置
  tableColumns = () => {
    const columns = [
      {
        title: intl.get('site.site'),
        dataIndex: 'siteName',
      },
      {
        title: intl.get('system.loop'),
        dataIndex: 'loops',
        width: '110px',
      },
      {
        title: intl.get('system.vars'),
        dataIndex: 'varNames',
        width: '30%',
        render: text => {
          return (
            <div>
              <Ellipsis tooltip lines={2}>
                {text}
              </Ellipsis>
            </div>
          );
        },
      },
      {
        title: 'FTP',
        dataIndex: 'ftp',
      },
      {
        title: intl.get('system.last_execute_time'),
        dataIndex: 'lastExecuteTime',
        width: '160px',
      },
      {
        title: intl.get('common.operation'),
        dataIndex: 'operate',
        width: '70px',
        render: (text, record) => {
          // record当前行数据
          return (
            <div>
              <Tooltip title={intl.get('common.detail')}>
                <Button
                  shape="circle"
                  size="small"
                  onClick={e => {
                    e.stopPropagation();
                    this.showPlanInfo(record);
                  }}
                >
                  <BizIcon type="edit" />
                </Button>
              </Tooltip>
            </div>
          );
        },
      },
    ];
    return columns;
  };
  handleTableChange = pagination => {
    this.fetchPlans(pagination);
  };

  // 配置tab标签选项相关操作
  tabChange = tabActiveIndex => {
    this.setState({
      tabActiveIndex,
    });
  };
  removeTab = (targetKey, action) => {
    let { tabActiveIndex } = this.state;
    if (targetKey === this.state.tabActiveIndex) {
      tabActiveIndex = 'information';
    }
    if (action === 'remove') {
      if (targetKey === 'create') {
        this.setState({
          tabPanelCreate: [],
          tabActiveIndex,
        });
      } else {
        const tabPanesEdite = this.state.tabPanesEdite.filter(item => {
          return item.key !== targetKey;
        });
        this.setState({
          tabPanesEdite,
          tabActiveIndex,
        });
      }
    }
  };

  // 创建导出计划
  handleCreatePlan = () => {
    this.setState({
      waiting: true,
    });
  };
  // 修改导出计划
  handleEditPlan = () => {
    this.setState({
      waiting: true,
    });
  };

  render() {
    const { plans, loading } = this.props;
    const { data } = plans;
    const {
      tabPanesEdite,
      tabPanelCreate,
      tabActiveIndex,
      waiting,
    } = this.state;
    const list = this.handleListData(data.list);
    const { getFieldDecorator } = this.props.form;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '30', '50', '100'],
      defaultPageSize: 10,
      ...data.pagination,
    };

    return (
      <PageHeaderLayout>
        <Spin spinning={waiting} size="large">
          <Card bordered={false}>
            <Tabs
              type="editable-card"
              activeKey={tabActiveIndex}
              hideAdd
              tabBarGutter={0}
              onChange={this.tabChange}
              onEdit={this.removeTab}
            >
              <Tabs.TabPane
                key="information"
                tab={intl.get('system.plan_information')}
                closable={false}
              >
                <Form onSubmit={this.handleSearch} layout="inline">
                  <Form.Item>
                    {getFieldDecorator('siteName', {
                      rules: [
                        {
                          pattern: new RegExp(
                            '^[a-zA-Z0-9_\\-\u4e00-\u9fa5@\\.\\s+]+$',
                            'i'
                          ),
                          message: intl.get(
                            'validate.cannot_contain_special_chars'
                          ),
                        },
                      ],
                    })(<Input placeholder={intl.get('site.site')} />)}
                  </Form.Item>
                  <Form.Item>
                    <Tooltip title={intl.get('common.query')}>
                      <Button type="primary" htmlType="submit">
                        <BizIcon type="search" />
                      </Button>
                    </Tooltip>
                  </Form.Item>
                  <Form.Item style={{ float: 'right' }}>
                    <Button.Group>
                      <Tooltip title={intl.get('common.add')}>
                        <Button onClick={this.addOnePlan}>
                          <BizIcon type="add" />
                        </Button>
                      </Tooltip>
                      {this.state.selectedKeys.length > 0 && (
                        <Tooltip title={intl.get('common.delete')}>
                          <Button onClick={this.deleteOnePlan}>
                            <BizIcon type="delete" />
                          </Button>
                        </Tooltip>
                      )}
                    </Button.Group>
                  </Form.Item>
                </Form>
                <Table
                  rowKey="_id"
                  size="middle"
                  style={{ background: '#fff' }}
                  dataSource={list}
                  rowSelection={this.RowSelection()}
                  columns={this.tableColumns()}
                  pagination={paginationProps}
                  loading={loading}
                  showHeader
                  onChange={this.handleTableChange}
                  footer={this.renderFooter}
                />
              </Tabs.TabPane>
              {tabPanelCreate.map(panel => {
                return (
                  <Tabs.TabPane tab={panel.title} key={panel.key}>
                    {panel.content}
                  </Tabs.TabPane>
                );
              })}
              {tabPanesEdite.map(panel => {
                return (
                  <Tabs.TabPane tab={panel.title} key={panel.key}>
                    {panel.content}
                  </Tabs.TabPane>
                );
              })}
            </Tabs>
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
