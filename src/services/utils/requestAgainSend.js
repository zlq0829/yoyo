// 实现 请求错误时重新发送接口
import { isJsonStr } from './createKey';

/**
 * @param {失败信息} err
 * @param {实例化的单例} axios
 * @returns
 */

 export function againRequest( err, axios ) {
    const config = err.config
    if (!config || !config.retry) return Promise.reject(err)    // config.retry 具体接口配置的重发次数

    config.__retryCount = config.__retryCount || 0              // 设置用于记录重试计数的变量 默认为0

    if (config.__retryCount >= config.retry) {                  // 判断是否超过了重试次数
        return Promise.reject(err);
    }

    config.__retryCount += 1                                    // 重试次数

    const backoff = new Promise(function(resolve) {             // 延时处理
        setTimeout(function() {
            resolve();
        }, config.retryDelay || 1000);
    })

    return backoff.then(function() {                            // 重新发起axios请求
        // 判断是否是JSON字符串
        // TODO: 未确认config.data再重发时变为字符串的原因
        if (config.data && isJsonStr(config.data)) {
            config.data = JSON.parse(config.data);
        }
        return axios(config)
    })
 }
