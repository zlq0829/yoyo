import React from 'react';
import { Form, Input, message } from 'antd';
import { connect } from 'react-redux';
import UTILS from '@/utils';
import API from '@/services';
import phoneIcon from '@/assets/icons/phone_icon.png';
import pasIcon from '@/assets/icons/pas_icon.png';

class PhoneLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      code: '',
    };
  }

  // 表单事件
  onFinish = async (values) => {
    const { phone, code } = this.state
    if(!UTILS.validate.validPhone(phone)) {
      // message.error('手机号码格式不正确，请重新输入')
      return false
    }

    let response = null
    let data = {
      phone_num: phone,
      code
    }
    try {
      response = await API.loginApi.loginByValidCode(data)
    } catch (error) {
      message.error((error && error.message) || '登陆失败')
      return false
    }
  }

  getValidCode = async() => {
    if(!this.state.phone) { return false }

    let data = {
      phone_num: this.state.phone,
      sms_use: 'login'
    }
    try {
      await API.loginApi.getValidCode(data)
    } catch (error) {
      message.warn((error && error.message) || '获取验证码失败')
      return
    }
  }

  render() {
    // console.log( this.props )
    return (
      <div className='login_input w-80'>
        <Form colon={false} name='phoneForm' requiredMark={false} >
          {/* 手机号码框 */}
          <div className='form_item mb-7'>
            <Form.Item
              name='phoneNum'
              label={<img src={phoneIcon} alt='' />}
            >
              <div className='phone_input border-b'>
                <Input
                  value={this.state.phone}
                  maxLength={11}
                  placeholder='请输入手机号码'
                  bordered={false}
                  onChange={e =>{
                    // this.setState({phone: e.target.value})
                  }}
                  suffix={<button className='_button py-1 px-2.5'>获取验证码</button>}
                />
              </div>
            </Form.Item>
          </div>

          {/* 验证码 */}
          <div className='form_item mb-7'>
            <Form.Item
              name='password'
              label={<img src={pasIcon} alt='' />}
            >
              <div className='phone_input border-b'>
                <Input
                  value={this.state.code}
                  placeholder='请输入验证码'
                  bordered={false}
                  maxLength={6}
                  onChange={e =>{
                    // this.setState({code: e.target.value})
                  }}
                />
              </div>
            </Form.Item>
          </div>

          <div className='warm_text text-xs text-gray-400 text-center mb-7'>
            *未注册手机将默认注册新账户
          </div>

          {/* 按钮 */}
          <div className='w-full' onClick={this.onFinish}>
            <button className='ant-button w-full rounded-full' type='button'>登 录</button>
          </div>
        </Form>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    handleAddProfile(profile) {
      console.log(profile, 'profile')
      // dispatch(ACTIONS.profileAction.addProfile(profile))
    }
  }
}
export default connect(
  mapDispatchToProps
)(PhoneLogin)
