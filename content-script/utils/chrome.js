export const sendMessageToBackground = body => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(body, response => {
      resolve(response);
    });
  });
};

export const injectCSS = file => {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL(file);
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.querySelector('head').appendChild(link);
};
