import request from '@/utils/request'

export function roomList(params) {
  return request({
    url: '/room/query_page',
    method: 'get',
    params
  })
}
export function roomUpdate(data, method) {
  return request({
    url: '/room',
    method: method,
    data
  })
}

export function roomDelete(params) {
  return request({
    url: '/room/' + params.id,
    method: 'delete'
  })
}

export function roomDetails(params) {
  return request({
    url: '/room/' + params.id,
    method: 'get'
  })
}

// 修改产品状态
export function upDownRoom(data) {
  return request({
    url: '/room/up_down_room',
    method: 'put',
    data
  })
}

