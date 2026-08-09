import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  const isClient = mode === 'client';
  const rootDir = isClient ? 'client' : 'admin';
  const outDir = isClient ? 'dist/client' : 'dist/admin';

  return {
    root: path.resolve(__dirname, rootDir),
    envDir: path.resolve(__dirname),
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@admin': path.resolve(__dirname, 'admin/src'),
        '@client': path.resolve(__dirname, 'client/src'),
        '@shared': path.resolve(__dirname, 'shared'),
        '@server': path.resolve(__dirname, 'server'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: path.resolve(__dirname, outDir),
      emptyOutDir: true,
    },
  };
});
