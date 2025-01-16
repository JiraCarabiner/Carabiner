// 메시지를 수신하고 DOM 조작
chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.message === 'Hello from background script!') {
    console.log('Message received in content script:', request.message);

    // 페이지 제목 변경
    document.title = 'Title changed by content script';

    // 응답 전송
    sendResponse({ message: 'Title updated successfully!' });
  }
});
