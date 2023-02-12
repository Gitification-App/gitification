import redaxios from 'redaxios'
import { REPOSITORY_PATH } from '../constants'
import type { AppStorageContext, Option } from '../types'
import { createBaseGithubApiHeaders } from '../utils/api'
import type { User } from './user'

export interface Release {
  url: string
  html_url: string
  assets_url: string
  upload_url: string
  tarball_url: string | null
  zipball_url: string | null
  id: number
  node_id: string
  tag_name: string
  target_commitish: string
  name: Option<string>
  body?: Option<string>
  draft: boolean
  prerelease: boolean
  created_at: string
  published_at: Option<string>
  author: User
  assets: ReleaseAsset[]
  body_html?: string
  body_text?: string
  mentions_count?: number
  discussion_url?: string
  reactions?: ReactionRollup
}

interface ReleaseAsset {
  url: string
  browser_download_url: string
  id: number
  node_id: string
  name: string
  label: Option<string>
  state: 'uploaded' | 'open'
  content_type: string
  size: number
  download_count: number
  created_at: string
  updated_at: string
  uploader: Option<User>
}

export interface ReactionRollup {
  url: string
  total_count: number
  '+1': number
  '-1': number
  laugh: number
  confused: number
  heart: number
  hooray: number
  eyes: number
  rocket: number
}

export async function getReleases(accessToken: AppStorageContext['accessToken']): Promise<Release[]> {
  try {
    const { data } = await redaxios<Release[]>({
      url: `https://api.github.com/repos/${REPOSITORY_PATH}/releases`,
      headers: createBaseGithubApiHeaders(accessToken),
    })
    return data
  }
  catch (error) {
    return []
  }
}
