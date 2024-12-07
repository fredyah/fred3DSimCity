import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // 将开发服务器绑定到 0.0.0.0
    port: 5173, // 可选，指定端口
  },
});