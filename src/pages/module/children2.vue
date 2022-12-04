<template>
  <div class="main-box">
    <a-row class="login-text">hello_children2</a-row>
  </div>
</template>

<script>
export default {
  name: 'Children2',
  data() {
    return {
      ticket: '',
    };
  },
  methods: {},
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
