import { ResponseType, fetch } from '@tauri-apps/api/http'
import { SERVER_PORTS } from '../constants'

export async function getServerPort() {
  for (const port of SERVER_PORTS) {
    const res = await fetch<{ pong: true }>(`http://localhost:${port}/ping`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      responseType: ResponseType.JSON,
    })

    if (res.ok && res.data.pong) {
      console.log({ res })
      return port
    }
  }

  return SERVER_PORTS[0]
}
