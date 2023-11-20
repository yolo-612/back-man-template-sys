const dialogParentElement = document.createElement('div');

dialogParentElement.className = 'dialogParentElement';
dialogParentElement.style.position = 'fixed';
dialogParentElement.style.zIndex = '10000000';
document.body.appendChild(dialogParentElement);

// 弹窗父控件
export default dialogParentElement;
