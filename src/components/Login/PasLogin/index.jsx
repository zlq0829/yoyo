import React, { useEffect } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import userIcon from '@/assets/icons/user_icon.png';
import eyeIcon from '@/assets/icons/eye_icon.png';
import API from '@/services';
import '../index.less';

const PasLogin = (props) => {
  const { addProfile } = props
  const [form] = Form.useForm();
  const accountRef = React.useRef('account')
  const pasRef = React.useRef('password')
  const [checked, setChecked] = React.useState(false)

  // 表单验证
  const formItemRules = {
    acountRules: [
      {
        required: true,
        message: '请输入账号',
      },
    ],
    pasRules: [
      {
        required: true,
        message: '请输入密码',
      },
    ],
  };

  // 根据选择，缓存账号密码
  useEffect(()=> {
    const data = {
      account: accountRef.current.state.value,
      password: pasRef.current.state.value
    }
    if(checked && data.account && data.password) {
      localStorage.setItem('accountCache', JSON.stringify(data))
    }

  },[checked])

  // 登录处理事件
  const handleLogin = async (values) => {
    let response = null
    const data = {
      phone_num: values.account,
      password: values.password
    }
    try {
      response = await API.loginApi.loginByPassword(data)
    } catch (error) {
      return false
    }

    // 个人信息缓存到store中
    console.log(response, 'phonelogin')
    // addProfile(response)
  }

  // 表单事件
  const onFininsh = (values) => {
    // 账号密码登录的方式不需要判断输入的是否是手机号,后期如果做开放式的,账号可能就不一定是手机号码,所以这里直接做登录,后端再做校验
    handleLogin(values)
  };

  return (
    <div className='phone_login w-80'>
      <Form colon={false} requiredMark={false} onFinish={onFininsh} form={form} name='pasForm'>
        <div className='form_item'>
          <Form.Item name='account' rules={formItemRules.acountRules} label={<img src={userIcon} alt='' />}>
            <div className='border-b'>
              <Input placeholder='请输入账号' bordered={false} maxLength={11} ref={accountRef}/>
            </div>
          </Form.Item>
        </div>

        <div className='form_item'>
          <Form.Item name='password' rules={formItemRules.pasRules} label={<img src={eyeIcon} alt='' />}>
            <div className='border-b'>
              <Input.Password placeholder='请输入密码' bordered={false} ref={pasRef}/>
            </div>
          </Form.Item>
        </div>

        <div className='flex justify-between'>
          <Form.Item className='remeber_flex'>
            <Checkbox defaultChecked={checked} onChange={(e)=>{setChecked(e.target.checked)}}>记住密码</Checkbox>
          </Form.Item>
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
};

export default PasLogin;
