'use strict'

module.exports = {
  RequestLogin: {
    code: { type: 'string', required: true, description: '小程序返回的 code，用来换取 token 凭证', message: '鉴权需要的 code 不能为空' },
    nickName: { type: 'string', required: true, description: '用户昵称', message: '昵称不能为空' },
    avatarUrl: { type: 'string', required: true, description: '用户昵称', message: '头像不能为空' },
    phone: { type: 'string', required: false, description: '用户手机号码' },
    gender: { type: 'number', required: false, description: '用户性别' },
    province: { type: 'string', required: false, description: '用户所在省份' },
    city: { type: 'string', required: false, description: '用户所在城市' },
    language: { type: 'string', required: false, description: '用户使用语言' }
  },
  RequestPhone: {
    userId: { type: 'number', required: true, message: '用户标识不能为空', description: '用户 id' },
    iv: { type: 'string', required: true, message: '初始向量不能为空', description: '同微信的 iv' },
    encryptedData: { type: 'string', required: true, message: '加密数据不能为空', description: '同微信的 encryptedData' }
  }
}
