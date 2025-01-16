import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      // 여러 엔트리를 정의
      input: {
        // background.ts, content.ts의 위치를 지정
        background: path.resolve(__dirname, 'src/background.ts'),
        content: path.resolve(__dirname, 'src/content.ts'),
        // React 앱(entry point)도 예시로 함께 넣을 수 있음
        popup: path.resolve(__dirname, 'index.html'),
      },
      output: {
        // 빌드시 생성될 파일 이름 패턴
        entryFileNames: '[name].js',
      },
    },
    outDir: 'dist', // 빌드 결과물 폴더
    sourcemap: false, // 필요에 따라 소스맵 사용 여부 설정
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
