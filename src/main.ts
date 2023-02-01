import { createApp } from 'vue'
import './assets/main.scss'
import { createPinia } from 'pinia'
import type { Event } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
import { message } from '@tauri-apps/api/dialog'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

window.oncontextmenu = e => e.preventDefault()

app.use(pinia)
app.mount('#app')

listen('code', ({ payload }: Event<string>) => {
  message(payload, { title: 'Here is the cdoe', type: 'info' })
})
