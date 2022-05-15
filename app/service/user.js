'use strict'

const Service = require('egg').Service
const moment = require('moment')

// 用户信息要返回的字段
const attributes = [ 'id', 'openId', 'nickName', 'avatarUrl', 'phone', 'loggedAt' ]

class UserService extends Service {
  // 登录
  async login(openId, defaults) {
    const { model } = this.ctx
    // 找到了返回当前用户信息否则新增一个用户
    return await model.User.findOrCreate({
      defaults,
      where: { openId },
      attributes
    })
      .then(async ([ user, created ]) => {
        const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        // 如果记录已存在
        if (created) {
          await user.update({
            loggedAt
          })
        } else { // 否则只是更新一下登录时间
          defaults.loggedAt = loggedAt
          await user.update(defaults)
        }
        return user
      })
      .then(res => res?.toJSON() || res)
  }

  // 保存手机号码
  async savePhone(id, phone) {
    const { model } = this.ctx
    return await model.User.findOne({
      where: { id }
    })
      .then(async res => {
        if (res) await res.update({ phone })
        return res
      })
  }

  // 获取用户信息
  async info(id) {
    const { model } = this.ctx
    return await model.User.findOne({
      where: { id }
    })
      .then(async res => {
        if (res) {
          // 更新登录时间
          await res.update({
            loggedAt: moment().format('YYYY-MM-DD HH:mm:ss')
          })
        }
        // 这里重新查询一次，否则 loggedAt 和 updatedAt 字段返回的还是没有格式化的（上面的更新操作影响的）
        return await model.User.findOne({
          where: { id },
          attributes
        })
      })
  }
}

module.exports = UserService
