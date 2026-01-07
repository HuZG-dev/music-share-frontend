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
      // 配置网易云音乐API代理（必须放在 /api 前面，更具体的路径优先匹配）
      '/api/netease': {
        target: 'https://music.163.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/netease/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Referer', 'https://music.163.com/')
            proxyReq.setHeader('Origin', 'https://music.163.com')
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
          })
        }
      },
      // 配置后端API代理
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})