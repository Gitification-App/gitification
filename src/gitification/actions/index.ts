import { invoke } from '@tauri-apps/api'
import { sendNotification } from '@tauri-apps/api/notification'
import { exit } from '@tauri-apps/api/process'
import { open } from '@tauri-apps/api/shell'
import * as Gitification from '../index'

export function openURL(url: string) {
  open(url)
}

export async function markThreadAsRead(thread: Gitification.api.Types.Thread) {
  if (Gitification.state.currentUser == null) {
    return
  }

  Gitification.state.checkedThreadIds.delete(thread.id)

  if (Gitification.state.settings.showReadNotifications) {
    thread.unread = false
    return
  }
  else {
    Gitification.state.threads = Gitification.state.threads
      .filter((t) => t.id !== thread.id)
  }

  Gitification.api.markThreadAsRead(thread.id, Gitification.state.currentUser.accessToken)
}

export function selectThread(thread: Gitification.api.Types.Thread) {
  Gitification.state.checkedThreadIds.add(thread.id)
}

export function deselectThread(thread: Gitification.api.Types.Thread) {
  Gitification.state.checkedThreadIds.delete(thread.id)
}

export function clearThreadSelection() {
  Gitification.state.checkedThreadIds.clear()
}

export function toggleThreadSelection(thread: Gitification.api.Types.Thread) {
  const set = Gitification.state.checkedThreadIds
  if (set.has(thread.id)) {
    set.delete(thread.id)
  }
  else {
    set.add(thread.id)
  }
}

export function unsubscribeThread(thread: Gitification.api.Types.Thread) {
  if (Gitification.state.currentUser == null) {
    return
  }

  Gitification.state.checkedThreadIds.delete(thread.id)
  Gitification.state.threads = Gitification.state.threads
    .filter((t) => t.id !== thread.id)

  Gitification.api.markThreadAsRead(thread.id, Gitification.state.currentUser.accessToken)
  Gitification.api.unsubscribeThread(thread.id, Gitification.state.currentUser.accessToken)
}

export function resetThreadsState() {
  Gitification.state.checkedThreadIds.clear()
  Gitification.state.threads = []
  Gitification.state.threadLoadStatus = 'idle'
}

export function logout() {
  if (Gitification.state.currentUser == null) {
    return
  }

  Gitification.state.users = Gitification.state.users
    .filter(({ user }) => user.id !== Gitification.state.currentUser?.user.id)

  const nextUser = Gitification.state.users.at(0)

  if (nextUser) {
    switchToAccount(nextUser.user.id)
    return
  }

  resetThreadsState()
  Gitification.state.currentUser = null
  Gitification.router.navigate('landing')
}

export function switchToAccount(userId: Gitification.api.Types.SimpleUser['id']) {
  if (Gitification.state.currentUser?.user.id === userId) {
    return
  }

  resetThreadsState()
  Gitification.state.currentUser = Gitification.state.users
    .find(({ user }) => user.id === userId) ?? null
  fetchThreads()
  Gitification.router.navigate('home')
}

export function quitApp() {
  exit(0)
}

export function playNotificationSound() {
  if (Gitification.state.settings.soundsEnabled) {
    invoke('play_notification_sound')
  }
}

export function pushThreadNotification(thread: Gitification.api.Types.Thread) {
  if (Gitification.state.settings.showSystemNotifications) {
    sendNotification({
      title: thread.repository.full_name,
      body: thread.subject.title,
    })
  }
}

export async function fetchThreads(withLoader = true) {
  if (Gitification.state.currentUser == null) {
    return
  }

  if (withLoader) {
    Gitification.state.checkedThreadIds.clear()
  }

  Gitification.state.threadLoadStatus = withLoader ? 'loading' : 'syncing'

  const threads = await Gitification.api
    .getThreads({
      all: Gitification.state.settings.showReadNotifications,
      accessToken: Gitification.state.currentUser.accessToken,
      onlyParticipating: Gitification.state.settings.onlyParticipating,
    })
    .catch(() => new Error('Failed to fetch threads'))

  if (threads instanceof Error) {
    Gitification.state.threadLoadStatus = 'failed'
    return
  }

  const newThreads = Gitification.utils.array.filterNewItems(
    Gitification.state.threads,
    threads,
    (thread) => thread.id,
  )

  const newUnread = newThreads.find((thread) => thread.unread)

  if (newUnread) {
    playNotificationSound()
    pushThreadNotification(newUnread)
  }

  Gitification.state.threads = threads
  Gitification.state.threadLoadStatus = 'idle'
}

export function setMenubarIcon(isTemplate: boolean) {
  invoke('set_icon_template', { isTemplate })
}
