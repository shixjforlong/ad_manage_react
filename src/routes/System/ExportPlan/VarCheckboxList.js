import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Checkbox } from 'antd';

export default class VarCheckboxList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checkboxList: [],
      checked: [],
      indeterminate: false,
      checkAll: false,
      isFirstLoad: true,
    };
  }
  componentWillReceiveProps(nextProps) {
    const { checkboxList = [], initChecked = [] } = nextProps;
    let indeterminate = false;
    let checkAll = false;
    let { checked, isFirstLoad } = this.state; // 保证组件 state.initChecked 只能被初始化一次
    if (isFirstLoad) {
      // 第一次赋值
      checked = initChecked;
      isFirstLoad = false;
      if (checkboxList.length > 0) {
        if (
          initChecked.length > 0 &&
          initChecked.length < checkboxList.length
        ) {
          indeterminate = true;
        }
        if (checkboxList.length === initChecked.length) {
          checkAll = true;
        }
      }
    } else {
      indeterminate = false;
      checkAll = false;
      checked = [];
    }
    this.setState({
      checkboxList,
      indeterminate,
      checkAll,
      checked,
      isFirstLoad,
    });
  }

  onChange = checked => {
    const { checkboxList } = this.state;
    this.setState({
      checked,
      indeterminate: !!checked.length && checked.length < checkboxList.length,
      checkAll: checked.length === checkboxList.length,
    });
  };
  onCheckAllChange = e => {
    const { checkboxList } = this.state;
    this.setState({
      checked: e.target.checked ? checkboxList.map(item => item.value) : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };

  render() {
    const { checked, checkboxList, indeterminate, checkAll } = this.state;
    return (
      <div className="my-checkbox-group-wrap">
        <div>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAllChange}
            checked={checkAll}
          >
            {intl.get('common.check_all')}
          </Checkbox>
        </div>
        <div>
          <Checkbox.Group
            options={checkboxList}
            value={checked}
            onChange={this.onChange}
          />
        </div>
      </div>
    );
  }
}
