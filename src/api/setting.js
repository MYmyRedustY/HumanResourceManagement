import request from '@/utils/request'

/**
 * 获取角色列表
 * ***/
export function getRoleListApi(params) {
  return request({
    url: '/sys/role',
    params
  })
}

/**
 * 获取公司信息
 * **/
export function getCompanyInfoApi(companyId) {
  return request({
    url: `/company/${companyId}`
  })
}

/** **
 *  删除角色
 *
 * ****/
export function deleteRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

/** *
 * 修改角色
 * ***/
export function updateRoleApi(data) {
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}

/**
 * 获取角色详情
 * **/
export function getRoleDetailApi(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

/** *
 * 新增角色
 * ***/
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}

// 给角色分配权限
export function assignPermApi(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
