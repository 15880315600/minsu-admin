import request from '@/utils/request'

/*
post提交用data接收数据
get提交用params接收数据
put提交类似于post提交
delete提交用data接收，直接拼接url
别问为什么，我也不知道为什么，这么用就是了
*/

export function login(data) {
  return request({
    url: '/admin_info/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/admin_info/account_info',
    method: 'get'
  })
}

