const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  name: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  staffPhoto: state => state.user.userInfo.staffPhoto, // 建立用户头像的映射
  companyId: state => state.user.userInfo.companyId, // 公司的快捷访问
  routes: state => state.permission.routes
}
export default getters
