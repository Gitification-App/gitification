# Gitification Agent Guide

## What This Project Is

Gitification is a Vue 3 + TypeScript desktop menubar application for GitHub notifications. It is packaged with Tauri 2. The frontend displays and manages GitHub notification threads; the Rust layer owns desktop integration such as the tray icon, window behavior, sound playback, and native commands.

## Repository Structure

```text
src/
  App.vue                 Root application shell and route selection
  main.ts                 Startup/bootstrap sequence
  views/                  Full-page views: landing, home, settings, about
  ui/                     Reusable Vue UI components
  composables/            Vue/Tauri event and input helpers
  gitification/           Application/domain layer
    api/                  GitHub API calls, request transport, and API types
    actions/              User-facing operations and side effects
    auth/                 GitHub OAuth and deep-link callback handling
    state/                Reactive runtime state
    storage/              Persisted settings/accounts and migrations
    router/               Small reactive in-app router
    tauri/                Tauri platform adapter exposed as TauriLayer
    utils/                GitHub URL, collection, date, notification helpers
  constants.ts            Shared constants and Tauri command names
  lib.css                 Global styling and theme definitions

src-tauri/
  src/main.rs             Tauri setup, tray events, polling event, window events
  src/commands.rs         Rust commands invoked from the frontend
  tauri.conf.json         Tauri window, tray, bundle, updater, and deep-link config
  resources/              Bundled native resources such as the notification sound
  capabilities/            Tauri permissions/capabilities

public/                    Fonts and static assets
images/                    README screenshots
README.md                 User-facing project overview
package.json              Frontend scripts and dependencies
vite.config.ts             Vite configuration
```

## Application Flow

1. [`src/main.ts`](src/main.ts) bootstraps the application.
2. Tauri store data is loaded through `Gitification.storage.syncFromDisk()`.
3. If an active account exists, the router starts on `home`; otherwise it starts on `landing`.
4. [`src/App.vue`](src/App.vue) selects the current view, initializes OAuth listening, and starts polling.
5. The Rust layer emits a `poll_tick` event every 10 seconds. The frontend only fetches when the configured poll interval has elapsed.
6. `actions.fetchThreads()` requests notifications from GitHub, compares them with the previous list, and triggers sound/system notifications for new unread threads.
7. Unread state controls whether the tray icon uses its template/normal appearance.

## State and Persistence

`src/gitification/state/index.ts` exposes runtime state. Most durable state is proxied to `src/gitification/storage/index.ts`:

- `state.users`: stored GitHub accounts and access tokens.
- `state.currentUser`: computed from `storage.activeUserId`.
- `state.settings`: persisted preferences.
- `state.threads`: current in-memory notification list; not persisted.
- `state.checkedThreadIds`: temporary multi-selection state.

Storage is versioned as `AppStorageContextV2`. Changes to the storage shape require a migration path in `syncFromDisk()` and should preserve defaults for newly added settings.

## Factory Composition

The application is assembled in `src/gitification/index.ts`. Factories use named object options so dependencies remain explicit and type-safe:

```text
createStorage({ getStorage })
createState({ storage })
createRouter({ defaultPage })
createTauriLayer()
createApi({ nativeFetch })
createActions({ state, storage, router, api, tauri })
createAuth({ api, actions, router, state, tauri })
```

`createStorage()` uses the real Tauri store by default. Tests should provide `getStorage: async () => fakeStore`. `createState()` must receive the storage instance it observes; it should not import the Gitification facade.

`createActions()` owns action-local mutable state such as the active fetch controller and receives all external services as dependencies. Production code exposes the single assembled instance through `Gitification`; tests should create fresh factory instances.

`utils` is a pure module and can be imported directly by application code and factories. It is intentionally not passed through dependency injection.

All parameterized `createX` functions use named object options, including `createRouter({ defaultPage })`, `createState({ storage })`, `createStorage({ getStorage })`, `createApi({ nativeFetch })`, and `createCodeCallbackURL({ redirectUri })`.

## GitHub and OAuth

- GitHub API requests are centralized in `src/gitification/api/`. The private `sendRequest()` helper, request headers, authorization, query parameters, and network fallback for `createThreadHtmlURL()` all belong to `createApi()`.
- `src/gitification/utils/github/` contains pure URL helpers only. Do not add network calls there.
- `createThreadHtmlURL()` is called through `Gitification.api.createThreadHtmlURL()` because it may resolve unknown subject types through GitHub.
- OAuth uses the custom deep-link URI `gitification://oauth/callback`.
- The callback listener is registered by `useOauthListener()` and implemented in `src/gitification/auth/`.
- Required environment variables are `VITE_CLIENT_ID` and `VITE_CLIENT_SECRET`, based on `.env.example`.
- GitHub notification subject types do not all map to the same web URL. Keep URL construction changes in `createThreadHtmlURL()`.

## Frontend Conventions

- Use the existing `UI` components and `Gitification` namespace exports instead of introducing parallel state or service layers.
- Route changes use `Gitification.router.navigate(...)`; there is no Vue Router dependency.
- User operations that affect API state belong in `src/gitification/actions/`.
- Components should generally call actions rather than calling the API module directly.
- Tauri events should be wrapped with the existing `useTauriEvent()` composable so listeners are cleaned up with the component scope.
- The app disables the browser context menu globally because context menus are implemented in the UI layer.

## Native/Tauri Boundary

`src/gitification/tauri/index.ts` contains `createTauriLayer()`. It is the only application-layer adapter for Tauri operations such as window focus, notifications, AutoStart, URL opening, app lifecycle, sounds, and menubar icon state. Actions depend on the `TauriLayer` interface rather than raw Tauri functions or command names.

OAuth is created through `createAuth(...)`. Deep-link registration is exposed by `TauriLayer.onOpenUrl()`, so auth does not import the Tauri deep-link plugin directly. The factory owns OAuth callback processing state and can be instantiated independently in tests.

Frontend-to-Rust calls use the command names in `src/constants.ts`:

- `play_notification_sound`
- `set_icon_template`
- `go_to_notification_settings`

Keep platform-specific native behavior in `src-tauri/src/commands.rs`. Keep tray/window lifecycle behavior in `src-tauri/src/main.rs`. When adding a command, update the Rust `invoke_handler` and the frontend command constants/call site together.

## Common Commands

```bash
pnpm install
pnpm dev                 # Vite development server
pnpm typecheck           # vue-tsc --noEmit
pnpm build               # Typecheck and production Vite build
pnpm tauri dev           # Run the desktop application
pnpm tauri build         # Build native bundles/installers
```

The Tauri build configuration runs `pnpm dev` before development and `pnpm build` before production builds. Rust development also requires a working Rust/Tauri toolchain for the target platform.

## Known Current Gaps

- The Home view network-error Retry button is rendered without a click handler.
- The thread context-menu Unsubscribe item currently has a no-op action, although the underlying action/API functions exist.

## Change Checklist

Before changing behavior:

1. Check whether the behavior belongs in a view, action, API helper, storage layer, or Rust command.
2. Preserve reactive state access through `Gitification.state` and persisted settings through `Gitification.storage`.
3. Pass factory dependencies through named object options; do not reintroduce hidden facade imports into factories.
4. Keep `utils` pure and import it directly; keep network/platform side effects in API, actions, or Tauri layers.
5. Consider account switching and logout, not only the currently active account.
6. Keep API operations guarded when `currentUser` is `null`.
7. Run `pnpm typecheck` and the relevant build/test command when dependencies are available.
8. For Tauri changes, verify both frontend invocation and Rust command registration.
