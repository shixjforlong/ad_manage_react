import React, { PureComponent } from 'react';
import { Form, Input, Modal, Select, Upload, Button, Icon} from 'antd';
import moment from 'moment';
import intl from 'react-intl-universal';
import OSS from 'ali-oss';
const { confirm } = Modal;

@Form.create()
export default class MediaManage extends PureComponent {
  constructor(props) {
    super(props);

    let oldImage=[{
      uid: "0001",
      name: props.data.fileName,
      status: "200",
      type: "image",
      result: props.data.fileName,
      url: props.data.imageCdnpath,
    }];
    this.state = {
      preview: "",
      imageList:[],
      token: {},
      visiblePreview: false,
      md5:"",
      length:"",
    }
    this.state.imageList = oldImage;
  }

  //点击取消按钮
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  };

  //点击保存时的提示框
  showConfirm = () => {
    this.props.form.validateFields((err, { ...values }) => {
      const { data: { _id: id }, onCancel, onConfirm } = this.props;
      if (err) return;
      const comment  = { ...values };
      const fileInfo = {
        mediaName:comment.mediaName,
        fileName:this.state.imageList[0].name,
        md5:this.state.md5,
        length:this.state.length,
        imageCdnpath:this.state.imageList[0].url,
        mediaType:"1_",
        fileId:"",
        fileSource:"2",
      };
      confirm({
        title: intl.get('common.notice'),
        content: intl.get('common.confirmupdate'),
        onOk() {
          onConfirm(id, fileInfo);
          onCancel();
        },
      });
    });
  };

  //预览图片
  handlePreview = (file) => {
    this.setState({
      preview: file.url || file.thumbUrl,
      visiblePreview: true,
    });
  }
  //取消预览图片
  handleCancelPreview = () => this.setState({ visiblePreview: false })

  componentDidMount(){

  }

  render() {
    const { visible, data ,dispatch} = this.props;
    const { getFieldDecorator } = this.props.form;
    const itemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };

    const { preview, imageList,visiblePreview} = this.state;

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

    return (
      <Modal
        title={intl.get('ad.media.detail')}
        style={{ top: 20 }}
        visible={visible}
        onOk={this.showConfirm.bind(this)}
        onCancel={this.handleCancel}
      >
        <Form onSubmit={this.handleComment}>
          <Form.Item label="素材名称" {...itemLayout}>
            {getFieldDecorator('mediaName', { initialValue: data.mediaName })(
              <Input  />
            )}
          </Form.Item>
          <Form.Item label="上传图片" {...itemLayout}>
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
            <img alt="example" style={{ width: '100%' }} src={data.imageCdnpath} />
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
}
const client = (self) => {
    let accessKey = sessionStorage.getItem('accessKey');
    let accessid = sessionStorage.getItem('accessid');
    let region = sessionStorage.getItem('endpoint');
    let bucket = sessionStorage.getItem('bucket');
    return new OSS.Wrapper({
      accessKeyId: accessid,
      accessKeySecret: accessKey,
      region: region.split(".")[0],
      bucket: bucket,
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
