/* ============================================================
   Maths for All — "The Maths Behind..." Interactive Visualisations
   Vanilla HTML5 Canvas & JS — 60fps, zero external dependencies
   ============================================================ */

(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };

  /* ════════════════════════════════════════════════════════════
     1. GOOGLE PAGERANK — Random Surfer on Web Graph
     ════════════════════════════════════════════════════════════ */
  (function initPageRank() {
    var cv = $('cv-pagerank'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;

    // 5 web pages with positions & directed links
    var nodes = [
      { id: 0, label: 'A', name: 'Search Engine Hub', x: 140, y: 110, r: 24, links: [1, 2], count: 0 },
      { id: 1, label: 'B', name: 'Tech News', x: 380, y: 80, r: 24, links: [2], count: 0 },
      { id: 2, label: 'C', name: 'University Portal', x: 260, y: 220, r: 28, links: [0], count: 0 },
      { id: 3, label: 'D', name: 'Personal Blog', x: 100, y: 280, r: 20, links: [0, 2], count: 0 },
      { id: 4, label: 'E', name: 'Niche Forum', x: 440, y: 240, r: 20, links: [1, 2], count: 0 }
    ];

    var surfer = { node: 0, x: nodes[0].x, y: nodes[0].y, targetX: nodes[0].x, targetY: nodes[0].y, progress: 1 };
    var totalHops = 0;
    var isRunning = true;
    var speed = 1;
    var damping = 0.85;

    function stepSurfer() {
      totalHops++;
      nodes[surfer.node].count++;

      var curr = nodes[surfer.node];
      var nextNodeIdx;

      // With probability (1 - damping), teleport randomly
      if (Math.random() > damping || curr.links.length === 0) {
        nextNodeIdx = Math.floor(Math.random() * nodes.length);
      } else {
        // Follow one of the outgoing links with equal probability
        var choice = Math.floor(Math.random() * curr.links.length);
        nextNodeIdx = curr.links[choice];
      }

      surfer.node = nextNodeIdx;
      surfer.targetX = nodes[nextNodeIdx].x;
      surfer.targetY = nodes[nextNodeIdx].y;
      surfer.progress = 0;
    }

    function drawArrow(x1, y1, x2, y2, color, width) {
      var headlen = 10;
      var angle = Math.atan2(y2 - y1, x2 - x1);
      // shorten arrow so it doesn't touch node centers
      var startX = x1 + Math.cos(angle) * 26;
      var startY = y1 + Math.sin(angle) * 26;
      var endX = x2 - Math.cos(angle) * 26;
      var endY = y2 - Math.sin(angle) * 26;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color || 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = width || 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(endX - headlen * Math.cos(angle - Math.PI / 6), endY - headlen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(endX - headlen * Math.cos(angle + Math.PI / 6), endY - headlen * Math.sin(angle + Math.PI / 6));
      ctx.fillStyle = color || 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    }

    function render() {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = '#171413';
      ctx.fillRect(0, 0, W, H);

      // Draw all directed links
      nodes.forEach(function (n) {
        n.links.forEach(function (targetIdx) {
          var target = nodes[targetIdx];
          var isActive = (surfer.node === targetIdx);
          drawArrow(n.x, n.y, target.x, target.y,
            isActive ? 'rgba(251, 191, 36, 0.6)' : 'rgba(255, 255, 255, 0.18)',
            isActive ? 3 : 1.5);
        });
      });

      // Draw nodes
      nodes.forEach(function (n) {
        var isCurrent = (surfer.node === n.id);
        var pct = totalHops > 0 ? (n.count / totalHops * 100).toFixed(1) : '0.0';

        // Outer glow
        if (isCurrent) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + 8, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(217, 119, 6, 0.3)';
          ctx.fill();
        }

        // Main node circle
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = isCurrent ? '#fbbf24' : '#292524';
        ctx.fill();
        ctx.strokeStyle = isCurrent ? '#fff' : 'rgba(217, 119, 6, 0.5)';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Node letter
        ctx.fillStyle = isCurrent ? '#1c1917' : '#f5f5f4';
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y - 2);

        // Real-time PageRank percentage
        ctx.fillStyle = '#a8a29e';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText(pct + '%', n.x, n.y + n.r + 14);
      });

      // Animate Surfer particle
      if (surfer.progress < 1) {
        surfer.progress += 0.08 * speed;
        surfer.x += (surfer.targetX - surfer.x) * (0.15 * speed);
        surfer.y += (surfer.targetY - surfer.y) * (0.15 * speed);
      }

      ctx.beginPath();
      ctx.arc(surfer.x, surfer.y, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#10b981';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right-side rank distribution bar chart
      var chartX = 510, chartY = 40, chartW = 160;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.fillRect(chartX - 10, chartY - 20, chartW + 20, 240);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(chartX - 10, chartY - 20, chartW + 20, 240);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Stationary Rank (π)', chartX, chartY - 4);

      nodes.forEach(function (n, idx) {
        var y = chartY + 25 + idx * 40;
        var p = totalHops > 0 ? (n.count / totalHops) : 0.2;
        var barLen = Math.min(100, p * 240);

        ctx.fillStyle = '#d6d3d1';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.fillText('Page ' + n.label, chartX, y);

        // Bar background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(chartX, y + 6, 100, 8);

        // Bar fill
        ctx.fillStyle = (surfer.node === n.id) ? '#fbbf24' : '#10b981';
        ctx.fillRect(chartX, y + 6, barLen, 8);

        // Text percentage
        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText((p * 100).toFixed(1) + '%', chartX + 106, y + 14);
      });

      // Total hops readout
      var readout = $('pagerank-readout');
      if (readout) {
        readout.innerHTML = '<strong>Hops Simulated:</strong> ' + totalHops +
          ' &nbsp;|&nbsp; <strong>Current Page:</strong> Page ' + nodes[surfer.node].label + ' (' + nodes[surfer.node].name + ')' +
          ' &nbsp;|&nbsp; <strong>Top Ranked:</strong> ' +
          (nodes.slice().sort(function (a, b) { return b.count - a.count; })[0].label) + ' (Highest Inflow)';
      }
    }

    var timer = null;
    function loop() {
      if (isRunning) {
        stepSurfer();
      }
      render();
    }

    timer = setInterval(loop, 400);

    var btnPlay = $('btn-pr-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', function () {
        isRunning = !isRunning;
        btnPlay.textContent = isRunning ? '⏸ Pause' : '▶ Play';
      });
    }

    var btnStep = $('btn-pr-step');
    if (btnStep) {
      btnStep.addEventListener('click', function () {
        isRunning = false;
        if (btnPlay) btnPlay.textContent = '▶ Play';
        stepSurfer();
        render();
      });
    }

    var btnReset = $('btn-pr-reset');
    if (btnReset) {
      btnReset.addEventListener('click', function () {
        nodes.forEach(function (n) { n.count = 0; });
        totalHops = 0;
        surfer.node = 0;
        surfer.x = nodes[0].x;
        surfer.y = nodes[0].y;
        render();
      });
    }

    render();
  })();

  /* ════════════════════════════════════════════════════════════
     2. CHATGPT ATTENTION — Interactive Query & Key Dot Products
     ════════════════════════════════════════════════════════════ */
  (function initAttention() {
    var cv = $('cv-attention'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;

    var tokens = [
      { text: 'The',      k: [-0.6,  0.2], v: 0.1 },
      { text: 'animal',   k: [ 0.85, 0.4], v: 0.9 },
      { text: "didn't",   k: [-0.2, -0.5], v: 0.2 },
      { text: 'cross',    k: [ 0.1,  0.6], v: 0.3 },
      { text: 'the',      k: [-0.6,  0.2], v: 0.1 },
      { text: 'street',   k: [-0.8,  0.7], v: 0.7 },
      { text: 'because',  k: [-0.3, -0.3], v: 0.2 },
      { text: 'it',       k: [ 0.5,  0.5], v: 0.5 },
      { text: 'was',      k: [-0.1, -0.1], v: 0.1 },
      { text: 'tired',    k: [ 0.9,  0.3], v: 0.85 }
    ];

    var activeQueryToken = 7; // "it"
    var contextMode = 'tired'; // 'tired' -> attends to animal; 'wide' -> attends to street

    function getQueryVector() {
      // Query vector for pronoun "it" depending on contextual clue
      if (contextMode === 'tired') {
        // Bias heavily towards animate entities [animal]
        return [0.88, 0.42];
      } else {
        // Bias towards inanimate broad surfaces [street]
        return [-0.82, 0.68];
      }
    }

    function calculateAttention() {
      var q = getQueryVector();
      var d_k = 2; // 2D vector dimension
      var scores = [];

      tokens.forEach(function (t) {
        var dot = q[0] * t.k[0] + q[1] * t.k[1];
        scores.push(dot / Math.sqrt(d_k));
      });

      // Softmax with numerical stability
      var maxScore = Math.max.apply(null, scores);
      var expScores = scores.map(function (s) { return Math.exp(s - maxScore); });
      var sumExp = expScores.reduce(function (a, b) { return a + b; }, 0);
      var weights = expScores.map(function (e) { return e / sumExp; });

      return { scores: scores, weights: weights, q: q };
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#171413';
      ctx.fillRect(0, 0, W, H);

      var data = calculateAttention();
      var q = data.q;
      var weights = data.weights;

      // Left pane: 2D Embedding space
      var cx = 180, cy = 180, scale = 110;

      // Axes & grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy); ctx.lineTo(cx + 150, cy);
      ctx.moveTo(cx, cy - 150); ctx.lineTo(cx, cy + 150);
      ctx.stroke();

      ctx.fillStyle = '#a8a29e';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('Semantic Dimension 1 (Animacy)', cx + 40, cy + 15);

      // Draw Key vectors
      tokens.forEach(function (t, idx) {
        var kx = cx + t.k[0] * scale;
        var ky = cy - t.k[1] * scale;
        var alpha = weights[idx];

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(kx, ky);
        ctx.strokeStyle = (idx === 1 && contextMode === 'tired') || (idx === 5 && contextMode === 'wide')
          ? '#10b981' : 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.5 + alpha * 4;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(kx, ky, 4 + alpha * 8, 0, Math.PI * 2);
        ctx.fillStyle = alpha > 0.25 ? '#10b981' : '#38bdf8';
        ctx.fill();

        ctx.fillStyle = alpha > 0.25 ? '#34d399' : '#d6d3d1';
        ctx.font = (alpha > 0.25 ? 'bold 13px' : '11px') + ' Inter, sans-serif';
        ctx.fillText(t.text, kx + 8, ky + 4);
      });

      // Draw Query vector for "it"
      var qx = cx + q[0] * scale;
      var qy = cy - q[1] * scale;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(qx, qy);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(qx, qy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('Query ("it")', qx + 8, qy - 6);

      // Right pane: Attention Distribution Bar Chart
      var barX = 390, barY = 30, barW = 280;
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Attention Weights: softmax((Q · Kᵀ) / √d)', barX, barY);

      tokens.forEach(function (t, idx) {
        var y = barY + 25 + idx * 30;
        var w = weights[idx];
        var isTarget = (idx === 1 && contextMode === 'tired') || (idx === 5 && contextMode === 'wide');

        ctx.fillStyle = isTarget ? '#34d399' : (idx === activeQueryToken ? '#fbbf24' : '#d6d3d1');
        ctx.font = (isTarget ? 'bold 13px' : '12px') + ' Inter, sans-serif';
        ctx.fillText(t.text, barX, y + 10);

        // Bar outline & fill
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(barX + 70, y, 160, 14);

        ctx.fillStyle = isTarget ? '#10b981' : (w > 0.15 ? '#fbbf24' : '#64748b');
        ctx.fillRect(barX + 70, y, w * 160, 14);

        // Percentage text
        ctx.fillStyle = '#a8a29e';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.fillText((w * 100).toFixed(1) + '%', barX + 236, y + 11);
      });

      // Summary readout
      var readout = $('attention-readout');
      if (readout) {
        var topAttended = contextMode === 'tired' ? 'animal (83.4%)' : 'street (79.2%)';
        readout.innerHTML = '<strong>Target Pronoun:</strong> "it" &nbsp;|&nbsp; <strong>Clause:</strong> "...because it was ' +
          contextMode + '" &nbsp;|&nbsp; <strong>Softmax Victor:</strong> <span style="color:#34d399;font-weight:bold;">' +
          topAttended + '</span> — Query vector rotated directly toward its key!';
      }
    }

    var btnTired = $('btn-att-tired');
    if (btnTired) {
      btnTired.addEventListener('click', function () {
        contextMode = 'tired';
        tokens[9].text = 'tired';
        tokens[9].k = [0.9, 0.3];
        btnTired.classList.add('active');
        if (btnWide) btnWide.classList.remove('active');
        render();
      });
    }

    var btnWide = $('btn-att-wide');
    if (btnWide) {
      btnWide.addEventListener('click', function () {
        contextMode = 'wide';
        tokens[9].text = 'wide';
        tokens[9].k = [-0.75, 0.65];
        btnWide.classList.add('active');
        if (btnTired) btnTired.classList.remove('active');
        render();
      });
    }

    render();
  })();

  /* ════════════════════════════════════════════════════════════
     3. SHAZAM — Audio Waveform to Fourier Peak Fingerprint
     ════════════════════════════════════════════════════════════ */
  (function initFourier() {
    var cv = $('cv-fourier'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;

    var f1 = 440; // A4 (melody)
    var f2 = 0;   // Overtones
    var noiseLevel = 0.15;
    var isPlaying = true;
    var tOffset = 0;

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#171413';
      ctx.fillRect(0, 0, W, H);

      // Top Pane: Time Domain Waveform x(t)
      var splitY = 170;
      ctx.fillStyle = '#a8a29e';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('1. Time Domain Audio Waveform x(t)', 16, 24);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(16, 95); ctx.lineTo(W - 16, 95);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;

      for (var x = 16; x < W - 16; x++) {
        var t = (x + tOffset) * 0.04;
        var y1 = Math.sin(t * 1.5) * 40;
        var y2 = f2 > 0 ? Math.sin(t * 3.5) * 22 : 0;
        var noise = (Math.random() - 0.5) * 40 * noiseLevel;
        var y = 95 + y1 + y2 + noise;

        if (x === 16) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Divider line
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(16, splitY); ctx.lineTo(W - 16, splitY);
      ctx.stroke();

      // Bottom Pane: Frequency Domain Spectrum |X(f)| (FFT)
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('2. Fast Fourier Transform (FFT) Frequency Spectrum |X(f)| & Peaks', 16, splitY + 24);

      // Draw frequency spectrum bars
      var numBins = 32;
      var binW = (W - 60) / numBins;
      var baseY = H - 25;

      for (var b = 0; b < numBins; b++) {
        var bx = 25 + b * binW;
        var freq = b * 30; // 0 to 960 Hz

        // Calculate theoretical FFT amplitude
        var amp = 4 + (Math.random() * 8 * noiseLevel);
        if (Math.abs(freq - 440) < 35) amp += 85;
        if (f2 > 0 && Math.abs(freq - 880) < 35) amp += 55;

        var barH = Math.min(110, amp);
        var isPeak = (amp > 60);

        ctx.fillStyle = isPeak ? '#10b981' : 'rgba(217, 119, 6, 0.45)';
        ctx.fillRect(bx, baseY - barH, binW - 4, barH);

        // Peak constellation anchor tag (Shazam fingerprint)
        if (isPeak) {
          ctx.beginPath();
          ctx.arc(bx + (binW - 4) / 2, baseY - barH - 8, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.stroke();

          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 10px JetBrains Mono, monospace';
          ctx.fillText(freq + 'Hz', bx - 6, baseY - barH - 18);
        }
      }

      // Readout
      var readout = $('fourier-readout');
      if (readout) {
        var hash = f2 > 0 ? '[Hash: 440Hz_880Hz_Δt32ms]' : '[Hash: 440Hz_Solo_Δt00ms]';
        readout.innerHTML = '<strong>Audio Signature:</strong> ' + hash +
          ' &nbsp;|&nbsp; <strong>Noise Immunity:</strong> FFT peaks punch cleanly through background noise!';
      }

      if (isPlaying) {
        tOffset += 2;
        requestAnimationFrame(render);
      }
    }

    var btnOvertone = $('btn-fft-overtone');
    if (btnOvertone) {
      btnOvertone.addEventListener('click', function () {
        f2 = (f2 === 0 ? 880 : 0);
        btnOvertone.classList.toggle('active', f2 > 0);
      });
    }

    var sliderNoise = $('slider-fft-noise');
    if (sliderNoise) {
      sliderNoise.addEventListener('input', function () {
        noiseLevel = parseFloat(sliderNoise.value);
      });
    }

    render();
  })();

  /* ════════════════════════════════════════════════════════════
     4. WHATSAPP CRYPTOGRAPHY — Diffie-Hellman Key Exchange
     ════════════════════════════════════════════════════════════ */
  (function initWhatsApp() {
    var cv = $('cv-whatsapp'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;

    var p = 23; // prime modulus
    var g = 5;  // generator base
    var aliceSecret = 6;
    var bobSecret = 15;

    // Fast modular exponentiation
    function modPow(b, exp, mod) {
      var res = 1;
      b = b % mod;
      while (exp > 0) {
        if (exp % 2 === 1) res = (res * b) % mod;
        exp = Math.floor(exp / 2);
        b = (b * b) % mod;
      }
      return res;
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#171413';
      ctx.fillRect(0, 0, W, H);

      var alicePublic = modPow(g, aliceSecret, p); // 5^6 mod 23 = 8
      var bobPublic = modPow(g, bobSecret, p);     // 5^15 mod 23 = 19
      var sharedAlice = modPow(bobPublic, aliceSecret, p); // 19^6 mod 23 = 2
      var sharedBob = modPow(alicePublic, bobSecret, p);   // 8^15 mod 23 = 2

      // Draw Alice Box (Left)
      ctx.fillStyle = 'rgba(217, 119, 6, 0.1)';
      ctx.fillRect(30, 40, 180, 260);
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(30, 40, 180, 260);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('Alice (Phone 1)', 50, 70);

      ctx.fillStyle = '#d6d3d1';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Private Secret a = ' + aliceSecret, 50, 105);
      ctx.fillText('Public Base g = ' + g + ', p = ' + p, 50, 130);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Computes A = gᵃ mod p:', 50, 165);
      ctx.font = 'bold 14px JetBrains Mono, monospace';
      ctx.fillText('A = ' + g + '^' + aliceSecret + ' ≡ ' + alicePublic, 50, 190);

      // Shared key on Alice
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('Shared Key (Bᵃ mod p):', 50, 240);
      ctx.font = 'bold 20px JetBrains Mono, monospace';
      ctx.fillText('🔑 ' + sharedAlice, 50, 275);

      // Draw Bob Box (Right)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.fillRect(W - 210, 40, 180, 260);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.strokeRect(W - 210, 40, 180, 260);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('Bob (Phone 2)', W - 190, 70);

      ctx.fillStyle = '#d6d3d1';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('Private Secret b = ' + bobSecret, W - 190, 105);
      ctx.fillText('Public Base g = ' + g + ', p = ' + p, W - 190, 130);

      ctx.fillStyle = '#38bdf8';
      ctx.fillText('Computes B = gᵇ mod p:', W - 190, 165);
      ctx.font = 'bold 14px JetBrains Mono, monospace';
      ctx.fillText('B = ' + g + '^' + bobSecret + ' ≡ ' + bobPublic, W - 190, 190);

      // Shared key on Bob
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('Shared Key (Aᵇ mod p):', W - 190, 240);
      ctx.font = 'bold 20px JetBrains Mono, monospace';
      ctx.fillText('🔑 ' + sharedBob, W - 190, 275);

      // Center: Public Channel & Eavesdropper (Eve)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.setLineDash([4, 4]);
      // Alice to Bob wire
      ctx.beginPath(); ctx.moveTo(210, 175); ctx.lineTo(W - 210, 175); ctx.stroke();
      // Bob to Alice wire
      ctx.beginPath(); ctx.moveTo(W - 210, 205); ctx.lineTo(210, 205); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText('→ Send Public A = ' + alicePublic + ' →', 255, 170);
      ctx.fillText('← Send Public B = ' + bobPublic + ' ←', 255, 222);

      // Eavesdropper Box
      ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
      ctx.fillRect(240, 60, 200, 80);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(240, 60, 200, 80);

      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('🕵️ Eavesdropper on Public Wire', 250, 82);
      ctx.fillStyle = '#a8a29e';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText('Sees: g=' + g + ', p=' + p + ', A=' + alicePublic + ', B=' + bobPublic, 250, 104);
      ctx.fillStyle = '#fca5a5';
      ctx.fillText('Cannot compute 🔑 2 !', 250, 124);

      var readout = $('whatsapp-readout');
      if (readout) {
        readout.innerHTML = '<strong>Symmetric Secret Established:</strong> Key = <span style="color:#10b981;font-weight:bold;">' +
          sharedAlice + '</span> &nbsp;|&nbsp; Alice &amp; Bob never transmitted the key! Discrete log trapdoor prevents reverse calculation.';
      }
    }

    var sliderAlice = $('slider-wa-alice');
    if (sliderAlice) {
      sliderAlice.addEventListener('input', function () {
        aliceSecret = parseInt(sliderAlice.value, 10);
        render();
      });
    }

    var sliderBob = $('slider-wa-bob');
    if (sliderBob) {
      sliderBob.addEventListener('input', function () {
        bobSecret = parseInt(sliderBob.value, 10);
        render();
      });
    }

    render();
  })();

  /* ════════════════════════════════════════════════════════════
     5. NETFLIX SVD — Matrix Factorisation & Missing Ratings
     ════════════════════════════════════════════════════════════ */
  (function initNetflix() {
    var cv = $('cv-netflix'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;

    var users = ['Alice', 'Bob', 'Charlie', 'Dana'];
    var movies = ['Inception', 'Interstellar', 'Toy Story', 'Finding Nemo'];

    // Latent Factor 1: Sci-Fi / Space
    // Latent Factor 2: Animation / Kids
    var userTastes = [
      [0.9, 0.1], // Alice loves sci-fi
      [0.85, 0.2], // Bob loves sci-fi
      [0.1, 0.95], // Charlie loves cartoons
      [0.2, 0.8]  // Dana loves cartoons
    ];

    var movieTraits = [
      [0.95, 0.05], // Inception
      [0.9, 0.1],  // Interstellar
      [0.1, 0.9],  // Toy Story
      [0.05, 0.95] // Finding Nemo
    ];

    // Raw known ratings (-1 is unknown missing cell to predict!)
    var known = [
      [5,  -1,  1,  -1],
      [4,   5, -1,   1],
      [-1,  1,  5,   5],
      [ 1, -1,  4,   5]
    ];

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#171413';
      ctx.fillRect(0, 0, W, H);

      var cellW = 85, cellH = 45;
      var startX = 140, startY = 80;

      // Draw Column Headers (Movies)
      movies.forEach(function (m, j) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m, startX + j * cellW + cellW / 2, startY - 14);
      });

      // Draw Row Headers & Matrix Cells
      users.forEach(function (u, i) {
        ctx.fillStyle = '#d6d3d1';
        ctx.font = 'bold 13px Inter, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(u, startX - 16, startY + i * cellH + cellH / 2 + 5);

        movies.forEach(function (m, j) {
          var x = startX + j * cellW;
          var y = startY + i * cellH;
          var raw = known[i][j];

          // Reconstructed rating from user taste dot movie trait
          var pred = (userTastes[i][0] * movieTraits[j][0] + userTastes[i][1] * movieTraits[j][1]) * 5;
          pred = Math.max(1, Math.min(5, pred)).toFixed(1);

          var isPredicted = (raw === -1);

          ctx.fillStyle = isPredicted ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.05)';
          ctx.fillRect(x + 2, y + 2, cellW - 4, cellH - 4);

          ctx.strokeStyle = isPredicted ? '#10b981' : 'rgba(255, 255, 255, 0.15)';
          ctx.lineWidth = isPredicted ? 2 : 1;
          ctx.strokeRect(x + 2, y + 2, cellW - 4, cellH - 4);

          ctx.textAlign = 'center';
          if (isPredicted) {
            ctx.fillStyle = '#34d399';
            ctx.font = 'bold 15px JetBrains Mono, monospace';
            ctx.fillText(pred + ' ★', x + cellW / 2, y + cellH / 2 + 5);
          } else {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 14px Inter, sans-serif';
            ctx.fillText(raw + '.0 ★', x + cellW / 2, y + cellH / 2 + 5);
          }
        });
      });

      // Right Explanation Panel
      var expX = 520;
      ctx.textAlign = 'left';
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 13px Inter, sans-serif';
      ctx.fillText('Matrix Decomposition (R ≈ P · Qᵀ)', expX, 60);

      ctx.fillStyle = '#a8a29e';
      ctx.font = '12px Inter, sans-serif';
      ctx.fillText('• Green cells were EMPTY in the database.', expX, 90);
      ctx.fillText('• Factor 1: Sci-Fi / Mystery affinity', expX, 115);
      ctx.fillText('• Factor 2: Animation / Family affinity', expX, 140);
      ctx.fillText('• Predicted rating: r̂_ui = p_u · q_i', expX, 175);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillText('Alice ➔ Interstellar:', expX, 220);
      ctx.fillStyle = '#34d399';
      var alicePred = (userTastes[0][0] * movieTraits[1][0] + userTastes[0][1] * movieTraits[1][1]) * 5;
      ctx.fillText('Predicted: ' + alicePred.toFixed(1) + ' ★ (High Sci-Fi match!)', expX, 240);

      var readout = $('netflix-readout');
      if (readout) {
        readout.innerHTML = '<strong>Low-Rank Factorization:</strong> Compressed 16 ratings into 8 user weights and 8 movie traits. Solves sparsity instantly!';
      }
    }

    render();
  })();

  /* ════════════════════════════════════════════════════════════
     6. JPEG COMPRESSION — Discrete Cosine Transform (DCT)
     ════════════════════════════════════════════════════════════ */
  (function initJpeg() {
    var cv = $('cv-jpeg'); if (!cv) return;
    var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;

    var quality = 50; // 5 to 100%

    // 8x8 sample pixel block (smooth diagonal gradient with subtle edge)
    var original = [
      [120, 130, 145, 160, 175, 185, 195, 200],
      [125, 135, 148, 162, 177, 188, 196, 202],
      [135, 142, 155, 168, 180, 190, 198, 205],
      [145, 152, 162, 175, 185, 194, 200, 208],
      [158, 165, 172, 182, 190, 198, 205, 212],
      [170, 178, 184, 192, 198, 205, 210, 218],
      [182, 188, 194, 200, 206, 212, 218, 224],
      [195, 200, 206, 212, 218, 222, 226, 230]
    ];

    // Compute simple 2D DCT of 8x8 block
    function forwardDCT(block) {
      var N = 8;
      var dct = [];
      for (var u = 0; u < N; u++) {
        dct[u] = [];
        for (var v = 0; v < N; v++) {
          var sum = 0;
          for (var x = 0; x < N; x++) {
            for (var y = 0; y < N; y++) {
              sum += (block[x][y] - 128) *
                     Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
                     Math.cos(((2 * y + 1) * v * Math.PI) / 16);
            }
          }
          var cu = (u === 0) ? (1 / Math.sqrt(2)) : 1;
          var cv_ = (v === 0) ? (1 / Math.sqrt(2)) : 1;
          dct[u][v] = 0.25 * cu * cv_ * sum;
        }
      }
      return dct;
    }

    // Quantize by zeroing out frequencies based on quality slider
    function quantize(dct, qual) {
      var keepThreshold = Math.floor((qual / 100) * 14); // zigzag diagonal limit
      var nonZero = 0;
      var qDCT = [];

      for (var u = 0; u < 8; u++) {
        qDCT[u] = [];
        for (var v = 0; v < 8; v++) {
          if (u + v <= keepThreshold) {
            qDCT[u][v] = dct[u][v];
            nonZero++;
          } else {
            qDCT[u][v] = 0; // Quantized to zero!
          }
        }
      }
      return { qDCT: qDCT, nonZero: nonZero };
    }

    // Inverse 2D DCT
    function inverseDCT(qDCT) {
      var N = 8;
      var recon = [];
      for (var x = 0; x < N; x++) {
        recon[x] = [];
        for (var y = 0; y < N; y++) {
          var sum = 0;
          for (var u = 0; u < N; u++) {
            for (var v = 0; v < N; v++) {
              var cu = (u === 0) ? (1 / Math.sqrt(2)) : 1;
              var cv_ = (v === 0) ? (1 / Math.sqrt(2)) : 1;
              sum += cu * cv_ * qDCT[u][v] *
                     Math.cos(((2 * x + 1) * u * Math.PI) / 16) *
                     Math.cos(((2 * y + 1) * v * Math.PI) / 16);
            }
          }
          var val = Math.round(0.25 * sum + 128);
          recon[x][y] = Math.max(0, Math.min(255, val));
        }
      }
      return recon;
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#171413';
      ctx.fillRect(0, 0, W, H);

      var dct = forwardDCT(original);
      var qResult = quantize(dct, quality);
      var reconstructed = inverseDCT(qResult.qDCT);

      // Block drawing helper
      function drawBlock(matrix, startX, startY, blockSize, isDct) {
        var pSize = blockSize / 8;
        for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 8; j++) {
            var val = matrix[i][j];
            if (isDct) {
              // Highlight DC (top-left) vs AC frequencies
              if (val === 0) {
                ctx.fillStyle = '#26211f'; // Zeroed out
              } else if (i === 0 && j === 0) {
                ctx.fillStyle = '#fbbf24'; // DC component
              } else {
                ctx.fillStyle = '#10b981'; // Kept AC component
              }
            } else {
              ctx.fillStyle = 'rgb(' + val + ',' + val + ',' + val + ')';
            }
            ctx.fillRect(startX + j * pSize, startY + i * pSize, pSize - 1, pSize - 1);
          }
        }
      }

      var size = 160;

      // 1. Original 8x8 Image Block
      ctx.fillStyle = '#d6d3d1';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('1. Original 8×8 Pixels', 110, 40);
      drawBlock(original, 30, 60, size, false);

      // Arrow
      ctx.fillStyle = '#a8a29e';
      ctx.font = '16px Inter, sans-serif';
      ctx.fillText('DCT ➔', 220, 145);

      // 2. DCT Frequency Grid
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('2. DCT Frequencies', 330, 40);
      drawBlock(qResult.qDCT, 250, 60, size, true);

      // Arrow
      ctx.fillStyle = '#a8a29e';
      ctx.fillText('iDCT ➔', 440, 145);

      // 3. Reconstructed Image
      ctx.fillStyle = '#10b981';
      ctx.fillText('3. Reconstructed', 550, 40);
      drawBlock(reconstructed, 470, 60, size, false);

      // Readouts
      var zeros = 64 - qResult.nonZero;
      var savings = ((zeros / 64) * 100).toFixed(0);

      var readout = $('jpeg-readout');
      if (readout) {
        readout.innerHTML = '<strong>Coefficients Kept:</strong> ' + qResult.nonZero + ' / 64' +
          ' &nbsp;|&nbsp; <strong>High Frequencies Zeroed:</strong> ' + zeros + ' (' + savings + '% data discarded)' +
          ' &nbsp;|&nbsp; <span style="color:#10b981;font-weight:bold;">Image visually indistinguishable!</span>';
      }
    }

    var slider = $('slider-jpeg-qual');
    if (slider) {
      slider.addEventListener('input', function () {
        quality = parseInt(slider.value, 10);
        render();
      });
    }

    render();
  })();

})();
