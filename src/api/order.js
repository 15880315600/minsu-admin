import request from '@/utils/request'

// 订单
export function orderTableList(params) { // 订单
  return request({
    url: '/order_table//query_page',
    method: 'get',
    params
  })
}
// 订单
export function orderTableAdd(data) { // 订单
  return request({
    url: '/order_table/admin_add_reserve',
    method: 'post',
    data
  })
}
// 订单
export function roomReserveRecord(data) { // 订单
  return request({
    url: '/room_reserve_record/roomReserveRecord',
    method: 'put',
    data
  })
}
// 订单
export function roomReserveRecordWriteOff(params) { // 订单
  return request({
    url: '/order_table/write_off',
    method: 'get',
    params
  })
}
// 团购订单
export function groupRoomInfoAdd(data) { // 订单
  return request({
    url: '/group_room_info',
    method: 'post',
    data
  })
}
// 团购订单
export function groupRoomInfoList(params) { // 订单
  return request({
    url: '/group_room_info/query_page',
    method: 'get',
    params
  })
}