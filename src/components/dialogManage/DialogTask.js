import Vue from 'vue';
import dialogParentElement from './dialogParentElement';

export default class DialogTask {
  key = ''; // 弹窗key
  name = ''; // 弹框名称
  level = 0;// 层级
  showDialog = false; // 是否显示弹窗：asyncData返回的showDialog
  data = null;// 弹窗数据，asyncData返回的data
  compOptions = null// 组件
  /**
   * 获取数据方法(缓存判断、开关接口),最后返回是否显示弹窗showDialog和data对象，data会传给组件的showData方法
   * @param refresh 强制刷新
   * @returns {Promise<{showDialog: boolean, data: {a: number}}>}
   */
  /* eslint-disable */
  asyncData(refresh) {
    return Promise.resolve().then(() => {
      const data = {};
      return {
        showDialog: true, // 是否显示弹窗
        data, // 业务数据
      };
    });
  }
  dialogUIOptions={}; // 弹窗组件UI配置（预留后期扩展）

  compVm = null;// 组件实例
  showDialogResolve = null;
  showDialogReject = null;
  showDialogPromise = null;// 弹窗promise
  asyncDataPromise = null;// 获取数据promise
  parentElement = null;

  constructor({ key, name, level, compOptions, asyncData, parentElement, dialogUIOptions } = {}) {
    this.key = key;
    this.name = name;
    this.level = level;
    this.compOptions = compOptions;
    this.asyncData = asyncData;
    this.parentElement = parentElement || dialogParentElement;
    this.dialogUIOptions = { ...this.dialogUIOptions, ...dialogUIOptions };
  }

  /**
   * @param refresh 重新获取数据，否则，会复用asyncDataPromise
   * @returns {Promise}
   */
  getAsyncDataPromise(refresh = false) {
    if (!this.asyncDataPromise || refresh) {
      this.asyncDataPromise = this.asyncData(refresh)
        .catch(() => ({ showDialog: false, data: null })) // 预防loadData的reject中断整个promise.all
        .then(({ showDialog, data }) => {
          // 将返回接口设置到task上
          this.showDialog = showDialog;
          this.data = data;
          return { showDialog, data };
        });
    }
    return this.asyncDataPromise;
  }

  show() {
    this.showDialogPromise = new Promise((resolve, reject) => {
      this.showDialogResolve = resolve;
      this.showDialogReject = reject;

      // 显示，挂载组件
      const CompConstruction = Vue.extend(this.compOptions);
      this.compVm = new CompConstruction();
      // 监听关闭事件
      if (this.compVm.$on) {
        // action 'close':关闭事件 'click':点击事件
        this.compVm.$on('close', ({ type = '', action = '' } = {}) => {
          this.close(type, action);
        });
      }
      this.compVm.$mount();
      this.parentElement.appendChild(this.compVm.$el);
      this.compVm.show({
        showDialog: this.showDialog,
        data: this.data,
        dialogUIOptions: this.dialogUIOptions,
      });
    });
    return this.showDialogPromise;
  }

  /**
   * 关闭弹窗
   * @param type 关闭类型，break=阻断后面的弹窗
   * @param action 关闭行为(场景)，close:关闭 click:点击
   */
  close(type = '', action = '') {
    if (['click', 'close'].indexOf(action) === -1) return;
    if (this.compVm) {
      // 销毁组件
      this.compVm.$destroy();
      if (this.parentElement.contains(this.compVm.$el)) {
        this.parentElement.removeChild(this.compVm.$el);
      }
      this.compVm = null;
    }
    // 加一点延迟，下一个弹窗体验更好
    setTimeout(() => {
      if (type === 'break') {
        this.showDialogReject && this.showDialogReject();
      } else {
        this.showDialogResolve && this.showDialogResolve();
      }
    }, 300);
  }
}
