/**
 * vite.config.js — updated for Tailwind CSS v4
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),   // Tailwind v4 — must come before react()
    react(),
  ],
});
