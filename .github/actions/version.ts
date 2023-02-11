import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const tauriConfPath = path.join(dirname, '..', '..', 'src-tauri', 'tauri.conf.json')
const packageJsonPath = path.join(dirname, '..', '..', 'package.json')

async function run() {
  const tauriConf = JSON.parse(
    await fs.readFile(tauriConfPath, 'utf-8'),
  ) as typeof import('../../src-tauri/tauri.conf.json')

  const packageJSON = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as typeof import('../../package.json')

  if (packageJSON.version !== tauriConf.package.version)
    throw new Error('Tauri config and Package JSON versions are not the same, update both of them!')
}

run()
