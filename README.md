# OIML Smart branding

The source of truth for the OIML Smart brand: logo assets in `logo/` (SVG
source of truth + 300dpi PNG exports + the designer's master
`logo/oiml-logo.pdf`), the branding guide below, `BRANDING.txt` (plain-text
application instructions for humans and AI agents), a published brand site on
GitHub Pages — plus the animated brand mark: the spinning OIML ⇄ SMART globe
as three dependency-free ES5 components.

- Brand site: <https://oimlsmart.github.io/branding/>
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

Component variants — each pairs the globe with the component wordmark:
`cs`, `cs-smart`, `cs-smartplus`, `smartplus`, `platform`, `platformplus`,
`smart-rec`, `smart-studio`, `smi`, `sst`, `cnml-box`, `vocab`.

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

### Rules

- Use files as-is: no stretching, recoloring, re-typesetting, or added
  effects. Pick `-dark`/`-light` per the background — the contrast is built
  into the artwork.
- Clear space of at least the globe's radius on all sides; minimum sizes:
  full lockup ≥ 120 px wide, icon ≥ 32 px, below 64 px prefer the globe mark
  or `SpinningGlobeMini`.
- Treat every file in `logo/` as source (including `-old` and iterations):
  never delete or overwrite. SVGs are canonical; PNGs are exports.

## Spinning globe — animated brand mark

- **Wireframe** (`spinning-globe.js`, `window.SpinningGlobe`) — globe outline
  built from 7 rotating meridians with the OIML ⇄ SMART wordmark
- **3D Filled** (`spinning-globe-3d.js`, `window.SpinningGlobe3D`) — adds a
  volumetric liquid fill, 70 cloud particles, and 35 twinkling star lights
- **Mini** (`spinning-globe-mini.js`, `window.SpinningGlobeMini`) — compact
  variant tuned for small screens (24–64 px): 5 meridians with
  size-proportional strokes, liquid fill, 6 star lights, no wordmark, no
  clouds or filters — ~14 animated elements for cheap mobile rendering

Pure SVG transforms driven by `requestAnimationFrame` — no WebGL, no canvas,
no dependencies, ES5 throughout.

### Demo

![Forward mode — OIML phase](screenshot-forward-oiml.png)
*Forward mode: OIML fades in, globe spins, text crossfades to SMART.*

![Forward mode — SMART phase](screenshot-forward-smart.png)
*Forward mode complete: SMART text holds with globe at rest.*

![Spinner mode](screenshot-spinner.png)
*Spinner mode: synchronized spin, crossfade, and fill cycling.*

![Dark theme](screenshot-dark-panel.png) ![Light theme](screenshot-light-panel.png)
*Dark and light themes.*

![3D filling](screenshot-3d-filling.png)
*3D filling up — radial gradient with cloud particles and surface ellipse.*

![3D full](screenshot-3d-full.png)
*Fully filled globe with yellow star lights twinkling.*

![Progress mode](screenshot-progress.png)
*Progress mode: fill level controlled externally via `setProgress()`.*

Open `index.html` in a browser for the full demo: wireframe and 3D variants in
dark and light themes, two no-text variants, a mini size ramp (28/44/64 px) in
spinner and progress modes, mode switching, a cycle-time slider for the
spinner, and a fill slider for progress mode.

### Quick start

```html
<div id="globe" style="width: 400px;"></div>
<script src="spinning-globe-3d.js"></script>
<script>
    var globe = new SpinningGlobe3D('#globe', { theme: 'dark', mode: 'forward' });
</script>
```

No build step. The container is filled with a responsive
`<svg viewBox="0 0 400 350">`; size it with CSS.

### Options

All options are optional.

| Group | Options (default) |
| --- | --- |
| Scene | `theme` `'dark'\|'light'` (`'dark'`) · `mode` `'forward'\|'reverse'\|'spinner'\|'progress'` (`'forward'`) · `delay` ms (`0`) |
| One-shot timing | `duration` s (`5.6`) · `spinSpeed` rad/s (`3.3`) — forward/reverse/progress only |
| Spinner | `cycleTime` s (`9`) — seconds per full OIML→SMART→OIML loop; the one parameter that synchronizes wordmark, spin, and fill |
| Wordmark | `text` (`true`) — `true` animated · `'oiml'` / `'smart'` pinned to one word · `false` hidden |
| 3D only | `idleAnimation` `'continue'\|'stop'` (`'continue'`) · `progress` 0–1 (`0`, initial fill level) |

Derivation rules: in `spinner` mode the half-cycle is `H = cycleTime / 2`.
The globe rotates through a breathing spin spanning the whole half — speed
never drops below 35 % of peak and peaks mid-half — covering exactly 18
meridian periods per half, so every half ends in an identical configuration
(seamless loop). The wordmark crossfade window is `min(2.4, H/2)` centered
mid-half. The fill rises through the OIML half and drains through the SMART
half. `duration` and `spinSpeed` are ignored in `spinner` mode; the static
center line stays hidden while spinning.

### Mini variant

`SpinningGlobeMini` shares the same API (`setMode`, `configure`,
`getOptions`, `start`, `destroy`, `setProgress`) and the same modes, with a
reduced option set — there is no `text` option (the wordmark is omitted by
design at mini sizes) and `mode` defaults to `'spinner'`:

| Group | Options (default) |
| --- | --- |
| Scene | `theme` `'dark'\|'light'` (`'dark'`) · `mode` (`'spinner'`) · `delay` ms (`0`) |
| One-shot timing | `duration` s (`5.6`) · `spinSpeed` rad/s (`3.3`) |
| Spinner | `cycleTime` s (`9`) |
| 3D-style extras | `idleAnimation` `'continue'\|'stop'` (`'continue'`) · `progress` 0–1 (`0`) |

The mini spinner uses the same breathing-spin derivation with 5 meridians
(13 meridian periods per half-cycle for the seamless loop).

### Modes

- **`forward`** — OIML fades in → globe spins → text crossfades to SMART → stops at rest
- **`reverse`** — SMART fades in → globe spins → text crossfades to OIML → stops at rest
- **`spinner`** — continuous synchronized loop driven by `cycleTime`: breathing spin (never stopping), wordmark crossfade at peak speed, fill rising on OIML and draining on SMART
- **`progress`** — static globe; fill controlled externally via `setProgress()`; stars/clouds animate

### Runtime API

```js
globe.setMode('spinner');             // restart the animation with a new mode
globe.configure({ cycleTime: 4 });    // live options apply immediately
globe.configure({ theme: 'light' });  // structural options rebuild in place,
                                      // preserving animation state
globe.getOptions();                   // copy of the resolved options
globe.start();                        // restart with the current mode
globe.destroy();                      // stop, clear the DOM

// 3D variant only:
globe.setProgress(0.7);               // set fill level 0–1 (progress mode)
```

### Themes

| Theme  | Stroke      | Text fill   | Background  | Volume fill | Cloud color | Star color |
|--------|-------------|-------------|-------------|-------------|-------------|------------|
| dark   | `#61b4ff`   | `#fff`      | `#050810`   | `#61b4ff`   | `#61b4ff`   | `#ffd54f`  |
| light  | `#004996`   | `#1a1a1a`   | `#f5f3ed`   | `#a8d4f5`   | `#4da8e8`   | `#ff9800`  |

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
