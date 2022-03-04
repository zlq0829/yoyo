import request from '../aioxs';

/**
 * @description 管理页获取商品列表
 * @param {object} data
 * @returns array
 */
function getGoodsList(data) {
  return request({
    url: '/api/commodity/personal_list',
    method: 'GET',
    data
  })
}

/**
 * @description 管理页获取播放列表
 * @returns array
 */
function getPlaylist() {
  return request({
    url: '/api/play_list',
    method: 'GET',
  })
}


export {
  getGoodsList,
  getPlaylist
}
