export function createBaseGithubApiHeaders(accessToken: string) {
  return {
    'Authorization': `token ${accessToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}
