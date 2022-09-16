'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/user.test.js', () => {
  it('mock 登录', () => {
    return app.httpRequest()
      .get('/api/v1/user/mock?userId=1000')
      .type('json')
      .expect(200)
      .expect(res => {
        assert(res.body.code === 0 && res.body.data.id === 1000)
      })
  })

  it('获取用户信息', () => {
    return app.httpRequest()
      .get('/api/v1/user/info')
      .type('json')
      .expect(200)
      .expect(res => {
        assert(res.body.code === 601)
      })
  })
})
