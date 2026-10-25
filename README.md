# Pipers Family

Personal launcher package and Homebrew Channel feed for LG webOS TVs.

## Install on the TV

In Homebrew Channel, open Settings → Add repository and enter:

```
https://raw.githubusercontent.com/gohun04/pipers-family/main/repo/apps.json
```

Return to the app list, select Pipers Family, then Install. This uses Homebrew Channel's installer rather than copying files into system directories. The package SHA-256 is checked during installation.

Version 1.0.2 was packaged using LG webOS CLI 3.2.6 from the supplied app source. Earlier manually packaged versions failed installer verification. Installing this app does not remap the Home button.

## Publish an update

1. Build your app as a webOS `.ipk` with a higher version in appinfo.json.
2. Run `python3 update_repo.py /path/to/new-app.ipk` from this repository.
3. Commit and upload the updated repo folder to GitHub's main branch.
4. Refresh Homebrew Channel to see the update.

The feed URL remains the same. Only app distribution files belong in this public repository; never upload SSH keys, passwords, or TV diagnostic logs.


## Version 1.1.0

Apple TV-inspired home layout with wide cards, scalable vector icons, a layered mountain background, a clock, animated focus, remembered selection, directional remote navigation, and a power-off confirmation. Back opens LG Home instead of activating the selected item. No external artwork, analytics, or network calls are needed to draw the home screen.

The editable app source is in `app/`. Package it with LG webOS CLI: `ares-package app -o repo --no-minify`, then run `python3 update_repo.py repo/com.pipers.family_VERSION_all.ipk` and commit the package and manifest.

## Version 1.2.0 — app library and live TV

The launcher discovers installed, visible TV apps through the rooted Homebrew Channel service. Apps are grouped into Movies & TV, Catch-up TV, Music, Games, TV & inputs, and Utilities. Choose Manage apps (or press Yellow on an app) to show/hide it, change its category, or toggle favourite status. These preferences are stored locally on the TV. Hiding does not uninstall an app. Add new apps opens LG Content Store or Homebrew Channel; Refresh rescans the TV. No app inventory or preferences are sent to this repository or any remote server.

Antenna / Live TV opens the LG tuner app; use the normal channel buttons once watching. HDMI inputs and Original LG Home remain accessible. Back closes a dialog or returns to the All apps view.

Home-button integration is optional and separate from the IPK: on a rooted TV, install [LG Input Hook](https://github.com/Simon34545/lginputhook), launch it once, and set Home (773 on the tested remote) to launch `com.pipers.family`. Its boot hook keeps the mapping across restarts. To undo, remove that binding in LG Input Hook. Key codes can vary by remote. The launcher itself does not alter remote bindings during installation.

Build the current source with `ares-package app --no-minify`, then run `python3 update_repo.py path/to/com.pipers.family_1.2.0_all.ipk`. The catalog helper requires rooted Homebrew Channel and runs locally using the TV's Node runtime. It filters out background/system overlays and falls back to initials when an icon is unavailable. Cached apps remain visible if discovery fails, with an error message.
