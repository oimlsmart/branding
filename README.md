# OIML Spinning Globe

Animated SVG globe components that transition between "OIML" and "SMART" text, rendered with meridian ellipses and path data from the official OIML brand assets.

Two variants:
- **Wireframe** (`SpinningGlobe`) — classic globe outline with meridian lines
- **3D Filled** (`SpinningGlobe3D`) — globe with volumetric fill, cloud particles, and yellow star lights

## Demo

### Wireframe

![Forward mode — OIML phase](screenshot-forward-oiml.png)
*Forward mode: OIML fades in, globe spins, text crossfades to SMART.*

![Forward mode — SMART phase](screenshot-forward-smart.png)
*Forward mode complete: SMART text holds with globe at rest.*

![Spinner mode](screenshot-spinner.png)
*Spinner mode: continuous rotation with cycling text.*

![Dark theme](screenshot-dark-panel.png) ![Light theme](screenshot-light-panel.png)
*Dark and light themes.*

### 3D Filled

![3D filling](screenshot-3d-filling.png)
*Globe filling up — radial gradient with cloud particles and surface ellipse.*

![3D full](screenshot-3d-full.png)
*Fully filled globe at rest with yellow star lights twinkling.*

![Progress mode](screenshot-progress.png)
*Progress mode: fill level controlled externally via `setProgress()`.*

Open `index.html` in a browser for the full demo with all four variants and mode switching.

---

## How It Works

### Wireframe Globe

The globe is built from 7 SVG `<ellipse>` elements that share the same center and radius but are scaled along the X-axis using `Math.cos(angle + phase)`. As the angle changes, each ellipse widens and narrows like a meridian rotating around a sphere — pure SVG transforms, no WebGL or canvas.

```
Meridian i at angle θ:
  scaleX = cos(θ + 2π·i/7)
  opacity = 0.55 + |scaleX| · 0.3
```

**Animation phases** (forward/reverse modes):

| Phase     | Duration | What happens                                        |
|-----------|----------|-----------------------------------------------------|
| Fade-in   | 1.0s     | Text fades in, globe stationary                     |
| Spin-up   | 0.8s     | Globe accelerates (cosEase — zero initial velocity) |
| Full-spin | 3.0s     | Globe spins at constant speed, text crossfades      |
| Spin-down | 0.8s     | Globe decelerates (sinEase — zero final velocity)   |

The angle is computed analytically from elapsed time (not accumulated frame-by-frame), eliminating drift. The globe always lands on a snap angle where one meridian is edge-on, matching the static center line.

### 3D Filled Globe

The 3D variant adds three visual layers on top of the wireframe:

**Volume fill**: A circular segment (SVG arc path) representing the intersection of the globe circle and the half-plane below the liquid surface. As fill percentage rises from 0 to 1, the surface moves up from bottom to top. A radial gradient (`gradientUnits="userSpaceOnUse"`) fixed to the globe center provides spherical depth shading — the fill is progressively revealed, not painted all at once.

**Cloud particles**: 70 soft circles positioned on the sphere surface using spherical coordinates (`lon`, `lat`). Each cloud is projected to 2D via `x = CX + R·cos(lat)·sin(lon+θ)`, `y = CY + R·lat`. Only clouds below the current fill surface are visible, so they appear gradually as the fill rises. Clouds rotate with the globe and have a gentle breathing animation.

**Star lights**: 35 yellow dots with radial gradient glow. Stars appear when fill exceeds 60%. Each star has a unique sinusoidal pulse — always visible with gentle brightening peaks. After the main animation completes, stars continue twinkling and clouds continue drifting (configurable via `idleAnimation`).

```
Fill percentage pct (0 → 1):
  y_surface = CY + R · (1 − 2·pct)
  dx = sqrt(R² − (y_surface − CY)²)

  Volume path: M (CX−dx, y_s) A R R [large] 0 (CX+dx, y_s) Z

  Surface ellipse: rx = dx, ry = dx · 0.18
```

### Text Shadow

Both text groups (OIML, SMART) use an SVG filter with `feGaussianBlur` on `SourceAlpha`, flooded with the theme's background color, creating a soft shadow that ensures readability against the clouds and gradient fill.

### Animation Loop Management

The `requestAnimationFrame` loop stops after forward/reverse animations complete (unless `idleAnimation` is `'continue'`). This saves CPU/battery when the animation is done. The loop restarts on `setMode()` or `start()`.

---

## Quick Start

### Wireframe

```html
<script src="spinning-globe.js"></script>
<div id="my-globe" style="width: 400px;"></div>
<script>
  var globe = new SpinningGlobe('#my-globe', {
    theme: 'dark',
    mode: 'forward'
  });
</script>
```

### 3D Filled

```html
<script src="spinning-globe-3d.js"></script>
<div id="my-globe" style="width: 400px;"></div>
<script>
  var globe = new SpinningGlobe3D('#my-globe', {
    theme: 'dark',
    mode: 'forward',
    fillTime: 4.0
  });
</script>
```

### Progress Indicator

```html
<script src="spinning-globe-3d.js"></script>
<div id="loader" style="width: 200px;"></div>
<script>
  var loader = new SpinningGlobe3D('#loader', {
    theme: 'dark',
    mode: 'spinner',
    idleAnimation: 'continue'
  });

  // Update fill as loading progresses
  loader.setProgress(0.3);
  // ... later
  loader.setProgress(0.7);
  // ... done
  loader.setProgress(1.0);
</script>
```

---

## API

### `new SpinningGlobe(container, opts)` — Wireframe

| Param          | Type              | Default    | Description                              |
|----------------|-------------------|------------|------------------------------------------|
| container      | `Element\|string` | —          | DOM element or CSS selector              |
| opts.theme     | `'dark'\|'light'` | `'dark'`   | Color scheme                             |
| opts.mode      | `string`          | `'forward'`| Animation mode (see Modes below)         |
| opts.duration  | `number`          | `5.6`      | Total animation duration in seconds      |
| opts.spinSpeed | `number`          | `3.3`      | Rotation speed in radians per second     |
| opts.delay     | `number`          | `0`        | Start delay in milliseconds              |

### `new SpinningGlobe3D(container, opts)` — 3D Filled

Same options as `SpinningGlobe`, plus:

| Param              | Type     | Default      | Description                                           |
|--------------------|----------|--------------|-------------------------------------------------------|
| opts.fillTime      | `number` | `4.0`        | Time in seconds for the fill-from-bottom cycle        |
| opts.idleAnimation | `string` | `'continue'` | `'continue'` or `'stop'` after animation completes    |
| opts.progress      | `number` | `0`          | Initial fill level (0–1) for `setProgress` usage      |

### Methods (both variants)

| Method             | Description                                           |
|--------------------|-------------------------------------------------------|
| `setMode(mode)`    | Restart animation with a new mode                     |
| `start()`          | Restart with the current mode                         |
| `destroy()`        | Cancel animation and clear the container              |

### Methods (3D variant only)

| Method              | Description                                                    |
|---------------------|----------------------------------------------------------------|
| `setProgress(pct)`  | Set fill level (0–1). Works in any mode to override fill level |

### Modes

- **`forward`** — OIML fades in → globe spins → text crossfades to SMART → globe stops
- **`reverse`** — SMART fades in → globe spins → text crossfades to OIML → globe stops
- **`spinner`** — Continuous rotation; text cycles between OIML and SMART indefinitely; fill rises and falls
- **`progress`** — Static globe; fill controlled externally via `setProgress()`; stars/clouds animate

### idleAnimation

Controls what happens after forward/reverse animations complete:

- **`'continue'`** (default) — Stars keep twinkling, clouds keep drifting. The animation loop continues running.
- **`'stop'`** — Everything freezes at the final frame. The animation loop stops completely, saving CPU.

In `spinner` mode, the animation always continues regardless of this setting.

### Themes

| Theme  | Stroke      | Text fill   | Background  | Volume fill | Cloud color | Star color |
|--------|-------------|-------------|-------------|-------------|-------------|------------|
| dark   | `#61b4ff`   | `#fff`      | `#050810`   | `#61b4ff`   | `#61b4ff`   | `#ffd54f`  |
| light  | `#004996`   | `#1a1a1a`   | `#f5f3ed`   | `#a8d4f5`   | `#4da8e8`   | `#ff9800`  |

---

## Use Cases

| Use case | Variant | Mode | Details |
|----------|---------|------|---------|
| Branded loading indicator | 3D Filled | `spinner` | Fill cycles up and down; yellow stars twinkle |
| Progress display | 3D Filled | `spinner` + `setProgress()` | Call `setProgress(0.7)` as loading advances |
| Logo reveal / hero section | Either | `forward` or `reverse` | One-shot brand transition with text crossfade |
| Idle state animation | 3D Filled | `forward` + `idleAnimation: 'continue'` | Globe at rest with stars and clouds gently moving |
| Static logo | Wireframe | `forward` + `idleAnimation: 'stop'` | Clean wireframe globe frozen at rest with text |

### Progress Indicator Example

The 3D filled variant is ideal for progress indicators. Use `setProgress()` to drive the fill level from your application state:

```js
var loader = new SpinningGlobe3D('#loader', {
  theme: 'dark',
  mode: 'spinner',
  fillTime: 3.0
});

// Wire to your loading progress
function onProgress(pct) {
  loader.setProgress(pct);
}
```

When used in `spinner` mode, the globe rotates continuously and `setProgress()` overrides the automatic fill cycle. The fill level jumps to whatever value you set.

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
  var globe3d = new SpinningGlobe3D('#globe', { theme: 'dark', mode: 'forward', fillTime: 3.5 });

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
    fillTime: { type: Number, default: 4.0 },
    progress: { type: Number, default: 0 },
  },
  setup(props) {
    const container = ref(null);
    let globe = null;

    onMounted(() => {
      globe = new SpinningGlobe3D(container.value, {
        theme: props.theme,
        mode: props.mode,
        fillTime: props.fillTime,
      });
    });

    onBeforeUnmount(() => { if (globe) globe.destroy(); });

    watch(() => props.mode, (m) => { if (globe) globe.setMode(m); });
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
    fillTime: { type: Number, default: 4.0 },
  },
  mounted: function() {
    this.globe = new SpinningGlobe3D(this.$refs.container, {
      theme: this.theme, mode: this.mode, fillTime: this.fillTime,
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

function Globe({ theme = 'dark', mode = 'forward', fillTime = 4.0, progress }) {
  const ref = useRef(null);
  const globeRef = useRef(null);

  useEffect(() => {
    globeRef.current = new SpinningGlobe3D(ref.current, { theme, mode, fillTime });
    return () => globeRef.current.destroy();
  }, []);

  useEffect(() => { if (globeRef.current) globeRef.current.setMode(mode); }, [mode]);
  useEffect(() => { if (globeRef.current) globeRef.current.setProgress(progress); }, [progress]);

  return <div ref={ref} style={{ width: 300 }} />;
}
```

### Bundler Usage (Webpack, Vite, Rollup)

Both components are shipped as IIFEs (`window.SpinningGlobe` and `window.SpinningGlobe3D`). To use with a bundler:

```js
import './spinning-globe-3d.js';
const SpinningGlobe3D = window.SpinningGlobe3D;
```

---

## Customization

### Timing

```js
// Fast, tight animation
new SpinningGlobe3D(el, { duration: 3.0, spinSpeed: 5.0, fillTime: 2.0 });

// Slow, dramatic reveal
new SpinningGlobe3D(el, { duration: 10.0, spinSpeed: 2.0, fillTime: 8.0 });
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

Both components are dependency-free, Safari-compatible, and work in any browser that supports SVG and `requestAnimationFrame`.

---

## File Structure

```
spinning-globe.js              Wireframe component (self-contained IIFE)
spinning-globe-3d.js           3D filled component (self-contained IIFE)
index.html                     Demo page (all variants, mode switching, progress slider)
oiml-logo_globe-dark.svg       Source SVG — globe wireframe, dark theme
oiml-logo_globe-light.svg      Source SVG — globe wireframe, light theme
oiml-logo_icon-dark.svg        Source SVG — globe + OIML text
oiml-logo_smart-new-dark.svg   Source SVG — globe + SMART text
```

The `.svg` files are designer source artwork — the path data used in the component is extracted from them. Do not delete.
