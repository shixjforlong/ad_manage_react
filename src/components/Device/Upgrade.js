import React from 'react';
import { Button, Form, Icon, message } from 'antd';
import Upload from '../Upload';
import styles from './Upgrade.less';
import { removeFile } from '../../services/file';

@Form.create()
export default class Upgrade extends React.PureComponent {
  state = {
    file: null,
  };

  render() {
    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    const uploadProps = {
      fileList: this.state.file ? [this.state.file] : [],
      onChange: ({ file }) => {
        this.setState({ file });
        if (file.status === 'done') {
          message.success(`${file.name} file uploaded successfully`);
        } else if (file.status === 'error') {
          message.error(`${file.name} file upload failed.`);
        }
      },
      onRemove: ({ response }) => {
        const { _id: id } = response.result;
        this.setState({ file: null }, () => removeFile({ id }));
      },
    };

    return (
      <Form className={styles.form}>
        <Form.Item {...itemLayout}>
          <Upload {...uploadProps}>
            <Button type="dashed">
              <Icon type="upload" /> Click to Upload
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    );
  }
}
