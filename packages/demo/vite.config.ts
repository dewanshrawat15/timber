import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  // When deployed to GitHub Pages as a project site, the app is served from "/<repo-name>/"
  // Update this if you use a different repository name or a custom domain.
  base: process.env.GITHUB_PAGES_BASE ?? '/timber/',
});
