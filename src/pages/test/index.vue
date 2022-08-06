<!--
 * @Author: yolo
 * @Date: 2022-08-03 21:07:39
 * @Email: 2458097476@qq.com
 * @LastEditors: yolo
 * @LastEditTime: 2022-08-04 00:25:26
 * @Description: file information
-->
<template>
  <div class="test-box">
    <span>1111</span>
    <span class="span-2">222</span>
    <a-button type="primary">Primary Button</a-button>
  </div>
</template>

<script>
export default {
  name: 'Test',
  created() {
  },
  methods: {
    haha() {
      console.log(112312312);
    },
  },
};
</script>

<style lang="less" scoped >
.test-box{
  background-color: red;
  .span-2{
    color: #fff;
  }
}
</style>
