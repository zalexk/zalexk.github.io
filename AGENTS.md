# Repository Guidelines

## Project Overview

Personal static blog **ZalexK** (`zalexk.github.io`), built with [Hexo](https://hexo.io) 7.3.0 and the [Stellar](https://github.com/xaoxuu/hexo-theme-stellar) theme. Content is written in **Traditional Chinese** (site language `zh-TW`); posts are mostly personal life writing (週報 weekly series, trip notes, coding notes). Deployment is via GitHub Actions → GitHub Pages on push to `main`.

## Architecture & Data Flow

```
source/ (markdown content + _data YAML)
  + _config.yml, _config.stellar.yml (site + theme config)
  + themes/stellar/ (git submodule — theme source)
        │  hexo generate (npm run build)
        ▼
  public/ (static site, gitignored) ──► GH Actions Pages workflow ──► github.io
```

- **Build pipeline**: Hexo loads all `hexo-*` npm dependencies (including the `hexo-pro` admin plugin, which auto-loads — no config section needed). `hexo generate` writes `db.json` (warehouse cache) and renders `source/` → `public/`.
- **hexo-pro admin layer** (commercial plugin, v1.2.10): when `hexo server` runs, mounts an admin SPA at `/pro` and a REST API at `hexopro/api/*`. It maintains `blogInfoList.json` (Fuse.js full-text search index) and NeDB datastores in `data/`. All of this is runtime state, not source of truth.
- **Theme stack**: `themes/stellar` is config-driven, three layers: server-side Node (`scripts/tags/*` tag plugins, `scripts/events/lib/config.js` widget merging) → EJS layouts (`layout/`, injects `ctx`/`def`/`utils` globals from theme config) → client JS (`source/js/main.js` core + `services/`/`search/`/`plugins/`) and Stylus CSS (`source/css/main.styl`).

## Key Directories

| Path | Purpose |
|---|---|
| `source/_posts/` | Blog posts (markdown). Post assets live in same-named subfolders (`post_asset_folder: true`). |
| `source/coding/` | Coding notebook notes (hexo-pro `notebook:` feature, e.g. `python/defaultdict.md`). |
| `source/_data/` | **Effective** site data: `widgets.yml` (sidebar widgets), `notebooks/python.yaml` (notebook definition). This is the only `_data/` Hexo reads. |
| `_data/` (root) | Inert duplicate of `widgets.yml` — Hexo does NOT read it. Do not edit as a source of truth. |
| `scaffolds/` | New-post templates (`post.md`, `draft.md`, `page.md`). |
| `themes/stellar/` | Theme **git submodule** (upstream `xaoxuu/hexo-theme-stellar`, unpinned, tracks `main` @ v1.29.1-era commit). Treat as vendored except the two dirty files below. |
| `data/` | hexo-pro NeDB runtime state (`users.db`, `settings.db`, `deploy_status.db`, `recycle.db`). Disposable; regenerated on server start. |
| `.github/workflows/` | `pages.yml` — build + Pages deploy CI. |

## Development Commands

| Command | Action |
|---|---|
| `npm install` | Install deps (lockfile v3; npm ≥ 7). |
| `npm run server` | `hexo server` — local preview at `http://localhost:4000`. Also starts hexo-pro admin at `/pro`. |
| `npm run build` | `hexo generate` — renders site to `public/`. |
| `npm run clean` | `hexo clean` — wipes `db.json` + `public/`. |
| `npm run deploy` | **Do not use.** `_config.yml` has `deploy.type: ''` — no deploy target configured. Real deploy is CI only. |

Deployment: push to `main` → GitHub Actions (`submodules: recursive` checkout, Node 20, `npm install`, `npm run build`, upload `public/`, `deploy-pages@v4`). Dependabot runs daily for npm.

## Code Conventions & Common Patterns

**Posts**
- Front-matter: `title`, `date` (`YYYY-MM-DD HH:mm:ss`), `tags` (scalar `週報` or YAML list `[生活, HKDSE]` — both occur in the wild).
- Excerpts: `> **摘要**` blockquote followed by `<!-- more -->` cut. No `excerpt:` key, no Stellar-specific front-matter keys (`cover`/`sticky`/`toc`/etc.) are used.
- Post images: referenced by bare filename (`![sphygmograph](sphygmograph.jpg)`) from the post's asset folder; asset folders may be empty.
- Drafts: `published: false` in front-matter (see `grad-trip.md`).
- Notebook notes (hexo-pro): `notebook: coding` front-matter key, live under the notebook's `base_dir` (`source/coding/`); notebooks are declared in `source/_data/notebooks/*.yaml`.

**Theme customization (Stellar)** — the correct surfaces, in order:
1. `_config.stellar.yml` (site root) — overrides theme config: `logo`, `inject.head` (LXGW WenKai TC fonts), `site_tree` (sidebar layout), `style`, `search` (local_search over `/search.json`).
2. `source/_data/widgets.yml` — deep-merged over the theme's widget library; `null` value deletes a widget, object deep-merges.
3. Theme JS services (`themes/stellar/source/js/services/*.js`) follow a fixed pattern: run inside `utils.jq(() => { $(function(){…}) })`, read per-element config from DOM attributes, use injected globals `ctx`/`def`/`utils`. Only relevant if extending the theme itself.

**Never edit under `themes/stellar/`** (upstream; clobbered by `git submodule update`) except the two already-local files: `themes/stellar/_config.yml` (appended `feed:` block) and `themes/stellar/_data/widgets.yml` (`recent.rss: /atom.xml`, `ghuser.username: Zalexk`). Ideally these get re-homed to site config and the submodule reverted.

**Language**: site content and post bodies in Traditional Chinese; keep new posts consistent (note `grad-trip.md` mixes Simplified — don't follow that).

## Important Files

| File | Role |
|---|---|
| `_config.yml` | Site config: `url: http://zalexk.github.io` (http, not https), `permalink: :year/:month/:day/:title/`, `post_asset_folder: true`, `new_post_name: :title.md`, syntax highlighter highlight.js, feed (atom.xml), Microsoft Clarity analytics. |
| `_config.stellar.yml` | Theme overrides (fonts, sidebar site_tree, style, local search). |
| `package.json` | Scripts + deps. `hexo-theme-stellar ^1.33.1` npm dep is redundant at build time — Hexo resolves `themes/stellar` (submodule) first. |
| `.gitmodules` | Submodule: `themes/stellar` ← `https://github.com/xaoxuu/hexo-theme-stellar.git`, no branch pin. |
| `source/_data/widgets.yml` | Effective widget config. |
| `.github/workflows/pages.yml` | The only deploy path. |
| `scaffolds/post.md` | New-post template: `title` / `date` / `tags`. |

## Runtime/Tooling Preferences

- **Runtime**: Node.js — CI pins Node 20 (workflow `setup-node`), local dev works on Node 24 / npm 11. No `engines`/`packageManager` fields; npm is the package manager (lockfile v3).
- **Theme checkout**: always with submodules (`git clone --recurse-submodules` or `git submodule update --init --recursive`) — CI does this automatically.
- **Config precedence**: Hexo reads `source/_data/` only (root `_data/` is inert); theme config = theme defaults ← `_config.stellar.yml` ← widget merge from `source/_data/widgets.yml`.

## Testing & QA

- **No test suite and no linters** — the project relies on the build as its gate.
- Verification workflow: `npm run build` (must exit 0; CI enforces the same), then `npm run server` and eyeball the page at `localhost:4000` (post rendering, images from asset folders, search via `/search.json`).
- `hexo clean` before builds if incremental generation behaves oddly (stale `db.json` cache).

## Gotchas

- `blogInfoList.json` and `data/*.db` are **git-tracked but disposable** — regenerated on every generate/server start; deleting resets the hexo-pro admin (users/settings). They should ideally be gitignored. `db.json` is already ignored.
- `npm run deploy` is a dead end (`deploy.type: ''`); hexo-pro's admin deploy panel writes its own `deploy_config.json` and edits `_config.yml` — beware of it mutating config.
- `source/_posts/weekly-01.md` contains a broken link with smart quotes inside the URL (`[醫學博物館]("https://…")`).
- Theme version drift: `package.json` says `^1.33.1` but the submodule HEAD is v1.29.1-era — the submodule is the source of truth.
