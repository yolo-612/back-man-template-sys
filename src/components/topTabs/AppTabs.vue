<template>
  <a-tabs
    v-model="currentTabCache"
    type="editable-card"
    @edit="tabsEdit"
    @change="change"
    hide-add
  >
    <a-tab-pane
      v-for="pane in tabsCache"
      :key="pane.key"
      :tab="pane.title"
      :closable="pane.key !== '/'"
    >
    </a-tab-pane>
  </a-tabs>
</template>
<script>
export default {
  name: 'AppTabs',
  props: {
    // 是否开启 tabs 缓存
    isCacheTabs: {
      type: Boolean,
      default: false,
    },
    // 首页的默认配置
    homePageConfig: {
      type: Object,
      default: () => ({
        title: '首页',
        key: '/',
      }),
    },
    // 默认激活 tabs 的 key 值
    homePageActivityKey: {
      type: String,
      default: '/',
    },
  },
  data() {
    const homeConfig = this.homePageConfig;
    const defaultActivityKey = this.homePageActivityKey;
    return {
      tabsCache: [homeConfig],
      currentTabCache: defaultActivityKey,
      tabs: JSON.parse(localStorage.getItem('tabsCache')) || [homeConfig],
      currentTab: defaultActivityKey,
    };
  },
  mounted() {
    this.$bus.$on('close-current-tab', (currentTabKey) => {
      !currentTabKey && (currentTabKey = this.$route.fullPath);
      this.remove(currentTabKey);
    });
  },
  methods: {
    /**
     * 打开 Tab
     * @param {Object} config tab 和 route 的配置结合
     */
    openTab(config) {
      const tabCurrentData = JSON.parse(JSON.stringify(this.tabs));
      const { key } = config;
      if (!tabCurrentData.find(item => item.key === key)) {
        const routeConfig = {
          ...config.meta,
          name: config.name,
        };
        this.tabs.push({
          title: config.title,
          key,
          routeConfig,
        });
      }
      this.currentTab = key;
      this.isCacheTabs && this.saveLocalStorage(this.tabs, this.currentTab);
      this.getRouteConfig(this.tabs);
      // console.log(75, this.tabs, this.$route);
    },
    /**
     * 切换 tab
     * @param {String} activeTab 当前点击的 tab
     */
    change(activeTab) {
      this.$router.push({
        path: activeTab,
      });
    },
    tabsEdit(targetKey, action) {
      // console.log(86, targetKey, action);
      this[action](targetKey);
    },
    /**
     * 删除 tab
     * @param {String} targetKey 目标 tab 的 key
     */
    remove(targetKey) {
      let currentTab;
      let tabsCache;
      let lastIndex;

      if (this.isCacheTabs) {
        tabsCache = JSON.parse(localStorage.getItem('tabsCache'))
          || JSON.parse(JSON.stringify(this.tabs));
        currentTab = localStorage.getItem('currentTabCache') || this.currentTab;
      } else {
        tabsCache = JSON.parse(JSON.stringify(this.tabs));
        currentTab = this.currentTab;
      }

      tabsCache.forEach((pane, i) => {
        if (pane.key === targetKey) {
          lastIndex = i - 1;
        }
      });
      const tabs = tabsCache.filter(pane => pane.key !== targetKey);
      if (tabs.length && currentTab === targetKey) {
        if (lastIndex >= 0) {
          currentTab = tabs[lastIndex].key;
        } else {
          currentTab = tabs[0].key;
        }
      }
      this.tabs = JSON.parse(JSON.stringify(tabs));
      this.currentTab = currentTab;
      this.$router.push({
        path: currentTab,
      });

      this.isCacheTabs && this.saveLocalStorage(tabs, currentTab);
      this.getRouteConfig(tabs);
    },
    /**
     * 获取路由配置钩子函数
     * @param {Array} tabs 当前 tabs 值
     */
    getRouteConfig(tabs) {
      this.$emit('getRouteConfig', tabs);
    },
    /**
     * 保存当前 tabs 配置
     * @param {Array} tabs 当前 tabs 数组
     * @param {String} currentTab 当前 tabs 激活 key 值
     */
    saveLocalStorage(tabs, currentTab) {
      localStorage.setItem('tabsCache', JSON.stringify(tabs));
      localStorage.setItem('currentTabCache', currentTab);
    },

    /**
     * 重置当前的tabs
     */
    resetTabs() {
      this.tabs = [this.homePageConfig];
      this.tabsCache = [this.homePageConfig];
    },
  },
  watch: {
    tabs: {
      immediate: true,
      handler(to) {
        const tabsCache = JSON.parse(localStorage.getItem('tabsCache')) || [];
        if (to.length === 1 && tabsCache.length > 1) {
          this.$nextTick(() => {
            this.tabsCache = JSON.parse(JSON.stringify(tabsCache));
          });
        } else {
          this.$nextTick(() => {
            this.tabsCache = JSON.parse(JSON.stringify(to));
          });
        }
      },
    },
    currentTab: {
      immediate: true,
      handler(to) {
        this.currentTabCache = this.isCacheTabs
          ? localStorage.getItem('currentTabCache')
          : to;
      },
    },
    $route: {
      immediate: true,
      handler(to) {
        const config = {
          key: to.fullPath || to.path,
          title: to.meta.title,
          meta: to.meta,
          name: to.name,
        };
        this.openTab(config);
      },
    },
    isCacheTabs: {
      immediate: true,
      handler(to) {
        if (!to) {
          localStorage.removeItem('tabsCache');
          localStorage.removeItem('currentTabCache');
        }
      },
    },
  },
};
</script>
