'use strict'

module.exports = (options, app) => {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志，用于线上环境排查问题
      ctx.app.emit('error', error, ctx)
      const { serverError } = app.config.resCode
      // 设置最重要响应状态码和错误提示
      const code = error.status || serverError.code
      const message = error.message || serverError.message

      // 如果是生产环境，隐藏错误日志，只对外抛出通用错误提示
      if (ctx.app.config.env === 'prod') {
        ctx.body = serverError
      } else {
        const body = { code, message }
        if (code === 422) body.errors = error.errors
        ctx.body = body
      }
      ctx.status = code
    }
  }
}
