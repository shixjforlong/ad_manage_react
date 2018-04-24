import intl from 'react-intl-universal';
import React, { Component } from 'react';
import QRCode from 'qrcode-react';

import styles from './CloudApp.less';
import * as ihtools from '../../../utils/ihtools';
import appImage from '../../../assets/images/downloads/apple.png';
import iosicon from '../../../assets/images/downloads/ios-icon.png';
import androidicon from '../../../assets/images/downloads/android-icon.png';

export default class CloudApp extends Component {
  render() {
    const iosPath = `${ihtools.getWebsite()}/apps/DN4App/ios/app.html`;
    const androidPath = `${ihtools.getWebsite()}/apps/DN4App/android/DeviceNetwork.apk`;
    const ios = {
      value: iosPath,
      size: 140,
      bgColor: '#ffffff',
      fgColor: '#000',
      level: 'H',
      logo: iosicon,
      logoWidth: 45,
      logoHeight: 45,
    };
    const android = {
      value: androidPath,
      size: 140,
      bgColor: '#ffffff',
      fgColor: '#000',
      level: 'H',
      logo: androidicon,
      logoWidth: 45,
      logoHeight: 45,
    };
    return (
      <div style={{ height: 'calc(100% + 24px)', margin: '-24px -24px 0px' }} className={styles.touch_content}>
        <div style={{ width: '100%', padding: '50px 0px 20px 0px' }}>
          <div className={styles.my_container}>
            <div className={styles.flex_item1}>
              <p className={styles.touch_title}>
                {intl.get('download.scan_to_download')}
              </p>
              <div className={styles.info_container}>
                <div className={styles.flex_item_step}>
                  <QRCode {...ios} />
                </div>
                <div className={styles.flex_item_step}>
                  <QRCode {...android} />
                </div>
                <div style={{ width: '200px', textAlign: 'left' }}>
                  <ul>
                    <li className={styles.text_des}>{intl.get('download.real_time_data_overview')}</li>
                    <li className={styles.text_des}>{intl.get('download.centralized_monitoring')}</li>
                    <li className={styles.text_des}>{intl.get('download.real_time_alerts')}</li>
                    <li className={styles.text_des}>{intl.get('download.gis_location')}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.flex_item2}>
              <img style={{ width: '230px', height: '450px' }} src={appImage} alt={intl.get('common.picture')} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

