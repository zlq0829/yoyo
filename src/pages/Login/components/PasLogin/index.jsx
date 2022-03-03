import React from 'react';
import { Form, Input, Checkbox, message } from 'antd';
import UTILS from '@/utils';
import API from '@/services';
import userIcon from '@/assets/icons/user_icon.png';
import eyeIcon from '@/assets/icons/eye_icon.png';

const { auth } = UTILS
class PasLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: (auth.getLocal('accountCache') &&  JSON.parse(auth.getLocal('accountCache')).account)  || '',
      password: (auth.getLocal('accountCache') && JSON.parse(auth.getLocal('accountCache')).password) || '',
      checked: true,
      infoText: '',
    };
  }

  // 表单事件
  onFinish = async () => {
    const { account, password, checked } = this.state
    if(!UTILS.validate.validPhone(account)) {
      message.error('账号格式不正确，请重新输入')
      return false
    }

    // 勾选☑️记住密码，本地保存
    if(checked) {
      auth.setLocal('accountCache', JSON.stringify({account, password}))
    }

    let response = null
    let data = {
      phone_num: account,
      password
    }
    try {
      response = await API.loginApi.loginByPassword(data)
      console.log(response.data)
      this.props.handleKeepAuth(response.data.token)
    } catch (error) {
      message.error((error && error.message) || '登陆失败')
      return false
    }
  }

  render() {
    return(
      <div className="login_input w-80">
        <Form colon={false} name='pasForm' requiredMark={false}>
          {/* 账号框 */}
          <div className='form_item mb-7'>
            <Form.Item
              name='phoneNum'
              label={<img src={userIcon} alt='' />}
            >
              <div className='phone_input border-b'>
                <Input
                  value={this.state.account}
                  maxLength={11}
                  placeholder='请输入账号'
                  bordered={false}
                  onChange={e => {this.setState({account: e.target.value})}}
                />
              </div>
            </Form.Item>
          </div>

          {/* 密码框 */}
          <div className='form_item mb-7'>
            <Form.Item
              name='code'
              label={<img src={eyeIcon} alt='' />}
            >
              <div className='phone_input border-b'>
                <Input.Password
                  value={this.state.password}
                  placeholder='请输入密码'
                  bordered={false}
                  maxLength={6}
                  onChange={e => {this.setState({password: e.target.value})}}
                />
              </div>
            </Form.Item>
          </div>

          {/* 单选按钮 && 忘记密码 */}
          <div className='warm_texttext-gray-400 mb-7 flex justify-between items-center'>
            <div>
              <Checkbox defaultChecked={this.state.checked} onChange={(e)=>{this.setState({checked: e.target.checked})}}>记住密码</Checkbox>
            </div>
            <div className='font_14 color-FF8462 cursor-pointer'>忘记密码？</div>
          </div>

          {/* 按钮 */}
          <div className='w-full' onClick={this.onFinish}>
            <button className='ant-button w-full rounded-full' type='button'>登 录</button>
          </div>
        </Form>
      </div>
    )
  }
}
export default PasLogin;
