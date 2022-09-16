'use strict'

/**
 * 用户是否已登录判断和异常捕获处理
 * @param {*} options 中间件的配置项，框架会将 app.config.middlewareName 传递进来
 * @param {*} app Application 实例
 */
module.exports = (options, app) => {
  return async (ctx, next) => {
    const whiteUrls = options.whiteUrls || []
    // 如果 ctx.url 在白名单中
    const isWhiteUrl = whiteUrls.some(whiteUrl => ctx.url.startsWith(whiteUrl))
    if (isWhiteUrl) {
      await next()
    } else {
      const { config } = ctx.app
      if (!ctx.session.userId && ctx.url.match(new RegExp(`^${config.apiPrefix}`))) {
        ctx.helper.notLogged()
      } else {
        await next()
      }
    }
  }
}
