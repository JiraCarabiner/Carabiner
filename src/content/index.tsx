// src/content/inject.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import ContentApp from './App';

function injectContentApp() {
  const container = document.createElement('div');
  container.id = 'extension-content-root';
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <ContentApp />
    </React.StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectContentApp);
} else {
  injectContentApp();
}
