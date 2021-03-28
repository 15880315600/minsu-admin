import request from '@/utils/request'

// 获取全部字典
export function dictionariesAllList(params) {
  return request({
    url: '/dictionaries/all',
    method: 'get',
    params
  })
}
// （新）递归抛出所有下级
export function dictionariesAisList(params) {
  return request({
    url: '/dictionaries/dictionaries_all',
    method: 'get',
    params
  })
}
export function dictionariesUpdate(data, method) {
  return request({
    url: '/dictionaries',
    method: method,
    data
  })
}
export function dictionariesDetails(params, method) {
  return request({
    url: '/dictionaries/' + params.id,
    method: method
  })
}
