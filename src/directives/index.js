import store from 'vuex'

export const imagerror = {
  // 指令对象 会在当前的dom元素插入到节点之后执行
  inserted(dom, options) {
    // options是 指令中的变量的解释  其中有一个属性叫做 value
    // dom 表示当前指令作用的dom对象
    // dom认为此时就是图片
    dom.src = dom.src || options.value
    // 当图片有地址 但是地址没有加载成功的时候 会报错 会触发图片的一个事件 => onerror
    dom.onerror = function () {
      // 图片失败  赋值一个默认的图片
      dom.src = options.value
    }
  },
  componentUpdated(dom, options) {
    dom.src = dom.src || options.value
  }
}

export const has = {
  inserted(dom, options) {
    const { userInfo } = store.mapState.user
    if (userInfo.roles.points && userInfo.roles.points.length && userInfo.roles.points.includes(options.value)) {
      return dom.style.display = 'block'
    } else {
      return dom.style.display = 'none'
    }
  }
}