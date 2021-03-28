import request from '@/utils/request'


export function storeList(params) { // 分类
  return request({
    url: '/store/query_page',
    method: 'get',
    params
  })
}
export function storeUpdate(data, method) {
  return request({
    url: '/store',
    method: method,
    data
  })
}
export function storeDetails(params, method) {
  return request({
    url: '/store/' + params.id,
    method: method
  })
}
