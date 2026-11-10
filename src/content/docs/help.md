---
title: Help
heading: Help
summary: Where your files live, answers to the questions that come up most, and how to report something that is broken.
description: Help and troubleshooting for Alcove, a visual workspace for Windows.
toc: true
---

The fastest way to get help is to email <a href="mailto:iamincontrol.dev@gmail.com">iamincontrol.dev@gmail.com</a><button type="button" class="email-copy" data-email="iamincontrol.dev@gmail.com" aria-label="Copy email address"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="i-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="i-check"><polyline points="20 6 9 17 4 12"></polyline></svg></button>, or to [open an issue on GitHub](https://github.com/IAmInControlll/alcove-web/issues). Issues are public, so use email for anything private.

Alcove is a personal project, so replies are best-effort rather than same-day.

## Where your files are

Everything Alcove stores is under one folder:

```
%APPDATA%\Alcove\
├── shortcuts\   copies of the shortcuts you added
├── notch\       links to what you pinned to the Notch
├── icons\       cached icons and thumbnails
├── settings.json
├── positions.json
├── notch_layout.json
├── folder_colors.json
├── launch_stats.json
├── search_history.json
├── desktop_sync.json
├── file_index.bin
├── exchange_rates.json
└── update_check_cache.json
```

Paste `%APPDATA%\Alcove` into the address bar in File Explorer to open it, or use Data folder in Settings > Data management.

## Reporting a problem

The more of this you can include, the faster something gets fixed:

1. What you expected, and what happened instead.
2. The exact steps that trigger it, ideally from a fresh launch of the app.
3. Your Alcove version, from Settings > Help & Info.
4. Your Windows version, from `winver`.
5. Whether the problem survives a restart of the app, and whether it survives Reset settings in Settings > Data management.

If a specific shortcut misbehaves, say what kind it is: a `.lnk`, a `.url`, an `.exe`, a linked external folder, or a Windows shell object such as Recycle Bin.

## Common questions

### Windows flagged the installer

Current builds are not code-signed, so Windows SmartScreen may show a "Windows protected your PC" prompt, and some antivirus engines occasionally flag an unsigned installer on heuristics alone. Choose "More info" and then "Run anyway" if you are confident the download came from a source you trust. This is a signing gap, not a sign that anything is wrong with the file, and it is on the list to fix.

### Which installer do I want?

The `.exe` (NSIS) installer is the one to use for a normal install. It installs to `%LOCALAPPDATA%\Alcove` for your user account and needs no administrator rights.

The `.msi` (WiX) installer is the enterprise option. It always installs for all users, to `C:\Program Files\Alcove`, and needs administrator rights.

### Does deleting remove the file?

No. Alcove works on its own copy inside `shortcuts\`, so deleting from the grid removes that copy and leaves the original where it was.

Linked external folders work the same way in spirit: dragging a folder in creates a Windows junction, and deleting it removes only the junction. The real folder and everything inside it is untouched.

### The hotkey does nothing

Global hotkeys are exclusive: whichever application registers a combination first owns it, and everything else silently misses out. `Ctrl+Space` in particular is claimed by some IMEs and by a few IDEs.

Open Settings, record a different combination for the workspace, Peek, or Shelf hotkey, and check that it is not already in use by something running at startup.

### An icon is missing or looks wrong

Icons are extracted once and then cached. If a program updates and changes its icon, or extraction failed the first time, the stale one sticks around. Icon cache in Settings > Data management empties the cache, and icons are re-extracted the next time the folder is opened.

### The Notch does not open

Push the pointer all the way to the top edge, in the middle where the Notch sits, and hold it there for a moment. Only the strip as wide as the closed Notch opens it. The Notch stays shut while you drag a window and while a game or video is fullscreen, and it only opens on the monitor chosen in Settings > Notch. Set When closed to Hairline in the same section to see where it sits, or give it a hotkey.

### Undo in Alcove Files

Ctrl+Z undoes your last change in Alcove Files and Ctrl+Y redoes it, or right-click empty space for Undo and Redo. Deleted files come back from the Recycle Bin. Deleting a linked folder only removes the link.

### The clipboard history panel is empty

It reads Windows' own clipboard history, the list Win+V shows. If that is off in Windows Settings, the panel has nothing to show. It has a button that takes you to the Windows setting.

### A restored shortcut will not open

A backup stores your shortcuts, not the programs they point at. If a program has been uninstalled since the backup was made, or you restored onto a different machine where it was never installed, the shortcut comes back with nothing to launch. Linked folders that cannot be found are listed for you after a restore.

### Where do I find the changelog?

Settings > Help & Info > Changelog, inside the app, or the [Changelog](../changelog/) page.

## Backing up your workspace

Export backup, in Settings > Data management, saves your whole workspace - settings, layout, folder colours, shortcuts, your Notch collection and layout, launch statistics, and search history - to a single `.alcove-backup` file wherever you choose to put it. It is worth doing before a big rearrange, before resetting settings, or before reinstalling Windows.

Importing replaces your current workspace entirely, and asks you to confirm before it does. If the restore fails part way, your existing workspace is left as it was.

Two cautions. A backup file contains your search history and the real paths of your linked folders, so treat it as personal. And only import archives you trust, since a backup can hold any kind of file, including programs, which become launchable shortcuts once restored.

## Uninstalling

Uninstall from Windows Settings > Apps > Installed apps, or from the Start menu entry.

The `.exe` (NSIS) installer cleans up after itself: it restores your desktop icons if Alcove hid them, removes the auto-start entry, and offers to delete your Alcove data folder. Decline that last prompt if you want to keep your workspace for a future reinstall. To remove it later by hand, delete `%APPDATA%\Alcove\`.

The `.msi` (WiX) installer does not include cleanup hooks. If you uninstall via MSI, you'll need to restore desktop icons and remove the Startup shortcut manually.

Backup files you exported are never touched by the uninstaller. Delete those yourself.

## Privacy and terms

See the [Privacy Policy](../privacy/) for what is stored and what leaves your device, and the [Terms of Use](../terms/) for the licence the app is provided under.
