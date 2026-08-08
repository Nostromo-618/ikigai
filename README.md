# Interactive Ikigai

Public Vue 3 site: an editable, colorful Ikigai flowchart (Vanduo **vd3** + **vd3-cbun/flowchart**), educational Read pages, and an Ikigai-9 quiz. Published on GitHub Pages.

**Live:** https://nostromo-618.github.io/ikigai/

## Features

- Classic four-circle **Venn-first** map (calm first look) with editable sample tiles on a flowchart canvas
- Edit and rearrange tiles — saved in browser `localStorage`
- **Mandatory disclaimer gate** (versioned acceptance) before map/quiz; farewell path if declined
- Reset clears map storage only (not theme)
- Export **PNG**, **SVG**, and a **single-file interactive HTML**
- Read section (origins, Western diagram honesty, Blue Zones, science, comparisons, stories, facts)
- Ikigai-9 purpose readiness quiz

## Stack

- Vue 3 + TypeScript + Vite + vite-ssg
- `@vanduo-oss/vd3` + `@vanduo-oss/vd3-cbun`
- Vitest + Playwright

## Develop

```bash
pnpm install
pnpm build:export-shell   # once (also runs before build)
pnpm dev
```

```bash
pnpm typecheck
pnpm test
pnpm build
pnpm preview
pnpm test:e2e
```

## Privacy & terms

Interactive tools require accepting the on-site disclaimer. Map data and quiz scores stay in this browser (`ikigai-disclaimer-accepted`, `ikigai-flowchart-document`, …). Nothing is uploaded. Export if you need a durable copy. Bump `DISCLAIMER_VERSION` in `src/data/site.ts` to re-prompt users after material term changes.

## Deploy

GitHub Actions builds the vite-ssg site and publishes it with the official Pages actions (`.github/workflows/deploy.yml`) on every push to `main` (and via **Run workflow**).

**One-time repo setting:** Settings → Pages → Source → **GitHub Actions**.

Vite `base` is `/ikigai/` so the project site is served at `https://<user>.github.io/ikigai/`.

## License

MIT
