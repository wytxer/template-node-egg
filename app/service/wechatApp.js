'use strict'

const Service = require('egg').Service

/**
 * 微信小程序
 */

// 缓存鉴权信息
let wechatAccessToken = {
  accessToken: null, invalidTime: 0
}

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
    const { helper, logger } = ctx
    const { appId, secret } = ctx.app.config.wechatApp

    return await this.request(`/sns/jscode2session?appid=${appId}&secret=${secret}&js_code=${code}&grant_type=authorization_code`)
      .then(res => res.data)
      // 只返回需要的数据
      .then(res => {
        logger.info('微信登录凭证校验：%s', helper.stringify(res))
        if (res.openid) {
          return {
            openId: res.openid, sessionKey: res.session_key, unionId: res.unionid, appId
          }
        }
        return Promise.reject(new Error(helper.stringify(res)))
      })
  }

  // 获取小程序全局唯一后台接口调用凭据
  // 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/access-token/auth.getAccessToken.html
  async accessToken() {
    const { ctx } = this
    const { helper, logger } = ctx
    const { appId, secret } = ctx.app.config.wechatApp

    // 先从缓存从读取
    if (wechatAccessToken.invalidTime - new Date().getTime() > 0) {
      return wechatAccessToken
    }

    return await this.request(`/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`)
      .then(res => res.data)
      // 只返回需要的数据
      .then(res => {
        logger.info('获取小程序全局唯一后台接口调用凭据：%s', helper.stringify(res))
        if (res.access_token) {
          wechatAccessToken = {
            accessToken: res.access_token, invalidTime: new Date().getTime() + (res.expires_in * 1000)
          }
          return wechatAccessToken
        }
        return Promise.reject(new Error(helper.stringify(res)))
      })
  }

  // 获取授权手机号
  // 官方文档：https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/phonenumber/phonenumber.getPhoneNumber.html
  async getPhoneNumber(accessToken, code) {
    const { helper, logger } = this.ctx

    return await this.request(`/wxa/business/getuserphonenumber?access_token=${accessToken}`, {
      method: 'POST',
      data: { code }
    })
      .then(res => res.data)
      // 只返回需要的数据
      .then(res => {
        logger.info('获取授权手机号：%s', helper.stringify(res))
        if (res.errcode === 0) {
          return res.phone_info
        }
        return Promise.reject(new Error(helper.stringify(res)))
      })
  }
}

module.exports = WechatAppService
