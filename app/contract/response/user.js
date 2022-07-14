'use strict'

module.exports = {
  UserInfo: {
    id: { type: 'string', description: '用户 id' },
    openId: { type: 'string', description: '同微信的 openid' },
    nickName: { type: 'string', description: '用户昵称' },
    avatarUrl: { type: 'integer', description: '用户头像' },
    phone: { type: 'integer', description: '用户手机号码，可能为空' },
    loggedAt: { type: 'boolean', description: '最后登录时间' }
  }
}
