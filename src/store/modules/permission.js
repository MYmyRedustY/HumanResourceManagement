// 处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 路由表， 表示当前用户所拥有的所有路由的数组
  // 一开始肯定拥有静态路由的权限
  routes: constantRoutes
}
const mutations = {
  // 定义一个修改routes的mutation
  // payload认为是我们登录成功需要添加的新路由
  setRoutes(state, newRoutes) {
    // 这么写 语法没有问题 但业务逻辑有问题
    // state.routes = [...state.routes, ...newRoutes]
    // 应该是每次都更新，所以应该是再静态路由上加动态路由
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // 筛选权限路由
  // menus  是当前用户所拥有的菜单权限
  // asyncRoutes是所有的动态路由
  filterRoutes(context, menus) {
    // 筛选出动态路由中和menus中能够对上的路由

    // #region 第一种方法
    /* const routes = []
      // menus.forEach(key => {
      // key 就是标识
      // asyncRoutes中找 有没有对象中的name属性等于key
      // 找不到就没权限，找到就筛选出来
      routes.push(...asyncRoutes.filter(item => item.name === key))  // 得到一个数组，可能为空也可能不为空
    }) */
    // #endregion

    // #region 第二种方法
    const routes = asyncRoutes.filter(item => menus.includes(item.name))
    // #endregion

    // 得到的routes是所有模块中满足权限要求的路由数组
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes
    // 这里为什么还要写return
    // state中的routes是为给左边菜单用的
    // return是给路由addRoutes用的
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
