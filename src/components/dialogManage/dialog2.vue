<template>
  <OneCloseDialog v-if="visible" @close="handleClose">
    <div class="modal-content">
      <p>弹窗2</p>
    </div>
  </OneCloseDialog>
</template>

<script>
import OneCloseDialog from './dialog';

export default {
  name: 'Dialog2',
  components: { OneCloseDialog },
  data() {
    return {
      visible: false, // 底部弹窗是否展示
      resolve: null,
      reject: null,
    };
  },
  methods: {
    show() {
      this.visible = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    close() {
      this.visible = false;
      this.resolve && this.resolve(true);
    },
    handleClose() {
      this.close();
    },
  },
};
</script>

<style scoped lang="less">
.modal-content {
  width: 200px;
  height: 300px;
  background-size: 300px 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: PingFang SC;
  background: #fff;
  p {
    margin-bottom: 20px;
    color: #ECD7D7;
    font-weight: 400;
    font-size: 66px;
    line-height: 22px;
    letter-spacing: 0px;
  }
}
</style>
