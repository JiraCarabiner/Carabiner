import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import styles from '@/styles/index.css?inline';
import { createShadowRoot } from '@/lib/createShadowRoot';
import { ShadowRootContext } from '@/lib/ShadowRootContext';

function injectContentApp() {
  if (document.getElementById('extension-content-root')) {
    return;
  }

  const createPRButton = document.querySelector(
    '#new_pull_request > div > div.Layout-main > div > div:nth-child(2) > div > div.d-flex.flex-justify-end.flex-items-center.flex-wrap.gap-1 > div.d-flex.flex-justify-end > div'
  );
  if (createPRButton) {
    const host = document.createElement('div');
    host.id = 'extension-content-root';
    createPRButton.prepend(host);

    const shadowRoot = createShadowRoot(host, [styles]);

    createRoot(shadowRoot).render(
      <ShadowRootContext.Provider value={shadowRoot}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ShadowRootContext.Provider>
    );
  }
}

// 버튼을 찾고 이벤트 리스너 추가
const createPRButton = document.querySelector('.js-details-target.btn-primary.btn');
if (createPRButton) {
  createPRButton.addEventListener('click', () => {
    console.log('Create PR Button clicked!');
    injectContentApp(); // 버튼 클릭 시 컴포넌트를 추가
  });
} else {
  console.log('Create PR Button not found.');
}

// DOMContentLoaded 처리 (만약 버튼이 나중에 로드된다면)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.js-details-target.btn-primary.btn');
    if (button) {
      button.addEventListener('click', () => {
        console.log('Create PR Button clicked after DOMContentLoaded!');
        injectContentApp();
      });
    }
  });
}
