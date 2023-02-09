import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import child_process from 'child_process'
import { promisify } from 'util'
import * as github from '@actions/github'

const exec = promisify(child_process.exec)

const token = process.env.GITHUB_TOKEN!
const dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  await exec('rustup target add x86_64-apple-darwin')
  await exec('rustup target add aarch64-apple-darwin')
  await exec('pnpm tauri build --target universal-apple-darwin')

  const tauriConf = JSON.parse(
    await fs.readFile(path.join(dirname, '..', 'src-tauri', 'tauri.conf.json'), 'utf-8'),
  ) as typeof import('../src-tauri/tauri.conf.json')

  const packageJSON = JSON.parse(
    await fs.readFile(path.join(dirname, '..', 'package.json'), 'utf-8'),
  ) as typeof import('../package.json')

  if (packageJSON.version !== tauriConf.package.version)
    throw new Error('Tauri config and Package JSON versions are not the same, update both of them!')

  const dmgFileName = `Gitification_${packageJSON.version}_universal.dmg`

  const dmgPath = path.join(
    dirname,
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
  const release = await octokit.rest.repos.createRelease({
    owner: 'kadiryazici',
    repo: 'gitification',
    tag_name: packageJSON.version.toString(),
    name: packageJSON.version.toString(),
  })

  octokit.rest.repos.uploadReleaseAsset({
    owner: 'kadiryazici',
    repo: 'gitification',
    name: dmgFileName,
    release_id: release.data.id,
    // @ts-expect-error type
    data: (await fs.readFile(dmgPath)).buffer,
  })
}

run()
