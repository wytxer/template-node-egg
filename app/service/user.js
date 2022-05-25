'use strict'

const Service = require('egg').Service
const moment = require('moment')

// 用户信息要返回的字段
const attributes = [ 'id', 'openId', 'nickName', 'avatarUrl', 'phone', 'loggedAt' ]

class UserService extends Service {
  // 登录
  async login(openId, values) {
    const { model } = this.ctx

    return await model.User.findOne({
      where: { openId },
      attributes
    })
      .then(async res => {
        const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        if (res) {
          return await res.update({ loggedAt })
        }
        values.loggedAt = loggedAt
        return await model.User.create(values)
      })
      .then(res => res.toJSON())
  }

  // 保存手机号码
  async savePhone(id, phone) {
    const { model } = this.ctx

    return await model.User.findOne({
      where: { id }
    })
      .then(async res => {
        if (res) return await res.update({ phone })
        return false
      })
  }

  // 获取用户信息
  async info(id) {
    const { model } = this.ctx

    return await model.User.findOne({
      where: { id },
      attributes
    })
      .then(async res => {
        if (res) {
          // 更新登录时间
          return await res.update({
            loggedAt: moment().format('YYYY-MM-DD HH:mm:ss')
          })
            .then(res => res.toJSON())
        }
        return false
      })
  }
}

module.exports = UserService
