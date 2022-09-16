'use strict'

const Service = require('egg').Service
const moment = require('moment')

// 用户信息要返回的字段
const attributes = [ 'id', 'openId', 'nickName', 'avatarUrl', 'phone', 'loggedAt' ]

class UserService extends Service {
  // 登录
  async login(values) {
    const { model } = this.ctx

    // 组装用户查询参数
    const where = {}
    if (values.unionId) {
      where.unionId = values.unionId
    } else {
      where.openId = values.openId
    }
    return await model.User.findOne({ where, attributes })
      .then(async user => {
        const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        values.loggedAt = loggedAt
        // 如果找到了用户更新用户信息
        if (user) {
          await user.update(values, { where: { id: user.id } })
        } else {
          // 否则新增一个用户
          user = await model.User.create(values)
        }
        // 返回用户信息
        const data = user.toJSON()
        data.loggedAt = loggedAt
        delete data.updatedAt
        return data
      })
  }

  // 保存手机号码
  async savePhone(id, phone) {
    const { model } = this.ctx

    return await model.User.findOne({
      where: { id },
      attributes: [ 'id', 'phone' ]
    })
      .then(async user => {
        if (user) {
          const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
          await user.update({ phone, loggedAt })
          // 返回用户信息
          const data = user.toJSON()
          data.loggedAt = loggedAt
          delete data.updatedAt
          return data
        }
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
      .then(async user => {
        if (user) {
          // 更新登录时间
          const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
          await user.update({ loggedAt })
          // 返回用户信息
          const data = user.toJSON()
          data.loggedAt = loggedAt
          delete data.updatedAt
          return data
        }
        return false
      })
  }
}

module.exports = UserService
