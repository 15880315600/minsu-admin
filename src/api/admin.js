import request from '@/utils/request'

// 权限
export function permissionsList(params) { // 分类
  return request({
    url: '/jurisdiction/permission_query_page',
    method: 'get',
    params
  })
}

// 角色
export function roleList(params) {
  return request({
    url: '/role/query_page',
    method: 'get',
    params
  })
}
export function roleAllList(params) {
  return request({
    url: '/role/get_all',
    method: 'get',
    params
  })
}
export function roleDetails(params, method) {
  return request({
    url: '/role/' + params.id,
    method: method
  })
}
export function roleUpdate(data, method) {
  return request({
    url: '/role',
    method: method,
    data
  })
}

// 管理员
export function adminList(params) {
  return request({
    url: '/admin_info/query_page',
    method: 'get',
    params
  })
}
export function adminUpdate(data, method) {
  return request({
    url: '/admin_info',
    method: method,
    data
  })
}
export function adminDetails(params, method) {
  return request({
    url: '/admin_info/' + params.id,
    method: method
  })
}
