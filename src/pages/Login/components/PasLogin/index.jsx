import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Checkbox, message } from 'antd';
import utils from '@/utils';
import API from '@/services';
import action from '@/actions';
import userIcon from '@/assets/icons/user_icon.png';
import eyeIcon from '@/assets/icons/eye_icon.png';

const { auth, validate } = utils;
const { profile } = action;
const accountCache = auth.getLocal('accountCache') && JSON.parse(auth.getLocal('accountCache'))
const TokenKey = 'token'

const Login = (props) => {
  const { token } = props;
  const [account, setAccount] = useState(accountCache?.account);
  const [password, setPassword] = useState(accountCache?.password);
  const [checked, setChecked] = useState(true);


  // 输入账号
  const handleAccountChange = (e) => {
    setAccount((account) => e.target.value);
  }

  // 输入密码
  const handlePasswordChange = (e) => {
    setPassword((password) => e.target.value);
  }

  // 修改多选框
  const handleCheckedChange = (e) => {
    setChecked((checked) => e.target.checked)
  }

  // 提交
  const handleSubmit = async () => {
    if (!validate.validPhone(account)) {
      message.error('账号格式不正确，请重新输入');
      return false;
    }

    let response = null;
    let data = {
      phone_num: account,
      password,
    };
    try {
      response = await API.loginApi.loginByPassword(data);
    } catch (error) {
      message.error((error && error.message) || '登陆失败');
      return false;
    }

    auth.setLocal(TokenKey, response.data.token);
    auth.setLocal('userInfo', JSON.stringify(response.data));
    props.handleProfile(response.data);
  };

  // 是否保存账号密码
  useEffect(()=>{
    if(checked && validate.validPhone(account)) {
      auth.setLocal('accountCache', JSON.stringify({ account, password }));
    }
  }, [checked, account, password])

  if (token) {
    return <Redirect to='/' />;
  }

  return (
    <div className='login_input w-80'>
      <Form colon={false} name='pasForm' requiredMark={false}>
        {/* 账号框 */}
        <div className='form_item mb-7'>
          <Form.Item
            name='phoneNum'
            label={<img src={userIcon} alt='' className='sm:block hidden' />}
          >
            <div className='phone_input border-b'>
              <Input
                value={account}
                maxLength={11}
                placeholder='请输入账号'
                bordered={false}
                onChange={(e) => { handleAccountChange(e)}}
              />
            </div>
          </Form.Item>
        </div>

        {/* 密码框 */}
        <div className='form_item mb-7'>
          <Form.Item
            name='code'
            label={<img src={eyeIcon} alt='' className='sm:block hidden' />}
          >
            <div className='phone_input border-b'>
              <Input.Password
                value={password}
                placeholder='请输入密码'
                bordered={false}
                maxLength={6}
                onChange={(e) => { handlePasswordChange(e)}}
              />
            </div>
          </Form.Item>
        </div>

        {/* 单选按钮 && 忘记密码 */}
        <div className='warm_texttext-gray-400 mb-7 flex justify-between items-center'>
          <div>
            <Checkbox
              defaultChecked={checked}
              onChange={(e) => {handleCheckedChange(e)}}
            >
              记住密码
            </Checkbox>
          </div>
          <div className='font_14 color-FF8462 cursor-pointer'>忘记密码？</div>
        </div>

        {/* 按钮 */}
        <div className='w-full' onClick={handleSubmit}>
          <button className='ant-button w-full rounded-full' type='button'>
            登 录
          </button>
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => ({
  token: state.profile.token,
});
const mapDispatchToProps = (dispatch) => ({
  handleProfile: (data) => {
    dispatch(profile.addProfile(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
