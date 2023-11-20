import DialogTask from '../DialogTask';
import dialogTest2 from './dialogTest2';

const asyncData = async () => {
  const result = {
    showDialog: false, // 是否显示弹窗
    data: null, // 业务数据
  };
  result.showDialog = true;
  return result;
};

export default new DialogTask({
  key: 'dialogTest2',
  name: '测试弹窗',
  type: 0, // 弹窗类型
  level: 50, // 层级
  compOptions: dialogTest2, // vue组件
  asyncData,
});
