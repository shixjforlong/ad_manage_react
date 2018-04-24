import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Form, Divider, Input, Button, Spin, Select, Radio } from 'antd';

import LoopInput from './LoopInput';
import Ellipsis from '../../../components/Ellipsis';
import VarCheckboxList from './VarCheckboxList';

@Form.create()
export default class PlanInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingTestFtp: false,
      loadingSubmit: false,
      checkboxList: [],
      initChecked: [],
    };
  }
  componentDidMount() {
    const { tag, plan } = this.props;
    if (tag === 'edit') {
      this.handleCheckboxList(plan.varList);
      this.handleInitChecked(plan.varList);
    }
  }

  // 提交表单
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      console.log(values);
      const { tag, onCreatePlan, onEditPlan } = this.props;
      this.setState(
        {
          loadingSubmit: true,
        },
        () => {
          if (tag === 'create') {
            onCreatePlan();
          } else {
            onEditPlan();
          }
        }
      );
    });
  };
  // 验证FTP地址
  TestFtp = e => {
    e.preventDefault();
    console.log('验证FTP');
    this.setState({
      loadingTestFtp: true,
    });
  };

  // 查询现场的 modal 显示
  showSiteModal = () => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      siteName: 'testSiteName',
    });
  };

  // 自定义校验
  checkLoops = (rule, value, callback) => {
    switch (value.unit) {
      case '3':
        if (value.number > 0 && value.number < 8) {
          callback();
        } else {
          callback(
            intl.get('validate.number_one_to_another', {
              one: '1',
              another: '7',
            })
          );
        }
        break;
      case '2':
        if (value.number > 0 && value.number < 169) {
          callback();
        } else {
          callback(
            intl.get('validate.number_one_to_another', {
              one: '1',
              another: '168',
            })
          );
        }
        break;
      case '1':
        if (value.number > 9 && value.number < 10080) {
          callback();
        } else {
          callback(
            intl.get('validate.number_one_to_another', {
              one: '10',
              another: '10080',
            })
          );
        }
        break;
      default:
        callback('无效的输入!');
        break;
    }
  };

  // 组装变量可选的 checkbox 列表
  handleCheckboxList = vars => {
    if (vars.length > 0) {
      const checkboxList = vars.map(item => {
        return {
          label: item.desc,
          value: item.id,
        };
      });
      this.setState({
        checkboxList,
      });
    }
  };
  // 初始化变量选中项
  handleInitChecked = vars => {
    if (vars.length > 0) {
      const initChecked = vars.map(item => item.id);
      this.setState({
        initChecked,
      });
    }
  };

  render() {
    const { tag, plan } = this.props;
    const {
      loadingTestFtp,
      loadingSubmit,
      checkboxList,
      initChecked,
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 8 },
        lg: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
        md: { span: 16 },
        lg: { span: 10 },
      },
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 24, offset: 0 },
        md: { span: 16, offset: 8 },
        lg: { span: 10, offset: 7 },
      },
    };

    return (
      <div>
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          {/* 变量配置 */}
          <Divider>{intl.get('system.config_vars')}</Divider>
          {tag === 'edit' && (
            <Form.Item
              label={intl.get('system.last_execute_time')}
              {...formItemLayout}
            >
              <Ellipsis lines={1}>{plan.last_execute_time}</Ellipsis>
            </Form.Item>
          )}
          <Form.Item
            label={intl.get('system.loop')}
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('loops', {
              initialValue: { number: 1, unit: '3' },
              rules: [
                {
                  required: true,
                  message: intl.get('validate.required'),
                },
                { validator: this.checkLoops },
              ],
            })(<LoopInput />)}
          </Form.Item>
          <Form.Item
            label={intl.get('site.site')}
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('siteName', {
              rules: [
                {
                  required: true,
                  message: intl.get('validate.required'),
                },
              ],
            })(
              <Input.Search
                placeholder={intl.get('site.select_site')}
                onSearch={this.showSiteModal}
                enterButton
                disabled
              />
            )}
          </Form.Item>
          <Form.Item
            label={intl.get('system.group')}
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('group', {
              rules: [
                { required: true, message: intl.get('validate.required') },
              ],
            })(
              <Select>
                {/* <Select.Option value="none"> */}
                {/* {intl.get('system.has_no_grouping')} */}
                {/* </Select.Option> */}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get('system.varible_type')}
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('varType', {
              rules: [
                { required: true, message: intl.get('validate.required') },
              ],
            })(
              <Radio.Group>
                {/* 0:瞬时 1:统计 calc_mode:传的字段名 */}
                <Radio value="0">{intl.get('system.instantaneous')}</Radio>
                <Radio value="1">{intl.get('system.statistics')}</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            label={intl.get('system.variables_select')}
            colon={false}
            {...formItemLayout}
          >
            {getFieldDecorator('vars', {
              rules: [
                { required: true, message: intl.get('validate.required') },
              ],
            })(
              <VarCheckboxList
                checkboxList={checkboxList}
                initChecked={initChecked}
              />
            )}
          </Form.Item>

          {/* ftp服务器配置 */}
          <Divider>{intl.get('system.config_ftp')}</Divider>
          <Spin spinning={loadingTestFtp}>
            <Form.Item label="标题" colon={false} {...formItemLayout}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: intl.get('validate.required'),
                  },
                ],
              })(<Input placeholder="给目标起个名字" />)}
            </Form.Item>
            <Form.Item label="目标客户" colon={false} {...formItemLayout}>
              {getFieldDecorator('client')(
                <Input placeholder="请描述你服务的客户，内部客户直接 @姓名／工号" />
              )}
            </Form.Item>
            <Form.Item {...submitFormLayout}>
              <Button
                onClick={this.TestFtp}
                loading={loadingTestFtp}
                disabled={loadingSubmit}
              >
                {intl.get('common.test')}
              </Button>
            </Form.Item>
          </Spin>

          <Divider />
          <Form.Item {...submitFormLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadingSubmit}
              disabled={loadingTestFtp}
            >
              {intl.get('common.submit')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
