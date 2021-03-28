import request from '@/utils/request'

export function noticeList(params) { // 分类
  return request({
    url: '/notice/query_page',
    method: 'get',
    params
  })
}
export function noticeUpdate(data, method) {
  return request({
    url: '/notice',
    method: method,
    data
  })
}
export function noticeDetails(params, method) {
  return request({
    url: '/notice/' + params.id,
    method: method
  })
}
