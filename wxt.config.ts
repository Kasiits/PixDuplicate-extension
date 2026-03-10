import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "PixDuplicate",
    description: "Keep your image collection organized by finding and removing duplicate images with our easy-to-use extension!",
    version: "1.0.2",
    action: {
      default_title: 'PixDuplicate',
    },
  },
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-svelte'],
  vite: () => ({
      plugins: [
        tailwindcss(),
      ],
    }),
});