'use strict'

/**
 * 路由配置
 */

module.exports = app => {
  const { router, controller } = app

  // 首页
  router.get('/', controller.home.index)
  // 设置统一的前缀，前缀地址在 config/config.default.js 中配置
  const subRouter = router.namespace(app.config.apiPrefix)
  // 开发环境
  const isDev = app.config.env === 'local' || app.config.env === 'test' || app.config.env === 'unittest'

  /**
   * 用户模块
   */
  // 本地环境和测试环境下开放 mock 登录，方便开发和调试
  if (isDev) {
    subRouter.get('/user/mock', controller.user.mock)
  }
  // 登录
  subRouter.post('/user/login', controller.user.login)
  // 获取用户信息
  subRouter.all('/user/info', controller.user.info)
  // 登出
  subRouter.all('/user/logout', controller.user.logout)
  // 通过授权获取用户手机号码，微信小程序专用
  subRouter.post('/user/phone', controller.user.phone)
}
