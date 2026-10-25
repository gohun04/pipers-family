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
