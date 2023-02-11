import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs/promises'
import github from '@actions/github'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const tauriConfPath = path.join(dirname, '..', '..', 'src-tauri', 'tauri.conf.json')
const packageJsonPath = path.join(dirname, '..', '..', 'package.json')
const token = process.env.GITHUB_TOKEN

async function run() {
  const tauriConf = JSON.parse(
    await fs.readFile(tauriConfPath, 'utf-8'),
  ) as typeof import('../../src-tauri/tauri.conf.json')

  const packageJSON = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as typeof import('../../package.json')

  if (packageJSON.version !== tauriConf.package.version)
    throw new Error('Tauri config and Package JSON versions are not the same, update both of them!')

  const octokit = github.getOctokit(token)

  try {
    const remoteRelease = await octokit.rest.repos.getLatestRelease({
      owner: 'Gitification-App',
      repo: 'gitification',
    })

    if (remoteRelease.data.name === packageJSON.version.toString())
      throw new Error('No version change detected, skipping build.')
  }
  catch { /* If endpoint throws, it means no release yet */ }
}

run()
