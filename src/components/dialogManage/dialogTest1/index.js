import DialogTask from '../DialogTask';
import dialogTest1 from './dialogTest1';

const asyncData = async () => {
  const result = {
    showDialog: true, // 是否显示弹窗
    data: null, // 业务数据
  };
  return result;
};

export default new DialogTask({
  key: 'dialogTest1',
  name: '测试弹窗',
  type: 0, // 弹窗类型
  level: 70, // 层级
  compOptions: dialogTest1, // vue组件
  asyncData,
});
