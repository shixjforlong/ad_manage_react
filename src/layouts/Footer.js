import React from 'react';
import { Icon } from 'antd';
import config from '../utils/config';
import GlobalFooter from '../components/GlobalFooter';

export default props => {
  const copyright = (
    <React.Fragment>
      Copyright <Icon type="copyright" /> {config.copyright}
    </React.Fragment>
  );
  return <GlobalFooter copyright={copyright} {...props} />;
};
