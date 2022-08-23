// 负责所有全局自定义组件的注册
// 全局注册后, 组件就可以不用引入直接用标签使用
// 在这里注册完以后,需要在 main.js 中全局注册Vue.use()
import UploadExcel from './UploadExcel'
import PageTools from './PageTool'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull'
export default {
  // 在main.js中, 使用Vue.use()方法的时候, 会自动调用install()
  // install方法是vue给我们提供的
  // install方法能会给我们返回一个Vue实例, 拿到Vue实例我们才可以我们注册全局组件
  install(Vue) {
    //  注册全局的通用栏组件对象
    // Vue.component('组件名', 组件)
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.use(Print) // 注册导入上传组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入上传组件
    Vue.component('ScreenFull', ScreenFull) // 注册全屏组件
  }
}
// Vue.use()
