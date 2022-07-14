'use strict'

const { app, assert } = require('egg-mock/bootstrap')

describe('test/app/controller/home.test.js', () => {
  it('获取用户信息', async () => {
    const ctx = app.mockContext()
    const user = await ctx.service.user.info(1000)
    assert(user)
    assert(user.id === 1000)
  })
})
