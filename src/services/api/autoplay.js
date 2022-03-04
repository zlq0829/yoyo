import request from '../aioxs';

/**
 * @description 获取播放列表
 * @returns {array}
 */
function getPlaylist() {
  return request({
    url: '/api/play_list',
    method: 'get',
  })
}

/**
 * @description 根据选择播放列表ID获取商品
 * @param {id} data
 * @returns {array}
 */
function getGoodsList(data) {
  return request({
    url: '/api/play_list/get_commodity',
    method: 'get',
    data
  })
}

export {
  getPlaylist,
  getGoodsList
}
