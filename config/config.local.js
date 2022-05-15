/* eslint-disable no-unused-vars */
'use strict'

/**
 * 本地环境
 */

module.exports = app => {
  const config = {}

  config.sequelize = {
    username: 'root',
    password: '',
    database: 'template_node_egg',
    host: '127.0.0.1',
    dialect: 'mysql'
  }

  return config
}
