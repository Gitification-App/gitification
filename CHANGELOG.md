### 1.3.1
  - Fixed app always starts in Turkish. (Sorry for that :sweat_smile:)

### 1.3.0
  - Updated Wowerlay to 1.1.0 to fix some bugs.
  - Added select language option to settings page (en and tr for now).

### 1.2.0
  - Added right click menu to repository titles.
  - Refactored ugly spaghetti code to a maintainable good looking code.
  - Fixed scroll padding on home page.
  - Fixed a bug if user has `mark as read on open` enabled and clicks a selected notification the notification stays selected in data and confuses the app.
  - Fixed a bug if user has `show read notifications` and marks or unsubscribes a notification it gets deleted (it should just become read).

### 1.1.3
  - Fixed content background for mac.

### 1.1.2
  - Fixed bug when login.

### 1.1.1
  - Now gitificaiton uses OverlayScrollbars library to make scrollbars look better betweeen operating systems.
  - Added `indeterminate` feature for repositories.
  - Added an option to mark notifications when open.
  - Added Windows and Linux support, (Linux might not comppile right now :sadge:)
  - `Retry` button of Oopsie error now shows skeletons on refresh.

### 1.1.0
  - Now Gitification has in-app updater, you don't have to download updates manually anymore.
  - Fixed a bug preventing opening read notifications on browser.
  - Added light and dark theme support, by default Gitification will choose system color.
  - Updated settings page to be more ergonomic.

### 1.0.1
  - Fixed a bug when user closes a contextmenu and then press O, U or M last item is triggers.
  - Synchronized api requests to avoid collisions.
  - Now Marking or unbuscribing a notification shows effects immediately. `(It was waiting for API request to success before)` but if request fails persists old data.

### 1.0.0
Gitification is finally version 1.0.0.

  - Now settings button on sidebar is `···` button that opens a popover with options.
  - Settings page is redesigned, "Logout" and "Exit app" buttons are moved to menu of `···` button on sidebar.
  - Added tooltips to interactable elements.
  - Added right click contextmenu for notification items.
  - Added `Unsubscribe` option for selected thread to contextmenu.
  - Added shortcut `(U)` to unsubscribe selected notifications.
  - BottomBar is removed due to new context menu. 

### 0.5.0
  - Added checkboxes to notifications/repositories, now users can select notifications and mark or open them at once. Can mark as read without going to notification page.
  - Minor style changes
  - Minor bug fixes

### 0.4.0
  - Added `Show system notifications` seting, if you enable this and your system granted notifications for Gitification, system notifications will show up.
  - Some style improvements

### 0.3.0
  - Auto launch on startup setting added.
  - Custom tray icon added, if an unread notification exists, it will highlight as blue.
  - Added icon logo and repository link to sidebar.
  - Back button is moved from sidebar to settings page header.
  - Sidebar padding adjusted to match settings page.
  - Now when a new notification is received if enabled Gitification will play sound.
  - Minor style changes.

### 0.2.0
  - Added ESC shortcut support for settings page, if pressed user will be redirected to home page.
  - In home page users can navigate between notifications by arrow up and arrow down keys.
  - If loading notifications failed, users will see an error state.
  - If there is no notification, users will se an empty state.
  - Sync icon in sidebar now spins if notifications are loading.
  - Added title attributes to only-icon buttons.
  - Now back button is disabled instead of invisible in non-settings pages.
  - Added a button for repository link to settings page.
  - Minor style improvements.

### 0.1.0
  - Added sidebar to landing page and a button to allow users to modify settings.
  - Added a back button to sidebar, removed bell icon. Now users can navigate back from settings.
  - Now notification title shows image of repository instead of a dummy image.

## Actions
  - Now release action adds a link to release to navigate users to changelog.
