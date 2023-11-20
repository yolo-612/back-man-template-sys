# 弹窗管理逻辑封装
1. 第一步封装出可以异步关闭展示的弹窗逻辑
主要的js逻辑是一段 promise链条，通过promise实现异步
    初始化定义：弹窗是否展示
    showDialog: [true, true],

    showDialogFunc(index) {
      return this.$refs[`modal${index}`].show();
    },

    let promise = Promise.resolve();
    this.showDialog.forEach((bool, index) => {
      if (bool) {
        promise = promise.then(() => this.showDialogFunc(index + 1));
      }
    });
每个独立的弹窗的展示都会返回一个promise，是单个异步任务，
在他close的时候 返回resolve的状态，执行后续的promise

2. 使用dialogTask方法实例化一个new DialogTask对象
   初始化引入弹窗实例
    taskDialog: [dialogTest2, dialogTest1],

    let promise = Promise.resolve();
    this.taskDialog.forEach((item) => {
      promise = promise.then(() => item.show());
    });

