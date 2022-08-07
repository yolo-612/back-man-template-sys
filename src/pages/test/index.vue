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
    <a-button type="primary" @click="handleClick">Primary Button</a-button>
  </div>
</template>

<script>
import { getDistrctVersion } from '@/api/Test';
import { HttpError } from '@/utils/http';

export default {
  name: 'Test',
  created() {},
  methods: {
    // async版本1：
    async handleClick() {
      const params = { version: '1641146467' };
      try {
        const { obj = {} } = await getDistrctVersion(params);
        // 响应处理
        console.log(obj);
      } catch (error) {
        if (HttpError.isApiType(error)) {
          // Toast(HttpError.getMsg(error));
          console.log(HttpError.getMsg(error));
        } else {
          // Toast('网络异常，请稍后再试');
          console.log('网络异常，请稍后再试');
        }
      }
    },
    // promise版本2
    handleClick1() {
      const params = { version: '1641146467' };
      getDistrctVersion(params)
        .then((res) => {
          const { obj = {} } = res;
          // 响应处理
          console.log(obj);
        })
        .catch((error) => {
          if (HttpError.isApiType(error)) {
          // Toast(HttpError.getMsg(error));
            console.log(HttpError.getMsg(error));
          } else {
          // Toast('网络异常，请稍后再试');
            console.log('网络异常，请稍后再试');
          }
        });
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
