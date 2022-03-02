// 本地缓存

const localCache = {
  clearToken: function () {
    // 清空locastorage
    window.localStorage.removeItem();
  },

  // 获取Token和缓存
  getLocal: function (key) {
    return window.localStorage.getItem(key);
  },

  // 设置缓存
  setLocal: function(key, data){
    return window.localStorage.setItem(key, data);
  },

  clearCookie: function () {
    // 清空Cookie
  },

  getCookie: function (key) {
    // 获取Cookie
  },
};
export default localCache;
