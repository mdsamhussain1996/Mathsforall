/* ============================================================
   Maths for All — Discrete Maths interactive visualisations
   One self-contained IIFE per chapter. Each exits quietly if its
   DOM nodes are missing, so the file is safe to include anywhere.
   ============================================================ */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var AMBER = '#fbbf24', AMBER_D = '#d97706', TEAL = '#34d399', TEAL_D = '#10b981',
      BG = '#171413', INK = '#e7e5e4', DIM = '#a8a29e', RED = '#fca5a5', PURPLE = '#a78bfa';
  function esc(s) { return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }

  /* ════════════════════════════════════════════════════════════
     CH 1 — TRUTH-TABLE GENERATOR (safe recursive-descent parser; no eval)
     ════════════════════════════════════════════════════════════ */
  (function truthTable() {
    var input = $('tt-input'); if (!input) return;
    var wrap = $('tt-table'), verdict = $('tt-verdict');

    function tokenize(src) {
      var s = src.replace(/<=>/g, '↔').replace(/<->/g, '↔').replace(/=>/g, '→').replace(/->/g, '→')
                 .replace(/&&/g, '∧').replace(/\|\|/g, '∨').replace(/[&]/g, '∧').replace(/[|]/g, '∨')
                 .replace(/[!~]/g, '¬').replace(/\^/g, '⊕');
      var out = [], i = 0, m;
      while (i < s.length) {
        var ch = s[i];
        if (/\s/.test(ch)) { i++; continue; }
        if ('¬∧∨⊕→↔()'.indexOf(ch) >= 0) { out.push({ k: ch }); i++; continue; }
        if ((m = /^[A-Za-z01]+/.exec(s.slice(i)))) {
          var w = m[0], lw = w.toLowerCase();
          if (lw === 'and') out.push({ k: '∧' });
          else if (lw === 'or') out.push({ k: '∨' });
          else if (lw === 'not') out.push({ k: '¬' });
          else if (lw === 'xor') out.push({ k: '⊕' });
          else if (w === 'T' || lw === 'true' || w === '1') out.push({ k: 'c', v: true });
          else if (w === 'F' || lw === 'false' || w === '0') out.push({ k: 'c', v: false });
          else if (/^[a-z]$/.test(w)) out.push({ k: 'v', n: w });
          else throw new Error('Unknown word “' + w + '” (use single lowercase letters for variables)');
          i += w.length; continue;
        }
        throw new Error('Unexpected character “' + ch + '”');
      }
      return out;
    }

    function parse(src) {
      var t = tokenize(src), p = 0;
      function peek() { return t[p] && t[p].k; }
      function eat(k) { if (peek() !== k) throw new Error('Expected ' + k); p++; }
      function iff() { var l = imp(); while (peek() === '↔') { p++; l = { t: 'b', op: '↔', l: l, r: imp() }; } return l; }
      function imp() { var l = or(); if (peek() === '→') { p++; return { t: 'b', op: '→', l: l, r: imp() }; } return l; }
      function or() { var l = xor(); while (peek() === '∨') { p++; l = { t: 'b', op: '∨', l: l, r: xor() }; } return l; }
      function xor() { var l = and(); while (peek() === '⊕') { p++; l = { t: 'b', op: '⊕', l: l, r: and() }; } return l; }
      function and() { var l = not(); while (peek() === '∧') { p++; l = { t: 'b', op: '∧', l: l, r: not() }; } return l; }
      function not() { if (peek() === '¬') { p++; return { t: 'n', a: not() }; } return atom(); }
      function atom() {
        var k = peek();
        if (k === 'v') return { t: 'v', n: t[p++].n };
        if (k === 'c') return { t: 'c', v: t[p++].v };
        if (k === '(') { p++; var e = iff(); eat(')'); return e; }
        throw new Error(k ? 'Unexpected ' + k : 'Expression ended early');
      }
      if (!t.length) throw new Error('Type an expression, e.g.  p -> q');
      var tree = iff();
      if (p < t.length) throw new Error('Unexpected ' + t[p].k);
      return tree;
    }
    function vars(n, set) {
      if (n.t === 'v') set[n.n] = 1; else if (n.t === 'n') vars(n.a, set); else if (n.t === 'b') { vars(n.l, set); vars(n.r, set); }
      return set;
    }
    function ev(n, env) {
      switch (n.t) {
        case 'v': return env[n.n];
        case 'c': return n.v;
        case 'n': return !ev(n.a, env);
        default:
          var a = ev(n.l, env), b = ev(n.r, env);
          return n.op === '∧' ? a && b : n.op === '∨' ? a || b : n.op === '⊕' ? a !== b : n.op === '→' ? (!a || b) : a === b;
      }
    }
    function cell(v) { return '<td class="' + (v ? 't' : 'f') + '">' + (v ? 'T' : 'F') + '</td>'; }

    function run() {
      try {
        var raw = input.value, parts = raw.split(/==|≡/);
        var trees = parts.map(parse);
        if (trees.length > 2) throw new Error('Use at most one “==” to compare two formulas');
        var set = {}; trees.forEach(function (tr) { vars(tr, set); });
        var names = Object.keys(set).sort();
        if (names.length > 6) throw new Error('Up to 6 variables, please (that is already 64 rows!)');
        var rows = 1 << names.length, html = '<table class="dm-table"><thead><tr>', trueCount = 0, same = true, diff = [];
        names.forEach(function (n) { html += '<th>' + n + '</th>'; });
        html += trees.length === 2 ? '<th>left</th><th>right</th>' : '<th>' + esc(raw.trim()) + '</th>';
        html += '</tr></thead><tbody>';
        for (var r = 0; r < rows; r++) {
          var env = {};
          html += '<tr>';
          names.forEach(function (n, i) { var v = !!(r & (1 << (names.length - 1 - i))); env[n] = v; html += cell(v); });
          var vals = trees.map(function (tr) { return ev(tr, env); });
          vals.forEach(function (v) { html += cell(v); });
          html += '</tr>';
          if (vals[0]) trueCount++;
          if (vals.length === 2 && vals[0] !== vals[1]) { same = false; diff.push(r + 1); }
        }
        wrap.innerHTML = html + '</tbody></table>';
        if (trees.length === 2) {
          verdict.className = 'dm-verdict ' + (same ? 'ok' : 'warn');
          verdict.textContent = same ? '✔ Logically equivalent — the two columns match in all ' + rows + ' rows.'
                                     : '✘ Not equivalent — they differ in row' + (diff.length > 1 ? 's ' : ' ') + diff.join(', ') + '.';
        } else if (trueCount === rows) { verdict.className = 'dm-verdict ok'; verdict.textContent = '✔ Tautology — true in every row.'; }
        else if (trueCount === 0) { verdict.className = 'dm-verdict err'; verdict.textContent = '✘ Contradiction — false in every row.'; }
        else { verdict.className = 'dm-verdict warn'; verdict.textContent = 'Contingent — true in ' + trueCount + ' of ' + rows + ' rows.'; }
      } catch (e) {
        wrap.innerHTML = ''; verdict.className = 'dm-verdict err'; verdict.textContent = '⚠ ' + e.message;
      }
    }
    input.addEventListener('input', run);
    document.querySelectorAll('[data-tt-preset]').forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.getAttribute('data-tt-preset'); run(); });
    });
    run();
  })();

  /* ════════════════════════════════════════════════════════════
     CH 2 — VENN DIAGRAM PLAYGROUND (click elements to move them)
     ════════════════════════════════════════════════════════════ */
  (function venn() {
    var cv = $('canvas-sets'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height, N = 10;
    var A = { x: 225, y: 180, r: 120 }, B = { x: 375, y: 180, r: 120 };
    var st = [1, 1, 1, 2, 2, 2, 3, 3, 0, 0];           // 0 none · 1 A only · 2 both · 3 A∩B... (B only = 3)
    var op = 'union', pos = [];
    var OPS = {
      union: { f: function (c) { return c !== 0; }, name: 'A ∪ B' },
      inter: { f: function (c) { return c === 2; }, name: 'A ∩ B' },
      amb: { f: function (c) { return c === 1; }, name: 'A ∖ B' },
      bma: { f: function (c) { return c === 3; }, name: 'B ∖ A' },
      sym: { f: function (c) { return c === 1 || c === 3; }, name: 'A △ B' },
      comp: { f: function (c) { return c === 0 || c === 3; }, name: 'Aᶜ' }
    };
    function inC(c, x, y, m) { return Math.hypot(x - c.x, y - c.y) < c.r - (m || 0); }
    function outC(c, x, y, m) { return Math.hypot(x - c.x, y - c.y) > c.r + (m || 0); }

    var slots = { 0: [], 1: [], 2: [], 3: [] }, anchors = { 0: [48, 40], 1: [175, 180], 2: [300, 180], 3: [425, 180] };
    for (var i = -12; i <= 12; i++) for (var j = -9; j <= 9; j++) {
      var x = 300 + 26 * i, y = 180 + 26 * j; if (x < 20 || x > W - 20 || y < 20 || y > H - 20) continue;
      var code = null;
      if (inC(A, x, y, 14) && outC(B, x, y, 14)) code = 1;
      else if (inC(A, x, y, 14) && inC(B, x, y, 14)) code = 2;
      else if (inC(B, x, y, 14) && outC(A, x, y, 14)) code = 3;
      else if (outC(A, x, y, 14) && outC(B, x, y, 14)) code = 0;
      if (code !== null) slots[code].push({ x: x, y: y });
    }
    Object.keys(slots).forEach(function (k) {
      var a = anchors[k]; slots[k].sort(function (p, q) { return Math.hypot(p.x - a[0], p.y - a[1]) - Math.hypot(q.x - a[0], q.y - a[1]); });
    });

    var shade = document.createElement('canvas'); shade.width = W; shade.height = H;
    function buildShade() {
      var sc = shade.getContext('2d'), img = sc.createImageData(W, H), f = OPS[op].f;
      for (var y = 0; y < H; y++) for (var x = 0; x < W; x++) {
        var a = Math.hypot(x - A.x, y - A.y) < A.r, b = Math.hypot(x - B.x, y - B.y) < B.r;
        var c = a ? (b ? 2 : 1) : (b ? 3 : 0);
        if (f(c)) { var k = (y * W + x) * 4; img.data[k] = 251; img.data[k + 1] = 191; img.data[k + 2] = 36; img.data[k + 3] = 70; }
      }
      sc.putImageData(img, 0, 0);
    }
    function layout() {
      var used = { 0: 0, 1: 0, 2: 0, 3: 0 };
      for (var e = 0; e < N; e++) { var c = st[e]; pos[e] = slots[c][used[c]++] || { x: -50, y: -50 }; }
    }
    function members() {
      var a = [], b = [], r = [], f = OPS[op].f;
      st.forEach(function (c, e) { if (c === 1 || c === 2) a.push(e + 1); if (c === 2 || c === 3) b.push(e + 1); if (f(c)) r.push(e + 1); });
      return { a: a, b: b, r: r };
    }
    function draw() {
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5; ctx.strokeRect(8, 8, W - 16, H - 16);
      ctx.fillStyle = DIM; ctx.font = '600 13px Inter, sans-serif'; ctx.fillText('U', 18, 28);
      ctx.drawImage(shade, 0, 0);
      [[A, 'A', AMBER], [B, 'B', TEAL]].forEach(function (s) {
        ctx.beginPath(); ctx.arc(s[0].x, s[0].y, s[0].r, 0, 6.2832); ctx.lineWidth = 3; ctx.strokeStyle = s[2]; ctx.stroke();
        ctx.fillStyle = s[2]; ctx.font = '700 20px Inter, sans-serif'; ctx.fillText(s[1], s[0].x + (s[1] === 'A' ? -s[0].r + 6 : s[0].r - 26), s[0].y - s[0].r + 26);
      });
      var f = OPS[op].f;
      for (var e = 0; e < N; e++) {
        var p = pos[e], hot = f(st[e]);
        ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, 6.2832);
        ctx.fillStyle = hot ? AMBER : '#292524'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = hot ? '#fde68a' : 'rgba(255,255,255,0.35)'; ctx.stroke();
        ctx.fillStyle = hot ? '#1c1917' : INK; ctx.font = '700 12px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(e + 1, p.x, p.y + 0.5); ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
      }
    }
    function readout() {
      var m = members(), set = function (a) { return '{' + a.join(', ') + '}'; };
      var inter = m.a.filter(function (x) { return m.b.indexOf(x) >= 0; }).length;
      $('readout-sets').innerHTML = 'A = ' + set(m.a) + ' &nbsp; B = ' + set(m.b) + '<br><b>' + OPS[op].name + ' = ' + set(m.r) + '</b> &nbsp;·&nbsp; |A∪B| = |A| + |B| − |A∩B| → ' +
        (m.a.length + m.b.length - inter) + ' = ' + m.a.length + ' + ' + m.b.length + ' − ' + inter;
    }
    function refresh() { layout(); draw(); readout(); }
    document.querySelectorAll('[data-set-op]').forEach(function (b) {
      b.addEventListener('click', function () {
        op = b.getAttribute('data-set-op');
        document.querySelectorAll('[data-set-op]').forEach(function (x) { x.classList.toggle('active', x === b); });
        buildShade(); refresh();
      });
    });
    var rnd = $('sets-random');
    if (rnd) rnd.addEventListener('click', function () { st = st.map(function () { return Math.floor(Math.random() * 4); }); refresh(); });
    cv.style.cursor = 'pointer';
    cv.addEventListener('click', function (ev) {
      var rect = cv.getBoundingClientRect(), x = (ev.clientX - rect.left) * W / rect.width, y = (ev.clientY - rect.top) * H / rect.height;
      for (var e = 0; e < N; e++) if (Math.hypot(x - pos[e].x, y - pos[e].y) < 16) { st[e] = (st[e] + 1) % 4; refresh(); return; }
    });
    buildShade(); refresh();
  })();

  /* ════════════════════════════════════════════════════════════
     CH 3 — PIGEONHOLE SIMULATOR (+ birthday-style collision odds)
     ════════════════════════════════════════════════════════════ */
  (function pigeon() {
    var cv = $('canvas-pigeon'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    var sn = $('pg-n'), sk = $('pg-k'), assign = [], birds = [], raf = null;

    function fmt(x) { return x >= 1e9 ? x.toExponential(2) : String(Math.round(x)); }
    function holeBox(h, k) {
      var perRow = Math.min(k, 6), rows = Math.ceil(k / perRow), gap = 12;
      var bw = Math.min(84, (W - 40 - gap * (perRow - 1)) / perRow), bh = Math.min(150, (H - 130 - gap * (rows - 1)) / rows);
      var row = Math.floor(h / perRow), col = h % perRow, inRow = Math.min(perRow, k - row * perRow);
      var left = (W - (inRow * bw + (inRow - 1) * gap)) / 2;
      return { x: left + col * (bw + gap), y: 120 + row * (bh + gap), w: bw, h: bh };
    }
    function target(i, n, k) {
      var h = assign[i], box = holeBox(h, k), idx = 0;
      for (var j = 0; j < i; j++) if (assign[j] === h) idx++;
      var perLine = Math.max(1, Math.floor((box.w - 8) / 20));
      return { x: box.x + 14 + (idx % perLine) * 20, y: box.y + box.h - 16 - Math.floor(idx / perLine) * 20 };
    }
    function reassign(mode) {
      var n = +sn.value, k = +sk.value; assign = [];
      for (var i = 0; i < n; i++) assign.push(mode === 'spread' ? i % k : Math.floor(Math.random() * k));
      for (i = 0; i < n; i++) {
        var t = target(i, n, k), b = birds[i] || { x: 30 + i * ((W - 60) / Math.max(n, 1)), y: 40 };
        if (!birds[i]) birds[i] = b; else { b.x = 30 + i * ((W - 60) / Math.max(n, 1)); b.y = 40; }
        b.tx = t.x; b.ty = t.y; b.delay = i * 3;
      }
      birds.length = n; kick();
    }
    function retarget() { var n = +sn.value, k = +sk.value; for (var i = 0; i < n; i++) { if (assign[i] === undefined || assign[i] >= k) assign[i] = Math.floor(Math.random() * k); } assign.length = n; reassign('keep'); }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function tick() {
      var moving = false;
      birds.forEach(function (b) {
        if (b.delay > 0) { b.delay--; moving = true; return; }
        var dx = b.tx - b.x, dy = b.ty - b.y;
        if (Math.abs(dx) + Math.abs(dy) > 0.6) { b.x += dx * 0.16; b.y += dy * 0.16; moving = true; } else { b.x = b.tx; b.y = b.ty; }
      });
      draw(); raf = moving ? requestAnimationFrame(tick) : null;
    }
    function draw() {
      var n = +sn.value, k = +sk.value, cnt = []; for (var h = 0; h < k; h++) cnt[h] = 0; assign.forEach(function (a) { cnt[a]++; });
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = DIM; ctx.font = '600 12px Inter, sans-serif'; ctx.fillText('pigeons (n = ' + n + ')', 14, 20);
      for (h = 0; h < k; h++) {
        var b = holeBox(h, k), crowded = cnt[h] >= 2;
        ctx.fillStyle = crowded ? 'rgba(251,191,36,0.16)' : 'rgba(255,255,255,0.04)'; ctx.fillRect(b.x, b.y, b.w, b.h);
        ctx.strokeStyle = crowded ? AMBER : 'rgba(255,255,255,0.3)'; ctx.lineWidth = crowded ? 2.5 : 1.5; ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = crowded ? AMBER : DIM; ctx.font = '600 11px Inter, sans-serif'; ctx.fillText('hole ' + (h + 1) + (cnt[h] ? ' · ' + cnt[h] : ''), b.x + 6, b.y + 14);
      }
      birds.forEach(function (bd, i) {
        ctx.beginPath(); ctx.arc(bd.x, bd.y, 7.5, 0, 6.2832);
        ctx.fillStyle = cnt[assign[i]] >= 2 ? AMBER : TEAL; ctx.fill(); ctx.strokeStyle = '#1c1917'; ctx.lineWidth = 1.5; ctx.stroke();
      });
      var max = Math.max.apply(null, cnt.concat([0])), guaranteed = Math.ceil(n / k);
      var total = Math.pow(k, n), inj = 1; for (var q = 0; q < n; q++) inj *= Math.max(0, k - q);
      $('readout-pigeon').innerHTML = '<b>⌈n/k⌉ = ' + guaranteed + '</b> — some hole <em>must</em> hold ≥ ' + guaranteed + ' (here the fullest holds ' + max + '). ' +
        (n > k ? '<span style="color:#fde68a">n &gt; k ⇒ a collision is forced!</span>' : 'n ≤ k ⇒ no collision is forced.') +
        '<br>Assignments kⁿ = ' + fmt(total) + ' · collision-free P(k,n) = ' + fmt(inj) + ' · P(no collision) = ' + (inj / total * 100).toFixed(1) + '%';
    }
    function onSlide() { $('pg-n-val').textContent = sn.value; $('pg-k-val').textContent = sk.value; retarget(); }
    sn.addEventListener('input', onSlide); sk.addEventListener('input', onSlide);
    $('pg-random').addEventListener('click', function () { reassign('random'); });
    $('pg-spread').addEventListener('click', function () { reassign('spread'); });
    reassign('random');
  })();

  /* ════════════════════════════════════════════════════════════
     CH 4 — RECURRENCE EXPLORER  T(n) = a·T(n/b) + n^d
     ════════════════════════════════════════════════════════════ */
  (function recurrence() {
    var cv = $('canvas-recur'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    var sa = $('rc-a'), sb = $('rc-b'), sd = $('rc-d');
    function compute() {
      var a = +sa.value, b = +sb.value, d = +sd.value, K = Math.floor(Math.log(4096) / Math.log(b)), T = [1];
      for (var k = 1; k <= K; k++) T[k] = a * T[k - 1] + Math.pow(Math.pow(b, k), d);
      return { a: a, b: b, d: d, K: K, T: T };
    }
    function draw() {
      var s = compute(), c = Math.log(s.a) / Math.log(s.b), eps = 1e-9;
      var cas = c > s.d + eps ? 1 : (Math.abs(c - s.d) < eps ? 2 : 3);
      var pred = function (k) { var n = Math.pow(s.b, k); return cas === 1 ? Math.pow(n, c) : cas === 2 ? Math.pow(n, s.d) * (k + 1) : Math.pow(n, s.d); };
      var L = 52, Rr = W - 16, Tp = 18, Bt = H - 38;
      var lx = function (k) { return L + (Rr - L) * k / s.K; };
      var ys = [], k;
      for (k = 0; k <= s.K; k++) { ys.push(Math.log2(s.T[k])); ys.push(c * k * Math.log2(s.b)); ys.push(s.d * k * Math.log2(s.b)); }
      var ymax = Math.max.apply(null, ys) * 1.08 + 0.5;
      var ly = function (v) { return Bt - (Bt - Tp) * v / ymax; };
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(255,255,255,0.08)'; ctx.fillStyle = DIM; ctx.font = '11px Inter, sans-serif'; ctx.lineWidth = 1;
      var step = ymax > 40 ? 10 : 5;
      for (var v = 0; v <= ymax; v += step) { ctx.beginPath(); ctx.moveTo(L, ly(v)); ctx.lineTo(Rr, ly(v)); ctx.stroke(); ctx.fillText('2^' + v, 8, ly(v) + 4); }
      for (k = 0; k <= s.K; k++) { ctx.fillText(Math.round(Math.pow(s.b, k)), lx(k) - 8, H - 20); }
      ctx.fillText('n  (log scale)', W / 2 - 30, H - 5);
      function line(fn, col, dash, w) {
        ctx.beginPath(); ctx.setLineDash(dash || []); ctx.strokeStyle = col; ctx.lineWidth = w || 2;
        for (var i = 0; i <= s.K; i++) { var y = ly(fn(i)); if (i === 0) ctx.moveTo(lx(i), y); else ctx.lineTo(lx(i), y); }
        ctx.stroke(); ctx.setLineDash([]);
      }
      line(function (i) { return s.d * i * Math.log2(s.b); }, PURPLE, [6, 5], 1.8);
      line(function (i) { return c * i * Math.log2(s.b); }, TEAL, [2, 5], 2);
      line(function (i) { return Math.log2(s.T[i]); }, AMBER, null, 3);
      for (k = 0; k <= s.K; k++) { ctx.beginPath(); ctx.arc(lx(k), ly(Math.log2(s.T[k])), 3.5, 0, 6.2832); ctx.fillStyle = AMBER; ctx.fill(); }
      ctx.font = '600 12px Inter, sans-serif';
      ctx.fillStyle = AMBER; ctx.fillText('— T(n)', L + 8, Tp + 10);
      ctx.fillStyle = TEAL; ctx.fillText('··· n^(log_b a) = n^' + c.toFixed(2), L + 70, Tp + 10);
      ctx.fillStyle = PURPLE; ctx.fillText('- - f(n) = n^' + s.d, L + 250, Tp + 10);

      var names = { 1: 'Case 1 (leaves dominate): T(n) = Θ(n^' + c.toFixed(2) + ')',
                    2: 'Case 2 (balanced): T(n) = Θ(n^' + s.d + ' · log n)',
                    3: 'Case 3 (root dominates): T(n) = Θ(n^' + s.d + ')' };
      var r1 = s.T[s.K - 1] / pred(s.K - 1), r2 = s.T[s.K] / pred(s.K);
      $('readout-recur').innerHTML = '<b>T(n) = ' + s.a + '·T(n/' + s.b + ') + n^' + s.d + '</b> &nbsp;|&nbsp; log_' + s.b + ' ' + s.a + ' = ' + c.toFixed(3) + ' vs d = ' + s.d +
        '<br>' + names[cas] + '<br>T(n) ÷ prediction: ' + r1.toFixed(2) + ' → ' + r2.toFixed(2) + ' <span style="opacity:.8">(levelling off ⇒ the bound is tight)</span>';
    }
    [sa, sb, sd].forEach(function (el) {
      el.addEventListener('input', function () { $(el.id + '-val').textContent = el.value; draw(); });
    });
    document.querySelectorAll('[data-rc]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var p = btn.getAttribute('data-rc').split(',');
        sa.value = p[0]; sb.value = p[1]; sd.value = p[2];
        [sa, sb, sd].forEach(function (el) { $(el.id + '-val').textContent = el.value; });
        draw();
      });
    });
    draw();
  })();

  /* ════════════════════════════════════════════════════════════
     CH 5 — ANIMATED BFS / DFS
     ════════════════════════════════════════════════════════════ */
  (function graphs() {
    var cv = $('canvas-graph'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
    var P = { A: [70, 170], B: [190, 80], C: [190, 265], D: [320, 45], E: [320, 150], F: [320, 285], G: [450, 235], H: [480, 105] };
    var E = [['A', 'B'], ['A', 'C'], ['B', 'D'], ['B', 'E'], ['C', 'F'], ['D', 'H'], ['E', 'H'], ['F', 'G'], ['G', 'H'], ['E', 'F']];
    var adj = {}; Object.keys(P).forEach(function (n) { adj[n] = []; });
    E.forEach(function (e) { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    Object.keys(adj).forEach(function (n) { adj[n].sort(); });
    var mode = 'bfs', steps = [], idx = 0, timer = null;

    function simulate(m, s) {
      var out = [], seen = {}, order = [], tree = [];
      out.push({ cur: null, front: [s], seen: [], order: [], tree: [], note: 'Start: put ' + s + ' in the ' + (m === 'bfs' ? 'queue' : 'stack') + '.' });
      if (m === 'bfs') {
        var q = [s], disc = {}; disc[s] = 1;
        while (q.length) {
          var u = q.shift(); seen[u] = 1; order.push(u);
          adj[u].forEach(function (v) { if (!disc[v]) { disc[v] = 1; q.push(v); tree.push([u, v]); } });
          out.push({ cur: u, front: q.slice(), seen: Object.keys(seen), order: order.slice(), tree: tree.slice(), note: 'Dequeue ' + u + ', enqueue its unseen neighbours.' });
        }
      } else {
        var stack = [[s, null]];
        while (stack.length) {
          var top = stack.pop(), x = top[0];
          if (seen[x]) continue;
          seen[x] = 1; order.push(x); if (top[1]) tree.push([top[1], x]);
          adj[x].slice().reverse().forEach(function (v) { if (!seen[v]) stack.push([v, x]); });
          out.push({ cur: x, front: stack.map(function (t) { return t[0]; }), seen: Object.keys(seen), order: order.slice(), tree: tree.slice(), note: 'Pop ' + x + ', push its unseen neighbours (dive deeper!).' });
        }
      }
      return out;
    }
    function isTree(tr, a, b) { return tr.some(function (t) { return (t[0] === a && t[1] === b) || (t[0] === b && t[1] === a); }); }
    function draw() {
      var s = steps[idx];
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      E.forEach(function (e) {
        var t = isTree(s.tree, e[0], e[1]); ctx.beginPath(); ctx.moveTo(P[e[0]][0], P[e[0]][1]); ctx.lineTo(P[e[1]][0], P[e[1]][1]);
        ctx.strokeStyle = t ? TEAL_D : 'rgba(255,255,255,0.18)'; ctx.lineWidth = t ? 4 : 1.6; ctx.stroke();
      });
      Object.keys(P).forEach(function (n) {
        var cur = s.cur === n, seen = s.seen.indexOf(n) >= 0, fr = s.front.indexOf(n) >= 0;
        ctx.beginPath(); ctx.arc(P[n][0], P[n][1], cur ? 24 : 20, 0, 6.2832);
        ctx.fillStyle = cur ? TEAL : seen ? '#0f766e' : fr ? 'rgba(251,191,36,0.3)' : '#292524'; ctx.fill();
        ctx.lineWidth = 2.5; ctx.strokeStyle = cur ? '#a7f3d0' : fr ? AMBER : 'rgba(255,255,255,0.4)'; ctx.stroke();
        ctx.fillStyle = cur ? '#052e1f' : INK; ctx.font = '700 16px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n, P[n][0], P[n][1] + 1);
      });
      ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
      var dist = mode === 'bfs' ? '' : '';
      ctx.fillStyle = DIM; ctx.font = '600 12px Inter, sans-serif';
      ctx.fillText(mode === 'bfs' ? 'QUEUE (front → back)' : 'STACK (top → bottom)', 16, H - 52);
      var items = mode === 'bfs' ? s.front : s.front.slice().reverse();
      items.slice(0, 12).forEach(function (n, i) {
        ctx.fillStyle = 'rgba(251,191,36,0.25)'; ctx.fillRect(16 + i * 36, H - 42, 32, 28); ctx.strokeStyle = AMBER; ctx.lineWidth = 1.5; ctx.strokeRect(16 + i * 36, H - 42, 32, 28);
        ctx.fillStyle = INK; ctx.font = '700 14px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(n, 32 + i * 36, H - 23); ctx.textAlign = 'start';
      });
      $('readout-graph').innerHTML = '<b>Visit order:</b> ' + (s.order.join(' → ') || '—') + ' &nbsp;|&nbsp; ' + s.note + (idx === steps.length - 1 ? ' <b style="color:#6ee7b7">✔ Done</b>' : '');
    }
    function rebuild() { stop(); steps = simulate(mode, $('graph-start').value); idx = 0; draw(); }
    function next() { if (idx < steps.length - 1) { idx++; draw(); return true; } return false; }
    function stop() { if (timer) { clearInterval(timer); timer = null; $('graph-play').textContent = '▶ Auto-play'; } }
    $('graph-step').addEventListener('click', function () { stop(); next(); });
    $('graph-reset').addEventListener('click', rebuild);
    $('graph-start').addEventListener('change', rebuild);
    $('graph-play').addEventListener('click', function () {
      if (timer) { stop(); return; }
      if (idx === steps.length - 1) { idx = 0; draw(); }
      $('graph-play').textContent = '⏸ Pause';
      timer = setInterval(function () { if (!next()) stop(); }, 800);
    });
    document.querySelectorAll('[data-graph-mode]').forEach(function (b) {
      b.addEventListener('click', function () {
        mode = b.getAttribute('data-graph-mode');
        document.querySelectorAll('[data-graph-mode]').forEach(function (x) { x.classList.toggle('active', x === b); });
        rebuild();
      });
    });
    rebuild();
  })();

  /* ════════════════════════════════════════════════════════════
     CH 6 — MODULAR CLOCK  (+ RSA toy with BigInt)
     ════════════════════════════════════════════════════════════ */
  (function modClock() {
    var cv = $('canvas-clock'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height, CX = W / 2, CY = H / 2 + 4, R = 138;
    var sm = $('mc-m'), sa = $('mc-a'), sb = $('mc-b'), op = '+', hand = 0, trail = [], anim = null;

    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    function egcd(a, b) { if (!b) return [a, 1, 0]; var r = egcd(b, a % b); return [r[0], r[2], r[1] - Math.floor(a / b) * r[2]]; }
    function ang(v, m) { return -Math.PI / 2 + 2 * Math.PI * v / m; }
    function draw(angle) {
      var m = +sm.value;
      ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
      ctx.beginPath(); ctx.arc(CX, CY, R + 14, 0, 6.2832); ctx.fillStyle = '#211d1b'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(217,119,6,0.55)'; ctx.stroke();
      for (var i = 0; i < m; i++) {
        var a = ang(i, m), x = CX + Math.cos(a) * R, y = CY + Math.sin(a) * R, on = i === hand;
        ctx.beginPath(); ctx.arc(x, y, m > 16 ? 11 : 14, 0, 6.2832); ctx.fillStyle = on ? AMBER : '#292524'; ctx.fill();
        ctx.lineWidth = 1.5; ctx.strokeStyle = on ? '#fde68a' : 'rgba(255,255,255,0.3)'; ctx.stroke();
        ctx.fillStyle = on ? '#1c1917' : INK; ctx.font = '700 ' + (m > 16 ? 10 : 12) + 'px Inter, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(i, x, y + 0.5);
      }
      trail.forEach(function (t, k) {
        var a0 = ang(t[0], m), a1 = ang(t[1], m), r = R - 28 - k * 7; if (r < 22) return;
        ctx.beginPath(); ctx.arc(CX, CY, r, a0, a1 > a0 ? a1 : a1 + 6.2832); ctx.strokeStyle = k % 2 ? TEAL : AMBER; ctx.lineWidth = 3; ctx.stroke();
      });
      ctx.beginPath(); ctx.moveTo(CX, CY); ctx.lineTo(CX + Math.cos(angle) * (R - 24), CY + Math.sin(angle) * (R - 24));
      ctx.strokeStyle = TEAL; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.stroke(); ctx.lineCap = 'butt';
      ctx.beginPath(); ctx.arc(CX, CY, 6, 0, 6.2832); ctx.fillStyle = TEAL; ctx.fill();
      ctx.textAlign = 'start'; ctx.textBaseline = 'alphabetic';
    }
    function readout() {
      var m = +sm.value, a = +sa.value, b = +sb.value, g = gcd(a, m), res = op === '+' ? (a + b) % m : (a * b) % m;
      var eq = op === '+' ? a + ' + ' + b + ' = ' + (a + b) : a + ' × ' + b + ' = ' + (a * b);
      var inv = '';
      if (g === 1 && m > 1) { var e = egcd(a % m, m); inv = ' · <span style="color:#6ee7b7">' + a + ' is invertible: ' + a + '⁻¹ ≡ ' + (((e[1] % m) + m) % m) + '</span>'; }
      else inv = ' · <span style="color:#fca5a5">gcd(' + a + ',' + m + ') = ' + g + ' ≠ 1 → no inverse</span>';
      $('readout-clock').innerHTML = '<b>' + eq + ' ≡ ' + res + ' (mod ' + m + ')</b>' + inv;
    }
    function jumps() {
      var m = +sm.value, a = +sa.value % m, b = +sb.value, list = [], cur = 0;
      if (op === '+') { list.push([0, a]); list.push([a, (a + b) % m]); }
      else for (var i = 0; i < b; i++) { var n = (cur + a) % m; list.push([cur, n]); cur = n; }
      return list;
    }
    function play() {
      if (anim) cancelAnimationFrame(anim);
      var m = +sm.value, list = jumps(), i = 0, t0 = null; hand = 0; trail = [];
      if (!list.length) { draw(ang(0, m)); return; }
      function frame(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / 600), seg = list[i], from = ang(seg[0], m), to = ang(seg[1], m);
        if (to < from) to += 2 * Math.PI; if (seg[0] === seg[1]) to = from;
        var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        draw(from + (to - from) * e);
        if (p < 1) { anim = requestAnimationFrame(frame); return; }
        hand = seg[1]; trail.push(seg); i++; t0 = null;
        if (i < list.length) anim = requestAnimationFrame(frame); else { anim = null; draw(ang(hand, m)); }
      }
      anim = requestAnimationFrame(frame);
    }
    function sync() {
      var m = +sm.value; sa.max = m * 3; if (+sa.value > sa.max) sa.value = sa.max;
      $('mc-m-val').textContent = sm.value; $('mc-a-val').textContent = sa.value; $('mc-b-val').textContent = sb.value;
      readout(); play();
    }
    [sm, sa, sb].forEach(function (el) { el.addEventListener('input', sync); });
    document.querySelectorAll('[data-mc-op]').forEach(function (b) {
      b.addEventListener('click', function () {
        op = b.getAttribute('data-mc-op');
        document.querySelectorAll('[data-mc-op]').forEach(function (x) { x.classList.toggle('active', x === b); });
        sync();
      });
    });
    $('mc-replay').addEventListener('click', play);
    sync();

    /* ── RSA toy (BigInt) ── */
    var rb = $('rsa-run'); if (!rb) return;
    function isPrime(n) { if (n < 2n) return false; for (var i = 2n; i * i <= n; i++) if (n % i === 0n) return false; return true; }
    function modpow(b, e, m) { var r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = r * b % m; b = b * b % m; e >>= 1n; } return r; }
    function egcdB(a, b) { if (b === 0n) return [a, 1n, 0n]; var r = egcdB(b, a % b); return [r[0], r[2], r[1] - (a / b) * r[2]]; }
    function rsa() {
      var out = $('rsa-out');
      try {
        var p = BigInt($('rsa-p').value), q = BigInt($('rsa-q').value), e = BigInt($('rsa-e').value), m = BigInt($('rsa-m').value);
        if (!isPrime(p) || !isPrime(q)) throw new Error('p and q must both be prime.');
        if (p === q) throw new Error('p and q must be different primes.');
        var n = p * q, phi = (p - 1n) * (q - 1n);
        if (e <= 1n || e >= phi || egcdB(e, phi)[0] !== 1n) throw new Error('e must satisfy 1 < e < φ(n) and gcd(e, φ(n)) = 1  (here φ = ' + phi + ').');
        if (m < 0n || m >= n) throw new Error('Message must satisfy 0 ≤ m < n = ' + n + '.');
        var d = ((egcdB(e, phi)[1] % phi) + phi) % phi, c = modpow(m, e, n), back = modpow(c, d, n);
        out.className = 'dm-verdict ok';
        out.innerHTML = 'n = p·q = <b>' + n + '</b> &nbsp; φ(n) = (p−1)(q−1) = <b>' + phi + '</b><br>Public key (n, e) = (' + n + ', ' + e + ') &nbsp;·&nbsp; Private d = e⁻¹ mod φ = <b>' + d +
          '</b><br>Encrypt: c = m<sup>e</sup> mod n = ' + m + '<sup>' + e + '</sup> mod ' + n + ' = <b>' + c + '</b><br>Decrypt: c<sup>d</sup> mod n = <b>' + back + '</b> ' + (back === m ? '✔ matches the message' : '✘');
      } catch (err) { out.className = 'dm-verdict err'; out.textContent = '⚠ ' + (err.message || 'Enter whole numbers.'); }
    }
    rb.addEventListener('click', rsa); rsa();
  })();
})();
