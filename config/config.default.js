'use strict'

/**
 * 默认的应用配置
 */

const { getLocalhost } = require('../app/extend/helper')

module.exports = app => {
  const config = {}

  /**
   * cookie 签名 token，建议修改
   */
  const key = '_1625119468325'
  config.keys = app.name + key

  /**
   * 中间件配置
   */
  config.middleware = [ 'catchError', 'permission' ]

  /**
   * 数据库相关配置
   */
  config.sequelize = {
    // 全局配置
    define: {
      // 是否自动进行下划线转换（这里是因为 DB 默认的命名规则是下划线方式，而我们使用的大多数是驼峰方式）
      underscored: true,
      // 启用 sequelize 默认时间戳设置
      timestamps: true,
      // 禁用 sequelize 默认给表名设置复数
      freezeTableName: true
    },
    // 时区修正
    timezone: '+08:00',
    // 格式化返回的数据结构
    dialectOptions: {
      dateStrings: true,
      typeCast: true
    }
  }

  /**
   * 自定义的应用配置，修改后全局生效
   */
  // 接口前缀名称，跟随业务系统修改
  const apiPrefixName = 'api'
  // 接口完整前缀
  const apiPrefix = `/${apiPrefixName}`
  const userConfig = {
    // 应用名称，用于日志文件目录指定、cookie 的 key 指定，具有唯一性，默认是 app.name，也可以改成其他字符串
    appName: app.name,
    apiPrefixName,
    apiPrefix,
    // 默认的 code 码和错误提示信息配置，只需要改这一个地方即可
    resCode: {
      // 服务器异常的 code 标识和提示，一般都不需要改
      serverError: { code: 500, message: '服务器异常' },
      // 成功的 code 标识
      success: { code: 0 },
      // 出错的 code 标识和提示
      error: { code: 602, message: '参数异常' },
      // 未登录的 code 标识和提示
      notLogged: { code: 601, message: '请先登录后再操作' }
    }
  }

  /**
   * cookie 配置
   */
  // 默认的 cookie 失效时间配置
  config.session = {
    key: `_${userConfig.appName}_${apiPrefixName}_`,
    // 3 天
    maxAge: 24 * 3600 * 1000 * 3,
    httpOnly: true,
    encrypt: true
  }

  /**
   * 安全策略配置
   */
  config.security = {
    // 关闭 CSRF 攻击防御（伪造用户请求向网站发起恶意请求）
    // csrf: {
    //   enable: false
    // }
  }
  // 设置白名单
  const port = 9001 // 前端端口，跟随实际情况修改
  const domainWhiteList = [
    ...new Set([
      `http://127.0.0.1:${port}`,
      `http://localhost:${port}`,
      // 服务启动时尝试自动获取本机 IP 设置白名单
      `http://${getLocalhost()}:${port}`
    ])
  ]
  config.security = { domainWhiteList }
  // 默认允许跨域，生产环境关闭此设置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  }

  /**
   * 权限配置
   */
  config.permission = {
    // 接口白名单配置
    whiteUrls: [
      `${apiPrefix}/v1/user/mock`,
      `${apiPrefix}/v1/user/login`,
      `${apiPrefix}/v1/user/logout`,
      `${apiPrefix}/v1/user/phone`
    ]
  }

  /**
   * 参数校验配置
   */
  config.validatePlus = {
    // 校验通过了始终返回 true，不通过返回 false
    resolveError(ctx, errors) {
      if (errors.length) {
        // 始终返回第一个错误
        ctx.body = {
          code: userConfig.resCode.error.code,
          message: errors[0].message
        }
      }
    }
  }

  /**
   * 自动生成文档配置
   * 文档地址：https://github.com/Yanshijie-EL/egg-swagger-doc/blob/master/config/config.default.js
   */
  config.swaggerdoc = {
    dirScanner: './app/controller',
    basePath: apiPrefix,
    apiInfo: {
      title: '接口平台',
      description: `${userConfig.appName} 接口平台。`,
      version: '1.0.0'
    },
    schemes: [ 'http', 'https' ]
  }

  /**
   * 小程序平台相关配置，可往下新增头条小程序、百度小程序、钉钉小程序等相关配置
   */
  // 微信小程序配置
  config.wxapp = {
    appId: '',
    secret: ''
  }

  return {
    ...config,
    ...userConfig
  }
}
