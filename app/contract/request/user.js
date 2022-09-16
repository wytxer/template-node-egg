'use strict'

module.exports = {
  RequestLogin: {
    code: { type: 'string', required: true, description: '授权用户信息获取到的临时凭证', message: '临时登录凭证不能为空' },
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
    code: { type: 'string', required: true, message: '临时凭证不能为空', description: '授权手机号获取到的临时凭证' }
  }
}
