# OIML Smart branding

Brand assets for OIML Smart — the logo SVG/PNG pairs and the master
`oiml-logo.pdf` (see `CLAUDE.md` for the naming convention and asset rules) —
plus the animated brand mark: the spinning OIML ⇄ SMART globe as two
dependency-free ES5 components.

## Spinning globe — animated brand mark

- **Wireframe** (`spinning-globe.js`, `window.SpinningGlobe`) — globe outline
  built from 7 rotating meridians with the OIML ⇄ SMART wordmark
- **3D Filled** (`spinning-globe-3d.js`, `window.SpinningGlobe3D`) — adds a
  volumetric liquid fill, 70 cloud particles, and 35 twinkling star lights

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
dark and light themes, two no-text variants, mode switching, a cycle-time
slider for the spinner, and a fill slider for progress mode.

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

Both components are shipped as IIFEs (`window.SpinningGlobe` and
`window.SpinningGlobe3D`). To use with a bundler:

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
| Text-free progress bar | 3D Filled | `progress` + `text: false` + `setProgress()` | Globe fills with no text |
| Logo reveal / hero section | Either | `forward` or `reverse` | One-shot brand transition with text crossfade |
| Idle state animation | 3D Filled | `forward` + `idleAnimation: 'continue'` | Globe at rest with stars and clouds gently moving |
| Static logo | Wireframe | `forward` + `idleAnimation: 'stop'` | Clean wireframe globe frozen at rest with text |

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

The `oiml-logo_*` files are the canonical logo assets, named
`oiml-logo_{variant}-{light|dark}[-old|-N].{png,svg}` — every variant ships in
light and dark; `-old` marks previous-generation marks and numeric suffixes
mark design iterations, all kept deliberately. `oiml-logo.pdf` is the
designer's master source.

```
spinning-globe.js              Wireframe component (self-contained IIFE)
spinning-globe-3d.js           3D filled component (self-contained IIFE)
index.html                     Demo page (all variants, mode switching, sliders)
oiml-logo_globe-dark.svg       Source SVG — globe wireframe, dark theme
oiml-logo_globe-light.svg      Source SVG — globe wireframe, light theme
oiml-logo_icon-dark.svg        Source SVG — globe + OIML text
oiml-logo_smart-new-dark.svg   Source SVG — globe + SMART text
```

The `.svg` files and `oiml-logo.pdf` are designer source artwork — the path
data used in the components is extracted from them. Treat every file as
source: never delete or overwrite (see `CLAUDE.md`).
