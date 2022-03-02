// import React from 'react';
// import { Form, Input, Button, message } from 'antd';

// import UTILS from '@/utils';
// import API from '@/services';
// import '../index.less';

// const PhoneLogin = (props) => {
//   const { addProfile } = props;
//   const [form] = Form.useForm();
//   const phoneRef = React.useRef('phone')

//   // 表单校验规则
//   const formItemRules = {
//     phoneRules: [
//       {
//         required: true,
//         message: '请输入手机号码',
//       },
//     ],
//     pasRules: [
//       {
//         required: true,
//         message: '请输入验证码',
//       },
//     ],
//   };

//   // 获取验证码
//   const getValidCode = async () => {
//     const { value } = phoneRef.current.state
//     if(!value) { return }

//     const data = {
//       phone_num: value,
//       sms_use: 'login'
//     }
//     try {
//       await API.loginApi.getValidCode(data)
//     } catch (error) {
//       message.error('获取验证码失败')
//     }
//   }

//   // 登录处理事件
//   const handleLogin = (values) => {
//     let response = null
//     const data = {
//       phone_num: values.phoneNum,
//       code: values.code
//     }
//     try {
//       response = API.loginApi.loginByValidCode(data)
//     } catch (error) {
//       message.error('登录失败')
//       return
//     }

//     // 这里需要将内容存到store中,暂时没写
//     console.log(response, 'phonelogin')
//     addProfile(response)

//   }

//   // 表单事件
//   const onFinish = (values) => {
//     const { phoneNum } = values
//     if(!UTILS.validate.validPhone(phoneNum)) {
//       message.error('手机号码格式不正确，请重新输入')
//       return false
//     }
//     handleLogin(values)
//   };

//   return (
//     <div className='phone_login w-80'>
//       <Form colon={false} requiredMark={false} onFinish={onFinish} form={form} name='phoneForm'>
//         <div className='form_item'>
//           <Form.Item
//             name='phoneNum'
//             label={<img src={phoneIcon} alt='' />}
//             rules={formItemRules.phoneRules}
//           >
//             <div className='phone_input border-b'>
//               <Input
//                 ref={phoneRef}
//                 placeholder='请输入手机号码'
//                 bordered={false}
//                 maxLength={11}
//                 suffix={<Button onClick={getValidCode} className='rounded-full'>获取验证码</Button>}
//               />
//             </div>
//           </Form.Item>
//         </div>

//         <div className='form_item'>
//           <Form.Item
//             name='code'
//             label={<img src={pasIcon} alt='' />}
//             rules={formItemRules.pasRules}
//           >
//             <div className='phone_input border-b'>
//               <Input
//                 placeholder='请输入验证码'
//                 bordered={false}
//                 maxLength={6}
//               />
//             </div>
//           </Form.Item>
//         </div>

//         <div className='warm_text text-xs text-gray-400 text-center mb-7'>
//           *未注册手机将默认注册新账户
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

// export default PhoneLogin;

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import UTILS from '@/utils';
import API from '@/services';
import phoneIcon from '@/assets/icons/phone_icon.png';
import pasIcon from '@/assets/icons/pas_icon.png';

class PhoneLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      password: '',
      // 表单校验规则
      formItemRules: {
        phoneRules: [
          {
            required: true,
            message: '请输入手机号码',
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
    const { phoneNum } = values
    if(!UTILS.validate.validPhone(phoneNum)) {
      message.error('手机号码格式不正确，请重新输入')
      return false
    }

    let response = null
    let data = {
      phone_num: values.phoneNum,
      code: values.code
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
    return (
      <div className='phone_login w-80'>
        <Form colon={false} name='phoneForm' requiredMark={false} onFinish={this.onFinish}>
          <div className='form_item'>
            <Form.Item
              name='phoneNum'
              label={<img src={phoneIcon} alt='' />}
              rules={this.state.formItemRules.phoneRules}
            >
              <div className='phone_input border-b'>
                <Input
                  value={this.state.phone}
                  maxLength={11}
                  placeholder='请输入手机号码'
                  bordered={false}
                  onChange={e =>{
                    this.setState({phone: e.target.value})
                  }}
                  suffix={<Button className='_button'>获取验证码</Button>}
                />
              </div>
            </Form.Item>
          </div>

          <div className='form_item'>
            <Form.Item
              name='code'
              label={<img src={pasIcon} alt='' />}
              rules={this.state.formItemRules.pasRules}
            >
              <div className='phone_input border-b'>
                <Input
                  value={this.state.password}
                  placeholder='请输入验证码'
                  bordered={false}
                  maxLength={6}
                  onChange={e =>{
                    this.setState({password: e.target.value})
                  }}
                />
              </div>
            </Form.Item>
          </div>

          <div className='warm_text text-xs text-gray-400 text-center mb-7'>
            *未注册手机将默认注册新账户
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
    );
  }
}
export default PhoneLogin;
