import { compare } from 'compare-versions'
import type { Release } from '../api/releases'
import type { Option } from '../types'

export function getNewRelease(releases: Release[]): Option<Release> {
  return releases.find(r => compare(r.tag_name, __APP_VERSION__, '>')) || null
}
