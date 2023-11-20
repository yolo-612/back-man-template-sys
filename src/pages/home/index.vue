<template>
  <div class="main-box">
    <a-row class="login-text">hello_首页</a-row>
    <a-spin size="large" />
    <Modal1 ref="modal1"/>
    <Modal2 ref="modal2"/>
  </div>
</template>

<script>
import Modal1 from '../../components/dialogManage/dialog1';
import Modal2 from '../../components/dialogManage/dialog2';
import dialogTest1 from '../../components/dialogManage/dialogTest1';
import dialogTest2 from '../../components/dialogManage/dialogTest2';


export default {
  name: 'Home',
  data() {
    return {
      ticket: '',
      showDialog: [true, true],
      taskDialog: [dialogTest2, dialogTest1],
    };
  },
  components: {
    Modal1,
    Modal2,
  },
  methods: {
    showDialogFunc(index) {
      return this.$refs[`modal${index}`].show();
    },
  },
  mounted() {
    let promise = Promise.resolve();
    this.taskDialog.forEach((item) => {
      promise = promise.then(() => item.show());
    });
    // 简单demo
    // this.showDialog.forEach((bool, index) => {
    //   if (bool) {
    //     promise = promise.then(() => this.showDialogFunc(index + 1));
    //   }
    // });
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
