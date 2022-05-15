'use strict'

/**
 * 微信数据解密
 */

const crypto = require('crypto')

class WechatCrypt {
  constructor(appId, sessionKey) {
    this.appId = appId
    this.sessionKey = sessionKey
  }

  decryptData(encryptedData, iv) {
    const sessionKey = Buffer.from(this.sessionKey, 'base64')
    encryptedData = Buffer.from(encryptedData, 'base64')
    iv = Buffer.from(iv, 'base64', encryptedData)
    let decoded

    try {
      // 解密
      const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
      // 设置自动 padding 为 true，删除填充补位
      decipher.setAutoPadding(true)
      decoded = decipher.update(encryptedData, 'binary', 'utf8')
      decoded += decipher.final('utf8')
      decoded = JSON.parse(decoded)
    } catch (error) {
      console.error(error)
      throw new Error('非法签名')
    }
    if (decoded.watermark.appid !== this.appId) {
      throw new Error('签名失败')
    }
    return decoded
  }
}

module.exports = WechatCrypt
