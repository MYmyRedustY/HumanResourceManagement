import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
// #region 这是引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// #endregion
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Components from '@/components'
Vue.use(Components)

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// 自定义指令
import * as directives from '@/directives'
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 全局过滤器
import * as filters from '@/filters'
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})

import Print from 'vue-print-nb'
Vue.use(Print) // 注册导入上传组件

import ScreenFull from '@/components/ScreenFull'
Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
Vue.config.devtools = true
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
