/*
 * @Author: yolo
 * @Date: 2022-08-03 20:15:48
 * @Email: 2458097476@qq.com
 * @LastEditors: yolo
 * @LastEditTime: 2022-08-04 00:28:58
 * @Description: file information
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import '@/assets/styles/global.css';
import 'ant-design-vue/dist/antd.css';

Vue.config.productionTip = false;

// 加载插件，插件统一都都写在plugin文件夹下
const pluginsFiles = require.context('./plugins', false, /\.js$/);
pluginsFiles.keys().forEach((key) => {
  pluginsFiles(key).default &&
    pluginsFiles(key).default({ App, router, store });
});

// TODO:路由守卫

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});
