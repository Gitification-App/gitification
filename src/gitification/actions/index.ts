import type { HTTPError } from 'ky'
import type { Types as ApiTypes, GiApi } from '../api'
import type { GiRouter } from '../router'
import type { GiState } from '../state'
import type { GitificationStorage } from '../storage'
import type { StorageUser } from '../storage/types'
import type { GiTauriLayer } from '../tauri'
import * as utils from '../utils'

export type CreateActionsOptions = {
  state: GiState
  storage: GitificationStorage
  api: GiApi
  router: GiRouter
  tauri: GiTauriLayer
}

export function createActions(deps: CreateActionsOptions) {
  let lastFetchThreadsAt = 0
  let fetchController: AbortController | null = null
  let installing = false

  function requestNotificationPermission() {
    return deps.tauri.requestNotificationPermission()
  }

  function getLastFetchThreadsAt() {
    return lastFetchThreadsAt
  }

  function openURL(url: string) {
    void deps.tauri.openURL(url)
  }

  async function showWindow() {
    await deps.tauri.showWindow()
  }

  async function markThreadAsRead(thread: ApiTypes.Thread) {
    const currentUser = deps.state.currentUser

    if (currentUser == null) {
      return
    }

    deps.state.checkedThreadIds.delete(thread.id)

    if (deps.state.settings.showReadNotifications) {
      thread.unread = false
      return
    }
    else {
      deps.state.threads = deps.state.threads
        .filter((t) => t.id !== thread.id)
    }

    void deps.api.markThreadAsRead(thread.id, currentUser.accessToken)
  }

  function selectThread(thread: ApiTypes.Thread) {
    deps.state.checkedThreadIds.add(thread.id)
  }

  function deselectThread(thread: ApiTypes.Thread) {
    deps.state.checkedThreadIds.delete(thread.id)
  }

  function clearThreadSelection() {
    deps.state.checkedThreadIds.clear()
  }

  function toggleThreadSelection(thread: ApiTypes.Thread) {
    const set = deps.state.checkedThreadIds
    if (set.has(thread.id)) {
      set.delete(thread.id)
    }
    else {
      set.add(thread.id)
    }
  }

  function unsubscribeThread(thread: ApiTypes.Thread) {
    const currentUser = deps.state.currentUser

    if (currentUser == null) {
      return
    }

    deps.state.checkedThreadIds.delete(thread.id)
    deps.state.threads = deps.state.threads
      .filter((t) => t.id !== thread.id)

    void deps.api.markThreadAsRead(thread.id, currentUser.accessToken)
    void deps.api.unsubscribeThread(thread.id, currentUser.accessToken)
  }

  function resetThreadsState() {
    deps.state.checkedThreadIds.clear()
    deps.state.threads = []
    deps.state.threadLoadStatus = 'idle'
  }

  function logout(id: StorageUser['user']['id']) {
    const user = deps.state.users
      .find(({ user }) => user.id === id) ?? null

    if (user == null) {
      return
    }

    deps.state.users = deps.state.users
      .filter((item) => item.user.id !== user.user.id)

    const nextUser = deps.state.users.at(0)

    if (nextUser) {
      switchToAccount(nextUser.user.id)
      return
    }

    resetThreadsState()
    deps.state.currentUser = null
    deps.router.navigate('landing')
  }

  function switchToAccount(userId: ApiTypes.SimpleUser['id']) {
    if (deps.state.currentUser?.user.id === userId) {
      return
    }

    resetThreadsState()
    deps.state.currentUser = deps.state.users
      .find(({ user }) => user.id === userId) ?? null
    void fetchThreads(true)
    deps.router.navigate('home')
  }

  function quitApp() {
    void deps.tauri.quitApp()
  }

  function playNotificationSound() {
    if (deps.state.settings.soundsEnabled) {
      void deps.tauri.playNotificationSound()
    }
  }

  async function pushThreadNotification(thread: ApiTypes.Thread) {
    if (import.meta.env.DEV) {
      // It crashes the app in dev mode.
      return
    }

    if (deps.state.settings.showSystemNotifications
      && await deps.tauri.hasNotificationPermission()) {
      deps.tauri.notify({
        title: thread.repository.full_name,
        body: thread.subject.title,
      })
    }
  }

  async function fetchThreads(withLoader = false) {
    fetchController?.abort()
    fetchController = null

    const currentUser = deps.state.currentUser
    if (currentUser == null) {
      return
    }

    lastFetchThreadsAt = Date.now()

    if (withLoader) {
      clearThreadSelection()
    }

    deps.state.threadLoadStatus = withLoader ? 'loading' : 'syncing'

    const controller = new AbortController()
    fetchController = controller
    const signal = controller.signal

    const result = await deps.api
      .getThreads({
        all: deps.state.settings.showReadNotifications,
        accessToken: currentUser.accessToken,
        onlyParticipating: deps.state.settings.onlyParticipating,
        signal,
      })
      .catch((error) => error as HTTPError)

    if (signal.aborted) {
      return
    }

    if (result instanceof Error) {
      deps.state.threadLoadStatus = 'failed'
      return
    }

    const [threads] = result
    const newThreads = utils.array.filterNewItems(
      deps.state.threads,
      threads,
      (thread) => thread.id,
    )
    const newUnread = newThreads.find((thread) => thread.unread)

    if (newUnread) {
      playNotificationSound()
      void pushThreadNotification(newUnread)
    }

    deps.state.threads = threads
    deps.state.threadLoadStatus = 'idle'
  }

  async function setMenubarIcon(isTemplate: boolean) {
    await deps.tauri.setMenubarIcon(isTemplate)
  }

  async function updateApp() {
    if (installing || deps.state.newRelease == null) {
      return
    }

    installing = true

    try {
      await deps.state.newRelease.downloadAndInstall()
      await deps.tauri.relaunchApp()
    }
    catch {
      installing = false
    }
  }

  return {
    AutoStart: {
      isEnabled: deps.tauri.isAutoStartEnabled,
      enable: deps.tauri.enableAutoStart,
      disable: deps.tauri.disableAutoStart,
    },
    resetSettings() {
      void deps.tauri.requestNotificationPermission()
      deps.storage.resetSettings()
    },
    requestNotificationPermission,
    getLastFetchThreadsAt,
    openURL,
    showWindow,
    markThreadAsRead,
    selectThread,
    deselectThread,
    clearThreadSelection,
    toggleThreadSelection,
    unsubscribeThread,
    resetThreadsState,
    logout,
    switchToAccount,
    quitApp,
    playNotificationSound,
    pushThreadNotification,
    fetchThreads,
    setMenubarIcon,
    updateApp,
  }
}

export type GiActions = ReturnType<typeof createActions>
