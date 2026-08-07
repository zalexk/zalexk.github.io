# Repository Guidelines

## Project Overview

Personal static blog **ZalexK** (`zalexk.github.io`), built with [Hexo](https://hexo.io) 7.3.0 and the [Stellar](https://github.com/xaoxuu/hexo-theme-stellar) theme. Content is written in **Traditional Chinese** (site language `zh-TW`, timezone `Asia/Hong_Kong`); posts are personal life writing (週報 weekly series, trip notes) plus coding/machine-learning notes. Deployment is GitHub Actions → GitHub Pages on push to `main`.

## Architecture & Data Flow

```
source/ (markdown content + _data YAML)
  + _config.yml, _config.stellar.yml (site + theme config)
  + themes/stellar/ (git submodule — theme source)
        │  hexo generate (npm run build; hexo-* plugins incl. hexo-pro auto-load)
        ▼
  public/ (static site, gitignored) ──► GH Actions Pages workflow ──► github.io
```

- **Build pipeline**: `hexo generate` renders `source/` → `public/`, caching to `db.json` (warehouse, gitignored). `scripts/asset-path.js` runs a `before_post_render` filter that strips a `<slug>/` prefix from markdown image paths so local editors preview assets correctly.
- **hexo-pro admin layer** (commercial plugin, installed v1.2.10 / manifest `^1.0.14`): mounts an admin SPA at `/pro` and a JWT-protected REST API at `hexopro/api/*`. Runtime state (NeDB `data/*.db`, `blogInfoList.json` Fuse.js index) is gitignored and disposable.
- **Theme stack** (Stellar, three layers): Node-side `scripts/` (47 tag plugins: note/tabs/timeline/gallery/ghcard…; helpers, generators for topic/wiki/search/404/author; filters, events) → EJS layouts (`layout/`, injected globals `ctx`/`def`/`utils`) → client JS (`source/js/main.js` + `services/`/`search/`/`plugins/`) and Stylus (`source/css/main.styl` → `/css/main.css`).
- **Config precedence**: Hexo reads `source/_data/` only (root `_data/` does not exist). Theme config = theme defaults ← `_config.stellar.yml` ← widget merge from `source/_data/widgets.yml`.

## Key Directories

|Path|Purpose|
|---|---|
|`source/_posts/`|Blog posts + same-named asset folders (`post_asset_folder: true`). 6 posts: `weekly-01..03.md` (週報), `grad-trip.md` (draft), `DSE-release.md`, `decision-tree-and-random-forest.md`.|
|`source/_data/`|Effective site data: `widgets.yml` (single `recent` widget, `rss: /atom.xml`, `limit: 5`) and `notebooks/*.yaml` (`machine-learning.yaml`, `python.yaml` — notebook declarations with `base_dir` URL roots and `menu_id: notebooks`).|
|`source/images/`|Favicons + notebook icons (`machine-learning.png`, `python.webp`).|
|`themes/stellar/`|Theme git submodule (upstream, HEAD `aa4afd3e` v1.29.1, cloned 2025-05-12). Treat as vendored except the two dirty files below.|
|`scaffolds/`|New-content templates: `post.md` (title/date/tags), `draft.md` (title/tags, no date), `page.md`.|
|`scripts/`|`asset-path.js` — the only standalone script (see Architecture).|
|`data/`, `db.json`, `blogInfoList.json`, `public/`|Runtime/build artifacts, all gitignored.|
|`hexo-theme-stellar-docs/`, `theme-user-guide.md`|Untracked reference docs (Stellar theme wiki clone + personal guide).|

## Development Commands

|Command|Action|
|---|---|
|`npm install`|Install deps (lockfile v3; npm ≥ 7).|
|`npm run server`|`hexo server` — local preview at `http://localhost:4000`; hexo-pro admin at `/pro`.|
|`npm run build`|`hexo generate` — renders site to `public/` (the QA gate).|
|`npm run clean`|`hexo clean` — wipes `db.json` + `public/`.|
|`npm run deploy`|**Do not use.** `_config.yml` has `deploy.type: ''` — no deploy target. Real deploy is CI only.|

Deployment: push to `main` → GitHub Actions: `actions/checkout@v4` (`submodules: recursive`) → `setup-node` (`node-version: "20"`; step name misleadingly says v22.15.0) → `npm install` → `npm run build` → `upload-pages-artifact@v3` (`./public`) → `deploy-pages@v4`. Dependabot runs daily for npm.

## Code Conventions & Common Patterns

**Posts**
- Front-matter: `title`, `date` (`YYYY-MM-DD HH:mm:ss`), `tags` (scalar `週報` or YAML list `[生活, HKDSE]` — both occur). Drafts: `published: false` (see `grad-trip.md`). The ML post also uses Stellar keys `mermaid: true`, `type: tech` (requires the `hexo-filter-mermaid-diagrams` dep).
- Excerpts: `> **摘要**` blockquote followed by `<!-- more -->` cut. No `excerpt:` key.
- Post images: referenced with slug-prefixed paths (`![sphygmograph](weekly-01/sphygmograph.jpg)`); `scripts/asset-path.js` strips the prefix at build so local editors preview correctly. Asset folders may be empty (e.g. `weekly-02/`).

**Converting Obsidian notes → repo markdown** (see `source/_posts/decision-tree-and-random-forest.md` for a worked example):
1. **Normalize to standard markdown first**: Obsidian callouts → GitHub alert syntax — uppercase type (`[!NOTE]`/`[!TIP]`/`[!IMPORTANT]`/`[!WARNING]`/`[!CAUTION]`), space after `>`, title moved to a bold line inside the body, list lines get a space after `>`. Fix malformed `![warning]` (image syntax) → `[!WARNING]`. Code fences: ` ``` python ` → ` ```python `. Footnotes (`[^1]`) and mermaid are already standard GFM — leave them.
2. **Then convert GitHub alerts → Stellar tag plugins** (the theme does NOT render GitHub alert syntax). Short single-line content → inline `{% note %}`; multi-line/list content → `{% box %}` container (`note` is implemented on `box`, same style — see `hexo-theme-stellar-docs/tag-plugins/express.md` + `container.md`):
   - `{% note [title] content [color:color] %}` — title cannot contain spaces (use `&nbsp;`)
   - `{% box [title] [color:color] %}...{% endbox %}`

   | GitHub alert | Stellar equivalent |
   |---|---|
   | `[!NOTE]` (blue) | `{% note color:blue %}` / `{% box color:blue %}` |
   | `[!TIP]` (green) | `{% note color:green %}` |
   | `[!IMPORTANT]` (purple) | `{% note color:purple %}` |
   | `[!WARNING]` (yellow) | `{% note color:yellow %}` (alias `color:warning`) |
   | `[!CAUTION]` (red) | `{% note color:red %}` (alias `color:error`) |

**Theme customization (Stellar)** — correct surfaces, in order:
1. `_config.stellar.yml` (site root) — overrides: `logo`, `preconnect`/`inject.head` (LXGW WenKai TC fonts), `site_tree` (sidebar: `recent`, `nav_tabs` `笔记: /notebooks/`), `style` (justified text, font families), `search` (local_search over `/search.json`, generated by `themes/stellar/scripts/generators/search.js`).
2. `source/_data/widgets.yml` — deep-merged over the theme widget library; `null` value deletes a widget, object deep-merges.
3. Theme JS services (`themes/stellar/source/js/services/*.js`): run inside `utils.jq(() => { $(function(){…}) })`, read per-element config from DOM attributes, use injected globals `ctx`/`def`/`utils`.

**Never edit under `themes/stellar/`** (upstream; clobbered by `git submodule update`) except the two already-dirty files: `themes/stellar/_config.yml` (appended `feed:` block — atom.xml, limit 0) and `themes/stellar/_data/widgets.yml` (`recent.rss: /atom.xml`, `ghuser.username: Zalexk`). Ideally re-home these to site config and revert the submodule.

## Important Files

|File|Role|
|---|---|
|`_config.yml`|Site config: `url: http://zalexk.github.io` (http, not https), `permalink: :year/:month/:day/:title/`, `post_asset_folder: true`, `new_post_name: :title.md`, highlight.js, atom feed, Microsoft Clarity (`rergjzgfa0`).|
|`_config.stellar.yml`|Theme overrides (fonts, sidebar `site_tree`, style, local_search).|
|`package.json`|Scripts (build/clean/deploy/server) + 12 deps: hexo `^7.3.0`, hexo-pro `^1.0.14`, generators archive/category/feed/index/tag, renderers ejs/marked/stylus, hexo-server, hexo-filter-mermaid-diagrams `^1.0.5`, hexo-theme-stellar `^1.33.1` (npm dep redundant — submodule wins). No `devDependencies`.|
|`.gitmodules`|Submodule: `themes/stellar` ← `xaoxuu/hexo-theme-stellar`, no branch pin.|
|`.github/workflows/pages.yml`|The only deploy path.|
|`source/_data/widgets.yml`|Effective widget config (single `recent` widget).|
|`source/_data/notebooks/*.yaml`|Notebook declarations (machine-learning, python).|
|`scripts/asset-path.js`|Hexo `before_post_render` filter for local-editor image preview.|
|`scaffolds/post.md`|New-post template: `title` / `date` / `tags`.|

## Runtime/Tooling Preferences

- **Runtime**: Node.js — CI pins Node 20 (workflow `setup-node`); local dev is Node 24.16.0 / npm 11.13.0. No `engines`/`packageManager` fields; npm is the package manager (lockfile v3).
- **Theme checkout**: always with submodules (`git clone --recurse-submodules` or `git submodule update --init --recursive`) — CI does this automatically.
- **hexo-pro**: auto-loads as a plugin; no config section needed. Beware its admin deploy panel writing `deploy_config.json` and mutating `_config.yml`.

## Testing & QA

- **No test suite and no linters** — the build is the gate.
- Verification workflow: `npm run build` (must exit 0; CI enforces the same), then `npm run server` and eyeball `localhost:4000` (post rendering, images from asset folders, search via `/search.json`).
- `hexo clean` before builds if incremental generation behaves oddly (stale `db.json` cache).

## Gotchas

- `npm run deploy` is a dead end (`deploy.type: ''`); CI is the only deploy path.
- Theme version drift: `package.json` says `hexo-theme-stellar ^1.33.1`, submodule HEAD is v1.29.1 — the submodule is the source of truth.
- `themes/stellar` shows as dirty in `git status` — that is expected (the two local overrides), not an accident.
- `source/_posts/weekly-01.md` contains a broken link with smart quotes inside the URL (`[醫學博物館]("https://…")`).
- The workspace is mid-restructure (see Notebooks): untracked `_data/notebooks/*.yaml` reference `base_dir`s with no matching source dirs yet, and a staged rename is missing its target file. Don't resolve these as errors.
