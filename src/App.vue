<!--
 * @Author: yolo
 * @Date: 2022-08-03 20:15:48
 * @Email: 2458097476@qq.com
 * @LastEditors: yolo
 * @LastEditTime: 2022-08-03 23:31:48
 * @Description: file information
-->
<template>
  <div id="app" class="AppPage">
    <a-layout id="components-layout-demo-custom-trigger">
      <a-layout-header>
      </a-layout-header>
      <a-layout>
        <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
          <div class="logo" />
          <AppSidebar :menu="menu" :tabsRef="$refs.appTabs" />
        </a-layout-sider>
        <a-layout-content
          class="main-contain"
          :style="{
            margin: '10px',
            padding: '0',
            background: '#fff',
          }"
        >
          <div class="view-tabs">
            <AppTabs ref="appTabs" @getRouteConfig="getRouteConfig" />
          </div>
          <div class="view-main">
            <keep-alive>
              <router-view v-if="$route.meta.cache" :key="$route.fullPath"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.cache" :key="$route.fullPath"></router-view>
          </div>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script>
// eslint-disable-next-line
import AppSidebar from '@/components/sideMenu/AppSiderMenu';
import AppTabs from '@/components/topTabs/AppTabs';

export default {
  name: 'App',
  components: {
    AppSidebar,
    AppTabs,
  },

  data() {
    return {
      collapsed: false,
    };
  },
  computed: {
    menu() {
      const routeMenu = this.$router.options.routes;
      return routeMenu;
    },
  },
  async created() {
    this.$router.push('/'); // 不允许链接直接进入某个页面
  },

  methods: {
    // 从 tab 里面传数据出来，然后处理数据用来做 keepAlive 的数组
    getRouteConfig(data) {
      console.log(data);
    },
  },
};
</script>

<style lang="less">
::-webkit-scrollbar-track-piece {
  //滚动条凹槽的颜色，还可以设置边框属性
  background-color: #f8f8f8;
}
::-webkit-scrollbar {
  //滚动条的宽度
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-thumb {
  //滚动条的设置
  background-color: gray;
  background-clip: padding-box;
  min-height: 28px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: gray;
}

#app {
  width: 100%;
  height: 100%;
  min-width: 1240px;
  color: #111;
  #components-layout-demo-custom-trigger {
    height: 100%;
    .ant-layout-header {
      display: flex;
      justify-content: space-between;
      padding: 0 24px;
      height: 60px;
      line-height: 60px;
      background-color: #000c17;
    }
    .main-contain.ant-layout-content {
      min-height: unset;
      display: flex;
      flex-direction: column;
    }
    .view-tabs {
      height: 56px;
    }
    .view-main {
      padding-left: 20px;
      padding-right: 20px;
      flex: 1;
    }
  }
}
</style>
