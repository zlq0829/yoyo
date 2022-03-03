import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

// 有效期为3小时
const inFifteenMinutes = new Date(new Date().getTime() + 3 * 60 * 60 * 1000)

/**
 *
 * @param {string} token
 * @returns ant
 */
export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: inFifteenMinutes })
}

/**
 *
 * @returns
 */
export function removeToken() {
  return Cookies.remove(TokenKey)
}


/**
 * @param {}
 * @returns {}
 */
export function clearToken() {
  window.localStorage.removeItem();
}

/**
 * @param {string} key
 * @returns {any}
 */
export function getLocal(key) {
  return window.localStorage.getItem(key);
}

/**
 * @param {string, any}
 * @returns {any}
 */
export function setLocal(key, data) {
  window.localStorage.setItem(key, data);
}
