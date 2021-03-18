import request from '@/utils/request'

export function userList(params) { // 用户
  return request({
    url: '/user_info/query_page',
    method: 'get',
    params
  })
}
export function userDetails(params, method) {
  return request({
    url: '/user_info/' + params.id,
    method: method
  })
}
export function userEditPwd(data) {
  return request({
    url: '/user_info/reset_pswd',
    method: 'put',
    data
  })
}
export function userEnable(data) {
  return request({
    url: '/user_info/start',
    method: 'put',
    data
  })
}
export function userDisable(data) {
  return request({
    url: '/user_info/stop',
    method: 'put',
    data
  })
}
