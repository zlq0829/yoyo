import request from '../aioxs'

/**
 * @description getValidateCode获取验证码
 * @param {*} data 手机号码、标示字段
 */
function getValidCode(data) {
  return request({
    url: '/api/common/send-sms',
    method: 'post',
    data
  })
}

/**
 * @description loginByValidCode通过验证码登录
 * @param {*} data 手机号码、验证码
 */
function loginByValidCode(data) {
  return request({
    url: '/api/auth/sign',
    method: 'post',
    data
  })
}

/**
 *
 * @description loginByPwd通过密码登录
 * @param {*} pwd
 * @returns
 */
function loginByPassword(data) {
  return request({
    url: '/api/auth/pwd_sign_in',
    method: 'post',
    needLoading: false,
    data
  });
}

export {
  getValidCode,
  loginByValidCode,
  loginByPassword,
}

