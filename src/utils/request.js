// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service

// import { config } from "@vue/test-utils"
import axios from 'axios'
import { Message } from 'element-ui' // 引入提醒组件
import store from '@/store'
import router from '@/router'
import { getTimeStamp } from '@/utils/auth'
const timeOut = 3600 // 定义超时时间
const service = axios.create({
  // process 是node.js里的一个全局变量，进程
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})
// 请求拦截器
service.interceptors.request.use(
  config => {
    // console.log(store);
    // 统一注入token
    if (store.getters.token) {
      // 只有在token存在的情况下，才有必要去检查时间戳是否超时
      if (isCheckTimeOut()) {
        // 如果它为true表示 过期了
        // token没用了 因为超时了
        store.dispatch('user/logout') // 登出操作
        // 跳转到登录页
        router.push('/login')
        return Promise.reject(new Error('token超时了'))
      }
      // 如果token存在 注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  },
  error => {
    return Promise.reject(error)
  }
)
// 响应拦截器
service.interceptors.response.use(
  // 杨文林有云:尽量不要在拦截器里解构返回,而是在看见返回数据之后再进行解构
  (response) => {
    // axios默认加了一层data
    const { success, message, data } = response.data
    if (success) {
      return data
    } else {
      // 业务错了，不能再进 .then ,而要进 .catch
      Message.error(message) // 提示错误信息
      return Promise.reject(new Error(message))
    }
  },
  (err) => {
    console.log(err)
    Message.error(err.message) // 提示错误信息
    return Promise.reject(err) // 返回执行错误，让当前的执行立案调处成功，直接进入catch。
    // 用 Promise 对象的静态方法 reject
  }
)
// 定义是否超时的函数
function isCheckTimeOut() {
  // 获取到当前的时间戳
  var currentTime = Date.now()
  // 获取缓存的时间戳
  var timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > timeOut
}
export default service
