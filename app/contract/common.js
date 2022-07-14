'use strict'

/**
 * egg-swagger-doc 提供的接口文档配置，公共的 DTO 结构可以定义在这里
 * 可以在结构里面定义 message 等校验字段，然后用 ctx.rule.xxx 去校验请求数据。例如 ctx.validate(ctx.rule.Phone, ctx.request.query)
 * 更多 type 支持：https://github.com/yiminghe/async-validator
 */

module.exports = {
  // 通用的标签字段
  CommonLabelInfo: {
    value: { type: 'number', description: '字段值' },
    label: { type: 'string', description: '字段名称' }
  },
  // 通用的查询字段
  CommonQueryInfo: {
    id: { type: 'number', description: 'id' },
    name: { type: 'string', description: '名称' }
  }
}
