// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })

// 导航守卫
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex实例
import NProgress from 'nprogress' // 引入进度条插件
import 'nprogress/nprogress.css'

// 定义白名单
const whiteList = ['/login', '/404']
// 前置守卫
router.beforeEach(async(to, from, next) => {
  // 刚进来，打开进度条
  NProgress.start()
  // 先判断有没有token
  if (store.getters.token) {
    // 有token，再判断是不是去登录页
    if (to.path === '/login') {
      // 有token并且去登录页，就强制跳转到登录页
      next('/')
    } else {
      // 判断有没有取到用户互信息，没取到就取
      if (!store.getters.userId) {
        // 如果没有id这个值 才会调用 vuex的获取资料的action
        await store.dispatch('user/getUserInfo')
      }
      console.log(store)
      // 有token不去登录页，就放行
      next()
    }
  } else {
    // 无token，判断是不是去白名单里的页面
    console.log(whiteList.indexOf(to.path) !== -1)

    if (whiteList.indexOf(to.path) !== -1) {
      // 去白名单，就放行
      console.log(to.path)
      next()
    } else {
      // 不去白名单，就强制跳转到登录页
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置守卫
router.afterEach(route => {
  NProgress.done() // 关闭进度条
})
