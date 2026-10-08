# Repository Guidelines

## Project Overview

Personal static blog **ZalexK** (`zalexk.github.io`), built with [Hexo](https://hexo.io) 8.1.2 and the [Stellar](https://github.com/xaoxuu/hexo-theme-stellar) **v2.0.0** theme (installed as the npm package `hexo-theme-stellar`). Content is written in **Traditional Chinese** (site language `zh-TW`, timezone `Asia/Hong_Kong`); posts are personal life writing (週報 weekly series, trip notes) plus coding/machine-learning notes. Deployment is GitHub Actions → GitHub Pages on push to `main`.

> 2026-10-08: migrated from Stellar 1.44.0 (git submodule) to Stellar v2.0.0 (npm) following https://xaoxuu.com/wiki/stellar/migration/v1-to-v2/ . The `themes/stellar` submodule and `.gitmodules` were removed; rollback = `git revert` of that commit.

## Architecture & Data Flow

```
source/ (markdown content + _data YAML)
  + _config.yml, _config.stellar.yml (site + theme config)
  + node_modules/hexo-theme-stellar (npm package — theme source)
        │  hexo generate (npm run build; hexo-* plugins incl. hexo-pro auto-load)
        ▼
  public/ (static site, gitignored) ──► GH Actions Pages workflow ──► github.io
```

- **Build pipeline**: `hexo generate` renders `source/` → `public/`, caching to `db.json` (warehouse, gitignored). `scripts/asset-path.js` runs a `before_post_render` filter that strips a `<slug>/` prefix from markdown image paths so local editors preview assets correctly.
- **hexo-pro admin layer** (commercial plugin, v2.0.0): mounts an admin SPA at `/pro` and a JWT-protected REST API. Runtime state (NeDB `data/*.db`, `blogInfoList.json` Fuse.js index) is gitignored and disposable.
- **Theme stack** (Stellar v2): Node-side `scripts/` (tag plugins, generators, **schema validation** in `scripts/schema/` — every config/front-matter field is validated at build time and unknown/invalid values produce `已忽略 N 项不支持的配置` warnings) → EJS layouts → client **Runtime** (`source/js/runtime/` — extensions like `diagrams`/`math`/`lightbox` load on demand, driven by a JSON registry embedded in each page with `"when": {"selector": …}` conditions).
- **Config precedence**: theme defaults (`node_modules/hexo-theme-stellar/_config.yml` — the authoritative v2 field reference) ← `_config.stellar.yml` (same structure, arrays replace wholesale) ← widget deep-merge from `source/_data/widgets.yml`.

## Key Directories

|Path|Purpose|
|---|---|
|`source/_posts/`|Blog posts + same-named asset folders (`post_asset_folder: true`). Posts: `weekly-01..03.md` (週報), `DSE-release.md`, `Y1-review.md`, `DJI-240-7A-USB-C-Cable.md`, `decision-tree-and-random-forest.md` (ML notes, mermaid + mathjax). Drafts live in `source/_drafts/`.|
|`source/_data/`|`widgets.yml` (widget library overrides: `recent` with `rss: /atom.xml`, `limit: 5`; `ghuser`). `caches/` (Stellar v2 Runtime image-metadata cache — gitignored, disposable).|
|`source/images/`|Favicons.|
|`scaffolds/`|New-content templates: `post.md`, `draft.md`, `page.md`.|
|`scripts/`|`asset-path.js` — the only standalone script (see Architecture).|
|`data/`, `db.json`, `blogInfoList.json`, `public/`|Runtime/build artifacts, all gitignored.|
|`hexo-theme-stellar-docs/`, `theme-user-guide.md`|Untracked reference docs (v1-era wiki clone + personal guide; **v2 docs are authoritative**: https://xaoxuu.com/wiki/stellar/).|

## Development Commands

|Command|Action|
|---|---|
|`npm install`|Install deps (lockfile v3; npm ≥ 7).|
|`npm run server`|`hexo server` — local preview at `http://localhost:4000`; hexo-pro admin at `/pro`.|
|`npm run build`|`hexo generate` — renders site to `public/` (the QA gate).|
|`npx hexo stellar doctor`|Stellar v2 config/schema check — **run after any theme-config change; must print PASS with no warnings**.|
|`npm run clean`|`hexo clean` — wipes `db.json` + `public/`.|
|`npm run deploy`|**Do not use.** `_config.yml` has `deploy.type: ''` — no deploy target. Real deploy is CI only.|

Deployment: push to `main` → GitHub Actions: `actions/checkout@v4` (no submodules) → `setup-node` (`node-version: "22"` — Stellar v2 requires Node ≥ 22) → `npm install` → `npm run build` → `upload-pages-artifact@v3` (`./public`) → `deploy-pages@v4`. Dependabot runs daily for npm.

## Code Conventions & Common Patterns

**Posts**
- Front-matter: `title`, `date` (`YYYY-MM-DD HH:mm:ss`), `tags` (scalar `週報` or YAML list `[生活, HKDSE]` — both occur). Drafts: `published: false` in `source/_drafts/`.
- Stellar v2 front-matter keys: `render: {math: mathjax, diagrams: mermaid}` (per-page math/diagrams; requires global `features.math.provider` / `features.diagrams.provider` in `_config.stellar.yml`), `article: {style: tech}` (v1 legacy `type: tech` also works via alias but new syntax is preferred). v1 keys `mermaid: true` / `mathjax: true` / `menu_id` etc. have legacy aliases in `content-config-schema.js` but should be converted on sight.
- Excerpts: `> **摘要**` blockquote followed by `<!-- more -->` cut. No `excerpt:` key.
- Post images: referenced with slug-prefixed paths (`![sphygmograph](weekly-01/sphygmograph.jpg)`); `scripts/asset-path.js` strips the prefix at build so local editors preview correctly.
- **Mermaid**: plain ` ```mermaid ` fences (no tag plugin). `_config.yml` sets `highlight.exclude_languages: [mermaid]` so the fence renders as `<code class="mermaid">`, which the v2 Runtime diagrams extension picks up via its `.mermaid` selector. Do not re-add `hexo-filter-mermaid-diagrams` (double rendering).

**Converting Obsidian notes → repo markdown** (same two-step as v1; still valid in v2):
1. Normalize Obsidian callouts → GitHub alert syntax, then
2. Convert GitHub alerts → Stellar tag plugins (`note`/`box` both exist in v2): short single-line → `{% note color:blue %}`, multi-line → `{% box color:blue %}…{% endbox %}`. `[!NOTE]`→blue, `[!TIP]`→green, `[!IMPORTANT]`→purple, `[!WARNING]`→yellow, `[!CAUTION]`→red. `{% note %}` title cannot contain spaces (use `&nbsp;`).

**Theme customization (Stellar v2)** — `_config.stellar.yml` mirrors the default config tree in `node_modules/hexo-theme-stellar/_config.yml`. **Policy (2026-10-08): follow the theme's latest defaults for all UI; only override site identity and content necessities.**
1. Current overrides are intentionally minimal: `leftbar.brand.image` (site icon; `name` inherits Hexo title) and `features.math/diagrams` providers (mathjax/mermaid, required by post front matter).
2. Everything else (7-item default menu, card preset, reveal animation, system fonts, search, share buttons) comes from theme defaults — do not re-add v1-look overrides (empty menu, LXGW font, justify) unless the user asks.
3. `source/_data/widgets.yml` deep-merges over the theme widget library (`node_modules/hexo-theme-stellar/_data/widgets.yml`).
- URL structure (v2 default style): home `/` is the post list (hexo-generator-index at `''`, default menu item `網誌`), categories `/blog/categories/`, tags `/blog/tags/`, archives `/blog/archives/` (hexo `category_dir`/`tag_dir`/`archive_dir` are set to `blog/*`), plus source pages `/about/` and `/friends/`. `/topic/` is in the default menu but 404s until topic (专栏) content exists — the theme only generates its index when topics are present. `/settings/` is auto-generated by the theme.

**Never edit `node_modules/`** — the theme ships as an npm package; all overrides go through `_config.stellar.yml` / `_data`.

## Important Files

|File|Role|
|---|---|
|`_config.yml`|Site config: `url: http://zalexk.github.io`, `permalink: :year/:month/:day/:title/`, `post_asset_folder: true`, highlight.js with `exclude_languages: [mermaid]`, atom feed (`hexo-generator-feed ^4`), Microsoft Clarity.|
|`_config.stellar.yml`|Stellar v2 overrides — minimal by policy: brand icon + math/diagrams providers only; everything else follows theme defaults.|
|`package.json`|Scripts + deps: hexo `^8.0.0`, hexo-pro `^2.0.0`, hexo-generator-feed `^4.0.0`, hexo-theme-stellar `^2.0.0`, generators, renderers, hexo-server. No `hexo-filter-mermaid-diagrams`, no `pi-tool-display` (removed 2026-10-08 — it was an unrelated coding-agent TUI package).|
|`.github/workflows/pages.yml`|The only deploy path (Node 22, no submodules).|
|`source/_data/widgets.yml`|Widget overrides (`recent`, `ghuser`).|
|`scripts/asset-path.js`|Hexo `before_post_render` filter for local-editor image preview.|
|`scaffolds/post.md`|New-post template.|

## Runtime/Tooling Preferences

- **Runtime**: Node.js ≥ 22 required (Stellar v2 engines). CI pins Node 22; local dev runs 22.22.2 / 24.16.0.
- **hexo-pro**: auto-loads as a plugin; no config section needed. Beware its admin deploy panel writing `deploy_config.json` and mutating `_config.yml`.

## Testing & QA

- **No test suite and no linters** — the build is the gate.
- Verification workflow: `npx hexo stellar doctor` (must PASS, 0 warnings) → `npm run build` (exit 0) → spot-check `public/` (home default menu, `/blog/categories|tags|archives/`, `/about/`, `/friends/`, `/settings/`, post page mermaid+mathjax, `/search.json`, `atom.xml`, `404.html`) → `npm run server` and eyeball `localhost:4000` + `/pro`.
- `hexo clean` before builds if incremental generation behaves oddly (stale `db.json` cache).

## Gotchas

- `npm run deploy` is a dead end (`deploy.type: ''`); CI is the only deploy path.
- **Interrupted builds leave stale state**: killing a `hexo generate` mid-run (e.g. SIGTERM) leaves `source/_data/caches/images_metadata.json.lock` behind; subsequent builds log `Image metadata is locked … skipped` and the Runtime's image metadata goes stale. Fix: `rm -rf source/_data/caches` (gitignored, disposable), then clean-build. Overlapping builds can also interleave writes to `public/` — when output looks inexplicably wrong, verify with a single clean build before debugging config.
- v2 validates config/front-matter against a schema; unknown keys are **ignored with warnings** (not errors) — watch build output for `已忽略 N 项不支持的配置`.
- `source/_posts/weekly-01.md` contains a broken link with smart quotes inside the URL (`[醫學博物館]("https://…")`).
- `hexo-theme-stellar-docs/` and `theme-user-guide.md` describe **v1**; for v2 behavior read the npm package source (`node_modules/hexo-theme-stellar/`) and https://xaoxuu.com/wiki/stellar/ .
