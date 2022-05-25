'use strict'

module.exports = app => {
  app.beforeStart(async () => {
    if (app.config.env === 'local' || app.config.env === 'unittest') {
      // force 设置为 true 可强制覆盖表结构，同时已有的数据也有丢失
      // await app.model.sync({ force: false })
    }
  })
}
