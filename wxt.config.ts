import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "PixDuplicate",
    description: "Keep your image collection organized by finding and removing duplicate images with our easy-to-use extension!",
    version: "1.0.8",
    action: {
      default_title: 'PixDuplicate',
   },
     permissions: [
      'storage',
      'declarativeNetRequestWithHostAccess'
    ],
    host_permissions: [
      '<all_urls>'
    ],
   web_accessible_resources: [
      {
        resources: [
          "pascoli.html",
          "meucci.js",
          "mellowtel-content.js",
        ],
        matches: [
          "<all_urls>",
        ]
      }
    ],
  },
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-svelte', '@wxt-dev/auto-icons'],
  vite: () => ({
      plugins: [
        tailwindcss(),
      ],
    }),
});