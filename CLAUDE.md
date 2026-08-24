# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Repo Is

Brand asset repository for OIML Smart (`github.com/oimlsmart/branding`). Kinds of content:

1. **Logo assets** — `logo/` holds designer source SVGs, 300dpi PNG exports (1875×1875 etc.), the master source PDF (`logo/oiml-logo.pdf`), and `logo/profile-pic.png`. `BRANDING.txt` is the plain-text branding application guide; `site/index.html` is the brand guide published to GitHub Pages by `.github/workflows/deploy-pages.yml`.
2. **Spinning globe components** — three dependency-free, ES5, self-contained IIFE scripts (`spinning-globe.js`, `spinning-globe-3d.js`, `spinning-globe-mini.js`) that animate the OIML↔SMART globe in pure SVG. `index.html` is the demo page.

## Commands

There is no build system, test suite, or linter. To see the components in action, open `index.html` directly in a browser (no dev server needed).

- `npm install` — installs Puppeteer (the only dependency), used for capturing README screenshots.

## Source-of-Truth Rule (Critical)

The `logo/oiml-logo_*.svg` files and `logo/oiml-logo.pdf` are **designer source artwork**. The path data embedded in `spinning-globe.js` / `spinning-globe-3d.js` (`OIML_PATHS`, `SMART_PATHS`, globe geometry) was extracted from these files. Never delete or "clean up" these files — including `-old` and numbered variants (`-25`, `-35`, etc.), which are historical iterations kept on purpose. If logo artwork changes, the path data in the components must be re-extracted from the updated SVGs.

## Asset Naming Convention

`logo/oiml-logo_<variant>-<theme>.{svg,png}`

- `<theme>`: `dark` or `light` (every variant ships in both)
- `<variant>`: `full`, `icon`, `globe`, `cs`, `cs-smart`, `smart-new`, `smartplus`, `platform`, `platformplus`, `smart-rec`, `smart-studio`, `smi`, `sst`, `cnml-box`, `vocab`, …
- `-old` suffix = previous-generation mark kept for history
- Numeric suffixes (`-25`, `-26`, `-35`, `-36`) = numbered design iterations

Commits are "brand asset drops" — descriptive lowercase prose describing what was added.

## Globe Component Architecture

All three components are ES5 IIFEs exposing `window.SpinningGlobe`, `window.SpinningGlobe3D`, and `window.SpinningGlobeMini`. No bundler, no transpilation, no dependencies; they must keep working when included via a plain `<script>` tag.

- **Wireframe** (`SpinningGlobe`): 7 meridian `<ellipse>` elements scaled along X by `cos(θ + 2π·i/7)`.
- **3D Filled** (`SpinningGlobe3D`): adds a volume-fill arc segment, 70 spherical-coordinate cloud particles, and 35 pulsing star lights. `setProgress(pct)` drives the fill level externally.
- **Mini** (`SpinningGlobeMini`): compact variant for small screens (24–64 px) — 5 meridians, size-proportional strokes, liquid fill, 6 star lights, no wordmark, no clouds/filter; same modes and runtime API, spinner mode shares the breathing-spin math (13 meridian periods per half).

Key invariants:

- Rotation angle is computed **analytically from elapsed time**, never accumulated frame-by-frame — this eliminates drift and guarantees the globe lands on a snap angle where a meridian is edge-on. Preserve this when touching animation code.
- The `requestAnimationFrame` loop stops when forward/reverse animations complete (unless `idleAnimation: 'continue'`); it restarts on `setMode()`/`start()`.
- Modes: `forward`, `reverse`, `spinner`, `progress`. Themes define exact brand colors (dark stroke `#61b4ff` / light stroke `#004996`) — see the Themes table in README.md.

`README.md` is the full API reference for both components; keep it in sync when changing options or methods.
