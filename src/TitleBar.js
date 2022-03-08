import React from 'react';
import { connect } from 'react-redux';
import TitleBar from 'frameless-titlebar'
import { Popover } from 'antd';
import utils from '@/utils'
import action from '@/actions'
import logo from '@/assets/images/logo.png'

const  { validate, type, auth } = utils
const { login } = action
const content = (props) => {
  console.log(props)
  return (
    <div className='text-center'>
      <header className='py-2 cursor-default'>{validate.hidePhoneNum(type.toString(props.props.userInfo.profile.phone_num))}</header>
      <footer className='py-1 border-t font_12 cursor-default' onClick={props.loginOut}>退 出</footer>
    </div>
  )
}


class _TitleBar extends React.Component {
  loginOut = () => {
    this.props.handleLoginOut()
    auth.clearLocal()
    auth.removeToken()
  }


  render() {
    console.log( this.props )
    return (
      <TitleBar
        id='title_bar'
        iconSrc={logo}
      >
        {
          this.props.userInfo.profile.token && (
            <Popover title={null} content={content(this)} trigger='click'>
              <img style={{ width: '32px', height: '32px', borderRadius: '100%' }} src={this.props.userInfo.profile.avatar} alt=''/>
            </Popover>
          )
        }
      </TitleBar>
    )
  }
}


const mapDispatchToProps = (dispatch) => ({
  handleLoginOut: () => {
    dispatch(login.clearAll({}))
  }
});
const mapStateToProps = (state) => ({
  userInfo: state,
});

export default connect(mapStateToProps, mapDispatchToProps)(_TitleBar);
