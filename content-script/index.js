import dayjs from 'dayjs';
import store from 'store';
import './styles/styles.css';
import './styles/tailwind.css';
import * as utils from './utils';
import { EVENT_TYPE } from '../common';
import { CONTENT_EVENT_TYPE } from './constants';
import App from './App';

const start = async () => {
  await utils.delay(3000);
  console.clear();
  utils.injectCSS('/content-script.css');
  console.log('🍒 --> 插件脚本已注入1', dayjs().format('YYYY/MM/DD HH:mm:ss'));
};

const listenerToLog = request => {
  const { message } = request;
  console.log(`👽 --> ${dayjs().format('YYYY/MM/DD HH:mm:ss')}`, message);
};

// 监听来自 background 转发的其他 content-script 事件
const CONTENT_EVENT_HANDLE_MAP = {
  [CONTENT_EVENT_TYPE.LOG]: listenerToLog,
};

const listenerToOtherContentScript = request => {
  const { contentEvent } = request;
  CONTENT_EVENT_HANDLE_MAP[contentEvent](request);
};

const EVENT_HANDLE_MAP = {
  [EVENT_TYPE.BROADCAST]: listenerToOtherContentScript,
  [EVENT_TYPE.RELOAD]: () => location.reload(),
};

// 监听来自 background 事件
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('🚀 ~ request', request);
  // console.log('🚀 ~ sender', sender);
  const { event } = request;
  EVENT_HANDLE_MAP[event](request, sender);
  sendResponse({ data: request, ...sender });
});

start();
