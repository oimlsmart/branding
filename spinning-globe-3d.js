(function(global) {
    'use strict';

    var CX = 196.41, CY = 175.15, R = 165, N_MER = 7;
    var INITIAL = Math.PI / 2;

    var OIML_PATHS = [
        'm6.86,178.38c0-23.1,20.3-46.48,43.68-46.48s43.54,23.38,43.54,46.48c0,25.62-15.82,51.24-43.54,51.24S6.86,204,6.86,178.38Zm66.64-14.84c0-5.04-.7-9.8-2.1-14-2.8-8.54-8.54-14.14-20.86-14.14s-18.48,5.6-21,14.14c-1.26,4.2-2.1,8.96-2.1,14v30.52c0,5.46.28,10.78,1.54,15.68,2.52,9.66,8.4,16.38,21.56,16.38s19.04-6.72,21.56-16.38c1.26-4.9,1.4-10.22,1.4-15.68v-30.52Z',
        'm150.75,224.02h13.86v3.5h-45.64v-3.5h13.86v-86.52h-13.86v-3.5h45.64v3.5h-13.86v86.52Z',
        'm283.19,224.02h13.86v3.5h-45.64v-3.5h13.86v-84.14h-.42l-28,87.64h-4.76l-27.86-87.64h-.28v84.14h13.58v3.5h-31.92v-3.5h13.86v-86.52h-13.86v-3.5h36.12l19.6,63.98,20.3-63.98h35.42v3.5h-13.86v86.52Z',
        'm315.67,227.52v-3.5h13.86v-86.52h-13.86v-3.5h46.34v3.5h-14.56v86.52h18.34c17.78,0,24.08-11.9,24.64-28h4.34l-1.4,31.5h-77.7Z'
    ];

    var SMART_PATHS = [
        'm10.66,216.72h-2.11v-24.67h3.6c2.6,11.78,9.67,22.69,22.81,22.69,9.8,0,18.48-7.19,18.48-17.36,0-11.53-10.29-13.76-19.59-16.99-2.48-.87-4.96-1.74-7.44-2.48-11.53-3.47-17.23-12.15-17.23-23.93,0-13.02,9.67-22.69,22.57-22.69,7.19,0,12.4,1.74,18.1,6.2l4.71-4.96h2.23v23.43h-3.97c-1.36-11.78-9.05-21.57-21.45-21.57-7.94,0-15.38,5.83-15.38,14.13,0,9.55,6.57,10.54,14.26,12.65,3.1.87,5.58,1.74,7.69,2.36,2.48.74,5.58,1.61,8.18,2.85,10.42,4.96,14.14,13.14,14.14,24.3,0,15.62-10.17,27.15-26.16,27.15-5.83,0-13.27-2.36-17.61-6.32l-5.83,5.21Z',
        'm147.83,212.87h12.28v3.1h-40.42v-3.1h12.28v-74.52h-.37l-24.8,77.62h-4.22l-24.67-77.62h-.25v74.52h12.03v3.1h-28.27v-3.1h12.28v-76.63h-12.28v-3.1h31.99l17.36,56.67,17.98-56.67h31.37v3.1h-12.28v76.63Z',
        'm159.56,215.97v-3.1h10.04l29.63-81.59h4.22l28.39,81.59h9.92v3.1h-39.31v-3.1h12.9l-7.56-21.95h-26.78l-7.69,21.95h12.65v3.1h-26.41Zm22.81-28.15h24.18l-11.66-34.59-12.52,34.59Z',
        'm270.75,212.87h12.27v3.1h-40.42v-3.1h12.28v-76.63h-12.28v-3.1h41.54c13.52,0,29.63,1.61,29.63,18.85,0,14.01-14.76,18.85-26.29,20.09v.25c19.34,2.98,23.68,13.39,23.68,33.6,0,4.34.37,9.3,12.28,7.07v2.98c-3.47.87-6.94,1.49-10.54,1.49-12.52,0-19.09-6.32-19.09-18.97,0-10.29-1.74-17.98-4.96-20.71-3.47-2.98-7.44-4.46-11.28-4.46h-6.82v39.55Zm0-42.65h10.17c11.16,0,15.75-5.33,15.75-16.49,0-13.89-4.09-17.48-15.13-17.48h-10.79v33.97Z',
        'm335.68,215.97v-3.1h13.02v-76.63c-17.48-.87-22.82,7.56-25.05,23.43h-3.97l1.36-26.53h71.05l1.36,26.53h-3.84c-2.23-15.87-7.56-24.3-25.05-23.43v76.63h13.02v3.1h-41.91Z'
    ];

    var N_LIGHTS = 35;
    var N_CLOUDS = 70;

    function makeRng(seed) {
        return function() {
            seed = (seed * 1103515245 + 12345) & 0x7fffffff;
            return seed / 0x7fffffff;
        };
    }

    var THEMES = {
        dark:  { stroke: '#61b4ff', fill: '#fff',     shading: '#050810', shadeOpacity: 0.4,
                 volColor: '#61b4ff', volCenterOp: 0.35, volEdgeOp: 0.55,
                 surfFill: '#61b4ff', surfStroke: '#a0d8ff',
                 cloudColor: '#61b4ff', cloudOp: 0.12,
                 starColor: '#ffd54f', starGlow: '#ffe082',
                 shadowColor: '#050810' },
        light: { stroke: '#004996', fill: '#1a1a1a', shading: '#f5f3ed', shadeOpacity: 0.5,
                 volColor: '#a8d4f5', volCenterOp: 0.7, volEdgeOp: 0.5,
                 surfFill: '#7abde8', surfStroke: '#5a9ed4',
                 cloudColor: '#4da8e8', cloudOp: 0.22,
                 starColor: '#ff9800', starGlow: '#ffcc80',
                 shadowColor: '#f5f3ed' }
    };

    var _counter = 0;

    function SpinningGlobe3D(container, opts) {
        if (typeof container === 'string') container = document.querySelector(container);
        if (!container) throw new Error('SpinningGlobe3D: container not found');

        this._id = 'sg3d' + (++_counter);
        this._container = container;
        this._opts = assign({
            theme: 'dark',
            mode: 'forward',
            duration: 5.6,
            spinSpeed: 3.3,
            delay: 0,
            fillTime: 4.0,
            idleAnimation: 'continue',
            progress: 0
        }, opts);

        this._stopped = false;
        this._raf = null;
        this._start = 0;
        this._progress = this._opts.progress;
        this._done = false;

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

    SpinningGlobe3D.prototype._build = function() {
        var id = this._id;
        var t = THEMES[this._opts.theme];
        var s = t.stroke, f = t.fill, sh = t.shading, so = t.shadeOpacity;
        var sf = t.surfFill, ss = t.surfStroke;

        var defs = '';
        var mersSvg = '';
        var lightsSvg = '';
        var cloudsSvg = '';
        var oimlP = '', smartP = '';

        defs += '<clipPath id="' + id + 'c"><circle cx="' + CX + '" cy="' + CY + '" r="' + R + '"/></clipPath>';

        defs += '<radialGradient id="' + id + 'stg">' +
            '<stop offset="0%" stop-color="' + t.starColor + '" stop-opacity="1"/>' +
            '<stop offset="50%" stop-color="' + t.starGlow + '" stop-opacity="0.5"/>' +
            '<stop offset="100%" stop-color="' + t.starGlow + '" stop-opacity="0"/>' +
        '</radialGradient>';

        for (var i = 0; i < N_LIGHTS; i++) {
            lightsSvg += '<circle class="lt" cx="' + CX + '" cy="' + CY + '" r="3" fill="url(#' + id + 'stg)" opacity="0"/>';
        }

        defs += '<radialGradient id="' + id + 'cg">' +
            '<stop offset="0%" stop-color="' + t.cloudColor + '" stop-opacity="' + t.cloudOp + '"/>' +
            '<stop offset="100%" stop-color="' + t.cloudColor + '" stop-opacity="0"/>' +
        '</radialGradient>';

        for (var i = 0; i < N_CLOUDS; i++) {
            cloudsSvg += '<circle class="cl" cx="' + CX + '" cy="' + CY + '" r="10" fill="url(#' + id + 'cg)" opacity="0"/>';
        }

        defs += '<radialGradient id="' + id + 'g">' +
            '<stop offset="40%" stop-color="' + sh + '" stop-opacity="0"/>' +
            '<stop offset="100%" stop-color="' + sh + '" stop-opacity="' + so + '"/>' +
        '</radialGradient>';

        var midOp = ((t.volCenterOp + t.volEdgeOp) / 2).toFixed(2);
        defs += '<radialGradient id="' + id + 'vg" cx="' + CX + '" cy="' + (CY - R * 0.1).toFixed(2) + '" r="' + R + '" gradientUnits="userSpaceOnUse">' +
            '<stop offset="0%" stop-color="' + t.volColor + '" stop-opacity="' + t.volCenterOp + '"/>' +
            '<stop offset="65%" stop-color="' + t.volColor + '" stop-opacity="' + midOp + '"/>' +
            '<stop offset="100%" stop-color="' + t.volColor + '" stop-opacity="' + t.volEdgeOp + '"/>' +
        '</radialGradient>';

        defs += '<linearGradient id="' + id + 'sg" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.35"/>' +
            '<stop offset="30%" stop-color="' + ss + '" stop-opacity="0.4"/>' +
            '<stop offset="100%" stop-color="' + sf + '" stop-opacity="0.08"/>' +
        '</linearGradient>';

        defs += '<linearGradient id="' + id + 'sh" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0%" stop-color="#fff" stop-opacity="0.4"/>' +
            '<stop offset="100%" stop-color="#fff" stop-opacity="0"/>' +
        '</linearGradient>';

        defs += '<filter id="' + id + 'ts" x="-5%" y="-10%" width="110%" height="120%">' +
            '<feGaussianBlur in="SourceAlpha" stdDeviation="4" result="shadow"/>' +
            '<feFlood flood-color="' + t.shadowColor + '" flood-opacity="0.8" result="color"/>' +
            '<feComposite in="color" in2="shadow" operator="in" result="coloredShadow"/>' +
            '<feMerge><feMergeNode in="coloredShadow"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>';

        for (var i = 0; i < N_MER; i++)
            mersSvg += '<ellipse class="mer" fill="none" stroke="' + s + '" stroke-width="2" vector-effect="non-scaling-stroke" cx="' + CX + '" cy="' + CY + '" rx="' + R + '" ry="' + R + '"/>';

        for (var i = 0; i < OIML_PATHS.length; i++)
            oimlP += '<path d="' + OIML_PATHS[i] + '" stroke-width="0"/>';
        for (var i = 0; i < SMART_PATHS.length; i++)
            smartP += '<path d="' + SMART_PATHS[i] + '" stroke-width="0"/>';

        this._container.innerHTML =
            '<svg viewBox="0 0 400 350" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' + defs + '</defs>' +
            '<g clip-path="url(#' + id + 'c)"><path class="vol" d="" fill="url(#' + id + 'vg)"/></g>' +
            '<g clip-path="url(#' + id + 'c)" class="sg-clouds">' + cloudsSvg + '</g>' +
            '<g clip-path="url(#' + id + 'c)">' +
                '<ellipse fill="none" stroke="' + s + '" stroke-width="2" vector-effect="non-scaling-stroke" opacity="0.5" cx="' + CX + '" cy="10.16" rx="94.5" ry="51.8"/>' +
                '<ellipse fill="none" stroke="' + s + '" stroke-width="2" vector-effect="non-scaling-stroke" opacity="0.5" cx="' + CX + '" cy="340.14" rx="94.5" ry="51.8"/>' +
            '</g>' +
            mersSvg +
            '<line class="ctr" x1="' + CX + '" y1="10.15" x2="' + CX + '" y2="340.15" stroke="' + s + '" stroke-width="2.5" vector-effect="non-scaling-stroke" clip-path="url(#' + id + 'c)"/>' +
            '<g clip-path="url(#' + id + 'c)">' +
                '<ellipse class="surf" cx="' + CX + '" cy="' + CY + '" rx="0" ry="0" fill="url(#' + id + 'sg)" stroke="' + ss + '" stroke-width="1.5" vector-effect="non-scaling-stroke" stroke-opacity="0.55"/>' +
                '<ellipse class="surf-hi" cx="' + CX + '" cy="' + CY + '" rx="0" ry="0" fill="url(#' + id + 'sh)" stroke="none"/>' +
            '</g>' +
            '<g clip-path="url(#' + id + 'c)" class="sg-lights">' + lightsSvg + '</g>' +
            '<circle fill="url(#' + id + 'g)" cx="' + CX + '" cy="' + CY + '" r="' + R + '"/>' +
            '<g class="sg-oiml" fill="' + f + '" filter="url(#' + id + 'ts)">' + oimlP + '</g>' +
            '<g class="sg-smart" fill="' + f + '" opacity="0" filter="url(#' + id + 'ts)">' + smartP + '</g>' +
            '</svg>';

        this._svg = this._container.querySelector('svg');
        this._mers = this._svg.querySelectorAll('.mer');
        this._line = this._svg.querySelector('.ctr');
        this._oiml = this._svg.querySelector('.sg-oiml');
        this._smart = this._svg.querySelector('.sg-smart');
        this._volPath = this._svg.querySelector('.vol');
        this._surf = this._svg.querySelector('.surf');
        this._surfHi = this._svg.querySelector('.surf-hi');
        this._lights = this._svg.querySelectorAll('.lt');
        this._clouds = this._svg.querySelectorAll('.cl');
    };

    SpinningGlobe3D.prototype._cache = function() {
        var lrng = makeRng(137 + _counter * 13);
        var crng = makeRng(200 + _counter * 17);
        this._lightPos = [];
        this._lightPhase = [];
        this._cloudPos = [];
        this._cloudPhase = [];

        for (var i = 0; i < N_LIGHTS; i++) {
            this._lightPos.push({ lon: lrng() * Math.PI * 2, lat: (lrng() - 0.5) * 2, sz: 1.8 + lrng() * 2.5 });
            this._lightPhase.push(lrng() * Math.PI * 2);
        }

        for (var i = 0; i < N_CLOUDS; i++) {
            this._cloudPos.push({ lon: crng() * Math.PI * 2, lat: (crng() - 0.5) * 2, sz: 6 + crng() * 16 });
            this._cloudPhase.push(crng() * Math.PI * 2);
        }
    };

    SpinningGlobe3D.prototype._computeTiming = function() {
        var o = this._opts;
        var sc = o.duration / 5.6;

        this._FADE = 1.0 * sc;
        this._SPIN = 0.8 * sc;
        this._FULL = 3.0 * sc;
        this._SPD = o.spinSpeed;

        this._XF0 = 0.4 * sc;
        this._XF1 = 2.4 * sc;

        this._P1 = this._FADE;
        this._P2 = this._P1 + this._SPIN;
        this._P3 = this._P2 + this._FULL;
        this._P4 = this._P3 + this._SPIN;
        this._DUR = this._P4;

        var aSpin = this._SPD * this._SPIN * (1 - 2 / Math.PI);
        var aFull = this._SPD * this._FULL;
        var raw = INITIAL + 2 * aSpin + aFull;
        var unit = Math.PI / N_MER;

        this._SNAP = Math.round((raw - Math.PI / 2) / unit) * unit + Math.PI / 2;
        this._DELTA = this._SNAP - raw;
        this._aSpin = aSpin;
        this._aFull = aFull;
    };

    SpinningGlobe3D.prototype._reset = function() {
        this._spinMers(INITIAL);
        var op = this._textOp(0);
        this._oiml.setAttribute('opacity', op.o.toFixed(2));
        this._smart.setAttribute('opacity', op.s.toFixed(2));
        this._line.setAttribute('opacity', this._opts.mode === 'spinner' ? '0' : '1');
        this._setFillLevel(this._progress);
        for (var i = 0; i < this._lights.length; i++) this._lights[i].setAttribute('opacity', '0');
        for (var i = 0; i < this._clouds.length; i++) this._clouds[i].setAttribute('opacity', '0');
    };

    SpinningGlobe3D.prototype._ease = function(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    };

    SpinningGlobe3D.prototype._xfade = function(ft) {
        if (ft < this._XF0) return { s: 1, d: 0 };
        var p = Math.min((ft - this._XF0) / this._XF1, 1);
        return {
            s: Math.max(0, 1 - this._ease(p)),
            d: Math.min(1, this._ease(Math.max((p - 0.15) / 0.85, 0)))
        };
    };

    SpinningGlobe3D.prototype._computeAngle = function(t) {
        if (this._opts.mode === 'spinner') return INITIAL + this._SPD * t;
        if (t >= this._DUR) return this._SNAP;
        if (t < this._P1) return INITIAL;
        if (t < this._P2) {
            var p = (t - this._P1) / this._SPIN;
            return INITIAL + (p - (2 / Math.PI) * Math.sin(p * Math.PI / 2)) * this._SPD * this._SPIN;
        }
        if (t < this._P3) return INITIAL + this._aSpin + this._SPD * (t - this._P2);
        var u = (t - this._P3) / this._SPIN;
        var raw = u - (2 / Math.PI) * (1 - Math.cos(u * Math.PI / 2));
        var bump = 3 * u * u - 2 * u * u * u;
        return INITIAL + this._aSpin + this._aFull + raw * this._SPD * this._SPIN + this._DELTA * bump;
    };

    SpinningGlobe3D.prototype._textOp = function(t) {
        var m = this._opts.mode;
        if (m === 'spinner') {
            var SH = 4.5, SXF = 1.8, hold = SH - SXF;
            var seg = t % (SH * 2);
            if (seg < hold) return { o: 1, s: 0 };
            if (seg < SH) {
                var p = (seg - hold) / SXF;
                return { o: Math.max(0, 1 - this._ease(p)), s: Math.min(1, this._ease(Math.max((p - 0.15) / 0.85, 0))) };
            }
            if (seg < SH + hold) return { o: 0, s: 1 };
            var p2 = (seg - SH - hold) / SXF;
            return { s: Math.max(0, 1 - this._ease(p2)), o: Math.min(1, this._ease(Math.max((p2 - 0.15) / 0.85, 0))) };
        }
        var fwd = m === 'forward';
        if (t >= this._DUR) return fwd ? { o: 0, s: 1 } : { o: 1, s: 0 };
        if (t < this._P1) {
            var fi = this._ease(t / this._P1);
            return fwd ? { o: fi, s: 0 } : { o: 0, s: fi };
        }
        if (t < this._P2) return fwd ? { o: 1, s: 0 } : { o: 0, s: 1 };
        var cf = this._xfade(t - this._P2);
        return fwd ? { o: cf.s, s: cf.d } : { o: cf.d, s: cf.s };
    };

    SpinningGlobe3D.prototype._lineOp = function(t) {
        if (this._opts.mode === 'spinner') return 0;
        if (t >= this._DUR) return 1;
        if (t < this._P1) return 1;
        if (t < this._P2) return 1 - (t - this._P1) / this._SPIN;
        if (t < this._P3) return 0;
        return (t - this._P3) / this._SPIN;
    };

    SpinningGlobe3D.prototype._setFillLevel = function(pct) {
        pct = Math.max(0, Math.min(1, pct));

        if (pct < 0.005) {
            this._volPath.setAttribute('d', '');
            this._surf.setAttribute('rx', '0');
            this._surf.setAttribute('ry', '0');
            this._surfHi.setAttribute('rx', '0');
            this._surfHi.setAttribute('ry', '0');
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
            this._surfHi.setAttribute('rx', '0');
            this._surfHi.setAttribute('ry', '0');
            return;
        }

        var dx = Math.sqrt(Math.max(0, dxSq));
        var left = CX - dx;
        var right = CX + dx;
        var large = pct > 0.5 ? 1 : 0;

        this._volPath.setAttribute('d',
            'M' + left.toFixed(2) + ',' + y_s.toFixed(2) +
            ' A' + R + ',' + R + ' 0 ' + large + ' 0 ' + right.toFixed(2) + ',' + y_s.toFixed(2) + ' Z');

        var ry = dx * 0.18;
        this._surf.setAttribute('cx', CX.toFixed(2));
        this._surf.setAttribute('cy', y_s.toFixed(2));
        this._surf.setAttribute('rx', dx.toFixed(2));
        this._surf.setAttribute('ry', Math.max(0.1, ry).toFixed(2));

        this._surfHi.setAttribute('cx', CX.toFixed(2));
        this._surfHi.setAttribute('cy', (y_s - ry * 0.5).toFixed(2));
        this._surfHi.setAttribute('rx', (dx * 0.92).toFixed(2));
        this._surfHi.setAttribute('ry', Math.max(0.1, ry * 0.55).toFixed(2));
    };

    SpinningGlobe3D.prototype._fillPct = function(t) {
        if (this._opts.mode === 'spinner') {
            var fillDur = this._opts.fillTime;
            var cycle = t % (fillDur * 2);
            var p = cycle < fillDur ? cycle / fillDur : 1 - (cycle - fillDur) / fillDur;
            return this._ease(p);
        }
        if (t >= this._DUR) return 1;
        if (t < this._P1) return 0;
        return this._ease(Math.min((t - this._P1) / (this._DUR - this._P1), 1));
    };

    SpinningGlobe3D.prototype._updateClouds = function(angle, fillPct, t) {
        var clouds = this._clouds;
        var n = clouds.length;
        var y_s = CY + R * (1 - 2 * fillPct);

        for (var i = 0; i < n; i++) {
            var el = clouds[i];
            var pos = this._cloudPos[i];
            var facing = Math.cos(pos.lon + angle);
            if (facing < 0.1) { el.setAttribute('opacity', '0'); continue; }

            var px = CX + R * Math.cos(pos.lat) * Math.sin(pos.lon + angle);
            var py = CY + R * pos.lat;

            if (py < y_s - pos.sz * 0.3) { el.setAttribute('opacity', '0'); continue; }

            var drift = 0.7 + 0.3 * Math.sin(t * 0.8 + this._cloudPhase[i]);
            var op = facing * drift * 0.7;

            el.setAttribute('cx', px.toFixed(2));
            el.setAttribute('cy', py.toFixed(2));
            el.setAttribute('r', (pos.sz * (0.85 + 0.15 * drift)).toFixed(2));
            el.setAttribute('opacity', Math.max(0, op).toFixed(2));
        }
    };

    SpinningGlobe3D.prototype._updateLights = function(angle, fillPct, t) {
        var lights = this._lights;
        var n = lights.length;
        var baseOp = fillPct > 0.6 ? Math.min(1, (fillPct - 0.6) / 0.3) : 0;

        for (var i = 0; i < n; i++) {
            var el = lights[i];
            var pos = this._lightPos[i];
            var facing = Math.cos(pos.lon + angle);
            if (facing < 0.05) { el.setAttribute('opacity', '0'); continue; }

            var px = CX + R * Math.cos(pos.lat) * Math.sin(pos.lon + angle);
            var py = CY + R * pos.lat;

            var phase = t * (1.5 + (i % 5) * 0.3) + this._lightPhase[i];
            var pulse = 0.5 + 0.5 * Math.sin(phase);
            var op = baseOp * facing * (0.3 + 0.7 * pulse);

            var r = pos.sz * (0.7 + 0.3 * pulse);
            el.setAttribute('cx', px.toFixed(2));
            el.setAttribute('cy', py.toFixed(2));
            el.setAttribute('r', Math.max(0.5, r).toFixed(2));
            el.setAttribute('opacity', Math.max(0, op).toFixed(2));
        }
    };

    SpinningGlobe3D.prototype._spinMers = function(angle) {
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

    SpinningGlobe3D.prototype._tick = function(now) {
        var el = (now - this._start) / 1000;
        if (el > 0) {
            var angle = this._stopped ? this._SNAP : this._computeAngle(el);
            var fillPct = this._fillPct(el);

            if (!this._stopped) {
                this._spinMers(angle);
                var op = this._textOp(el);
                this._oiml.setAttribute('opacity', op.o.toFixed(2));
                this._smart.setAttribute('opacity', op.s.toFixed(2));
                this._setFillLevel(fillPct);
                this._line.setAttribute('opacity', this._lineOp(Math.min(el, this._DUR)).toFixed(2));

                if (this._opts.mode !== 'spinner' && el >= this._DUR) {
                    this._spinMers(this._SNAP);
                    this._stopped = true;
                    this._done = true;
                    if (this._opts.idleAnimation === 'stop') {
                        cancelAnimationFrame(this._raf);
                        this._raf = null;
                        return;
                    }
                }
            }

            var lightAngle = this._stopped ? this._SNAP + (el - this._DUR) * 0.15 : angle;
            this._updateClouds(lightAngle, fillPct, el);
            this._updateLights(lightAngle, fillPct, el);
        }
        this._raf = requestAnimationFrame(this._tick);
    };

    SpinningGlobe3D.prototype.setMode = function(mode) {
        if (this._raf) cancelAnimationFrame(this._raf);
        this._opts.mode = mode;
        this._stopped = false;
        this._done = false;
        this._reset();
        this._start = performance.now() + this._opts.delay;
        this._tick = this._tick.bind(this);
        this._raf = requestAnimationFrame(this._tick);
    };

    SpinningGlobe3D.prototype.setProgress = function(pct) {
        this._progress = Math.max(0, Math.min(1, pct));
        this._setFillLevel(this._progress);
    };

    SpinningGlobe3D.prototype.start = function() {
        this.setMode(this._opts.mode);
    };

    SpinningGlobe3D.prototype.destroy = function() {
        if (this._raf) cancelAnimationFrame(this._raf);
        this._container.innerHTML = '';
    };

    global.SpinningGlobe3D = SpinningGlobe3D;
})(window);
