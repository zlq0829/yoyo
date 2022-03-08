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

/**
 * @description 删除商品
 * @param {id} id
 * @returns
 */
function deleteGoods(id) {
  return request({
    url: `/api/commodity/${id}`,
    method: 'DELETE',
  })
}

/**
 * @description 删除播放
 * @param {id} id
 * @returns
 */
function deletePlay(id) {
  return request({
    url: `/api/play_list/${id}`,
    method: 'DELETE',
  })
}

/**
 * @description 增加播放
 * @param {object} data
 * @returns
 */
function addPlay(data) {
  return request({
    url: '/api/play_list',
    method: 'POST',
    data
  })
}

/**
 *
 * @param {object} data
 * @returns
 */
function getPlayGoodsList(data) {
  return request({
    url: '/api/play_list/get_commodity',
    method: 'GET',
    data
  })
}

function updataPlayGoods(data, id) {
  return request({
    url: `/api/play_list/${id}`,
    method: 'PATCH',
    data
  })
}

export {
  getGoodsList,
  getPlaylist,
  deleteGoods,
  deletePlay,
  addPlay,
  getPlayGoodsList,
  updataPlayGoods
}
