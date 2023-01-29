import { createApp } from 'vue'
import './assets/main.scss'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

window.oncontextmenu = e => e.preventDefault()

app.use(pinia)
app.mount('#app')
