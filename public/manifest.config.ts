import { ManifestV3Export } from '@crxjs/vite-plugin';

const manifest = {
  manifest_version: 3,
  name: 'Carabiner',
  version: '1.0.0',
  description: 'Jira Carabiner',
  action: {
    default_popup: 'index.html',
    icons: {
      '16': 'images/icon/icon-16.png',
      '32': 'images/icon/icon-32.png',
      '48': 'images/icon/icon-48.png',
      '128': 'images/icon/icon-128.png',
    },
  },
  icons: {
    '16': 'images/icon/icon-16.png',
    '32': 'images/icon/icon-32.png',
    '48': 'images/icon/icon-48.png',
    '128': 'images/icon/icon-128.png',
  },
  background: {
    service_worker: 'src/background.ts',
  },
  content_scripts: [
    {
      matches: ['https://github.com/*/*/compare/*'],
      js: ['src/content/index.tsx'],
    },
  ],
  web_accessible_resources: [
    {
      resources: ['assets/*.js', 'assets/*.css', '*.webp', '*.png', '*.jpg', '*.jpeg', '*.gif'],
      matches: ['*://*/*'],
    },
  ],
  options_page: '/options.html',
  permissions: ['scripting', 'storage', 'activeTab'],
  host_permissions: ['https://*/*', 'http://*/*'],
} as ManifestV3Export;

export default manifest;
