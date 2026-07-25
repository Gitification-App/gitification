import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import * as AutoStart from '@tauri-apps/plugin-autostart'
import { onOpenUrl as listenForOpenUrl } from '@tauri-apps/plugin-deep-link'
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification'
import { exit, relaunch } from '@tauri-apps/plugin-process'
import { open } from '@tauri-apps/plugin-shell'
import { InvokeCommand } from '../../constants'

export function createTauriLayer() {
  async function showWindow() {
    const window = getCurrentWindow()
    await window.show()
    await window.setFocus()
  }

  function openURL(url: string) {
    return open(url)
  }

  function playNotificationSound() {
    return invoke(InvokeCommand.PlayNotificationSound)
  }

  function setMenubarIcon(isTemplate: boolean) {
    return invoke(InvokeCommand.SetIconTemplate, { isTemplate })
  }

  function requestNotificationPermission() {
    return requestPermission()
  }

  function hasNotificationPermission() {
    return isPermissionGranted()
  }

  function notify(notification: { title: string, body: string }) {
    return sendNotification(notification)
  }

  function quitApp() {
    return exit(0)
  }

  function relaunchApp() {
    return relaunch()
  }

  function isAutoStartEnabled() {
    return AutoStart.isEnabled()
  }

  function enableAutoStart() {
    return AutoStart.enable()
  }

  function disableAutoStart() {
    return AutoStart.disable()
  }

  function onOpenUrl(handler: Parameters<typeof listenForOpenUrl>[0]) {
    return listenForOpenUrl(handler)
  }

  return {
    showWindow,
    openURL,
    playNotificationSound,
    setMenubarIcon,
    requestNotificationPermission,
    hasNotificationPermission,
    notify,
    quitApp,
    relaunchApp,
    isAutoStartEnabled,
    enableAutoStart,
    disableAutoStart,
    onOpenUrl,
  }
}

export type GiTauriLayer = ReturnType<typeof createTauriLayer>
