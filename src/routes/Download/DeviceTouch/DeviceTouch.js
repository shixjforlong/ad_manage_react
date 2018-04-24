import intl from 'react-intl-universal';
import React, { Component } from 'react';
import { Button } from 'antd';

import styles from './DeviceTouch.less';
import { filedownload } from '../../../utils/filedownload';
import * as ihtools from '../../../utils/ihtools';
import DeviceTouchStep from '../../../components/Download';
import pcImage from '../../../assets/images/downloads/pc-ds.png';
import arrowImage from '../../../assets/images/downloads/devicetouch-3.png';
import devicetouch2 from '../../../assets/images/downloads/devicetouch-2.png';
import devicetouch1 from '../../../assets/images/downloads/devicetouch-1.png';
import devicetouch4 from '../../../assets/images/downloads/devicetouch-4.png';

export default class DeviceTouch extends Component {
  handleDownload = () => {
    const url = `${ihtools.getWebsite()}/apps/DN4App/dt/DeviceTouch.zip`;
    // const url = 'http://10.5.16.208/apps/DN4App/dt/DeviceTouch.zip';
    filedownload(null, `deviceTouch-${(new Date()).getTime()}`, null, url);
  };

  render() {
    const items = [
      {
        type: 'item',
        itemImage: devicetouch2,
        text: 'download.download_dt_client_install',
        button: <Button type="primary" icon="download" size="large" onClick={this.handleDownload}>{intl.get('download.download')}</Button>,
      }, {
        type: 'arrow',
        itemImage: arrowImage,
      }, {
        type: 'item',
        itemImage: devicetouch1,
        text: 'download.login_dt_client',
      }, {
        type: 'arrow',
        itemImage: arrowImage,
      }, {
        type: 'item',
        itemImage: devicetouch4,
        text: 'download.create_channel_success',
      },
    ];
    return (
      <div style={{ height: 'calc(100% + 24px)', margin: '-24px -24px 0px' }} className={styles.touch_content}>
        <div style={{ width: '100%', padding: '50px 0px 20px 0px' }}>
          <div className={styles.my_container}>
            <div className={styles.flex_item1}>
              <p className={styles.touch_title}>
                {intl.get('download.how_to_maintain_channel')}
              </p>
              <DeviceTouchStep items={items} />
            </div>
            <div className={styles.flex_item2}>
              <img style={{ width: '350px' }} src={pcImage} alt={intl.get('common.picture')} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

