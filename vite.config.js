import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // 将开发服务器绑定到 0.0.0.0
    port: 5173, // 可选，指定端口
  },
  base: '/fred3DSimCity/', // 設定資源的基底路徑
});