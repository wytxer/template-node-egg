'use strict'

const Controller = require('egg').Controller

/**
 * @controller User 用户模块
 */

class UserController extends Controller {
  /**
   * @summary 模拟登录
   * @description 通过 mock 的方式登录
   * @router get /v1/user/mock
   * @request query string *id 用户 id
   * @response 0 UserInfo
   */
  async mock() {
    const { ctx } = this
    const { service, helper, session } = ctx
    const { id } = ctx.request.query

    // 参数校验
    const rules = {
      id: { required: true, message: '用户标识不能为空' }
    }
    const passed = await ctx.validate(rules, ctx.request.query)
    if (!passed) return

    const data = await service.user.info(id)
    if (data) {
      session.id = data.id
      session.openId = data.openId
      session.unionId = data.unionId
      session.nickName = data.nickName
      ctx.rotateCsrfSecret()
    }
    helper.success(data)
  }

  /**
   * @summary 小程序登录
   * @description 目前仅支持微信小程序登录
   * @router post /v1/user/login
   * @request body RequestLogin
   * @response 0 UserInfo
   */
  async login() {
    const { ctx } = this
    const { service, helper, session } = ctx
    const { code, nickName, avatarUrl, phone, gender, province, city, language } = ctx.request.body

    // 参数校验
    const rules = {
      code: { required: true, message: '临时登录凭证不能为空' },
      nickName: { required: true, message: '昵称不能为空' },
      avatarUrl: { required: true, message: '用户头像不能为空' }
    }
    const passed = await ctx.validate(rules, ctx.request.body)
    if (!passed) return

    // 微信登录凭证校验，通过 code 换取用户信息，包含 openId 和 unionId
    const token = await service.wechatApp.code2Session(code)
    if (!token) {
      helper.error(null, '微信登录鉴权失败')
      return
    }

    const { openId, unionId, sessionKey } = token
    // 更新用户信息
    const data = await service.user.login({
      openId, unionId, nickName, avatarUrl, phone, gender, province, city, language
    })
    if (data) {
      session.id = data.id
      session.openId = data.openId
      session.unionId = data.unionId
      session.nickName = data.nickName
      session.sessionKey = sessionKey
      delete data.unionId
      delete data.password
      helper.success(data)
    } else {
      helper.error(null, '授权出现未知错误')
    }
  }

  /**
   * @summary 解密手机号码信息
   * @description 获取用户当前绑定的手机号码
   * @router post /v1/user/phone
   * @request body RequestPhone
   * @response 0 UserInfo
   */
  async phone() {
    const { ctx } = this
    const { service, helper, app, logger } = ctx
    const { userId, iv, encryptedData } = ctx.request.body
    const sessionKey = ctx.session.sessionKey

    // 参数校验（复用 egg-swagger-doc 结构来校验）
    const passed = await ctx.validate(ctx.rule.RequestPhone, ctx.request.body)
    if (!passed) return

    const { appId } = app.config.wxapp
    // 解密后的手机号码数据
    let phoneInfo = null
    try {
      phoneInfo = helper.wechatCrypt({ appId, sessionKey, iv, encryptedData })
    } catch (error) {
      logger.error(error)
      helper.error(null, '手机号码解密失败')
      return
    }

    if (phoneInfo) {
      // 完整的用户数据
      const data = await service.user.savePhone(userId, phoneInfo.phoneNumber)
      if (data) {
        helper.success(data)
      } else {
        helper.error(null, '手机号码保存失败')
      }
    } else {
      helper.error(null, '手机号码获取失败')
    }
  }

  /**
   * @summary 获取用户信息
   * @description 只有登录成功了才会返回用户信息
   * @router get /v1/user/info
   * @response 0 UserInfo
   */
  async info() {
    const { ctx } = this
    const { service, helper, session } = ctx
    const data = await service.user.info(session.id)
    if (data) {
      helper.success(data)
    } else {
      helper.error(null, '用户信息获取失败')
    }
  }

  /**
   * @summary 登出
   * @description 退出登录
   * @router get /v1/user/logout
   * @response 0
   */
  async logout() {
    const { helper, session } = this.ctx
    session.id = null
    session.openId = null
    session.unionId = null
    session.nickName = null
    helper.success()
  }
}

module.exports = UserController
