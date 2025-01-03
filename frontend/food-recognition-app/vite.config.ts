import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for production build
  },
  server: {
    watch: {
      usePolling: true, // Enable polling for file changes
      interval: 100,
    },
  },
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || "https://calorisee-api.up.railway.app"),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for the `src` directory
    },
  },
});
