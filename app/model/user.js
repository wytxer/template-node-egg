'use strict'

/**
 * 用户表
 */

module.exports = app => {
  const { TEXT, STRING, INTEGER, DATE } = app.Sequelize

  const User = app.model.define('user', {
    openId: {
      type: STRING(255),
      allowNull: false,
      comment: '同微信的 openid'
    },
    unionId: {
      type: STRING(255),
      comment: '同微信的 unionid，作为预留字段，不一定有值'
    },
    nickName: {
      type: STRING(255),
      allowNull: false,
      comment: '昵称，同微信的 nickName'
    },
    password: {
      type: STRING(255),
      comment: '登录密码，作为预留字段，不一定有值'
    },
    avatarUrl: {
      type: TEXT,
      allowNull: false,
      comment: '头像，同微信的 avatarUrl'
    },
    phone: {
      type: STRING(255),
      comment: '手机号码，可能为空'
    },
    gender: {
      type: INTEGER,
      comment: '性别，可能为空'
    },
    country: {
      type: STRING(255),
      comment: '国家，可能为空'
    },
    province: {
      type: STRING(255),
      comment: '省份，可能为空'
    },
    city: {
      type: STRING(255),
      comment: '城市，可能为空'
    },
    language: {
      type: STRING(255),
      comment: '语言，可能为空'
    },
    loggedAt: {
      type: DATE,
      comment: '最后登录时间'
    }
  })

  return User
}
