import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import * as github from '@actions/github'
import { execaCommand } from 'execa'
import { OWNER, REPO, id, secret, token } from './constants'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const envPath = path.join(dirname, '..', '..', '.env')
const tauriConfPath = path.join(dirname, '..', '..', 'src-tauri', 'tauri.conf.json')

const envFileContent = `\
VITE_CLIENT_SECRET=${secret}
VITE_CLIENT_ID=${id}
`

async function run() {
  const { package: { productName, version } } = JSON.parse(
    await fs.readFile(tauriConfPath, 'utf-8'),
  ) as typeof import('../../src-tauri/tauri.conf.json')

  const dmgFileName = `${productName}_${version}_universal.dmg`

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

  await fs.writeFile(envPath, envFileContent, 'utf-8')
  await execaCommand('pnpm tauri build --target universal-apple-darwin', { stdio: 'inherit' })

  const release = await octokit.rest.repos.createRelease({
    owner: OWNER,
    repo: REPO,
    tag_name: version,
    name: version,
    body: `Click to view [CHANGELOG](https://github.com/${OWNER}/${REPO}/blob/main/CHANGELOG.md).`,
  })

  octokit.rest.repos.uploadReleaseAsset({
    owner: OWNER,
    repo: REPO,
    name: dmgFileName,
    release_id: release.data.id,
    // @ts-expect-error type
    data: (await fs.readFile(dmgPath)).buffer,
  })
}

run()
