import request from '@/utils/request'

export function roomTypeList(params) {
  return request({
    url: '/room_type/query_page',
    method: 'get',
    params
  })
}
export function roomTypeUpdate(data, method) {
  return request({
    url: '/room_type',
    method: method,
    data
  })
}

export function roomTypeDelete(params) {
  return request({
    url: '/room_type/' + params.id,
    method: 'delete'
  })
}

export function roomTypeDetails(params) {
  return request({
    url: '/room_type/' + params.id,
    method: 'get'
  })
}
