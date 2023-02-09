import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import child_process from 'child_process'
import { promisify } from 'util'
import * as github from '@actions/github'

const exec = promisify(child_process.exec)

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_SECRET: string
      CLIENT_ID: string
      GITHUB_TOKEN: string
    }
  }
}

const dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(dirname, '..', '..', '.env')
const tauriConfPath = path.join(dirname, '..', '..', 'src-tauri', 'tauri.conf.json')
const packageJsonPath = path.join(dirname, '..', '..', 'package.json')
const token = process.env.GITHUB_TOKEN
const secret = process.env.CLIENT_SECRET
const id = process.env.CLIENT_ID

const envFileContent = `\
VITE_CLIENT_SECRET=${secret}
VITE_CLIENT_ID=${id}
`

async function run() {
  await fs.writeFile(envPath, envFileContent, 'utf-8')
  await exec('pnpm tauri build --target universal-apple-darwin')

  const tauriConf = JSON.parse(
    await fs.readFile(tauriConfPath, 'utf-8'),
  ) as typeof import('../../src-tauri/tauri.conf.json')

  const packageJSON = JSON.parse(
    await fs.readFile(packageJsonPath, 'utf-8'),
  ) as typeof import('../../package.json')

  if (packageJSON.version !== tauriConf.package.version)
    throw new Error('Tauri config and Package JSON versions are not the same, update both of them!')

  const dmgFileName = `Gitification_${packageJSON.version}_universal.dmg`

  const dmgPath = path.join(
    dirname,
    '..',
    '..',
    'src-tauri',
    'target',
    'universal-apple-darwin',
    'release',
    'bundle',
    'dmg',
    dmgFileName,
  )

  const octokit = github.getOctokit(token)

  try {
    const remoteRelease = await octokit.rest.repos.getLatestRelease({
      owner: 'Gitification-App',
      repo: 'gitification',
    })

    if (remoteRelease.data.name === packageJSON.version.toString()) {
      console.log('No version change detected, skipping build.')
      return
    }
  }
  catch { /* If endpoint throws, it means no release yet */ }

  const release = await octokit.rest.repos.createRelease({
    owner: 'Gitification-App',
    repo: 'gitification',
    tag_name: packageJSON.version.toString(),
    name: packageJSON.version.toString(),
  })

  octokit.rest.repos.uploadReleaseAsset({
    owner: 'Gitification-App',
    repo: 'gitification',
    name: dmgFileName,
    release_id: release.data.id,
    // @ts-expect-error type
    data: (await fs.readFile(dmgPath)).buffer,
  })
}

run()