import React, { useState } from 'react';
import { Upload, message, Form, Input, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import API from '@/services';
import UTILS from '@/utils';
import defaultAvatar from '@/assets/images/character_model_yoyo.png';
import './index.less';

const Profile = () => {
  // 更宽图片时触发的loading的状态
  const [loading, setLoading] = useState(false);

  // 人物头像
  const avatar = (UTILS.localCache.getLocal('avatar'))
  const [imageUrl, setImageUrl] = useState(avatar);

  // Upload钩子函数
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('仅可以上传JPG/PNG格式图纸!');
    }
    const isLt2M = file.size / 1024 / 1024 < 3;
    if (!isLt2M) {
      message.error('上传的图片不可大于3M!');
    }
    return isJpgOrPng && isLt2M;
  };

  // Upload文件改变时的状态
  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setImageUrl('')
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      setLoading(false)
      setImageUrl(info.file.response.data)
      UTILS.localCache.setLocal('avatar', info.file.response.data)
      return
    }
  };

  // 没有上传自己的头像会设置显示默认头像
  const defaultShowAvatar = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      {
        !loading && <img
          src={defaultAvatar}
          alt='avatar'
          style={{ height: '100%' }}
        />
      }

    </div>
  );

  // 表单校验规则
  const formItemRules = {
    nickNameRules: [
      {
        required: true,
        message: '请输入手机号码',
      },
    ],
    nameRules: [
      {
        required: true,
        message: '请输入验证码',
      },
    ],
    companyRules: [
      {
        required: true,
        message: '请输入验证码',
      },
    ]
  }

  // 基本信息表单提交
  const onFinish = async (data) => {
    // 发起请求
    const params = {
      avatar: '',
      name: data.name,
      nickname: data.nickname,
      org_name: data.company
    }
    try {
      await API.profileApi.modifyProfile(params)
    } catch (error) {
      message.success('保存失败')
      return false
    }
    message.success('保存成功')
  }

  // Upload组件data属性
  const data = (file) => {
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    return {
      suffix: suffix,
      preffix: 'userImg',
    };
  };


  return (
    <div className='h-full p-3 box-border'>
      <div className='bg-white relative rounder h-full p-5'>
        <div className='base_profile mb-12 w-full'>
          <div className='w-32 font-semibold font_20 mt_20'>基本信息</div>
          <div className='flex'>
            {/* 基本信息 */}
            <div className='profile '>
              <Form colon={false} onFinish={onFinish} name='profileForm'>
                <div className='h-px m_b_t_13 bg-gray-200' style={{ width: '103%' }} />
                <Form.Item
                  name='nickname'
                  label={
                    <div className='font-semibold' style={{ color: '#666' }}>昵称</div>
                  }
                  rules={formItemRules.nickNameRules}
                >
                  <Input style={{ width: '440px' }} showCount maxLength={20}  />
                </Form.Item>
                <div className='h-px m_b_t_13 bg-gray-200' style={{ width: '103%' }}/>
                <Form.Item
                  label={
                    <div className='font-semibold' style={{ color: '#666' }}>
                      姓名
                    </div>
                  }
                  rules={formItemRules.nameRules}
                >
                  <Input style={{ width: '440px' }} showCount maxLength={40}/>
                </Form.Item>
                <div className='h-px m_b_t_13 bg-gray-200' style={{ width: '103%' }}/>
                <Form.Item
                  label={
                    <div className='font-semibold' style={{ color: '#666' }}>
                      单位名称
                    </div>
                  }
                  rules={formItemRules.companyRules}
                >
                  <Input style={{ width: '440px' }} showCount maxLength={40}/>
                </Form.Item>
                <div className='h-px m_b_t_13 bg-gray-200' style={{ width: '103%' }} />
                <Form.Item style={{ textAlign: 'right' }}>
                  <Button shape='round' htmlType='submit'>保存修改</Button>
                </Form.Item>
              </Form>
            </div>
            <div className='avatar w_112 h_112 ml_70'>
              <Upload
                data={data}
                listType='picture-card'
                showUploadList={false}
                action='http://47.106.112.61:8080/api/common/upload'
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
                ) : (
                  defaultShowAvatar
                )}
              </Upload>
              <div className='font_12'>
                支持 jpg、png、jpeg 格式大小 5M 以内的图片
              </div>
            </div>
          </div>
        </div>

        {/* 账号设置 */}
        <div className='account_set mb-12'>
          <div className='w-32 font-semibold font_20 mt_20'>账号设置</div>
          <div>
            <div className='account flex'>
              <Form colon={false}>
                <div className='h-px m_b_t_13 bg-gray-200' style={{ width: '103%' }} />
                <Form.Item
                  label={
                    <div className='font-semibold' style={{ color: '#666' }}>
                      手机号码
                    </div>
                  }
                >
                  <Input style={{ width: '440px' }}/> <Button shape='round'>换绑</Button>
                </Form.Item>
                <div className='h-px m_b_t_13 bg-gray-200' style={{ width: '103%' }} />
                <Form.Item
                  label={
                    <div className='font-semibold' style={{ color: '#666' }}>
                      密码
                    </div>
                  }
                >
                  <Input style={{ width: '440px' }} /> <Button shape='round'>重置</Button>
                </Form.Item>
                <div className='border-b m_b_t_13'/>
              </Form>
            </div>
            <div className='w_112 h_112 ml_70'></div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
