import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: './',
  publicDir: 'src/assets',
  server: {
    open: true,
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  esbuild: {
    keepNames: true
  },
  plugins: [tsconfigPaths()],
})