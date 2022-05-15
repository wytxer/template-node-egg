'use strict'

/**
 * 模块的接口定义，是给 egg-swagger-doc 用的，message 字段主要是给接口字段校验用的，如果想要启用 swagger-ui 的接口文档功能，建议在 contract 目录下使用 message 定义接口字段校验以复用字段结构，然后用 ctx.rule.xxx 去校验。例如 ctx.validate(ctx.rule.phone, ctx.request.query)
 * 更多 type 支持：https://github.com/yiminghe/async-validator
 */

module.exports = {
  login: {
    code: { type: 'string', required: true, description: '小程序返回的 code，用来换取 token 凭证', message: '鉴权需要的 code 不能为空' },
    nickName: { type: 'string', required: true, description: '用户昵称', message: '昵称不能为空' },
    avatarUrl: { type: 'string', required: true, description: '用户昵称', message: '头像不能为空' },
    phone: { type: 'string', required: false, description: '用户手机号码' },
    gender: { type: 'number', required: false, description: '用户性别' },
    province: { type: 'string', required: false, description: '用户所在省份' },
    city: { type: 'string', required: false, description: '用户所在城市' },
    language: { type: 'string', required: false, description: '用户使用语言' }
  },
  phone: {
    sessionKey: { type: 'string', required: true, message: '凭证不能为空', description: '同微信的 sessionKey' },
    userId: { type: 'string', required: true, message: '用户标识不能为空', description: '用户 id' },
    iv: { type: 'string', required: true, message: '初始向量不能为空', description: '同微信的 iv' },
    encryptedData: { type: 'string', required: true, message: '加密数据不能为空', description: '同微信的 encryptedData' }
  }
}
