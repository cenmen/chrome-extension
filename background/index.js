import dayjs from 'dayjs';
import * as utils from './utils';
import { EVENT_TYPE } from '../common';
const eventSource = new EventSource('http://localhost:9000/reload');
console.clear();
console.log('🥥 --> 插件更新时间', dayjs().format('YYYY/MM/DD HH:mm:ss'));

// 广播信息到所有注册页面
const broadcastToAllContentScript = async body => {
  const tabs = await utils.getCurrentTabs();
  const tabIds = tabs.map(item => item.id);
  for (const tabId of tabIds) {
    await utils.sendMessageToTargetTab({ tabId, body });
  }
};

const EVENT_HANDLE_MAP = {
  [EVENT_TYPE.INFO]: utils.info,
  [EVENT_TYPE.BROADCAST]: broadcastToAllContentScript,
};

eventSource.addEventListener('reload', async () => {
  // 先广播 content-script，否则会插件失效
  await broadcastToAllContentScript({ event: EVENT_TYPE.RELOAD });
  // chrome 插件更新应在最后
  chrome.runtime.reload();
});

// 接收 content-script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🚀 ~ chrome.runtime.onMessage.addListener ~11 request', request);
  console.log('🚀 ~ chrome.runtime.onMessage.addListener ~ sender', sender);
  const { event } = request;
  EVENT_HANDLE_MAP[event](request, sender);
  sendResponse({ data: request, ...sender });
});
