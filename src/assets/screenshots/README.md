# Image assets the site needs

This file lists every image the site expects from the user. Drop real files in at the paths below; the build picks them up by exact filename and no code changes are needed.

Screenshot order follows the brand rule: workspace -> folders -> themes -> peek -> shelf. Never lead with settings or the Shelf. The site positions Alcove as a visual workspace, not a launcher, so every shot should reinforce "a space you arrange" before it shows any feature.

General guidance for all screenshots:
- Capture on Windows 11 at a realistic window size. The workspace should look like it does in normal use, not staged with one item in the middle.
- Use a theme that reads as calm and considered - the default mint-on-charcoal is a safe choice. Avoid the loudest retro theme for the hero or feature tabs.
- Hide anything that would date or personalise the shot: real file names, account names, browser history, third-party app icons that imply endorsement. Use neutral placeholder names where needed (e.g. "Project Files", "Apps", "Daily").
- No annotations, arrows, or callouts on the screenshots themselves. The site adds its own captions and copy.
- Keep the workspace partially filled - enough tiles to look lived-in, not so many it looks cluttered. Roughly 60-75% of the grid in use works well.
- PNG is fine. WebP or AVIF is smaller if you can export it.
- Feature tabs show each screenshot fitted inside a 16:9 frame, so nothing is cropped and the tab height stays put as they rotate. Shots close to 16:9 fill it best; take all five from the same window size. Hero slides are 16:9.

## App screenshots

Place these in `src/assets/screenshots/`. Do not put them in `public/` - they go through the Astro build so they get hashed and optimized. The `Screenshot` component (`src/components/Screenshot.tsx`) finds each one by name, so `grid-view.png`, `grid-view.webp`, and `grid-view.avif` all work; if no file matches it falls back to a styled placeholder.

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

- Used by: the Hero slideshow (the first images visitors see). The list, order, and alt text live in `heroSlides` in `src/config/home.ts`.
- Aspect: 16:9. Each slide is a full-screen screenshot cropped to 1900x1069 centred on the Alcove window and saved as WebP, so the window sits in the same place on every slide and the crossfade only changes the theme and wallpaper around it. Keep the window at the same size and position for every slide.
- Each slide shows a different theme over a different wallpaper, with desktop icons hidden.
- Goal: Make a visitor understand what Alcove is in under two seconds. This is the single most important image on the site.
- What to show: The Alcove workspace open over a real Windows desktop, so the grid is clearly the focal point and the desktop behind it is visibly decluttered. The preferred composition is "Alcove floating cleanly over a tidy desktop" - the workspace is the subject, the desktop is context.
- Alternative composition: A before/after split (cluttered desktop on one side, same desktop with Alcove open on the other). Only use this if the split reads clearly at small sizes; otherwise prefer the single floating-workspace shot.
- What to avoid: A bare workspace with one or two tiles. A shot that leads with the Shelf or settings. A shot so zoomed out the tiles become unreadable.
- Feeling: Calm, organised, "this is where my stuff lives". Not flashy.

### `grid-view.png`

- Used by: FeatureShowcase tab 1 ("Your space - A grid you arrange the way you think")
- Aspect: 16:10
- Goal: Show the core product - the drag-and-drop grid with real things on it.
- What to show: The main workspace with a varied, realistic set of tiles: a few app shortcuts, a couple of folders, maybe a shell object or a .url tile. Tiles should be arranged in a way that looks intentional but personal - grouped loosely by purpose rather than in a perfect grid. Include a mix of tile types so it reads as "shortcuts, apps, folders, and shell objects", not just app icons.
- What to avoid: An empty grid. A grid so full it looks like a Start menu. Only one kind of tile.
- Feeling: "I arranged this the way I think about my stuff."

### `folders.png`

- Used by: FeatureShowcase tab 2 ("Folders & junctions - Organise without copying anything")
- Aspect: 16:10
- Goal: Show that folders in Alcove are real Windows junctions and that you can group things in-app.
- What to show: At least one in-app folder open or expanded, with items inside it visible. Show a coloured folder or two so the "colour them to find things at a glance" claim is visible. If the UI distinguishes a junction from a copied folder (an icon, a badge, a path tooltip), include that cue - it is the proof for "not a copy".
- What to avoid: A closed folder with nothing happening. A shot that looks identical to grid-view.png. Hiding the junction distinction, since that is the whole point of this tab.
- Feeling: "I can group things without duplicating files."

### `themes.png`

- Used by: FeatureShowcase tab 3 ("Themes - Make it look like yours")
- Aspect: 16:10
- Goal: Show personalisation without making it look like theming is the main feature.
- What to show: The theme picker open, with a visible selection of light, dark, and retro themes. Ideally the workspace behind the picker is using one of the non-default themes so the change is obvious. If tile size or window opacity controls are visible, include them - they back up the "adjustable tile size and window opacity" line.
- What to avoid: A shot of just the theme picker dialog with no workspace behind it. Showing only dark themes (it implies the product is dark-only). Making this shot so busy it competes with the hero.
- Feeling: "It can look like mine, but that's not the main thing."

### `peek.png`

- Used by: FeatureShowcase tab 4 ("Peek - Preview without opening")
- Aspect: 16:10
- Goal: Show Peek doing its one job: previewing a file inline without launching the source app.
- What to show: A Peek preview open over a tile, with the previewed content clearly visible. An image, a document, or a text file all work - pick one where the preview is legible at screenshot size. The tile being peeked should be identifiable so the relationship between "the thing on the grid" and "the preview" is clear.
- What to avoid: A Peek preview of something unreadable at small sizes (a giant spreadsheet, a video frame). A shot where the preview blends into the workspace background.
- Feeling: "Quick look, no commitment."

### `shelf.png`

- Used by: FeatureShowcase tab 5 ("Shelf - When typing is faster than browsing")
- Aspect: 16:10
- Goal: Show the Shelf as a supporting capability, presented last.
- What to show: The Shelf open with a local search query typed in and a few results visible - enough to show it searches the workspace. If the Google and Wikipedia scopes are visible in the same frame, include them, but do not force all three scopes into the shot if it makes it cluttered. Local search results are the priority.
- What to avoid: Making this the most polished or largest shot - it is the last tab and should feel supporting, not heroic. An empty Shelf with no query. A shot that makes Alcove look like a launcher first.
- Feeling: "It's there when typing is faster than browsing."

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
