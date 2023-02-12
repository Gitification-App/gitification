import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { checker as Checker } from 'vite-plugin-checker'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const { version } = JSON.parse(fs.readFileSync(path.join(dirname, 'package.json'), 'utf-8')) as { version: string }

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Checker({
      vueTsc: true,
    }),
    Icons({
      compiler: 'vue3',
      defaultClass: 'icon',
    }),
  ],

  define: {
    __APP_VERSION__: `'${version}'`,
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "/src/assets/mixins.scss" as *;',
      },
    },
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ['VITE_', 'TAURI_'],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? 'esbuild' : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,
  },
})
