import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Modal, Select, Upload, Button, Icon} from 'antd';
import { debounce } from 'lodash/function';

import AlertError from '../../components/AlertError';
import { modelOfSN } from '../../utils/utils';
import OSS from 'ali-oss';


@Form.create()
export default class AddMedia extends PureComponent {

  static defaultProps = {
    error: undefined,
  };

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    error: PropTypes.object,
    onAdd: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  state = {
    preview: "",
    imageList: [],
    token: {},
    visiblePreview: false,
    md5:"",
    length:"",
  }

  handleAdd = () => {
    const { onAdd } = this.props;
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        console.log(values);
        const fileInfo = {
          mediaName:values.mediaName,
          fileName:this.state.imageList[0].name,
          md5:this.state.md5,
          length:this.state.length,
          imageCdnpath:this.state.imageList[0].url,
          mediaType:"1_",
          fileId:"",
          fileSource:"2",
        };
        console.log(fileInfo);
        onAdd(fileInfo);
      }
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  componentDidMount(){
     //向后台服务器请求获取token.
     this.props.dispatch({
       type: 'media/getOSSToken',
       payload: {
         verbose:100,
         onSuccess: (result) => {
             this.setState({token: result})
         },
       },
     });
  }

  render() {
    const { visible,error,form,dispatch } = this.props;
    const { getFieldDecorator } = form;

    const { preview, imageList,visiblePreview} = this.state
    console.log(imageList);
    const propsFile = {
      onRemove: (file) => {
        this.setState(({ imageList }) => {
          const index = imageList.indexOf(file);
          const newFileList = imageList.slice();
          newFileList.splice(index, 1);
          return {imageList: newFileList};
        });
      },
      beforeUpload: this.beforeUpload,
      fileList: this.state.imageList,
      onPreview: this.handlePreview,
      accept: "image/*",
      listType: "picture-card"
    };

    const itemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 15 },
    };

    return (
      <Modal
        title="新增素材"
        visible={visible}
        onOk={this.handleAdd}
        onCancel={this.handleCancel}
      >
      <Form>
        {error && <AlertError error={error} />}

          <Form.Item {...itemLayout} label="素材名称" hasFeedback>
            {getFieldDecorator('mediaName', {
              rules: [
                {
                  required: true,
                  message: '请输入素材名称！',
                }
              ],
            })(<Input placeholder="请输入素材名称" />)}
          </Form.Item>

          <Form.Item {...itemLayout} label="上传图片" hasFeedback>
            {getFieldDecorator('fileName', {
              rules: [
                {
                  required: true,
                  message: '请选择要上传的图片！',
                }
              ],
            })(<Upload {...propsFile}>
                <div>
                  <Icon type="plus" />
                  <div className="ant-upload-text">Upload</div>
                </div>

	            </Upload>

              )}
          </Form.Item>

        </Form>
        <Modal visible={visiblePreview} footer={null} onCancel={this.handleCancelPreview}>
            <img alt="example" style={{ width: '100%' }} src={preview} />
        </Modal>
      </Modal>

    );
  }

  beforeUpload = file => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      UploadToOss(this, file).then(data => {
        console.log(data);
        this.setState(({ imageList }) => ({
          imageList: [{
            uid: file.uid,
            name: file.name,
            status: file.status,
            type: file.type,
            result: data.name,
            url: data.res.requestUrls[0]
          }],
        }));
      })
    }
    return false;
  }
  //预览图片
  handlePreview = (file) => {
    console.log(file);
    this.setState({
      preview: file.url || file.thumbUrl,
      visiblePreview: true,
    });
  }
  //取消预览图片
  handleCancelPreview = () => this.setState({ visiblePreview: false })
}

const client = (self) => {
  const {token} = self.state;
  console.log(token);
  return new OSS.Wrapper({
    accessKeyId: token.accessid,
    accessKeySecret: token.accessKey,
    region: token.endpoint.split(".")[0],
    bucket: token.bucket,
  });
}

const uploadPath = (file) => {
  return `${file.name.split(".")[0]}-${file.lastModified}.${file.type.split("/")[1]}`
}

const UploadToOss = (self, file) => {
  const url = uploadPath(file)
  return new Promise((resolve, reject) => {
    client(self).multipartUpload(url, file).then(data => {
      //获取图片的大小和md5值
      const fileName = data.name;
      self.props.dispatch({
        type: 'media/getObjectInfo',
        payload: {
          fileName:fileName,
          onSuccess: (result) => {
              console.log(result);
              self.setState({
                md5: result.etag,
                length:result.size
              })
          },
        },
      });
      resolve(data);
    }).catch(error => {
      reject(error)
    })
  })
}
