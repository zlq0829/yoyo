import React from 'react';
import ReactDOM from 'react-dom';
import { Spin, message } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Axios from 'axios';
import UTILS from '@/utils'
const { auth, validate } = UTILS

// 加载动效，效缓解用户的焦虑。
let requestCount = 0;
function startLoading() {
  if (requestCount === 0) {
    const mountNode = document.createElement('div');
    mountNode.setAttribute('id', 'loading');
    document.body.appendChild(mountNode);
    ReactDOM.render(<Spin size='large' indicator={<LoadingOutlined spin/>}/>, mountNode);
  }
  requestCount++;
}

// 卸载loading效果
function hideLoading() {
  requestCount--;
  if (requestCount===0) {
    document.body.removeChild(document.getElementById('loading'));
  }
}

// 处理成功结果状态机
const responseHandle = {
  200: (response) => {
    return response.data;
  },
  400: (response) => {
    return Promise.reject(response.data.message);
  },
  401: (response) => {
    window.location.href = window.location.origin;
  },
  500: (error) => {
    console.log(error)
    if(validate.isString(error)) {
      message.error(error);
    }
  },
  default: (response) => {
    return Promise.reject(response);
  },
};

const service = Axios.create({
  baseURL: process.env.REACT_APP_API,
  timeout: 30000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    auth.getToken() &&
      (config.headers.Authorization = 'JWT ' + auth.getToken());

    if (
      config.method.toLocaleLowerCase() === 'post' ||
      config.method.toLocaleLowerCase() === 'put' ||
      config.method.toLocaleLowerCase() === 'patch'
    ) {
      Object.assign(config.data, config.data);
    } else if (
      config.method.toLocaleLowerCase() === 'get' ||
      config.method.toLocaleLowerCase() === 'delete'
    ) {
      config.params = config.data;
    } else {
      message.error(`${config.method}不是有效的方法`);
      return false;
    }

    startLoading()
    return config;
  },

  (err) => {
    hideLoading()
    return Promise.reject(err);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    hideLoading()
    return responseHandle[response.data.code || 'default'](response);
  },

  (err) => {
    console.log(err)
    hideLoading()
    responseHandle[500]('网络请求失败，请刷新重试')
  }
);

export default service;
