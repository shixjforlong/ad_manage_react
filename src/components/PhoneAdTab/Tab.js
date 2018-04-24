import React, { Component } from 'react';
import { Tabs,Form,Input } from 'antd';
const TabPane = Tabs.TabPane;

import AdPayPage from '../../components/AdPayPage/Page';
import AdPaySuccessPage from '../../components/AdPayPage/PageSuccess'

export default class Tab extends Component {
      constructor(props) {
        super(props);
        this.state = {
          mediaInfo:[]
        }
      }

     onConfirmTab1= (mediaInfo) => {
         this.state.mediaInfo[0] = mediaInfo;
         const { onConfirmTab } = this.props;
         onConfirmTab(this.state.mediaInfo);
     }

     onConfirmTab2= (mediaInfo) => {
         this.state.mediaInfo[1] = mediaInfo;
         const { onConfirmTab } = this.props;
         onConfirmTab(this.state.mediaInfo);
     }


     render() {
       const itemLayout = {
         labelCol: { span: 5 },
         wrapperCol: { span: 15 },
       };

        return (
          <div className="card-container">
            <Tabs
              type="card"
              size="small"
              tabBarStyle={{ marginBottom: 24 }}
              animated={{ inkBar: true, tabPane: false }}
              defaultActiveKey="1"
              onChange={this.tabChange}
            >
              <TabPane tab="支付页面" key="1">
                 <AdPayPage
                   onConfirmTab = {this.onConfirmTab1}
                 />
              </TabPane>

              <TabPane tab="支付成功(广告图片)" key="2">
                 <AdPaySuccessPage
                  onConfirmTab = {this.onConfirmTab2}
                 />
              </TabPane>
            </Tabs>
          </div>
        )
    }

}
