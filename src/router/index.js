import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const routes = [
  {
    path: '/test',
    name: 'Test',
    component: () => import(/* webpackChunkName: "manage" */'@/pages/test'),
  },
];

const routerConfig = {
  mode: 'history',
  base: process.env.VUE_APP_ROUTER_BASE,
  routes,
};

const router = new Router(routerConfig);

export default router;
