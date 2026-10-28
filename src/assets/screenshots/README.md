# Image assets the site needs

This file lists every image the site expects from the user. Drop real files in at the paths below; the build picks them up by exact filename and no code changes are needed.

Screenshot order follows the brand rule: workspace -> folders -> themes -> peek -> shelf. Never lead with settings or the Shelf. The workspace is selling point #1 and the Shelf #2; folders, themes and Peek are parts of the workspace. The site positions Alcove as a visual workspace, not a launcher, so every shot should reinforce "a space you arrange" before it shows any feature.

General guidance for all screenshots:
- Capture on Windows 11 at a realistic window size. The workspace should look like it does in normal use, not staged with one item in the middle.
- Use a theme that reads as calm and considered - the default mint-on-charcoal is a safe choice. Avoid the loudest retro theme for the hero or the workspace shots.
- Hide anything that would date or personalise the shot: real file names, account names, browser history, third-party app icons that imply endorsement. Use neutral placeholder names where needed (e.g. "Project Files", "Apps", "Daily").
- No annotations, arrows, or callouts on the screenshots themselves. The site adds its own captions and copy.
- Keep the workspace partially filled - enough tiles to look lived-in, not so many it looks cluttered. Roughly 60-75% of the grid in use works well.
- PNG is fine. WebP or AVIF is smaller if you can export it.
- The workspace chapter shows `grid-view`, `folders` and `peek` in one 16:9 frame that swaps as you scroll (about 700px wide on desktop), so take all three from the same window size. The Shelf chapter shows `shelf` about 750px wide, bleeding off the right edge. Capture at least 1400px wide so the images stay sharp on high-density screens. Hero slides are 16:9.

## App screenshots

Place these in `src/assets/screenshots/`. Do not put them in `public/` - they go through the Astro build so they get hashed and optimized. `screenshotUrl()` in `src/config/screenshots.ts` finds each one by name, so `grid-view.png`, `grid-view.webp`, and `grid-view.avif` all work; if no file matches, the chapter leaves that image out.

### Capturing

1. Back up your own workspace first (Settings > Backup & restore > Export). Importing replaces it.
2. Import `C:\Users\Mohammad\Documents\mock-workspace.alcove-backup` (built by `edit-backup.ps1`, or build a fresh one with `generate-mock-backup.ps1`).
3. Close or minimise everything behind Alcove. The window shots include a margin of whatever is behind it.
4. For each shot, run the capture script, then set up the view during the countdown and keep focus on Alcove:

```powershell
powershell -ExecutionPolicy Bypass -File capture.ps1 -Shot grid-view
```

`-Shot` is one of `grid-view`, `folders`, `themes`, `peek`, `shelf`. The file is saved next to the script under the right name. `-Delay` changes the countdown (default 6 seconds), `-Margin` the desktop border around the window (default 40px), `-NoResize` captures the window exactly as it is with no margin, and `-KeepSize` leaves the window at the capture size instead of restoring it. `-Widen` resizes the window to 16:10 at its current height and exits, so you can arrange tiles before capturing with `-NoResize`.

### Hero slides (`hero-1.webp`, `hero-2.webp`, ...)

- Used by: the themes chapter (`hero-1`, `hero-3`, `hero-4`, `hero-5`, `hero-6`, `hero-7`, `hero-9`, picked in `HomeThemes.astro`), which stacks the shots and wipes one diagonally over the next on a timer (arrows instead of the timer with reduced motion). Every shot must keep the Alcove window at the same size and position, or the wipe stops reading as the theme changing in place. `hero-2` and `hero-8` are not currently shown. Alt text lives in `heroSlides` in `src/config/home.ts`.
- Aspect: 16:9. Each slide is a full-screen screenshot cropped to 1900x1069 centred on the Alcove window and saved as WebP, so the window sits in the same place on every slide and the crossfade only changes the theme and wallpaper around it. Keep the window at the same size and position for every slide.
- Each slide shows a different theme over a different wallpaper, with desktop icons hidden.
- Goal: Make a visitor understand what Alcove is in under two seconds. This is the single most important image on the site.
- What to show: The Alcove workspace open over a real Windows desktop, so the grid is clearly the focal point and the desktop behind it is visibly decluttered. The preferred composition is "Alcove floating cleanly over a tidy desktop" - the workspace is the subject, the desktop is context.
- Alternative composition: A before/after split (cluttered desktop on one side, same desktop with Alcove open on the other). Only use this if the split reads clearly at small sizes; otherwise prefer the single floating-workspace shot.
- What to avoid: A bare workspace with one or two tiles. A shot that leads with the Shelf or settings. A shot so zoomed out the tiles become unreadable.
- Feeling: Calm, organised, "this is where my stuff lives". Not flashy.

### `grid-view.png`

- Used by: the workspace chapter (`HomeWorkspace.astro`), step 1 ("Your space")
- Aspect: 16:10
- Goal: Show the core product - the drag-and-drop grid with real things on it.
- What to show: The main workspace with a varied, realistic set of tiles: a few app shortcuts, a couple of folders, maybe a shell object or a .url tile. Tiles should be arranged in a way that looks intentional but personal - grouped loosely by purpose rather than in a perfect grid. Include a mix of tile types so it reads as "shortcuts, apps, folders, and shell objects", not just app icons.
- What to avoid: An empty grid. A grid so full it looks like a Start menu. Only one kind of tile.
- Feeling: "I arranged this the way I think about my stuff."

### `folders.png`

- Used by: the workspace chapter, step 2 ("Folders")
- Aspect: 16:10
- Goal: Show that folders in Alcove are real Windows junctions and that you can group things in-app.
- What to show: At least one in-app folder open or expanded, with items inside it visible. Show a coloured folder or two so the "colour them to find things at a glance" claim is visible. If the UI distinguishes a junction from a copied folder (an icon, a badge, a path tooltip), include that cue - it is the proof for "not a copy".
- What to avoid: A closed folder with nothing happening. A shot that looks identical to grid-view.png. Hiding the junction distinction, since that is the whole point of this tab.
- Feeling: "I can group things without duplicating files."

### `themes.png`

- Used by: nothing at the moment. The themes chapter shows the hero wallpaper shots instead. Kept for a future themes view.
- Aspect: 16:10
- Goal: Show personalisation without making it look like theming is the main feature.
- What to show: The theme picker open, with a visible selection of light, dark, and retro themes. Ideally the workspace behind the picker is using one of the non-default themes so the change is obvious. If tile size or window opacity controls are visible, include them - they back up the "adjustable tile size and window opacity" line.
- What to avoid: A shot of just the theme picker dialog with no workspace behind it. Showing only dark themes (it implies the product is dark-only). Making this shot so busy it competes with the hero.
- Feeling: "It can look like mine, but that's not the main thing."

### `peek.png`

- Used by: the workspace chapter, step 3 ("Peek")
- Aspect: 16:10
- Goal: Show Peek doing its one job: previewing a file inline without launching the source app.
- What to show: A Peek preview open over a tile, with the previewed content clearly visible. An image, a document, or a text file all work - pick one where the preview is legible at screenshot size. The tile being peeked should be identifiable so the relationship between "the thing on the grid" and "the preview" is clear.
- What to avoid: A Peek preview of something unreadable at small sizes (a giant spreadsheet, a video frame). A shot where the preview blends into the workspace background.
- Feeling: "Quick look, no commitment."

### `shelf.png`

- Used by: the Shelf chapter (`HomeShelf.astro`), the second-largest image on the page
- Aspect: 16:10
- Goal: Show the Shelf as the second selling point: prominent, but after the workspace.
- What to show: The Shelf open with a local search query typed in and a few results visible - enough to show it searches the workspace. If the Google and Wikipedia scopes are visible in the same frame, include them, but do not force all three scopes into the shot if it makes it cluttered. Local search results are the priority.
- What to avoid: Making it outshine the workspace shot, which stays the hero. An empty Shelf with no query. A shot that makes Alcove look like a launcher first.
- Feeling: "It's there when typing is faster than browsing."

## Demo video

The home page has a "Watch it in use" section (`DemoVideo.tsx`) that stays hidden until a video exists. Drop the files into `src/assets/video/` (create the folder) and rebuild; no code changes are needed. The lookup is in `src/config/video.ts`.

- `demo.mp4` (or `demo.webm`): the clip. Aim for about 30 seconds, 16:9, H.264 MP4, under roughly 10 MB since it ships with the site.
- `demo-poster.webp` (or `.png`/`.jpg`): optional still shown before play. A frame of the workspace open works.
- What to show: open Alcove with the hotkey, drag a couple of things in, open a folder, Peek a file, close it again. Workspace first; the Shelf only briefly, if at all.
- It does not autoplay or loop, and plays with sound off unless the visitor turns it up, so no voiceover is needed. Captions on screen are fine if they are short.
- The heading and one-line description live in `demo` in `src/config/home.ts`; adjust them to match what the clip actually shows.

## Social share image

### `og.png`

- Location: `public/og.png`
- Size: 1200x630
- Used for: `og:image` and `twitter:card` (summary_large_image). This is what shows up when someone posts a link to the site on social, Slack, Discord, etc.
- Goal: Communicate "Alcove - visual workspace for Windows" at a glance, with the brand lockup, not a feature dump.
- What to show: The supplied Alcove lockup artwork (use the marketing lockup or horizontal tagline lockup - do not reconstruct the wordmark from typed text). Pair it with the primary marketing headline "Clear the clutter. Keep what matters close." on a calm charcoal background using the mint accent. One clear subject - the lockup and the line - not a grid of features or a screenshot collage.
- What to avoid: Em-dashes and en-dashes in any text on the image (use plain hyphens). Hype words. A busy composition. Reconstructing the logo from a font.
- Feeling: Sleek, calm, confident. The same personality as the site.

## Already in place

These are real assets and do not need replacing:

- Brand SVGs in `src/assets/brand/`: `glyph.svg`, `wordmark-dark.svg`, `wordmark-light.svg`, `lockup-horizontal-tagline-dark.svg`, `lockup-horizontal-tagline-light.svg`, `lockup-stacked-dark.svg`, `lockup-stacked-light.svg`, `marketing-lockup-dark.svg`, `marketing-lockup-light.svg`.
- `public/favicon.png` and `public/icon.png` (apple-touch icon).
- `public/og.png` - the marketing lockup with "A visual workspace for Windows" underneath, on the charcoal background with a mint glow.
- `src/assets/brand/kofi-badge-dark.png` and `kofi-badge-light.png`.
- `public/install-shots/*` - the eight installer and SmartScreen walkthrough images used on the Install page.

## Demo icons (`src/assets/demo-icons/`)

The live Alcove demo on the home page uses real icons copied from the app's icon cache (`%APPDATA%\Alcove\icons\`), renamed to short ids that `src/config/demo.ts` references (`chrome.png`, `this-pc.png`, ...). They are 32 or 40 px, the same bitmaps the app renders. Replace one by copying the matching file from the cache over it under the same name.

## Demo wallpaper (`src/assets/demo-wallpaper-*.svg` / `.webp`)

The hero demo sits on a desktop: a rounded frame filled with an original abstract wallpaper (mint and teal ribbons over soft glows), dark or light following the site theme (`--demo-wallpaper` in `global.css`). Not the Windows 11 wallpaper, which is Microsoft's artwork. The SVGs are the editable sources; the page loads the WebPs (2400x1500, about 25KB each) so the browser never rasterizes the SVG blur filters. After editing an SVG, run `node scripts/render-demo-wallpaper.mjs`.

## Demo file pictures (`src/assets/demo-files/`)

Small original SVG illustrations that stand in for the photos and images inside the demo's linked "Projects" folder (Lisbon trip photos, a park, a lake). The Website folder inside Projects shows this site's real `og.png` and glyph instead. Peek shows them when a `.jpg` or `.svg` entry is opened. `src/config/demo.ts` refers to them by file name (`picture: 'rooftops'`).
