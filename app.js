'use strict'

module.exports = app => {
  app.beforeStart(async () => {
    if (app.config.env === 'local' || app.config.env === 'unittest') {
      // force 设置为 true 会重置数据库造成已有数据丢失，请谨慎修改
      // await app.model.sync({ force: false })
    }
  })
}
