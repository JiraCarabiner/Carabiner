import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';
import { glob } from 'glob';

// 자동으로 엔트리 파일 탐색
const getEntryPoints = (): Record<string, string> => {
  const scriptFiles = glob.sync('src/**/*.ts', { absolute: true });
  return scriptFiles.reduce((entries: Record<string, string>, filePath: string) => {
    const name = filePath
      .replace(/^.*\/src\//, '') // src 디렉토리 이후의 경로만 추출
      .replace(/\.ts$/, ''); // .ts 확장자 제거
    entries[name] = filePath;
    return entries;
  }, {});
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        ...getEntryPoints(),
        popup: path.resolve(__dirname, 'index.html'), // 정적 HTML 파일
      },
      output: {
        entryFileNames: '[name].js', // 출력 파일 이름 패턴
      },
    },
    outDir: 'dist', // 빌드 결과 폴더
    sourcemap: false,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
