'use strict'

const { app } = require('egg-mock/bootstrap')

describe('test/app/controller/home.test.js', () => {
  it('访问首页 /', () => {
    return app.httpRequest()
      .get('/')
      .expect(200)
      .expect('首页')
  })
})
