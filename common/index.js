// 与 content-script 通信的事件类型
export const EVENT_TYPE = {
  INFO: 'info', // 桌面通知
  RELOAD: 'reload', // 刷新 content-script 页面
  BROADCAST: 'broadcast', // content-script 广播给其他注册的 content-script
};
