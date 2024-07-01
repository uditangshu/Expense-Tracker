import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for production builds
    sourcemap: true, // Enable source maps
    // You can configure additional build options here
  },
});
