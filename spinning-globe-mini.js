(function(global) {
    'use strict';

    var CX = 196.41, CY = 175.15, R = 165;
    var INITIAL = Math.PI / 2;
    var N_MER = 5;
    var N_STARS = 6;
    var PAD = 10;

    function makeRng(seed) {
        return function() {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed / 0x7fffffff;
        };
    }

    var THEMES = {
        dark:  { stroke: '#61b4ff', shading: '#050810', shadeOpacity: 0.4,
                 volColor: '#61b4ff', volCenterOp: 0.35, volEdgeOp: 0.55,
                 surfFill: '#61b4ff', surfStroke: '#a0d8ff',
                 starColor: '#ffd54f', starGlow: '#ffe082' },
        light: { stroke: '#004996', shading: '#f5f3ed', shadeOpacity: 0.5,
                 volColor: '#a8d4f5', volCenterOp: 0.7, volEdgeOp: 0.5,
                 surfFill: '#7abde8', surfStroke: '#5a9ed4',
                 starColor: '#ff9800', starGlow: '#ffcc80' }
    };

    var _counter = 0;

    function SpinningGlobeMini(container, opts) {
        if (typeof container === 'string') container = document.querySelector(container);
        if (!container) throw new Error('SpinningGlobeMini: container not found');

        this._id = 'sgm' + (++_counter);
        this._container = container;
        this._opts = assign({
            theme: 'dark',
            mode: 'spinner',
            duration: 5.6,
            spinSpeed: 3.3,
            delay: 0,
            cycleTime: 9,
            idleAnimation: 'continue',
            progress: 0
        }, opts);

        this._stopped = false;
        this._raf = null;
        this._start = 0;
        this._progress = this._opts.progress;

        this._build();
        this._cache();
        this._computeTiming();
        this._reset();
        this._start = performance.now() + this._opts.delay;
        this._tick = this._tick.bind(this);
        this._raf = requestAnimationFrame(this._tick);
    }

    function assign(dst, src) {
        for (var k in src) { if (src.hasOwnProperty(k)) dst[k] = src[k]; }
        return dst;
    }

    SpinningGlobeMini.prototype._build = function() {
        var id = this._id;
        var t = THEMES[this._opts.theme];
        var vbX = (CX - R - PAD).toFixed(2), vbY = (CY - R - PAD).toFixed(2), vbS = (2 * (R + PAD)).toFixed(2);

        var defs =
            '<clipPath id="' + id + 'c"><circle cx="' + CX + '" cy="' + CY + '" r="' + R + '"/></clipPath>' +
            '<radialGradient id="' + id + 'vg" cx="' + CX + '" cy="' + (CY - R * 0.1).toFixed(2) + '" r="' + R + '" gradientUnits="userSpaceOnUse">' +
                '<stop offset="0%" stop-color="' + t.volColor + '" stop-opacity="' + t.volCenterOp + '"/>' +
                '<stop offset="100%" stop-color="' + t.volColor + '" stop-opacity="' + t.volEdgeOp + '"/>' +
            '</radialGradient>' +
            '<radialGradient id="' + id + 'g">' +
                '<stop offset="40%" stop-color="' + t.shading + '" stop-opacity="0"/>' +
                '<stop offset="100%" stop-color="' + t.shading + '" stop-opacity="' + t.shadeOpacity + '"/>' +
            '</radialGradient>' +
            '<radialGradient id="' + id + 'stg">' +
                '<stop offset="0%" stop-color="' + t.starColor + '" stop-opacity="1"/>' +
                '<stop offset="100%" stop-color="' + t.starGlow + '" stop-opacity="0"/>' +
            '</radialGradient>';

        var mers = '';
        for (var i = 0; i < N_MER; i++)
            mers += '<ellipse class="mer" fill="none" stroke="' + t.stroke + '" stroke-width="9" cx="' + CX + '" cy="' + CY + '" rx="' + R + '" ry="' + R + '"/>';

        var stars = '';
        for (var j = 0; j < N_STARS; j++)
            stars += '<circle class="st" cx="' + CX + '" cy="' + CY + '" r="5" fill="url(#' + id + 'stg)" opacity="0"/>';

        this._container.innerHTML =
            '<svg viewBox="' + vbX + ' ' + vbY + ' ' + vbS + ' ' + vbS + '" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' + defs + '</defs>' +
            '<g clip-path="url(#' + id + 'c)"><path class="vol" d="" fill="url(#' + id + 'vg)"/></g>' +
            mers +
            '<circle fill="none" stroke="' + t.stroke + '" stroke-width="12" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/>' +
            '<g clip-path="url(#' + id + 'c)">' +
                '<ellipse class="surf" cx="' + CX + '" cy="' + CY + '" rx="0" ry="0" fill="' + t.surfFill + '" fill-opacity="0.25" stroke="' + t.surfStroke + '" stroke-width="6" stroke-opacity="0.55"/>' +
            '</g>' +
            '<g clip-path="url(#' + id + 'c)" class="sgm-stars">' + stars + '</g>' +
            '<circle fill="url(#' + id + 'g)" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/>' +
            '</svg>';

        this._svg = this._container.querySelector('svg');
        this._mers = this._svg.querySelectorAll('.mer');
        this._volPath = this._svg.querySelector('.vol');
        this._surf = this._svg.querySelector('.surf');
        this._stars = this._svg.querySelectorAll('.st');
    };

    SpinningGlobeMini.prototype._cache = function() {
        var rng = makeRng(311 + _counter * 7);
        this._starPos = [];
        this._starPhase = [];
        for (var i = 0; i < N_STARS; i++) {
            this._starPos.push({ lon: rng() * Math.PI * 2, lat: (rng() - 0.5) * 1.2, sz: 4.5 + rng() * 4 });
            this._starPhase.push(rng() * Math.PI * 2);
        }
    };

    SpinningGlobeMini.prototype._computeTiming = function() {
        var o = this._opts;
        var sc = o.duration / 5.6;

        this._SPIN = 0.8 * sc;
        this._FULL = 3.0 * sc;
        this._SPD = o.spinSpeed;

        this._P2 = this._SPIN;
        this._P3 = this._P2 + this._FULL;
        this._DUR = this._P3 + this._SPIN;

        var aSpin = this._SPD * this._SPIN * (1 - 2 / Math.PI);
        var aFull = this._SPD * this._FULL;
        var raw = INITIAL + 2 * aSpin + aFull;
        var unit = 2 * Math.PI / N_MER;

        this._SNAP = Math.round((raw - Math.PI / 2) / unit) * unit + Math.PI / 2;
        this._DELTA = this._SNAP - raw;
        this._aSpin = aSpin;
        this._aFull = aFull;

        /* synchronized spinner — same derivation as the full variants, 5 meridians */
        var H = Math.max(2, o.cycleTime) / 2;
        this._PH = H;
        this._PH_TURNS = Math.round(2.5 * N_MER) * unit;
        this._PH_M = 0.35;
        this._PH_V = this._PH_TURNS / (H * (this._PH_M + 2 * (1 - this._PH_M) / Math.PI));
    };

    SpinningGlobeMini.prototype._reset = function() {
        this._spinMers(INITIAL);
        this._setFillLevel(this._progress);
        for (var i = 0; i < this._stars.length; i++) this._stars[i].setAttribute('opacity', '0');
    };

    SpinningGlobeMini.prototype._ease = function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    /* breathing spin: speed floor + sinusoidal swell, seamless across half boundaries */
    SpinningGlobeMini.prototype._spinAngle = function(u) {
        var H = this._PH;
        return this._PH_V * this._PH_M * u +
            this._PH_V * (1 - this._PH_M) * (H / Math.PI) * (1 - Math.cos(Math.PI * u / H));
    };

    SpinningGlobeMini.prototype._angle = function(t) {
        var m = this._opts.mode;
        if (m === 'spinner') {
            var k = Math.floor(t / this._PH);
            return INITIAL + k * this._PH_TURNS + this._spinAngle(t - k * this._PH);
        }
        if (m === 'progress') return INITIAL;
        if (t >= this._DUR) return this._SNAP;
        if (t < this._P2) {
            var p = t / this._SPIN;
            return INITIAL + (p - (2 / Math.PI) * Math.sin(p * Math.PI / 2)) * this._SPD * this._SPIN;
        }
        if (t < this._P3) return INITIAL + this._aSpin + this._SPD * (t - this._P2);
        var u = (t - this._P3) / this._SPIN;
        var raw = u - (2 / Math.PI) * (1 - Math.cos(u * Math.PI / 2));
        var bump = 3 * u * u - 2 * u * u * u;
        return INITIAL + this._aSpin + this._aFull + raw * this._SPD * this._SPIN + this._DELTA * bump;
    };

    SpinningGlobeMini.prototype._fillPct = function(t) {
        var m = this._opts.mode;
        if (m === 'progress') return this._progress;
        if (m === 'spinner') {
            var k = Math.floor(t / this._PH);
            var h = (t - k * this._PH) / this._PH;
            return this._ease(k % 2 === 0 ? h : 1 - h);
        }
        if (t >= this._DUR) return 1;
        return this._ease(Math.min(t / this._DUR, 1));
    };

    SpinningGlobeMini.prototype._setFillLevel = function(pct) {
        pct = Math.max(0, Math.min(1, pct));

        if (pct < 0.005) {
            this._volPath.setAttribute('d', '');
            this._surf.setAttribute('rx', '0');
            this._surf.setAttribute('ry', '0');
            return;
        }

        var y_s = CY + R * (1 - 2 * pct);
        var dy = y_s - CY;
        var dxSq = R * R - dy * dy;

        if (pct > 0.995) {
            this._volPath.setAttribute('d',
                'M' + (CX - R) + ',' + CY +
                ' A' + R + ',' + R + ' 0 1 1 ' + (CX + R) + ',' + CY +
                ' A' + R + ',' + R + ' 0 1 1 ' + (CX - R) + ',' + CY + ' Z');
            this._surf.setAttribute('rx', '0');
            this._surf.setAttribute('ry', '0');
            return;
        }

        var dx = Math.sqrt(Math.max(0, dxSq));
        var large = pct > 0.5 ? 1 : 0;

        this._volPath.setAttribute('d',
            'M' + (CX - dx).toFixed(2) + ',' + y_s.toFixed(2) +
            ' A' + R + ',' + R + ' 0 ' + large + ' 0 ' + (CX + dx).toFixed(2) + ',' + y_s.toFixed(2) + ' Z');

        this._surf.setAttribute('cy', y_s.toFixed(2));
        this._surf.setAttribute('rx', dx.toFixed(2));
        this._surf.setAttribute('ry', Math.max(0.1, dx * 0.18).toFixed(2));
    };

    SpinningGlobeMini.prototype._spinMers = function(angle) {
        var els = this._mers, n = els.length;
        for (var i = 0; i < n; i++) {
            var ph = (i / n) * Math.PI * 2;
            var sx = Math.cos(angle + ph);
            var ab = Math.abs(sx);
            els[i].setAttribute('transform',
                'translate(' + CX + ',' + CY + ') scale(' + sx + ',1) translate(' + (-CX) + ',' + (-CY) + ')');
            els[i].setAttribute('opacity', (0.55 + ab * 0.3).toFixed(2));
        }
    };

    SpinningGlobeMini.prototype._updateStars = function(angle, fillPct, t) {
        var stars = this._stars;
        var baseOp = fillPct > 0.6 ? Math.min(1, (fillPct - 0.6) / 0.3) : 0;

        for (var i = 0; i < stars.length; i++) {
            var el = stars[i];
            var pos = this._starPos[i];
            var facing = Math.cos(pos.lon + angle);
            if (facing < 0.05 || baseOp === 0) { el.setAttribute('opacity', '0'); continue; }

            var px = CX + R * Math.cos(pos.lat) * Math.sin(pos.lon + angle);
            var py = CY + R * pos.lat;

            var phase = t * (1.5 + (i % 5) * 0.3) + this._starPhase[i];
            var pulse = 0.5 + 0.5 * Math.sin(phase);
            var op = baseOp * facing * (0.3 + 0.7 * pulse);

            el.setAttribute('cx', px.toFixed(2));
            el.setAttribute('cy', py.toFixed(2));
            el.setAttribute('r', Math.max(0.5, pos.sz * (0.7 + 0.3 * pulse)).toFixed(2));
            el.setAttribute('opacity', Math.max(0, op).toFixed(2));
        }
    };

    SpinningGlobeMini.prototype._tick = function(now) {
        var el = (now - this._start) / 1000;
        if (el > 0) {
            var angle = this._stopped ? this._SNAP : this._angle(el);
            var fillPct = this._fillPct(el);

            if (!this._stopped) {
                this._spinMers(angle);
                this._setFillLevel(fillPct);

                if (this._opts.mode !== 'spinner' && this._opts.mode !== 'progress' && el >= this._DUR) {
                    this._spinMers(this._SNAP);
                    this._setFillLevel(1);
                    this._stopped = true;
                    if (this._opts.idleAnimation === 'stop') {
                        cancelAnimationFrame(this._raf);
                        this._raf = null;
                        return;
                    }
                }
            }

            this._updateStars(this._stopped ? this._SNAP : angle, this._stopped ? 1 : fillPct, el);
        }
        this._raf = requestAnimationFrame(this._tick);
    };

    SpinningGlobeMini.prototype._renderRest = function() {
        this._spinMers(this._SNAP);
        this._setFillLevel(this._progress > 0 ? this._progress : 1);
    };

    SpinningGlobeMini.prototype.setMode = function(mode) {
        if (this._raf) cancelAnimationFrame(this._raf);
        this._opts.mode = mode;
        this._stopped = false;
        this._reset();
        this._start = performance.now() + this._opts.delay;
        this._tick = this._tick.bind(this);
        this._raf = requestAnimationFrame(this._tick);
    };

    SpinningGlobeMini.prototype.setProgress = function(pct) {
        this._progress = Math.max(0, Math.min(1, pct));
        this._setFillLevel(this._progress);
    };

    SpinningGlobeMini.prototype.configure = function(opts) {
        if (!opts) return this;
        var rebuild = false;
        for (var k in opts) {
            if (!opts.hasOwnProperty(k)) continue;
            if (k === 'theme' && opts[k] !== this._opts.theme) rebuild = true;
            this._opts[k] = opts[k];
        }
        this._computeTiming();
        if (rebuild) {
            var elapsed = performance.now() - this._start;
            this._build();
            this._reset();
            this._start = performance.now() - elapsed;
            if (this._stopped) this._renderRest();
            if (this._raf) {
                cancelAnimationFrame(this._raf);
                this._raf = requestAnimationFrame(this._tick);
            }
        } else if (this._stopped) {
            this._renderRest();
        }
        return this;
    };

    SpinningGlobeMini.prototype.getOptions = function() {
        return assign({}, this._opts);
    };

    SpinningGlobeMini.prototype.start = function() {
        this.setMode(this._opts.mode);
    };

    SpinningGlobeMini.prototype.destroy = function() {
        if (this._raf) cancelAnimationFrame(this._raf);
        this._container.innerHTML = '';
    };

    global.SpinningGlobeMini = SpinningGlobeMini;
})(window);
