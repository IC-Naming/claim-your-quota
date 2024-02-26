import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix:"APP_",//APP_  为自定义开头名
  server: {
    host: '0.0.0.0',
    port: 4000, // 端口号
    open: true, // 是否自动打开浏览器
    cors: true // 允许跨域
  },
})
