// - DialogManager：控制弹窗显示，统一挂载到body
// - 通过promise的链式调用实现按顺序显示弹窗
// 集合维护所有的弹窗
import dialog1 from './dialogTest1/index';
import dialog2 from './dialogTest2/index';

// startTask函数是属于初始化
export default class DialogManager {
  taskList = []
  showTaskList = []

  static instance = new DialogManager();

  /* eslint-disable */
  constructor() {}

  static getInstance() {
    return DialogManager.instance;
  }

  initTask(tasks) {
    // 排序，优先级高的排在第一个
    this.taskList = tasks.sort((a, b) => b.level - a.level);
    console.log('oooooo', this.taskList);
  }

  /**
   * 弹窗规则
   * 1、弹窗有运营位、功能、重要通知3种类型，3个类型分别设置优先级
   * 2、每次按顺序最多弹3个弹窗，优先级：重要通知>运营位>功能
   * 3、如果匹配3种类型弹窗：优先显示运营位弹窗，然后显示功能说明弹窗
   * 4、如果只匹配了运营位弹窗：按顺序显示优先级最高的1个
   * 5、如果只匹配了功能说明弹窗：按顺序显示优先级最高的1个
   * 6、知会函是重要通知类型
   */
  /* eslint-disable */
  _getShowTask(taskList) {
    return taskList.filter(item => item.showDialog);
  }

  /**
   *
   * @param refresh 强制刷新
   */
  startTask(refresh = false) {
    Promise.all(this.taskList.map(item => item.getAsyncDataPromise(refresh)))
      .then(() => {
      // 2、筛选需要弹窗的task
        this.showTaskList = this._getShowTask(this.taskList);
        let promise = Promise.resolve();

        if (this.showTaskList.length > 0) {
        // 3、通过promise的链式调用实现按顺序弹窗
          this.showTaskList.forEach((item) => {
            promise = promise.then(() => item.show());
          });
        }
        return promise;
      }).catch(() => {
      // 弹窗被阻断，或者代码报错
        console.log('弹窗被阻断了');
      });
  }
}

window.DialogManager = DialogManager;

DialogManager.getInstance().initTask([
  dialog1,
  dialog2,
]);
