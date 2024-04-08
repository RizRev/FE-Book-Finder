import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  preview: {
   port: 7000,
   strictPort: true,
  },
  server: {
   port: 7000,
   strictPort: true,
   host: true,
   origin: "http://0.0.0.0:7000",
  },
 });
