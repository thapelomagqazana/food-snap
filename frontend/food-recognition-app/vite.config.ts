import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {

  // Load .env file based on the mode
  const env = loadEnv(mode, process.cwd());

  console.log('Loaded environment variables:', env);
  
  // Prepare environment variables with `import.meta.env` prefix
  // const envWithImportMetaPrefix = Object.entries(env).reduce<Record<string, string>>(
  //   (acc, [key, value]) => {
  //     acc[`import.meta.env.${key}`] = JSON.stringify(value);
  //     return acc;
  //   },
  //   {}
  // );

  return {
    plugins: [react()],
    build: {
      outDir: 'dist',
    },
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'https://food-track-api.up.railway.app'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
