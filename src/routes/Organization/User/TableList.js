import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Card, message, Tooltip } from 'antd';
import { generate as shortid } from 'shortid';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from './TableList.less';
import UserTable from '../../../components/UserTable';
import AddUser from '../../../components/User/AddUser';
import ResetPassword from '../../../components/User/ResetPassword';

@connect(({ users, roles, loading }) => ({
  users,
  roles,
  loading: loading.effects['users/fetchUsers'],
}))
export default class TableList extends PureComponent {
  state = {
    modalVisible: false,
    modalResetVisible: false,
    uid: undefined,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'users/fetchUsers',
    });
    this.props.dispatch({
      type: 'roles/fetchRoles',
    });
  }

  handleStandardTableChange = () => {
    this.fetchUsers();
  };

  fetchUsers = () => {
    this.props.dispatch({ type: 'users/fetchUsers' });
  };

  handleRemove = uid => {
    this.props.dispatch({
      type: 'users/removeUser',
      payload: {
        id: uid,
        onSuccess: () => {
          message.success('删除成功');
          this.fetchUsers({});
        },
      },
    });
  };

  handleAddCancel = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = values => {
    this.props.dispatch({
      type: 'users/addUser',
      payload: {
        ...values,
        onSuccess: () => {
          message.success('添加成功');
          this.setState({
            modalVisible: false,
          });
          this.fetchUsers({});
        },
      },
    });
  };

  handleUpdate = (uid, values) => {
    this.props.dispatch({
      type: 'users/updateUser',
      id: uid,
      payload: {
        ...values,
        onSuccess: () => {
          message.success('修改成功');
          this.fetchUsers({});
        },
      },
    });
  };

  handleCaptchaUpdate = () => {
    this.setState({ pid: shortid() });
  };

  handleResetCancel = (flag, id) => {
    this.setState({
      modalResetVisible: !!flag,
      uid: id,
    });
  };

  handleReset = values => {
    this.props.dispatch({
      type: 'users/resetPassword',
      id: this.state.uid,
      payload: {
        ...values,
        picId: this.state.pid,
        onSuccess: () => {
          message.success('重置密码成功');
          this.setState({
            modalResetVisible: false,
          });
        },
        onFail: this.handleCaptchaUpdate,
      },
    });
  };

  lockUser = uid => {
    this.props.dispatch({
      type: 'users/lock',
      payload: {
        id: uid,
        onSuccess: () => {
          message.success('成功锁定');
          this.fetchUsers({});
        },
      },
    });
  };

  unlockUser = uid => {
    this.props.dispatch({
      type: 'users/unlock',
      payload: {
        id: uid,
        onSuccess: () => {
          message.success('解锁成功');
          this.fetchUsers({});
        },
      },
    });
  };

  render() {
    const { users, roles, loading } = this.props;
    const { list, status } = users;
    const { modalVisible, modalResetVisible } = this.state;
    const tableProps = { loading, list };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <Tooltip title="添加用户" placement="left">
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
            <UserTable
              {...tableProps}
              onChange={this.handleStandardTableChange}
              onRemove={this.handleRemove}
              resetPassword={this.handleResetCancel}
              lock={this.lockUser}
              unlock={this.unlockUser}
            />
          </div>
        </Card>
        <AddUser
          visible={modalVisible}
          onAdd={this.handleAdd}
          onCancel={this.handleAddCancel}
          roles={roles.list}
          status={status}
        />
        <ResetPassword
          visible={modalResetVisible}
          onReset={this.handleReset}
          onCancel={this.handleResetCancel}
          captchaUpdate={this.handleCaptchaUpdate}
          status={status}
          pid={this.state.pid}
        />
      </PageHeaderLayout>
    );
  }
}
