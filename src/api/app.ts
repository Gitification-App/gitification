import { fetch } from '@tauri-apps/plugin-http'
import { SERVER_PORTS } from '../constants'

export async function getServerPort() {
  for (const port of SERVER_PORTS) {
    const res = await fetch(`http://localhost:${port}/ping`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })

    if (res.ok) {
      const data = await res.json() as { pong: true }
      if (data.pong) {
        console.log({ res })
        return port
      }
    }
  }

  return SERVER_PORTS[0]
}
