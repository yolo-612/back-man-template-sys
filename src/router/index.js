import Vue from 'vue';
import Router from 'vue-router';
import module from './module';

Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName:'manage' */ '@/pages/home'),
    meta: {
      title: '首页',
    },
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "manage" */'@/pages/test'),
    meta: {
      title: '测试页面1',
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName:'manage' */ '@/pages/login'),
    meta: {
      title: '登录',
      menuHide: true,
    },
  },
  module,
];

const routerConfig = {
  mode: 'history',
  base: process.env.VUE_APP_ROUTER_BASE,
  routes,
};

const router = new Router(routerConfig);

export default router;
