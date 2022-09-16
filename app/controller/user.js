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
   * @request query string *userId 用户 id
   * @response 0 UserInfo
   */
  async mock() {
    const { service, request, validate, session, rotateCsrfSecret, helper } = this.ctx
    const { userId } = request.query

    // 参数校验
    const rules = {
      userId: { required: true, message: '用户标识不能为空' }
    }
    const passed = await validate.call(this, rules, request.query)
    if (!passed) return

    const data = await service.user.info(userId)
    if (data) {
      session.userId = data.id
      session.openId = data.openId
      session.nickName = data.nickName
      rotateCsrfSecret.call(this)
      helper.success(data)
    } else {
      helper.error(null, '用户不存在')
    }
  }

  /**
   * @summary 小程序登录
   * @description 目前仅支持微信小程序登录
   * @router post /v1/user/login
   * @request body RequestLogin
   * @response 0 UserInfo
   */
  async login() {
    const { service, helper, session, request, validate, rotateCsrfSecret, rule } = this.ctx
    const { code, nickName, avatarUrl, phone, gender, province, city, language } = request.body

    // 参数校验
    const passed = await validate.call(this, rule.RequestLogin, request.body)
    if (!passed) return

    // 微信登录凭证校验，通过 code 换取用户信息，包含 openId 和 unionId
    const token = await service.wechatApp.code2Session(code)
    if (!token) {
      helper.error(null, '微信登录鉴权失败')
      return
    }

    const { openId, unionId } = token
    const data = await service.user.login({
      openId, unionId, nickName, avatarUrl, phone, gender, province, city, language
    })
    if (data) {
      session.userId = data.id
      session.openId = data.openId
      session.nickName = data.nickName
      rotateCsrfSecret.call(this)
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
    const { service, helper, session, request, validate, rule } = this.ctx
    const { userId, code } = request.body

    // 参数校验（复用 egg-swagger-doc 结构来校验）
    const passed = await validate.call(this, rule.RequestPhone, request.body)
    if (!passed) return

    const token = await service.wechatApp.accessToken()
    const phoneData = await service.wechatApp.getPhoneNumber(token.accessToken, code)
    if (phoneData) {
      // 保存手机号
      const data = await service.user.savePhone(userId, phoneData.phoneNumber, session.openId)
      if (data) {
        helper.success()
      } else {
        helper.error(null, '手机号保存失败')
      }
    } else {
      helper.error(null, '手机号授权异常')
    }
  }

  /**
   * @summary 获取用户信息
   * @description 只有登录成功了才会返回用户信息
   * @router get /v1/user/info
   * @response 0 UserInfo
   */
  async info() {
    const { service, helper, session } = this.ctx
    const data = await service.user.info(session.userId)
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
    session.userId = null
    session.openId = null
    session.nickName = null
    helper.success()
  }
}

module.exports = UserController
