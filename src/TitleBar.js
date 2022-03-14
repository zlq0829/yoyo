import React, { useEffect, useState } from 'react';
import {withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import TitleBar from 'frameless-titlebar';
import Popover from '@/components/Popover';
import utils from '@/utils';
import action from '@/actions';
import logo from '@/assets/images/logo.png';


const { auth, main } = utils;
const { login } = action;

// 读取Electro
const getCurrentWindow = () => {
  if (window.isElectron) {
    const remote = main.getElectronModule('remote');
    if (remote) {
      return remote.getCurrentWindow();
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const currentWindow = getCurrentWindow();

const _TitleBar = (props) => {
  // 管理窗口状态
  const [maximized, setMaximized] = useState(currentWindow?.isMaximized());

  // 登出，同时清除localStorage、cookie、redux
  const loginOut = () => {
    props.handleLoginOut();
    auth.removeLocal('userInfo');
    auth.removeToken();
    props.history.push('/login')
  };

  // 双击和点击控制窗口按钮来控制窗口
  const handleMaximize = () => {
    setMaximized((maximized) => !maximized);
  };

  useEffect(() => {
    if (maximized) {
      currentWindow?.maximize();
    } else {
      currentWindow?.unmaximize();
    }
  }, [maximized]);

  return (
    <TitleBar
      id="title_bar"
      iconSrc={logo}
      currentWindow={currentWindow}
      platform={process.platform}
      onClose={() => currentWindow?.close()}
      onMinimize={() => currentWindow?.minimize()}
      onMaximize={handleMaximize}
      onDoubleClick={handleMaximize}
      maximized={maximized}
    >
      {props.userInfo.profile.token && (
        <Popover profile={props.userInfo} loginOut={loginOut} />
      )}
    </TitleBar>
  );
};

const mapDispatchToProps = (dispatch) => ({
  handleLoginOut: () => {
    dispatch(login.clearAll({}));
  },
});
const mapStateToProps = (state) => ({
  userInfo: state,
});

export default connect(mapStateToProps, mapDispatchToProps)(_TitleBar);
