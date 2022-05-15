'use strict'

/**
 * 测试环境
 */
const os = require('os')

module.exports = app => {
  const config = {}

  config.sequelize = {
    username: 'root',
    password: '',
    database: 'template_node_egg',
    host: '127.0.0.1',
    dialect: 'mysql'
  }

  // 自定义日志路径
  // https://eggjs.org/zh-cn/core/logger.html
  config.logger = {
    dir: `${os.homedir()}/logs/${app.name}-test`
  }

  return config
}
