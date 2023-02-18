import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import * as github from '@actions/github'
import actions from '@actions/core'
import { compare } from 'compare-versions'
import { OWNER, REPO, token } from './constants'

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

  const octokit = github.getOctokit(token)
  const version = packageJSON.version

  try {
    const { data: remoteReleases } = await octokit.rest.repos.listReleases({
      owner: OWNER,
      repo: REPO,
    })

    const isNewRelease = remoteReleases
      .filter(release => !release.draft)
      .every(release => (
        compare(version, release.tag_name, '>')
      ))

    if (isNewRelease) {
      actions.setOutput('isNewRelease', 'true')
      return
    }
  }
  catch { /* If endpoint throws, it means no release yet */ }

  actions.setOutput('isNewRelease', 'false')
}

run()
