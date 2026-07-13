import { invoke } from '@tauri-apps/api/core'
import { fetch as tFetch } from '@tauri-apps/plugin-http'

const SERVER_PORTS = [23846, 15830, 12840]

export async function getPort() {
  for (const port of SERVER_PORTS) {
    const res = await tFetch(`http://localhost:${port}/ping`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (res.ok && (await res.json() as { pong: true }).pong) {
      return port
    }
  }

  return SERVER_PORTS[0]
}

export function start() {
  return invoke('start_server')
}

export function stop() {
  return invoke('stop_server')
}
