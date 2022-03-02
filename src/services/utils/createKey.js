import Qs from 'qs';

// generateReqKey ：用于根据当前请求的信息，生成请求 Key；
export function generateReqKey(config) {
  // 响应的时候，response.config 中的data 是一个JSON字符串，所以需要转换一下
  if (config && config.data && isJsonStr(config.data)) {
    config.data = JSON.parse(config.data);
  }
  // 请求方式，参数，请求地址，
  const { method, url, params, data } = config;
  const keyAry = [method, url];
  if (
    method.toLocaleLowerCase() === 'post' ||
    method.toLocaleLowerCase() === 'put'
  ) {

    keyAry.push(Qs.stringify(data));
  } else {
    keyAry.push(Qs.stringify(params));
  }
  // 拼接，map的key
  return keyAry.join('&');
}


// 判断一个字符串是否为JSON字符串
export let isJsonStr = (str) => {
  if (typeof str == 'string') {
    try {
      var obj = JSON.parse(str);
      if (typeof obj == 'object' && obj) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log('error：' + str + '!!!' + e);
      return false;
    }
  }
};
