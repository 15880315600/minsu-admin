import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken,
  removeToken
} from '@/utils/auth'
import router from '../router/index.js'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    console.log(store.getters.token)
    console.log(store.getters)

    if (store.getters.token) {
      console.log(true)
      // let each request carry token
      // ['Authorization'] is a custom headers key
      // please modify it according to the actual situation
      config.headers.Authorization = store.getters.token
    } else {
      console.log(false)
      config.headers.Authorization = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    console.log(res)
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      console.log("请求失败")
      if (res.code == 440) {
        console.log("身份过期，请重新登录")
        Message({
          message: '身份过期，请重新登录',
          type: 'error',
          duration: 2 * 1000
        })
        // to re-login
        removeToken()
        location.reload()
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      console.log("请求成功")
      console.log(res)
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
