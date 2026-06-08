# Portfolio site

Static HTML portfolio for Tony Dongfang Zhao. Designed at **1440px** (desktop minimum **800px**). Below 800px the layout locks to horizontal scroll; at **402px** and below (or on phones) the site switches to mobile layout. **1024px** adjusts tablet stacking for Bio/CV and text pages.

## Structure

```
portfolio/
├── MANA_2026.html              ← homepage (change in site-config.js)
├── Specimens_2026.html
├── NARS-Foundation_2025.html
├── Lake-House_2024.html
├── Norfolk_2023.html
├── about_2023.html
├── exhibition-text-lake-house.html
├── css/main.css
├── js/site-config.js           ← projects, images, home page
├── js/nav.js
├── js/project.js
├── fonts/
└── assets/
```

Images live in `Paintings/<project-folder>/` at the repo root. Paths in `site-config.js` use `../Paintings/…` so they work for local preview and GitHub Pages without a symlink.

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
2. Add an entry to `projects` in `js/site-config.js` (copy an existing block).
3. Duplicate any `*_YYYY.html` project file, set `data-project-id` and the `<title>`.
4. Add the new filename to the `page` field in config.

## Change the homepage

In `js/site-config.js`, set `homePage` to the new HTML filename (e.g. `"untitled_2025.html"`). Update `index.html` at the repo root if you use that redirect.

## Local preview

```bash
cd portfolio
python3 -m http.server 8080
```

Open http://localhost:8080/MANA_2026.html

## Publish on GitHub Pages

1. Push this repo to GitHub (`portfolio/`, `Paintings/`, root `index.html`, fonts, and assets must all be included).
2. In the repo: **Settings → Pages → Build and deployment → Source**: Deploy from a branch.
3. Branch **main** (or **master**), folder **/ (root)** — not `/portfolio` alone, so `index.html` and `Paintings/` are served.
4. After deploy, the site URL is `https://<user>.github.io/<repo>/` (redirects to the homepage project).
5. **Custom domain**: Pages settings → add your domain; at your registrar set the DNS records GitHub shows (usually `A` + `CNAME` for `www`).

Optional local symlink `portfolio/Paintings → ../Paintings` is not required for deploy.

### Norfolk (2023)

`Paintings/Norfolk-2023/` is empty — add images there, then list them under the `norfolk-2023` entry in `site-config.js`.
