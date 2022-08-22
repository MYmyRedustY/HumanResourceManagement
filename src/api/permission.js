import request from '@/utils/request'

/**
 * 获取权限
 * **/
export function getPermissionListApi(params) {
  return request({
    url: '/sys/permission',
    params
  })
}

/**
 * 新增权限
 * **/
export function addPermissionApi(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

/**
 * 更新权限
 * **/
export function updatePermissionApi(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

/**
 * 删除权限
 * **/
export function delPermissionApi(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

/**
 * 获取权限详情
 * **/
export function getPermissionDetailApi(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}
