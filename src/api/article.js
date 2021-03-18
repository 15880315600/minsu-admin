import request from '@/utils/request'

export function articleList(params) { // 分类
  return request({
    url: '/article/query_page',
    method: 'get',
    params
  })
}
export function articleUpdate(data, method) {
  return request({
    url: '/article',
    method: method,
    data
  })
}
export function articleDetails(params, method) {
  return request({
    url: '/article/' + params.id,
    method: method
  })
}
