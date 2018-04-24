import React from 'react';
import intl from 'react-intl-universal';
import { isUrl } from '../utils/utils';
import BizIcon from '../components/BizIcon';

const Icon = ({ type, ...rest }) => (
  <BizIcon type={type} {...rest} className="anticon" />
);

const menuData = [
  {
    // 概览
    name: 'home.monitor',
    icon: <Icon type="home" />,
    path: 'home',
  },
  {
    // 广告管理
    name: 'ad.ad_phone_management',
    path: 'ad',
    icon: <Icon type="router" />,
    children: [
      {
        name: 'ad.mediaManagement',  //媒体库
        path: 'media',
      },
      {
        name: 'ad.phoneManagement',   //手机广告管理
        path: 'phoneAd',
      },
      {
        name: 'ad.phonePublish',   //手机广告发布
        path: 'phonePublish',
      }
    ],
  },
  /*{
    // 点位
    name: 'site.site_management',
    path: 'site',
    icon: <Icon type="router" />,
    children: [
      {
        name: 'site.area.area',
        path: 'area',
      },
      {
        name: 'site.line',
        path: 'line',
      },
      {
        name: 'site.site',
        path: 'site',
      },
    ],
  },*/
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      name: intl.get(item.name).defaultMessage(item.name),
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
