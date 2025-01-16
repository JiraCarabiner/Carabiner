chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed!');
});

// 브라우저 액션 클릭 시 메시지를 content script로 보냄
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { message: 'Hello from background script!' }, (response) => {
      console.log('Response from content script:', response);
    });
  }
});
