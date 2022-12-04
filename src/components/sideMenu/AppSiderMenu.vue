<template>
  <div class="app-sidebar">
    <a-menu
      mode="inline"
      theme="dark"
      :inline-collapsed="collapsed"
      :selectedKeys="keyPath"
      @click="menuClick"
    >
      <template v-for="subMenu in menu">
        <!-- 单菜单 -->
        <a-menu-item
          v-if="!subMenu.children && subMenu.meta && !subMenu.meta.menuHide"
          :key="`${subMenu.path}`"
        >
          <a-icon :type="subMenu.meta.icon || 'appstore'" />
          <span>{{ subMenu.meta.title || '未填写菜单名' }}</span>
        </a-menu-item>
        <!-- 内嵌菜单 -->
        <a-sub-menu
          v-else-if="
            subMenu.children &&
            subMenu.children.length > 0 &&
            !subMenu.meta.menuHide
          "
          :key="subMenu.path"
          :index="`${subMenu.path}_${subMenu.name}`"
        >
          <span slot="title">
            <a-icon :type="subMenu.meta.icon" />
            <span> {{ subMenu.meta.title }}</span>
          </span>
          <template v-for="item in subMenu.children">
            <!-- 分组菜单 -->
            <template v-if="item.meta.isGroup">
              <a-menu-item-group :key="item.path">
                <template slot="title">
                  <span>{{ item.meta.title }}</span>
                </template>
                <template v-for="groupItem in item.children">
                  <a-menu-item :key="groupItem.path">
                    {{ groupItem.meta.title }}
                  </a-menu-item>
                </template>
              </a-menu-item-group>
            </template>
            <!-- 二级菜单 -->
            <template v-else-if="!item.children">
              <a-menu-item v-if="!item.meta.menuHide" :key="item.path">
                {{ item.meta.title }}
              </a-menu-item>
            </template>
            <!-- 三级菜单 -->
            <template v-else>
              <a-sub-menu :key="item.path">
                <span slot="title">
                  <span>{{ item.meta.title }}</span>
                </span>
                <template v-for="children in item.children">
                  <a-menu-item :key="children.path">
                    {{ children.meta.title }}
                  </a-menu-item>
                </template>
              </a-sub-menu>
            </template>
          </template>
        </a-sub-menu>
      </template>
    </a-menu>
  </div>
</template>

<script>
// import { SIDEBAR_MENU } from "@/assets/scripts/config";
export default {
  name: 'AppSidebar',
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
    tabsRef: {
      type: Object,
      default: () => {},
    },
    homePageActivityKey: {
      type: String,
      default: '/',
    },
  },
  mounted() {
    console.log(this.menu);
  },
  data() {
    const defaultActivityKey = this.homePageActivityKey;
    return {
      sideBarMenuList: [],
      collapsed: false,
      keyPath: [defaultActivityKey],
    };
  },
  methods: {
    menuClick({ item, key, keyPath }) {
      console.log(item, key);
      const routeArray = keyPath.slice().reverse();
      let i = 0;
      let targetMenu = this.menu;
      // 遍历获取当前菜单对应路由信息
      while (i < routeArray.length) {
        const route = targetMenu.find(item => item.path === routeArray[i]);
        if (route.children) {
          if (route.children.find(item => item.meta.isGroup)) {
            targetMenu = [];
            route.children.forEach((item) => {
              item.children.forEach(value => targetMenu.push(value));
            });
          } else {
            targetMenu = route.children;
          }
        } else {
          targetMenu = route;
        }
        i++;
      }
      const routeConfig = {
        meta: targetMenu.meta,
        key: targetMenu.path,
        title: targetMenu.meta.title,
        name: targetMenu.name,
      };
      this.tabsRef.openTab(routeConfig);

      console.log(targetMenu.path, this.$route.path);
      if (this.$route.path === targetMenu.path) return;
      this.$router.push({
        path: targetMenu.path,
      });
    },
  },
  watch: {
    $route: {
      immediate: true,
      handler(to) {
        const keyPath = [];
        to && to.matched.forEach((item) => {
          if (!item.meta && item.meta.isGroup) {
            keyPath.push(item.path || this.homePageActivityKey);
          }
        });
        this.keyPath = keyPath.slice().reverse();
      },
    },
  },
};
</script>

<style lang="less"></style>
