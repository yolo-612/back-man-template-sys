export default {
  path: '/module',
  name: 'module',
  meta: {
    title: '模块',
    icon: 'shop',
  },
  component: { render: e => e('router-view') },
  children: [
    {
      path: '/module/children1',
      name: 'children1',
      component: () => import(/* webpackChunkName: "manage" */'@/pages/module/children1'),
      meta: {
        title: '模块1子菜单',
        cache: true,
      },
    },
    {
      path: '/module/children2',
      name: 'children2',
      component: () => import(/* webpackChunkName: "manage" */'@/pages/module/children2'),
      meta: {
        title: '模块1子菜单2',
        cache: true,
      },
    },
    {
      path: '/module/children3',
      name: 'children3',
      component: () => import(/* webpackChunkName: "manage" */'@/pages/test'),
      meta: {
        title: '模块1子菜单3',
        cache: true,
        menuHide: true,
      },
    },
  ],
};
