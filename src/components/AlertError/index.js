import React from 'react';
import { Alert } from 'antd';
import { errorMessage } from '../../utils/utils';

export default ({ error }) => {
  return (
    <div>
      {error && (
        <Alert
          style={{ marginBottom: 24 }}
          message={errorMessage(error)}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};
