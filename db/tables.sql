/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : localhost:3306
 Source Schema         : template_node_egg

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : 65001

 Date: 02/01/2022 23:22:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(255) NOT NULL COMMENT '同微信的 openid',
  `union_id` varchar(255) DEFAULT NULL COMMENT '同微信的 unionid，作为预留字段，不一定有值',
  `nick_name` varchar(255) CHARACTER SET utf8mb4 NOT NULL COMMENT '昵称，同微信的 nickName',
  `password` varchar(255) DEFAULT NULL COMMENT '登录密码，作为预留字段，不一定有值',
  `avatar_url` text NOT NULL COMMENT '头像，同微信的 avatarUrl',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机号码，可能为空',
  `gender` int(11) DEFAULT NULL COMMENT '性别，可能为空',
  `country` varchar(255) DEFAULT NULL COMMENT '国家，可能为空',
  `province` varchar(255) DEFAULT NULL COMMENT '省份，可能为空',
  `city` varchar(255) DEFAULT NULL COMMENT '城市，可能为空',
  `language` varchar(255) DEFAULT NULL COMMENT '语言，可能为空',
  `logged_at` datetime DEFAULT NULL COMMENT '最后登录时间',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1000 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (1000, 'o8FXk5E4u7hwaguN6kSq-KPXApJ1', NULL, '测试账号', NULL, 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20180520%2F0473e00bdfd2476fbe0c228a45a1652c.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628131130&t=05ee794a54bad8edd2fd8bb2536db5b9', NULL, NULL, NULL, NULL, NULL, NULL, '2022-01-01 23:59:59', '2022-01-01 23:59:59', '2022-01-01 23:59:59');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
