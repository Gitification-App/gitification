import * as github from '@actions/github'

const token = process.env.GITHUB_TOKEN

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
}

run()
