'use strict'

const Service = require('egg').Service
const moment = require('moment')

// 用户信息要返回的字段
const attributes = [ 'id', 'openId', 'nickName', 'avatarUrl', 'phone', 'loggedAt' ]

class UserService extends Service {
  // 登录
  async login(values) {
    const { model } = this.ctx

    // 先根据 unionId 查找用户是否存在
    return await model.User.findOne({ where: { unionId: values.unionId }, attributes })
      .then(async user => {
        // 如果未找到，尝试使用 openId 查找用户是否存在
        if (!user) {
          user = await model.User.findOne({ where: { openId: values.openId }, attributes })
        }
        let newUser
        // 如果找到了用户，更新用户信息
        if (user) {
          newUser = user
          await model.User.update(values, { where: { id: user.id } })
        } else {
          // 否则新增一个用户
          newUser = await model.User.create(values)
        }
        // 更新用户登录时间
        const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        await model.User.update({ loggedAt }, { where: { id: newUser.id } })
        // 返回最新的用户信息
        return await model.User.findOne({ where: { id: newUser.id }, attributes })
          .then(res => res.toJSON())
      })
  }

  // 保存手机号码
  async savePhone(id, phone) {
    const { model } = this.ctx

    return await model.User.findOne({
      where: { id },
      attributes: [ 'id', 'phone' ]
    })
      .then(async res => {
        if (res) {
          const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
          await res.update({ phone, loggedAt })
          return await model.User.findOne({ where: { id: res.id }, attributes })
            .then(res => res.toJSON())
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
      .then(async res => {
        if (res) {
          // 更新登录时间
          const loggedAt = moment().format('YYYY-MM-DD HH:mm:ss')
          await res.update({ loggedAt })
          return await model.User.findOne({
            where: { id },
            attributes
          })
            .then(user => user.toJSON())
        }
        return false
      })
  }
}

module.exports = UserService
