/*
 * @Author: yolo
 * @Date: 2022-08-03 20:15:48
 * @Email: 2458097476@qq.com
 * @LastEditors: yolo
 * @LastEditTime: 2022-08-03 21:47:40
 * @Description: file information
 */
'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // vue-router的base
  VUE_APP_ROUTER_BASE: '"manage"',
  // api代理的接口域名
  VUE_APP_BASE_URL: '"http://v.sit.sf-express.com/"'
})
