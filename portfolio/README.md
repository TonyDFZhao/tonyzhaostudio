# Portfolio site

Static HTML portfolio for Tony Dongfang Zhao. Designed at **1440px** (desktop minimum **800px**). Below 800px the layout locks to horizontal scroll; at **402px** and below (or on phones) the site switches to mobile layout. **1024px** adjusts tablet stacking for Bio/CV and text pages.

## Structure

```
/
├── index.html                  ← redirects to /C24/
├── C24/index.html              ← homepage (change homeSlug in site-config.js)
├── Specimens/index.html
├── NARS-Foundation/index.html
├── Lake-House/index.html
├── Norfolk/index.html
├── bio/index.html
├── the-room-built-with-gaze/index.html
├── portfolio/
│   ├── css/main.css
│   ├── js/site-config.js       ← projects, images, slugs
│   ├── js/nav.js
│   ├── js/project.js
│   ├── fonts/
│   └── assets/
└── Paintings/
```

Images live in `Paintings/<project-folder>/` at the repo root. Paths in `site-config.js` use `/Paintings/…` (absolute from site root).

## URLs

| Page | URL |
|------|-----|
| C24 (home) | `/C24/` |
| Specimens | `/Specimens/` |
| NARS Foundation | `/NARS-Foundation/` |
| Lake House | `/Lake-House/` |
| Norfolk | `/Norfolk/` |
| Bio/CV | `/bio/` |
| Exhibition text | `/the-room-built-with-gaze/` |

Old `portfolio/*.html` paths redirect to these URLs.

## Image fields (`site-config.js`)

Each image object supports:

| Field | Purpose |
|-------|---------|
| `file` | Filename (or subpath) under the project’s `imageDir` — must match disk after renames |
| `title` | Gallery caption title (Director) |
| `size` | e.g. `30×40 inch` |
| `medium` | e.g. `oil on canvas` |
| `year` | e.g. `2025` |
| `showInGrid` | `false` = gallery only; omit or `true` = also show in grid |
| `galleryFit` | `"fit"` = full image in gallery; omit or `"fill"` = crop to frame (default) |

Gallery order = array order. Grid shows only entries where `showInGrid` is not `false`. `galleryFit` applies to gallery view only.

Set `showGridView: false` on a project (e.g. Norfolk) to hide the grid toggle and keep gallery-only view.

## Add a new project

1. Add images under `Paintings/Your-Project-YYYY/`.
2. Add an entry to `projects` in `js/site-config.js` with a unique `slug` (used in the URL).
3. Create `/<slug>/index.html` at the repo root (copy from `MANA/index.html`, set `data-project-id` and `<title>`).
4. Optionally add a redirect in `portfolio/` if migrating an old filename.

## Change the homepage

In `js/site-config.js`, set `homeSlug` to the project slug (e.g. `"MANA"`). Update root `index.html` to redirect to that slug.

## Local preview

Serve from the **repository root** (not `portfolio/` alone):

```bash
python3 -m http.server 8080
```

Open http://localhost:8080/C24/

## Publish on GitHub Pages

1. Push this repo to GitHub (`portfolio/`, route folders, `Paintings/`, root `index.html`, fonts, and assets must all be included).
2. In the repo: **Settings → Pages → Build and deployment → Source**: Deploy from a branch.
3. Branch **main** (or **master**), folder **/ (root)** — not `/portfolio` alone.
4. After deploy, the site URL is `https://<user>.github.io/<repo>/` (redirects to `/C24/`). With custom domain `tonyzhaostudio.com`, pages are `tonyzhaostudio.com/C24/`, etc.
5. **Custom domain**: Pages settings → add your domain; at your registrar set the DNS records GitHub shows (usually `A` + `CNAME` for `www`).

Optional local symlink `portfolio/Paintings → ../Paintings` is not required for deploy.

### Norfolk (2023)

`Paintings/Norfolk-2023/` is empty — add images there, then list them under the `norfolk-2023` entry in `site-config.js`.
