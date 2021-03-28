import request from '@/utils/request'

export function advertisementList(params) { // 分类
  return request({
    url: '/advertisement/query_page',
    method: 'get',
    params
  })
}
export function advertisementUpdate(data, method) {
  return request({
    url: '/advertisement',
    method: method,
    data
  })
}
export function advertisementDetails(params, method) {
  return request({
    url: '/advertisement/' + params.id,
    method: method
  })
}
