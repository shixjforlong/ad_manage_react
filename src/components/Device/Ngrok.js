import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Button, message, Modal, Tooltip } from 'antd';
import { runTask } from '../../services/task';

export default class Ngrok extends PureComponent {
  static propTypes = {
    device: PropTypes.object.isRequired,
    proto: PropTypes.string,
    port: PropTypes.number,
    server: PropTypes.string,
  };

  static defaultProps = {
    proto: 'http',
    port: 80,
    server: 'ngrok.j3r0lin.com:4443',
  };

  state = {
    loading: false,
  };

  handleWebConsole = () => {
    const { proto, port, server, device } = this.props;
    const { _id: id, name } = device;
    this.setState({ loading: true });
    runTask({
      objectId: id,
      objectName: name,
      name: 'ngrok connect',
      type: '23',
      data: {
        server,
        proto,
        port,
      },
    })
      .then(({ result, error }) => {
        this.setState({ loading: false });
        if (error) {
          message.error(error);
        } else if (result.state === 3) {
          const { data: { response } } = result;
          const w = window.open();
          if (w === null) {
            Modal.warning({
              content: (
                <p>
                  failed to open new window, please click
                  <a href={response} target="_blank">
                    {' '}
                    here
                  </a>{' '}
                  to visit.
                </p>
              ),
            });
          } else {
            setTimeout(() => {
              w.location = response;
            }, 200);
          }
        } else {
          message.error(result.error);
        }
      })
      .catch(() => this.setState({ loading: false }));
  };

  render() {
    const { children, device } = this.props;
    const { model, online = 0 } = device;
    const { loading } = this.state;
    const disabled = loading || online === 0 || !model.startsWith('IR9');
    const props = { disabled, onClick: this.handleWebConsole, loading };

    if (React.Children.count(children) === 0) {
      return (
        <Tooltip title="web管理">
          <Button
            shape="circle"
            loading={loading}
            icon="desktop"
            size="small"
            {...props}
          />
        </Tooltip>
      );
    } else {
      return React.cloneElement(React.Children.only(children), props);
    }
  }
}
