import * as fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_SECRET: string
      CLIENT_ID: string
    }
  }
}

const secret = process.env.CLIENT_SECRET
const id = process.env.CLIENT_ID
const dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(dirname, '..', '..', '.env.bruh')

const envFileContent = `\
VITE_CLIENT_SECRET=${secret}
VITE_CLIENT_ID=${id}
`

async function run() {
  await fs.writeFile(filePath, envFileContent, 'utf-8')
}

run()
