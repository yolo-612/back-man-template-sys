<template>
    <div class="OneCloseDialog">
      <div class="content-box">
        <slot name="close">
          <div
            v-if="showCloseBtn"
            class="close"
            :class="{'lottie-close' : type === 1}"
            @click.self.prevent="onClose"
          />
        </slot>
        <slot>
          <img class="image" :src="image" @click="onClick"/>
        </slot>
      </div>
    </div>
</template>

<script>
/*
 * 上面内容和下面关闭按钮的弹窗
 * */
export default {
  name: 'OneCloseDialog',
  components: {},
  emit: ['close', 'click'],
  props: {
    image: {
      type: String,
      default: '',
    },
    showCloseBtn: {
      type: Boolean,
      default: true,
    }, // 是否显示关闭按钮
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },

  created() {
  },
  mounted() {
  },
  methods: {
    onClose() {
      this.$emit('close');
    },
    onClick() {
      this.$emit('click');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@vw: 1 / 750 * 100vw;

.OneCloseDialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 0px;
  background-color: rgba(0, 0, 0, 0.7);
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
    padding-bottom: 60px;

    .image {
      display: block;
      width: 566px;
      height: 202px;
    }

    .close {
      position: absolute;
      top: -100px;
      right: -4px;
      cursor: pointer;
      width: 70px;
      height: 70px;
      background-size: 100%;
      background-color: #FFF;
      z-index: 10;

      &.lottie-close {
        left: 50%;
        top: 50%;
        margin: 10px;
      }
    }
  }
}
</style>
