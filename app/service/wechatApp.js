'use strict'

const Service = require('egg').Service

class WechatAppService extends Service {
  constructor(ctx) {
    super(ctx)
    this.domain = 'https://api.weixin.qq.com'
  }

  async request(url, config = {}) {
    return await this.ctx.curl(this.domain + url, {
      contentType: 'json',
      dataType: 'json',
      ...config
    })
  }

  // 微信登录凭证校验，授权获取 openId 和 unionId
  // 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
  async code2Session(code) {
    const { ctx } = this
    const { appId, secret } = ctx.app.config.wxapp
    return await this.request(`/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
      .then(res => res.data)
      // 只返回需要的数据
      .then(res => {
        ctx.logger.info('微信登录凭证校验：%s', ctx.helper.stringify(res))
        if (res.openid) {
          return {
            openId: res.openid, sessionKey: res.session_key, unionId: res.unionid
          }
        }
        return Promise.reject(new Error(ctx.helper.stringify(res)))
      })
  }
}

module.exports = WechatAppService
