import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs/promises'
import * as github from '@actions/github'

const token = process.env.GITHUB_TOKEN
const dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  const octokit = github.getOctokit(token)

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
    name: 'package.json',
    release_id: release.data.id,
    // @ts-expect-error type
    data: (await fs.readFile(path.join(dirname, 'package.json'))).buffer,
  })
}

run()
