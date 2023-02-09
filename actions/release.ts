import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import child_process from 'child_process'
import * as github from '@actions/github'

const token = process.env.GITHUB_TOKEN!
const dirname = path.dirname(fileURLToPath(import.meta.url))
const dmgPath = path.join(dirname, '..', 'src-tauri', 'target', 'release', 'bundle', 'macos', 'rw.Gitification_0.0.0_aarch64.dmg')

async function run() {
  const octokit = github.getOctokit(token)

  child_process.execSync('pnpm tauri build', { stdio: 'inherit' })

  const release = await octokit.rest.repos.createRelease({
    owner: 'kadiryazici',
    repo: 'gitification',
    tag_name: 'test-version',
    draft: true,
    name: 'test-version',
    body: 'This is just for testing',
  })

  octokit.rest.repos.uploadReleaseAsset({
    owner: 'kadiryazici',
    repo: 'gitification',
    name: 'Gitification.aarch64.dmg',
    release_id: release.data.id,
    // @ts-expect-error type
    data: (await fs.readFile(dmgPath)).buffer,
  })
}

run()
