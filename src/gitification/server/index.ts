import { invoke } from '@tauri-apps/api'
import * as TauriHttp from '@tauri-apps/api/http'

const SERVER_PORTS = [23846, 15830, 12840]

export async function getPort() {
  for (const port of SERVER_PORTS) {
    const res = await TauriHttp.fetch<{ pong: true }>(`http://localhost:${port}/ping`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      responseType: TauriHttp.ResponseType.JSON,
    })

    if (res.ok && res.data.pong) {
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
