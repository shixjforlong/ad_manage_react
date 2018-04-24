import React from 'react';
import { Upload } from 'antd';
import { getToken } from '../../utils/request';

export default ({ onUpload, onChange, ...props }) => {
  const token = getToken();
  const defaultProps = {
    name: 'file',
    action: '/api/file/form',
    headers: {
      authorization: `Bearer ${token}`,
    },
    accept: '.bin',
    data(file) {
      return {
        filename: file.name,
      };
    },
    onChange({ file, fileList, event }) {
      if (file.status === 'done') {
        if (onUpload) {
          onUpload(file.response.result);
        }
      }

      if (onChange) {
        onChange({ file, fileList, event });
      }
    },
  };

  return <Upload {...defaultProps} {...props} />;
};
