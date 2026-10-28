import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://alcove-app.com',
  integrations: [react(), sitemap({ filter: (page) => !page.endsWith('/support/') })],
  vite: {
    plugins: [tailwindcss()],
  },
  build: { format: 'directory' },
});
