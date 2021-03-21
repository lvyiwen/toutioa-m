// 请求模块
// 导入axios插件
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://toutiao-app.itheima.net',
  // 自定义后端返回的原始数据
  // data： 后端返回的原始数据， JSON格式的字符串
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformResponse: [function (data) {
    // 对 data 进行任意转换处理
    try {
      // 使用json-bigint方法来解决大数字的问题
      return JSONBig.parse(data)
    } catch (err) {
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 发起请求会经过这里
  const { user } = store.state
  // 如果store 数据中有user并且user中有token数据及添加请求头
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  if (config.url.startsWith('/app')) {
    // 只要以/app开始，则把前四个字符去掉
    config.url = config.url.slice(4)
  }
  return config
}, error => {
  // 如果请求出错了 还没有发出会进入这里
  console.log(error)
})
// 响应拦截器
request.interceptors.response.use(res => {
  return res.data
}, error => {
  console.log(error)
})
// 向外暴露
export default request
