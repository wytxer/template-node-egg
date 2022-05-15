'use strict'

const os = require('os')
const { v4: uuidv4 } = require('uuid')
const WechatCrypt = require('./wechatCrypt')

/**
 * 新旧接口兼容的版本号标识，有不兼容的代码时更新该版本号，主要为了应对审核以及通过 24h 内没有更新到最新版本的用户
 * 当需要发新版本时，用户已全部更新到最新版本，所以每次只要有不兼容的更新，只需要更新该版本号即可
 */
const version = [ 1, 0, 0 ]

module.exports = {
  /**
   * 将菜单拆解成顶层的一级菜单和根据 parentId 进行分类好的子菜单
   * @param {array} data 菜单列表
   * @return {array} 组装好的菜单树
   */
  treeMenu(data) {
    if (data.length <= 0) {
      return []
    }
    // 最终要返回的菜单列表
    const menus = []
    // 所有的子菜单
    const children = {}
    data.forEach(menu => {
      delete menu.createdAt
      delete menu.updatedAt
      if (menu.meta) {
        menu.meta = JSON.parse(menu.meta)
      }
      // 取出顶层菜单
      if (menu.parentId === 0 && !menus.find(m => m.id === menu.id)) {
        menus.push(menu)
      } else {
        // 初始化子菜单列表
        if (!children[menu.parentId]) {
          children[menu.parentId] = []
        }
        // 如果当前子菜单在列表里面的话添加进去
        if (!children[menu.parentId].find(child => child.id === menu.id)) {
          children[menu.parentId].push(menu)
        }
      }
    })
    // 递归把子菜单挂载到 menus 上
    const treeMenu = () => {
      let currentChildren = []
      if (Object.keys(children).length <= 0) {
        return
      }
      menus.forEach(item => {
        if (children[item.id]) {
          item.children = item.children || []
          item.children = children[item.id]
          currentChildren = currentChildren.concat(children[item.id])
          delete children[item.id]
        }
      })
      if (currentChildren.length) {
        treeMenu(currentChildren, children)
      }
    }
    treeMenu()
    return menus
  },
  /**
   * 生成 uid
   * @return {string} 例如：9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d
   */
  createUid() {
    return uuidv4()
  },
  /**
   * 解密微信数据
   * @param {String} data 微信数据
   * @param {string} data.appId 微信公众号的 appId
   * @param {string} data.sessionKey 微信授权登录成功后的 sessionKey
   * @param {string} data.encryptedData 需要解密的数据
   * @param {string} data.iv 初始向量
   * @return {*} 返回解密后的数据
   */
  wechatCrypt({ appId, sessionKey, encryptedData, iv }) {
    const pc = new WechatCrypt(appId, sessionKey)
    return pc.decryptData(encryptedData, iv)
  },
  /**
   * 判断版本号是否大于指定版本
   * @param {string} v1 当前版本号
   * @param {string} v2 目标版本号
   * @return {number} 对比结果，1：当前版本大于指定版本，0：当前版本等于指定版本，-1：当前版本小于指定版本
   */
  thanVersion(v1, v2) {
    v1 = v1.split('.')
    // 如果没传递目标版本号，则默认使用内置的版本号
    v2 = v2 ? v2.split('.') : version
    const len = Math.max(v1.length, v2.length)
    // 补全版本号位数
    while (v1.length < len) {
      v1.push('0')
    }
    while (v2.length < len) {
      v2.push('0')
    }
    // 对比版本号
    for (let i = 0; i < len; i++) {
      const num1 = parseInt(v1[i])
      const num2 = parseInt(v2[i])
      if (num1 > num2) {
        return 1
      } else if (num1 < num2) {
        return -1
      }
    }
    return 0
  },
  /**
   * JSON 转字符串
   * @param {*} data 数据源
   * @return {string} 转换后的 JSON 字符串
   */
  stringify(data) {
    return JSON.stringify(data)
  },
  /**
   * JSON 字符串转 JSON
   * @param {*} data 数据源
   * @return {*} JSON
   */
  parse(data) {
    return JSON.parse(data)
  },
  /**
   * 简单的数据拷贝
   * @param {*} data 数据源
   * @return {*} 拷贝后的数据
   */
  clone(data) {
    return JSON.parse(JSON.stringify(data))
  },
  /**
   * 获取本机 IP 地址
   * @return {string} IP 地址
   */
  getLocalhost() {
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
      const iface = interfaces[devName]
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
    return '127.0.0.1'
  },
  /**
   * 请求体部分
   */
  /**
   * 请求成功
   * @param {object} data 响应数据，可以是对象或者数组
   * @param {string} message 提示信息
   */
  success(data, message) {
    const { ctx } = this
    ctx.body = {
      ...ctx.app.config.resCode.success,
      data,
      message
    }
  },
  /**
   * 参数异常
   * @param {object} data 响应数据，可以是对象或者数组
   * @param {string} message 提示信息
   */
  error(data, message) {
    const { ctx } = this
    ctx.body = {
      ...ctx.app.config.resCode.error,
      data,
      message
    }
  },
  /**
   * 未登录
   */
  notLogged() {
    const { ctx } = this
    ctx.body = ctx.app.config.resCode.notLogged
  }
}
