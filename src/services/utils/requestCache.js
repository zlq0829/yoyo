// 请求缓存
import Axios from 'axios';
import { generateReqKey } from './createKey';

const option = {
    storage: true,              // 是否开启loclastorage缓存
    storageKey: 'apiCache',     // 缓存字段
    storage_expire: 600000,     // localStorage 数据存储时间10min（刷新页面判断是否清除）
    expire: 20000               // 每个接口数据缓存ms 数
};

(function() {
    let cache = window.localStorage.getItem(option.storageKey);
    if (cache) {
        let { storageExpire } = JSON.parse(cache);
        if (storageExpire && getNowTime() - storageExpire < option.storage_expire) {
            return;
        }
    }
    window.localStorage.setItem(option.storageKey, JSON.stringify({ data: {}, storageExpire: getNowTime() }));
})();

function getCacheItem( key ) {
    let cache = window.localStorage.getItem(option.storageKey)
    let { data, storageExpire } = JSON.parse(cache)
    return (data && data[key]) || null
}

function setCacheItem( key, value ){
    let cache = window.localStorage.getItem(option.storageKey);
    let { data, storageExpire } = JSON.parse(cache);
    data[key] = value;
    window.localStorage.setItem(option.storageKey, JSON.stringify({ data, storageExpire }))
}

// 使用Proxy代理
let _CACHES = {}
let cacheHandler = {
    get: function ( target, key ) {
        let value = target[ key ]
        console.log(`${key} 被读取`, value)
        if ( option.storage && !value ) {
            value = getCacheItem( key )
        }
        return value
    },
    set: function ( target, key, value ) {
        console.log(`${key} 被设置为 ${value}`)
        target[key] = value
        if (option.storage) {
            setCacheItem(key, value)
        }
        return true
    }
}

// 获取当前时间戳
function getNowTime() {
    return new Date().getTime()
}

let CACHES = new Proxy(_CACHES, cacheHandler)

export function requestInterceptor( config, axios ){
    if ( config.cache ) {       // 开启缓存则保存请求结果和cancel 函数
        let data = CACHES[`${generateReqKey(config)}`]
        let setExpireTime

        config.setExpireTime? (setExpireTime = config.setExpireTime) : (setExpireTime = option.expire)
        if (data && getNowTime() - data.expire < setExpireTime) {   // 判断缓存数据是否存在 存在的话 是否过期 没过期就返回
            config.cancelToken = new Axios.cancelToken(cancel => {
                cancel(data)
            })
        }
    }
}

export function responseInterceptor(response) {
    // 返回的code === 200 时候才会缓存下来
    if (response && response.config.cache && response.data.code === 200) {
        let data = {
            expire: getNowTime(),
            data: response
        }
        CACHES[`${generateReqKey(response.config)}`] = data;
    }
}

