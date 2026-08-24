# OIML Smart branding

The source of truth for the OIML Smart brand: logo assets in `logo/` (SVG
source of truth + 300dpi PNG exports + the designer's master
`logo/oiml-logo.pdf`), the branding guide below, `BRANDING.txt` (plain-text
application instructions for humans and AI agents), a published brand site on
GitHub Pages — plus the animated brand mark: the spinning OIML ⇄ SMART globe
as three dependency-free ES5 components.

- Brand site: <https://www.oimlsmart.org/branding/>
- Quick application guide: `BRANDING.txt`

## Brand guide

### Which logo to use

All assets live in `logo/` as `oiml-logo_<variant>-<theme>.{svg,png}`, with
every variant in `-dark` (for dark backgrounds) and `-light` (for light
backgrounds).

| Context | Use |
| --- | --- |
| Primary lockup (hero, cover, official) | `logo/oiml-logo_full-{theme}` |
| App icon / favicon / square tile | `logo/oiml-logo_icon-{theme}` |
| Small mark, avatar, badge (< 64 px) | `logo/oiml-logo_globe-{theme}` |
| SMART wordmark + globe | `logo/oiml-logo_smart-new-{theme}` |
| Component-branded surface | that component's variant (below) |
| Loading / progress states | the spinning-globe components (below) |
| Social profile picture | `logo/profile-pic.png` |

#### The two programmes and their constituents

The OIML Smart ecosystem is two programmes with their own audiences and
their own publishing surfaces. Each constituent ships a brand mark pairing
the globe with its wordmark.

**Programme SMART** — the *published* side of OIML Smart. Recommendations,
Vocabulary, Studio, CNML at the IA / Type-approval level, and the two
SMART platforms host the workflow that produces and verifies the artifacts.
This is where the brand mark does the heaviest lifting: a SMART surface
introduces itself with the wordmark + globe lockup, then keeps a steady,
slow `spinner` to signal "live and verified".

| Component | Logo |
| --- | --- |
| SMART Recommendations | `smart-rec` |
| SMART Vocabulary | `vocab` |
| SMART Studio | `smart-studio` |
| OIML CNML (IA / Type-approval level) | `cnml-box` |
| OIML-CS SMART Platform — global deployment | `cs-smart` |
| OIML SMART Platform — member deployment | `platform` (registry slug `smart-platform`) |

**Programme SMART+** — the *live* side of OIML Smart. CNML at the
Type-instance and measurement level, the SMART Measuring Instruments
themselves, the SST twins, and the two SMART+ platforms run the lifecycle
that follows each instrument from certification through service. Programmatic
surfaces — dashboards, instrument portals, the SIM registry, mobile loaders
— usually want the `progress` mode (a static globe driven by `setProgress()`
as work advances) or a silent mini loader while a remote call runs.

| Component | Logo |
| --- | --- |
| OIML CNML (Type-instance + measurement level — same mark) | `cnml-box` |
| SMART Measuring Instruments | `smi` |
| SST for Measuring Instruments (Simulated SMART Twin) | `sst` |
| OIML-CS SMART+ Platform — global deployment | `cs-smartplus` |
| OIML SMART+ Platform — member deployment | `smartplus` (`platformplus` is its companion member-deployment mark) |

SMART Resources (publications and resolutions databases) has no separate
logo — use the programme or OIML marks.

Authoritative registry: `site-shell/src/data/components.ts`. Embed component
logos from the canonical public URL with the color-scheme-swapped picture
pattern:

```html
<picture>
  <source srcset="https://www.oimlsmart.org/img/components/<slug>-dark.svg"
          media="(prefers-color-scheme: dark)">
  <img src="https://www.oimlsmart.org/img/components/<slug>-light.svg"
       alt="The <component> logo." width="112" loading="lazy">
</picture>
```

Web design tokens (color ramps, typography, paper/ink) live only in
`site-shell/src/styles/tokens.css` — do not fork them per site.

`-old` files (`full-old`, `icon-old`, `smart-old`) and numbered iterations are
historical — never use them for new work.

### Colors

| Role | Hex | Notes |
| --- | --- | --- |
| Brand Blue (primary) | `#004996` | light-theme stroke, text, links |
| Sky Blue (secondary) | `#61b4ff` | dark-theme stroke, highlights |
| Deep Navy | `#001e41` | dark wordmarks, dark surfaces |
| Midnight Navy | `#003369` | secondary dark blue |
| Ocean Blue | `#017abe` | mid-tone accent |
| Pale Sky | `#c4e3ff` | light-theme accents |
| Ink | `#1d1d1b` | near-black text |
| White | `#ffffff` | text on dark |
| Background (dark) | `#050810` | behind `-dark` assets |
| Background (light) | `#f5f3ed` | behind `-light` assets |
| Star Yellow | `#ffd54f` | dark-theme accent, sparingly |
| Star Amber | `#ff9800` | light-theme accent, sparingly |

### Typography

Web surfaces use the project's font stack (do not substitute):
**IBM Plex Sans** for body UI, **IBM Plex Mono** for code and engineering
contexts, **Fraunces** for editorial display headings. Load:

```html
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Fraunces:wght@300;500;600&display=swap" rel="stylesheet">
```

CSS usage:

```css
body    { font-family: 'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif; }
code    { font-family: 'IBM Plex Mono', ui-monospace, 'SF Mono', monospace; }
h1, h2  { font-family: 'Fraunces', 'Source Serif 4', ui-serif, Georgia, serif; }
```

### Rules

- Use files as-is: no stretching, recoloring, re-typesetting, or added
  effects. Pick `-dark`/`-light` per the background — the contrast is built
  into the artwork.
- Clear space of at least the globe's radius on all sides; minimum sizes:
  full lockup ≥ 120 px wide, icon ≥ 32 px, below 64 px prefer the globe mark
  or `SpinningGlobeMini`.
- Treat every file in `logo/` as source (including `-old` and iterations):
  never delete or overwrite. SVGs are canonical; PNGs are exports.
- Use the project's font stack — do not introduce a new typeface without
  updating `tokens.css` first.

## Spinning globe — the animated brand mark

Three self-contained components share the same globe geometry, the same
OIML ⇄ SMART path data, and the same set of behaviors. They differ only
in richness and render cost:

- **Wireframe** (`spinning-globe.js`, `window.SpinningGlobe`) — globe
  outline of 7 rotating meridians with the OIML ⇄ SMART wordmark.
  Heaviest component: ~12 KB.
- **3D Filled** (`spinning-globe-3d.js`, `window.SpinningGlobe3D`) — adds
  a volumetric liquid fill, 70 cloud particles, and 35 twinkling star
  lights. ~25 KB.
- **Mini** (`spinning-globe-mini.js`, `window.SpinningGlobeMini`) —
  compact 24–64 px variant (5 meridians, ~14 animated elements, no
  wordmark). ~5 KB.

Pure SVG transforms driven by `requestAnimationFrame` — no WebGL, no canvas,
no dependencies, ES5 throughout. The viewBox of the full components is
`0 0 400 350`; the mini uses a tight square crop around the globe.

Open `index.html` in a browser to see the demo: every variant in dark and
light themes, two no-text variants, a mini size ramp (28 / 44 / 64 px),
mode switching, and a cycle / fill slider.

### Quick start

```html
<!-- Wireframe (OIML ⇄ SMART wordmark, no fill) -->
<div id="globe" style="width: 400px;"></div>
<script src="spinning-globe.js"></script>
<script>
    var globe = new SpinningGlobe('#globe', { theme: 'dark', mode: 'spinner' });
</script>

<!-- 3D Filled (volumetric fill, clouds, stars) -->
<script src="spinning-globe-3d.js"></script>
<script>
    var loader = new SpinningGlobe3D('#loader', { theme: 'dark', mode: 'progress' });
</script>

<!-- Mini (24–64 px loader, defaults to spinner mode) -->
<script src="spinning-globe-mini.js"></script>
<script>
    var icon = new SpinningGlobeMini('#icon', { theme: 'dark' });
</script>
```

### Behaviors (modes)

The four modes cover the full range of "what this surface is for" — from a
one-shot brand reveal to a live loading indicator.

- **`forward`** — one-shot brand reveal: OIML fades in, the globe spins up,
  the wordmark crossfades to SMART at peak speed, the globe decelerates,
  settles at rest on a snap angle. The right mode for hero sections,
  marketing pages, and anywhere you want the lockup to introduce itself.
- **`reverse`** — same as `forward`, SMART → OIML.
- **`spinner`** — looping brand mark driven by a single `cycleTime`
  parameter that synchronizes the breathing spin, the wordmark crossfade,
  and the 3D fill. Default for the **mini** component (drop-in loader).
- **`progress`** — static globe; fill driven externally by
  `globe.setProgress(0..1)` as work advances. Clouds and stars keep
  animating. Default behavior for the SMART+ use cases (dashboards,
  instrument portals, the SIM registry).

Two more runtime knobs on the 3D component:

- `globe.setProgress(0..1)` — set the fill level in any mode (instantly
  overrides the spinner's auto cycle).
- `idleAnimation: 'continue' | 'stop'` — whether stars and clouds keep
  animating after a one-shot animation completes. `'stop'` saves CPU when
  the loader is finished.

### Programme usage patterns

Each programme uses the components a little differently — pick the variant
+ mode that matches the surface.

**Programme SMART surfaces** (docs, Studio, the global SMART platform) tend
to use the `forward` mode once on entry, then fall back to a steady
`spinner` to signal "live and verified". The full lockup
(`oiml-logo_full-{theme}`) anchors the masthead; component marks sit in
nav dropdowns. The mini variant handles the in-page "loading the next
recommendation" state.

**Programme SMART+ surfaces** (CNML verifier, instrument dashboards, the
SMART+ platforms) tend to be programmatic — `progress` mode driven by
`setProgress()` as a workflow advances, or a silent mini loader while a
remote call runs. The full SMART+ mark or `cnml-box` (also the mark for the
SMART tier's IA-level CNML) anchors cert pages.

### Options

All options are optional. Full documentation is in the JSDoc block above
the constructor in each `<file>`.

| Group | Options (default) — wireframe and 3D |
| --- | --- |
| Scene | `theme` `'dark' \| 'light'` (`'dark'`) · `mode` `'forward' \| 'reverse' \| 'spinner' \| 'progress'` (`'forward'`) · `delay` ms (`0`) |
| One-shot timing | `duration` s (`5.6`) · `spinSpeed` rad/s (`3.3`) — forward / reverse / progress only |
| Spinner | `cycleTime` s (`9`) — seconds per full OIML→SMART→OIML loop; the one parameter that synchronizes wordmark, spin, and fill |
| Wordmark | `text` `true \| 'oiml' \| 'smart' \| false` (`true`) — animated / pinned / hidden |
| 3D only | `idleAnimation` `'continue' \| 'stop'` (`'continue'`) · `progress` 0–1 (`0`, initial fill) |

Derivation rules (spinner): the half-cycle is `H = cycleTime / 2`. The globe
rotates through a breathing spin spanning the whole half — speed never
drops below 35 % of peak, peaks mid-half, exactly 18 meridian periods per
half → every half ends in an identical configuration (seamless loop). The
wordmark crossfade window is `min(2.4, H/2)` centered mid-half. The fill
rises through the OIML half and drains through the SMART half. `duration`
and `spinSpeed` are ignored in `spinner` mode; the static center line stays
hidden while spinning.

**Mini variant** — same API, reduced options (the wordmark is omitted by
design at mini sizes; `mode` defaults to `'spinner'`):

| Group | Options (default) |
| --- | --- |
| Scene | `theme` (`'dark'`) · `mode` (`'spinner'`) · `delay` ms (`0`) |
| One-shot timing | `duration` s (`5.6`) · `spinSpeed` rad/s (`3.3`) |
| Spinner | `cycleTime` s (`9`) |
| 3D-style extras | `idleAnimation` (`'continue'`) · `progress` 0–1 (`0`) |

### Runtime API

```js
globe.configure({ cycleTime: 5 });     // live options apply immediately
globe.configure({ theme: 'light' });   // structural options rebuild in
                                       // place, preserving animation state
globe.getOptions();                    // copy of the resolved options:
                                       // { theme, mode, cycleTime, ... }
globe.setMode('spinner');              // restart the animation with a mode
globe.start();                         // restart with the current mode
globe.destroy();                       // stop the loop, clear the DOM

// 3D variant only:
globe.setProgress(0.7);                // 0–1 fill level (works in any mode)
```

A spinner that reacts to live state changes:

```js
var loader = new SpinningGlobe3D('#loader', { theme: 'dark', mode: 'spinner' });

// Speed up live:
document.getElementById('faster').onclick = function () {
    loader.configure({ cycleTime: 5 });
};

// Stagger multiple instances (uses `delay`):
new SpinningGlobe3D('#a', { delay: 0 });
new SpinningGlobe3D('#b', { delay: 2000 });
new SpinningGlobe3D('#c', { delay: 4000 });
```

### Themes

Two named themes — pick by the background of your surface (dark or light):

| Theme | Stroke | Text fill | Background | Volume fill | Cloud | Star |
|-------|--------|-----------|------------|-------------|-------|------|
| `dark` | `#61b4ff` | `#fff` | `#050810` | `#61b4ff` | `#61b4ff` | `#ffd54f` |
| `light` | `#004996` | `#1a1a1a` | `#f5f3ed` | `#a8d4f5` | `#4da8e8` | `#ff9800` |

Only the two named themes are accepted today. To customize beyond them,
edit the `THEMES` table at the top of the component source file (each
component has its own — they don't share a palette, since the wireframe
component has no fill / clouds / stars). For a wider design system, change
the values in `site-shell/src/styles/tokens.css` and feed them in.

---

## How It Works

### Wireframe globe

The globe is built from 7 SVG `<ellipse>` elements that share the same center
and radius but are scaled along the X-axis using `Math.cos(angle + phase)`. As
the angle changes, each ellipse widens and narrows like a meridian rotating
around a sphere.

```
Meridian i at angle θ:
  scaleX = cos(θ + 2π·i/7)
  opacity = 0.55 + |scaleX| · 0.3
```

The angle is computed analytically from elapsed time (not accumulated
frame-by-frame), eliminating drift.

**Animation phases** (forward/reverse modes, scaled by `duration / 5.6`):

| Phase     | Duration | What happens                                        |
|-----------|----------|-----------------------------------------------------|
| Fade-in   | 1.0s     | Text fades in, globe stationary                     |
| Spin-up   | 0.8s     | Globe accelerates (cosEase — zero initial velocity) |
| Full-spin | 3.0s     | Globe spins at constant speed, text crossfades      |
| Spin-down | 0.8s     | Globe decelerates (sinEase — zero final velocity)   |

The globe always lands on a snap angle where one meridian is edge-on, matching
the static center line.

### Spinner mode

One parameter, `cycleTime`, synchronizes all three subsystems over each
half-cycle `H = cycleTime / 2`:

```
Spin:   angle(u) = V·m·u + V·(1−m)·(H/π)·(1 − cos(π·u/H)),  m = 0.35
        → continuous breathing spin, velocity-continuous across halves,
          exactly 18 meridian periods (2π/7 each) per half → seamless loop
Text:   symmetric crossfade, o + s = 1 throughout,
        window min(2.4, H/2) centered mid-half (at peak spin speed)
Fill:   rises e(u/H) through the OIML half, drains through the SMART half
```

The static center line stays hidden; the globe never stops.

### 3D volume fill

A circular segment (SVG arc path) represents the intersection of the globe
circle and the half-plane below the liquid surface. A radial gradient
(`gradientUnits="userSpaceOnUse"`) fixed to the globe center provides
spherical depth shading.

```
Fill percentage pct (0 → 1):
  y_surface = CY + R · (1 − 2·pct)
  dx = sqrt(R² − (y_surface − CY)²)

  Volume path: M (CX−dx, y_s) A R R [large] 0 (CX+dx, y_s) Z
  Surface ellipse: rx = dx, ry = dx · 0.18
```

**Cloud particles**: 70 soft circles positioned on the sphere surface with
spherical coordinates (`lon`, `lat`), projected via
`x = CX + R·cos(lat)·sin(lon+θ)`, `y = CY + R·lat`. Only clouds below the
current fill surface are visible, so they appear gradually as the fill rises.

**Star lights**: 35 yellow dots with radial-gradient glow, visible when fill
exceeds 60 %, each with a unique sinusoidal pulse. After a one-shot animation
completes, stars keep twinkling and clouds keep drifting (see
`idleAnimation`).

### Text shadow

Both wordmark groups use an SVG filter with `feGaussianBlur` on
`SourceAlpha`, flooded with the theme's background color — a soft shadow that
keeps the text readable against clouds and gradient fill.

### Animation loop management

The `requestAnimationFrame` loop stops after forward/reverse animations
complete (unless `idleAnimation` is `'continue'`), saving CPU/battery. It
restarts on `setMode()` or `start()`. In `spinner` and `progress` modes the
loop always runs.

---

## Integration

### Vanilla JS

```html
<script src="spinning-globe.js"></script>
<script src="spinning-globe-3d.js"></script>
<div id="globe"></div>
<script>
  var globe = new SpinningGlobe('#globe', { theme: 'dark', mode: 'forward' });
  // or:
  var globe3d = new SpinningGlobe3D('#globe', { theme: 'dark', mode: 'forward' });

  globe.setMode('spinner');
  globe.destroy();
</script>
```

### Vue 3

```vue
<template>
  <div ref="container" style="width: 300px;"></div>
</template>

<script>
export default {
  props: {
    theme: { type: String, default: 'dark' },
    mode:  { type: String, default: 'forward' },
    cycleTime: { type: Number, default: 9 },
    progress: { type: Number, default: 0 },
  },
  setup(props) {
    const container = ref(null);
    let globe = null;

    onMounted(() => {
      globe = new SpinningGlobe3D(container.value, {
        theme: props.theme,
        mode: props.mode,
        cycleTime: props.cycleTime,
      });
    });

    onBeforeUnmount(() => { if (globe) globe.destroy(); });

    watch(() => props.mode, (m) => { if (globe) globe.setMode(m); });
    watch(() => props.cycleTime, (c) => { if (globe) globe.configure({ cycleTime: c }); });
    watch(() => props.progress, (p) => { if (globe) globe.setProgress(p); });

    return { container };
  },
};
</script>
```

### Vue 2

```vue
<template>
  <div ref="container" style="width: 300px;"></div>
</template>

<script>
export default {
  props: {
    theme: { type: String, default: 'dark' },
    mode:  { type: String, default: 'forward' },
    cycleTime: { type: Number, default: 9 },
  },
  mounted: function() {
    this.globe = new SpinningGlobe3D(this.$refs.container, {
      theme: this.theme, mode: this.mode, cycleTime: this.cycleTime,
    });
  },
  beforeDestroy: function() { if (this.globe) this.globe.destroy(); },
  watch: {
    mode: function(m) { if (this.globe) this.globe.setMode(m); },
  },
};
</script>
```

### React

```jsx
import { useEffect, useRef } from 'react';

function Globe({ theme = 'dark', mode = 'forward', cycleTime = 9, progress }) {
  const ref = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    globeRef.current = new SpinningGlobe3D(ref.current, { theme, mode, cycleTime });
    return () => globeRef.current.destroy();
  }, []);

  useEffect(() => { if (globeRef.current) globeRef.current.setMode(mode); }, [mode]);
  useEffect(() => { if (globeRef.current) globeRef.current.configure({ cycleTime }); }, [cycleTime]);
  useEffect(() => { if (globeRef.current) globeRef.current.setProgress(progress); }, [progress]);

  return <div ref={ref} style={{ width: 300 }} />;
}
```

### Bundler Usage (Webpack, Vite, Rollup)

All three components are shipped as IIFEs (`window.SpinningGlobe`,
`window.SpinningGlobe3D`, `window.SpinningGlobeMini`). To use with a bundler:

```js
import './spinning-globe-3d.js';
const SpinningGlobe3D = window.SpinningGlobe3D;
```

---

## Use Cases

| Use case | Variant | Mode | Details |
|----------|---------|------|---------|
| Branded loading indicator | 3D Filled | `spinner` | Synchronized spin/crossfade/fill loop; stars twinkle |
| Progress display | 3D Filled | `progress` + `setProgress()` | Call `setProgress(0.7)` as loading advances |
| Pure spinner (no wordmark) | Either | `spinner` + `text: false` | Globe-only spinner, pace set by `cycleTime` |
| Mini loader / inline spinner | Mini | `spinner` (default) | 24–64 px, ~14 animated SVG elements |
| Compact progress | Mini | `progress` + `setProgress()` | Small progress globe for mobile UIs |
| Text-free progress bar | 3D Filled | `progress` + `text: false` + `setProgress()` | Globe fills with no text |
| Logo reveal / hero section | Either | `forward` or `reverse` | One-shot brand transition with text crossfade |
| Idle state animation | 3D Filled | `forward` + `idleAnimation: 'continue'` | Globe at rest with stars and clouds gently moving |
| Static logo | Wireframe | `forward` + `idleAnimation: 'stop'` | Clean wireframe globe frozen at rest with text |

### Mini (small screens)

```html
<div id="loader" style="width: 32px;"></div>
<script src="spinning-globe-mini.js"></script>
<script>
    var loader = new SpinningGlobeMini('#loader', { theme: 'dark' });
</script>
```

Defaults to `spinner` mode — drop it in and it loads. Give the wrapper an
explicit pixel size (24–64 px is the sweet spot).

### Progress Indicator Example

```js
var loader = new SpinningGlobe3D('#loader', {
  theme: 'dark',
  mode: 'progress'
});

// Wire to your loading progress
function onProgress(pct) {
  loader.setProgress(pct);
}
```

### Delayed Start

Stagger multiple globe instances:

```js
new SpinningGlobe3D('#globe-1', { delay: 0 });
new SpinningGlobe3D('#globe-2', { delay: 2000 });
new SpinningGlobe3D('#globe-3', { delay: 4000 });
```

### Styling the Container

The SVG fills its container width. Control size via the wrapper:

```css
.globe-container {
  width: min(80vmin, 460px);
}
```

---

## Browser Support

Tested on Safari, Chrome, Firefox, and Edge. Requires:

- SVG support (all modern browsers)
- `requestAnimationFrame` (IE 10+)
- ES5 (no transpilation needed)

---

## Logo assets

`logo/` holds the canonical logo assets, named
`oiml-logo_{variant}-{light|dark}[-old|-N].{png,svg}` — every variant ships in
light and dark; `-old` marks previous-generation marks and numeric suffixes
mark design iterations, all kept deliberately. `logo/oiml-logo.pdf` is the
designer's master source; `logo/profile-pic.png` is the social profile
picture. `BRANDING.txt` is the plain-text application guide.

```
logo/                          all logo assets (SVG source + 300dpi PNG)
spinning-globe.js              Wireframe component (self-contained IIFE)
spinning-globe-3d.js           3D filled component (self-contained IIFE)
spinning-globe-mini.js         Mini component for small screens (self-contained IIFE)
index.html                     Component demo (open directly in a browser)
site/index.html                Brand guide page published to GitHub Pages
.github/workflows/deploy-pages.yml  Pages deployment (stages site + logo + components)
BRANDING.txt                   Plain-text branding application guide
```

The `.svg` files and `oiml-logo.pdf` are designer source artwork — the path
data used in the components is extracted from them. Treat every file as
source: never delete or overwrite (see `CLAUDE.md`).
