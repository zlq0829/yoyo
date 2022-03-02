import request from '../aioxs';

function getPlaylist() {
  return request({
    url: '/api/play_list',
    method: 'get',
  })
}

function getGoodsList(data) {
  return request({
    url: '/api/play_list/get_commodity',
    data
  })
}
export {
  getPlaylist,
  getGoodsList
}
