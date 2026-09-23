# Alcove docs

The documentation and marketing site for **Alcove**, a visual workspace for Windows.

**[alcove-app.com](https://alcove-app.com/)**

| Page | |
|---|---|
| [Home](https://alcove-app.com/) | Marketing landing page |
| [Privacy Policy](https://alcove-app.com/privacy/) | What is stored on your device, what leaves it, and how to remove it |
| [Terms of Use](https://alcove-app.com/terms/) | What you can and can't do with Alcove, and the limits of the licence |
| [Support](https://alcove-app.com/support/) | Where your data lives, common questions, and how to get help |

## Tech stack

- [Astro](https://astro.build) - static site generator, ships zero JS by default
- [React](https://react.dev) - interactive islands only (hero, feature showcase, FAQ, theme toggle)
- [Tailwind CSS](https://tailwindcss.com) v4 - utility-first styling, mapped to CSS variables for theme awareness
- [motion](https://motion.dev) (Framer Motion) - React component animations
- [Lenis](https://lenis.darkroom.engineering) - smooth scroll
- [GSAP](https://gsap.com) - scroll-triggered timelines
- Deployed to GitHub Pages via GitHub Actions

No Jekyll, no Ruby, no Liquid templates. No third-party fonts, scripts, or trackers (except the animation libs listed above).

## Local development

Requires Node.js 24+ and npm 11+.

```sh
npm install
npm run dev
```

Then open the URL Astro prints (typically <http://localhost:4321/>).

## Build and preview

```sh
npm run build      # production build to dist/
npm run preview    # preview the production build locally
```

## Deployment

Pushing to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the site and deploys `dist/` to GitHub Pages.

The GitHub repo must be configured to use GitHub Actions as the Pages source (Settings > Pages > Source > GitHub Actions). This is a one-time manual step.

The site is served at the custom domain `alcove-app.com` (apex, no base path), configured in `astro.config.mjs`. All internal links use `import.meta.env.BASE_URL`.

## Project structure

```
src/
  assets/
    brand/         # SVG lockups, glyphs, wordmarks (tracked)
    screenshots/   # Feature tab shots, hero slides, capture scripts (see its README.md)
  components/      # React islands + Astro components (atomic design)
  config/          # site.ts, nav.ts, home.ts (typed data), screenshots.ts (image lookup)
  content/
    docs/          # privacy, terms, support, install, changelog (content collection)
  content.config.ts  # content collection schema
  layouts/
    BaseLayout.astro  # header, nav, footer, theme init, TOC, SEO
  pages/
    index.astro       # marketing home page (composition root)
    [slug].astro      # dynamic route for content collection pages
  styles/
    global.css        # design system, theme variables, Tailwind import
public/             # favicon.png, icon.png, og.png (served as-is)
brand/              # local-only brand archive (gitignored, not deployed)
.github/workflows/
  deploy.yml        # GitHub Actions deploy workflow
```

## Questions or corrections

Found something inaccurate, unclear, or out of date? Please [open an issue](https://github.com/IAmInControlll/alcove-web/issues). Anyone can, and no special access is needed.

For anything you would rather not discuss in public, email <iamincontrol.dev@gmail.com>.
