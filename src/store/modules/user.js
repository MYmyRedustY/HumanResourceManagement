// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }

// 先引入
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'

// 状态
const state = {
  token: getToken() || '', // 设置token初始状态
  userInfo: {} // 定义一个空的对象，不是null，如果这里是null，在下边取出来赋值的时候就会报错
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token // 设置token  只是修改state的数据  123 =》 1234
    // vuex变化 => 缓存数据
    setToken(token) // vuex和 缓存数据的同步
  },
  // 删除缓存
  removeToken(state) {
    state.token = null // 删除vuex的token
    removeToken() // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo } // 用浅拷贝的方式赋值，会触发视图的更新
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  // 定义login发送请求，需要的参数是表单的参数
  async login(context, data) {
    const res = await login(data) // axios返回一个Promise对象
    // 如果请求成功
    // if (res.data.success) {
    // 返回token ，把token放进本地存储
    context.commit('setToken', res)
    // }
    // 写入时间戳
    setTimeStamp() // 将当前的最新时间写入缓存
  },
  // 获取用户资料
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    // 获取头像
    const res = await getUserDetailById(result.userId)
    // 合并数据
    const baseResult = { ...result, ...res }
    context.commit('setUserInfo', baseResult) // 将整个用户数据设置到vuex数据中
    return baseResult // 伏笔
  },
  // 登出的action
  logout(context) {
    // 删除token
    context.commit('removeToken') // 不仅仅删除了vuex中的 还删除了缓存中的
    // 删除用户资料
    context.commit('removeUserInfo') // 删除用户信息
    // 重置路由
    resetRouter()
    // 还要设置权限模块下的路由为初始状态
    // Vuex子模块怎么调用子模块的actions
    //  不加命名空间，所有的actions和mutations都挂在在全局上，可以直接调用
    //  加了命名空间的子模块怎么调用呢
    //    加了命名空间的context指的不是全局的context
    //    context.commit(mutations所在命名空间/mutations名称, payload, { root:true })
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
