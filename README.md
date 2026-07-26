<img width="128" height="128" src="src-tauri/icons/128x128%402x.png" />

# Gitification - Menubar App for Github Notifications

Gitification is a lightweight desktop application that notifies you when you have new notifications on Github. It sits on your menubar and gets your attention with a sound.

- Lightweight `Nearly 10mb`. Uses Tauri so doesn't ship with a browser engine.
- Easy to login `Uses Github Oauth flow`.

[Download from releases](https://github.com/Gitification-App/gitification/releases)

### ⚠️ Mac OS Gatekeeper

After installing Gitification MacOS blocks the app because it's unsigned. Open **System Settings > Privacy & Security**, then click **Open Anyway** for Gitification.

Alternatively, remove the quarantine attribute from Terminal after moving the app to Applications:

```bash
xattr -d com.apple.quarantine /Applications/Gitification.app
```


### Screenshots

<div>
  <img width="350" src="images/image.png" />
<img width="350" src="images/imagectx.png" />
</div>
