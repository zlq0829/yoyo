import request from '../aioxs';

/**
 * @description 基本信息
 * @param {*} data 昵称 姓名 公司
 */
function updataProfile(data) {
  return request({
    url: '/api/user/update_profile',
    method: 'post',
    data,
  });
}

export { updataProfile };
