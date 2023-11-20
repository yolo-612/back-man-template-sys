<template>
  <div class="main-box">
    <a-row class="login-text">hello_首页</a-row>
    <a-spin size="large" />

  </div>
</template>

<script>
/* eslint-disable */
const loadDialogManager = import('../../components/dialogManage/DialogManager.js').then(module => module.default);


export default {
  name: 'Home',
  data() {
    return {
      ticket: '',
      showDialog: [true, true],
    };
  },
  components: {

  },
  methods: {
    showDialogFunc(index) {
      return this.$refs[`modal${index}`].show();
    },
  },
  mounted() {
    loadDialogManager.then((DialogManager) => {
      DialogManager.getInstance().startTask(true);
    });
  },
};
</script>

<style lang="less">
.main-box {
  .login-text {
    margin-bottom: 20px;
  }
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
