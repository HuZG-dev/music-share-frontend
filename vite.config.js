import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // 配置后端API代理
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      // 配置网易云音乐API代理
      '/api/netease': {
        target: 'https://music.163.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/netease/, ''),
        headers: {
          'Referer': 'https://music.163.com/',
          'Host': 'music.163.com'
        }
      }
    }
  }
})