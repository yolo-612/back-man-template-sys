<template>
  <div class="modal-wrap" v-if="visible">
    <div class="content-box">
      <div class="title">支持导入速打地址啦～</div>
      <div class="content">
        <p>如需导入速打寄收地址，请用电脑登录顺丰企业服务平台，地址如下：</p>
        <div class="red-text">https://v.sf-express.com/</div>
      </div>
      <div class="line"></div>
      <div class="footer" @click="close()">
        我知道了
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialogTest1',
  props: {
  },
  data() {
    return {
      visible: true,
      dialogActObj: null,
    };
  },
  watch: {
  },
  methods: {
    show({ data: dialogActObj }) {
      this.dialogActObj = dialogActObj;
      this.visible = true;
    },
    close(action = 'close') {
      this.visible = false;
      this.$emit('close', { action });
    },
    onOk() {
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
.modal-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 0px;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-y: initial;
  /* 这里防止当用户长按屏幕，出现的黑色背景色块，以及 iPhone 横平时字体的缩放问题 */
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content-box {
    position: relative;
    padding-bottom: 160px;
    background: #FFFFFF;
    border-radius: 16px;
    width: 85%;
    // height: 2.36rem;
    padding-top: 40px;
    .title {
      font-style: normal;
      font-weight: 600;
      font-size: .17rem;
      line-height: .25rem;
      text-align: center;
      color: #000000;
      padding-bottom: .24rem;
    }
    .content {
      padding: 0px .32rem;
      font-style: normal;
      font-weight: 400;
      font-size: .15rem;
      line-height: .29rem;
      color: #333333;
      .red-text {
        font-size: .14rem;
        color: #D80C24;
      }
      .copy {
        display: inline-block;
        width: .46rem;
        height: .22rem;
        line-height: .22rem;
        text-align: center;
        background: #FFFFFF;
        border: 1px solid #D80C24;
        border-radius: .12rem;
        margin-left: .12rem;
      }
    }
  }
  .line {
    background-color: #E8E9EC;
    height: 1px;
    width: 100%;
    position: absolute;
    bottom: .55rem;
    transform: scaleY(0.5)
  }
  .footer {
    position: absolute;
    width: 100%;
    bottom: 0px;
    font-weight: 400;
    font-size: 34px;
    line-height: 48px;
    color: #000000;
    padding: 32px 0px;
    text-align: center;
  }
}
</style>
