---
title: Install Alcove
heading: Install Alcove on Windows
description: Download and install Alcove on Windows. Covers the SmartScreen warning for unsigned builds and links to the release page.
summary: The download started automatically when you opened this page. Follow the steps below.
updated: 2026-08-19
toc: true
autoDownload: true
---

The installer for the latest release should start downloading on its own. If it didn't, use the button below.

<a class="btn btn-primary install-cta" href="https://github.com/IAmInControlll/alcove-web/releases/latest/download/Alcove-setup.exe" download>Download Alcove-setup.exe</a>

<p class="install-changelog-link">Want to see what changed? Read the <a href="../changelog/">changelog</a>.</p>

## Step-by-step

<div class="install-steps">
<div class="install-step">
<p><strong>1.</strong> Open the <strong>Downloads</strong> folder and find <code>Alcove-setup.exe</code>.</p>
<figure class="install-figure">
<img src="../install-shots/just-downloaded.png" alt="Alcove-setup.exe shown in the browser download bar after downloading" loading="lazy" />
<figcaption>The installer in the browser download bar.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>2.</strong> Double-click <code>Alcove-setup.exe</code> to start the installer.</p>
</div>
<div class="install-step">
<p><strong>3.</strong> Windows SmartScreen may show a <strong>"Windows protected your PC"</strong> prompt. Click <strong>More info</strong>.</p>
<blockquote class="install-callout">
Current builds (v0.1.2) are not code-signed, so SmartScreen flags the installer. This is a signing gap, not a sign the file is malicious.
</blockquote>
<figure class="install-figure">
<img src="../install-shots/smartscreen-before-more-info.png" alt="Windows SmartScreen showing 'Windows protected your PC' with no Run button visible yet" loading="lazy" />
<figcaption>The SmartScreen prompt as it first appears.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>4.</strong> Click <strong>Run anyway</strong>.</p>
<figure class="install-figure">
<img src="../install-shots/smartscreen-after-more-info.png" alt="SmartScreen prompt after clicking More info, now showing the Run anyway button" loading="lazy" />
<figcaption>The <strong>Run anyway</strong> button appears after clicking <strong>More info</strong>.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>5.</strong> The installer opens. Click <strong>Next</strong>.</p>
<figure class="install-figure">
<img src="../install-shots/installer-1.png" alt="Alcove NSIS installer welcome screen" loading="lazy" />
<figcaption>The installer welcome screen.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>6.</strong> Pick the install location. The default is fine. Click <strong>Next</strong>.</p>
<figure class="install-figure">
<img src="../install-shots/installer-2.png" alt="Alcove installer install location selection" loading="lazy" />
<figcaption>Choose where Alcove installs. The default works for most users.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>7.</strong> Click <strong>Install</strong> and wait for it to finish.</p>
<figure class="install-figure">
<img src="../install-shots/installer-3.png" alt="Alcove installer progress bar while installing" loading="lazy" />
<figcaption>The installer copies files and sets up Alcove.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>8.</strong> The finish screen has two options, both checked by default. <strong>Run Alcove</strong> launches the app as soon as you click Finish. <strong>Create desktop shortcut</strong> adds a shortcut on the desktop for launching it later. Leave them checked, or uncheck either if you'd rather not. Then click <strong>Finish</strong>.</p>
<figure class="install-figure">
<img src="../install-shots/installer-4.png" alt="Alcove installer completing screen with Finish button, Run Alcove and desktop shortcut options" loading="lazy" />
<figcaption>Both options are checked by default. Click <strong>Finish</strong> when you're ready.</figcaption>
</figure>
</div>
<div class="install-step">
<p><strong>9.</strong> Open Alcove from the Start menu or the desktop shortcut. If you left <strong>Run Alcove</strong> checked in the previous step, the app is already open.</p>
</div>
</div>

## That's it

<div class="install-finale">
<p class="install-thanks">Thanks for installing Alcove. Hope it makes your day a bit easier.</p>
<p>Feedback and criticism are both very welcome. If there's something you'd like built, just let me know - I'll get back to you as soon as possible. You can open an issue on GitHub <a href="https://github.com/IAmInControlll/alcove-web/issues/new" target="_blank" rel="noopener noreferrer">here</a>, or email <a href="mailto:iamincontrol.dev@gmail.com">iamincontrol.dev@gmail.com</a><button type="button" class="email-copy" data-email="iamincontrol.dev@gmail.com" aria-label="Copy email address"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="i-copy"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="i-check"><polyline points="20 6 9 17 4 12"></polyline></svg></button>.</p>
</div>

## Release notes and verification

For the full release notes, the SHA-256 fingerprint (`checksums.txt`), and the list of files in this release, see the <a href="https://github.com/IAmInControlll/alcove-web/releases/latest" target="_blank" rel="noopener noreferrer">latest release page</a>.

## Trouble installing?

If something goes wrong, see the [Support](../support/) page for common issues and how to get help.
