import request from '@/utils/request'

export function upload(data) { //分类
  return request({
    url: '/files/upload',
    method: 'post',
    data
  })
}