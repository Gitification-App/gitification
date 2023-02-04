import { createApp } from 'vue'
import './assets/main.scss'
import { createPinia } from 'pinia'
import type { Event } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
import App from './App.vue'
import { storage } from './composables/useStorageRef'

const app = createApp(App)
const pinia = createPinia()

window.oncontextmenu = e => e.preventDefault()

app.use(pinia)
app.mount('#app')

listen('code', ({ payload }: Event<string>) => {
  console.log(payload)
})

storage.onChange(async () => {
  console.log(Object.fromEntries(await storage.entries()))
})
