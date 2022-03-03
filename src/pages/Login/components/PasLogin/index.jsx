// import React, { useEffect } from 'react';
// import { Form, Input, Button, Checkbox } from 'antd';
// import userIcon from '@/assets/icons/user_icon.png';
// import eyeIcon from '@/assets/icons/eye_icon.png';
// import API from '@/services';
// import '../index.less';

// const PasLogin = (props) => {
//   const { addProfile } = props
//   const [form] = Form.useForm();
//   const accountRef = React.useRef('account')
//   const pasRef = React.useRef('password')
//   const [checked, setChecked] = React.useState(false)

//   // 表单验证
//   const formItemRules = {
//     acountRules: [
//       {
//         required: true,
//         message: '请输入账号',
//       },
//     ],
//     pasRules: [
//       {
//         required: true,
//         message: '请输入密码',
//       },
//     ],
//   };

//   // 根据选择，缓存账号密码
//   useEffect(()=> {
//     const data = {
//       account: accountRef.current.state.value,
//       password: pasRef.current.state.value
//     }
//     if(checked && data.account && data.password) {
//       localStorage.setItem('accountCache', JSON.stringify(data))
//     }

//   },[checked])

//   // 登录处理事件
//   const handleLogin = async (values) => {
//     let response = null
//     const data = {
//       phone_num: values.account,
//       pwd: values.password
//     }
//     try {
//       response = await API.loginApi.loginByPassword(data)
//     } catch (error) {
//       return false
//     }

//     // 个人信息缓存到store中
//     console.log(response, 'phonelogin')
//     addProfile(response)
//   }

//   // 表单事件
//   const onFininsh = (values) => {
//     // 账号密码登录的方式不需要判断输入的是否是手机号,后期如果做开放式的,账号可能就不一定是手机号码,所以这里直接做登录,后端再做校验
//     handleLogin(values)
//   };

//   return (
//     <div className='phone_login w-80'>
//       <Form colon={false} requiredMark={false} onFinish={onFininsh} form={form} name='pasForm'>
//         <div className='form_item'>
//           <Form.Item name='account' rules={formItemRules.acountRules} label={<img src={userIcon} alt='' />}>
//             <div className='border-b'>
//               <Input placeholder='请输入账号' bordered={false} maxLength={11} ref={accountRef}/>
//             </div>
//           </Form.Item>
//         </div>

//         <div className='form_item'>
//           <Form.Item name='password' rules={formItemRules.pasRules} label={<img src={eyeIcon} alt='' />}>
//             <div className='border-b'>
//               <Input.Password placeholder='请输入密码' bordered={false} ref={pasRef}/>
//             </div>
//           </Form.Item>
//         </div>

//         <div className='flex justify-between'>
//           <Form.Item className='remeber_flex'>
//             <Checkbox defaultChecked={checked} onChange={(e)=>{setChecked(e.target.checked)}}>记住密码</Checkbox>
//           </Form.Item>
//         </div>

//         <Form.Item>
//           <Button
//             className='ant-button'
//             size='large'
//             shape='round'
//             htmlType='submit'
//             block
//           >
//             登录
//           </Button>
//         </Form.Item>
//       </Form>
//     </div>
//   );
// };

// export default PasLogin;
import React from 'react';
import { Form, Input, Button, Checkbox, message } from 'antd';
import UTILS from '@/utils';
import API from '@/services';
import userIcon from '@/assets/icons/user_icon.png';
import eyeIcon from '@/assets/icons/eye_icon.png';

class PasLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: (UTILS.localCache.getLocal('accountCache') &&  JSON.parse(UTILS.localCache.getLocal('accountCache')).account)  || '',
      password: (UTILS.localCache.getLocal('accountCache') && JSON.parse(UTILS.localCache.getLocal('accountCache')).password) || '',
      checked: true,
      // 表单校验规则
      formItemRules: {
        accountRules: [
          {
            required: true,
            message: '请输入账号',
          },
        ],
        pasRules: [
          {
            required: true,
            message: '请输入验证码',
          },
        ],
      },
    };
  }

  // 表单事件
  onFinish = async (values) => {
    console.log(values)
    const { phoneNum } = values
    if(!UTILS.validate.validPhone(phoneNum)) {
      message.error('手机号码格式不正确，请重新输入')
      return false
    }

    // 勾选☑️记住密码，本地保存
    console.log(this.state.checked)
    if(this.state.checked) {
      UTILS.localCache.setLocal('accountCache', JSON.stringify({account: this.state.account, password: this.state.password}))
    }

    let response = null
    let data = {
      phoneNum: this.state.account,
      password: this.state.password
    }
    try {
      response = await API.loginApi.loginByPassword(data)
    } catch (error) {
      message.error((error && error.message) || '登陆失败')
      return false
    }
  }
  render() {
    return(
      <div className="login_input w-80">
        <Form
          colon={false}
          name='phoneForm'
          requiredMark={false}
          onFinish={this.onFinish}
        >
          <div className='form_item mb-4'>
            <Form.Item
              name='phoneNum'
              label={<img src={userIcon} alt='' />}
              rules={this.state.formItemRules.accountRules}
            >
              <div className='phone_input border-b'>
                <Input
                  maxLength={11}
                  placeholder='请输入账号'
                  bordered={false}
                />
              </div>
            </Form.Item>
          </div>

          <div className='form_item mb-4'>
            <Form.Item
              name='code'
              label={<img src={eyeIcon} alt='' />}
              rules={this.state.formItemRules.pasRules}
            >
              <div className='phone_input border-b'>
                <Input.Password
                  placeholder='请输入密码'
                  bordered={false}
                  maxLength={6}
                />
              </div>
            </Form.Item>
          </div>

          <div className='warm_texttext-gray-400 mb-7 flex justify-between items-center'>
            <div>
              <Checkbox defaultChecked={this.state.checked} onChange={(e)=>{this.setState({checked: e.target.checked})}}>记住密码</Checkbox>
            </div>
            <div className='font_14 color-FF8462 cursor-pointer'>忘记密码？</div>
          </div>

          <Form.Item>
            <Button
              className='ant-button'
              size='large'
              shape='round'
              htmlType='submit'
              block
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
export default PasLogin;
