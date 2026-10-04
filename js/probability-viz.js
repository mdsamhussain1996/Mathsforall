/* ============================================================
   Maths for All — Interactive Visualizations: PROBABILITY & STATISTICS
   Course: probability-statistics.html (8 Interactive Canvas Labs)
   Author: Dr. Md Samshad Hussain Ansari
   ============================================================ */
(function () {
  'use strict';

  // Responsive Canvas Helper with Retina support
  function setupCanvas(canvas) {
    if (!canvas) return null;
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    var width = rect.width || 600;
    var height = rect.height || 360;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx: ctx, width: width, height: height, dpr: dpr };
  }

  // Generic Lazy Loader using IntersectionObserver
  function observeLab(containerId, initFn) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!('IntersectionObserver' in window)) {
      initFn();
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          initFn();
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '100px' });
    observer.observe(container);
  }

  /* ============================================================
     LAB 1: Birthday Paradox & Hash Collision Explorer
     ============================================================ */
  function initLab1() {
    var canvas = document.getElementById('prob-lab1-canvas');
    var sliderK = document.getElementById('lab1-k-slider');
    var valK = document.getElementById('lab1-k-val');
    var selectN = document.getElementById('lab1-n-select');
    var btnSim = document.getElementById('lab1-sim-btn');
    var hudProb = document.getElementById('lab1-hud-prob');
    var hudSim = document.getElementById('lab1-hud-sim');
    var hudPairs = document.getElementById('lab1-hud-pairs');

    if (!canvas || !sliderK) return;

    var empSimRate = null;
    var simTrials = 1000;

    function getTheory(k, N) {
      if (k <= 1) return 0;
      if (k > N) return 1;
      var logNoCollision = 0;
      for (var i = 0; i < k; i++) {
        logNoCollision += Math.log(1 - i / N);
      }
      return 1 - Math.exp(logNoCollision);
    }

    function runMonteCarlo() {
      var k = parseInt(sliderK.value, 10);
      var N = parseInt(selectN.value, 10);
      var collisions = 0;

      for (var t = 0; t < simTrials; t++) {
        var seen = new Set();
        var hasCol = false;
        for (var i = 0; i < k; i++) {
          var slot = Math.floor(Math.random() * N);
          if (seen.has(slot)) {
            hasCol = true;
            break;
          }
          seen.add(slot);
        }
        if (hasCol) collisions++;
      }
      empSimRate = collisions / simTrials;
      draw();
    }

    function draw() {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      var k = parseInt(sliderK.value, 10);
      var N = parseInt(selectN.value, 10);
      valK.textContent = k;

      var pTheory = getTheory(k, N);
      var pairs = (k * (k - 1)) / 2;

      hudProb.textContent = (pTheory * 100).toFixed(2) + '%';
      hudPairs.textContent = pairs.toLocaleString();
      if (empSimRate !== null) {
        hudSim.textContent = (empSimRate * 100).toFixed(1) + '% (1,000 trials)';
      } else {
        hudSim.textContent = 'Click "Run Simulation"';
      }

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      // Plot margins
      var padL = 55, padR = 30, padT = 30, padB = 45;
      var pw = W - padL - padR;
      var ph = H - padT - padB;

      // Draw Grid & Axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var yVal = 0; yVal <= 1; yVal += 0.25) {
        var py = padT + ph * (1 - yVal);
        ctx.moveTo(padL, py);
        ctx.lineTo(W - padR, py);
      }
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#a8a29e';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      for (var yV = 0; yV <= 1; yV += 0.25) {
        var yPos = padT + ph * (1 - yV);
        ctx.fillText((yV * 100).toFixed(0) + '%', padL - 10, yPos);
      }

      // 50% Threshold line
      var py50 = padT + ph * 0.5;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padL, py50);
      ctx.lineTo(W - padR, py50);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#fbbf24';
      ctx.textAlign = 'right';
      ctx.fillText('50% Collision Boundary', W - padR - 8, py50 - 8);

      // Max k on plot
      var maxK = Math.min(100, N);

      // Draw Theoretical Curve
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (var curK = 1; curK <= maxK; curK++) {
        var px = padL + (curK / maxK) * pw;
        var pVal = getTheory(curK, N);
        var pCurY = padT + ph * (1 - pVal);
        if (curK === 1) ctx.moveTo(px, pCurY);
        else ctx.lineTo(px, pCurY);
      }
      ctx.stroke();

      // Draw X axis ticks
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillStyle = '#a8a29e';
      for (var xK = 10; xK <= maxK; xK += (maxK <= 50 ? 10 : 20)) {
        var xTick = padL + (xK / maxK) * pw;
        ctx.fillText(xK, xTick, padT + ph + 8);
      }
      ctx.fillText('Number of items / people (k)', padL + pw / 2, padT + ph + 26);

      // Current point highlight
      var currX = padL + (k / maxK) * pw;
      var currY = padT + ph * (1 - pTheory);

      // Dropline to X and Y
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(currX, padT + ph);
      ctx.lineTo(currX, currY);
      ctx.lineTo(padL, currY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Point circle
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(currX, currY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Tooltip label at point
      ctx.fillStyle = '#f5f5f4';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = currX > W - 140 ? 'right' : 'left';
      ctx.fillText('k = ' + k + ': ' + (pTheory * 100).toFixed(1) + '%', currX > W - 140 ? currX - 12 : currX + 12, currY - 6);

      // Draw Empirical Point if simulated
      if (empSimRate !== null) {
        var empY = padT + ph * (1 - empSimRate);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(currX, empY, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = '11px JetBrains Mono, monospace';
        ctx.textAlign = currX > W - 140 ? 'right' : 'left';
        ctx.fillText('Monte Carlo: ' + (empSimRate * 100).toFixed(1) + '%', currX > W - 140 ? currX - 12 : currX + 12, empY + 14);
      }
    }

    sliderK.addEventListener('input', function () {
      empSimRate = null;
      draw();
    });
    selectN.addEventListener('change', function () {
      empSimRate = null;
      draw();
    });
    btnSim.addEventListener('click', runMonteCarlo);
    window.addEventListener('resize', draw);
    draw();
  }

  /* ============================================================
     LAB 2: Bayes' Theorem & Diagnostic Tree Lab
     ============================================================ */
  function initLab2() {
    var canvas = document.getElementById('prob-lab2-canvas');
    var sliderPrior = document.getElementById('lab2-prior-slider');
    var sliderSens = document.getElementById('lab2-sens-slider');
    var sliderSpec = document.getElementById('lab2-spec-slider');
    var valPrior = document.getElementById('lab2-prior-val');
    var valSens = document.getElementById('lab2-sens-val');
    var valSpec = document.getElementById('lab2-spec-val');

    var hudPosterior = document.getElementById('lab2-hud-posterior');
    var hudTp = document.getElementById('lab2-hud-tp');
    var hudFp = document.getElementById('lab2-hud-fp');

    if (!canvas || !sliderPrior) return;

    function draw() {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      var prior = parseFloat(sliderPrior.value) / 1000; // 1 to 200 per 1000 => 0.001 to 0.20
      var sens = parseFloat(sliderSens.value) / 100;    // 70% to 99.9%
      var spec = parseFloat(sliderSpec.value) / 100;    // 70% to 99.9%

      valPrior.textContent = (prior * 100).toFixed(2) + '% (1 in ' + Math.round(1 / prior) + ')';
      valSens.textContent = (sens * 100).toFixed(1) + '%';
      valSpec.textContent = (spec * 100).toFixed(1) + '%';

      // 10,000 population breakdown
      var totalPop = 10000;
      var sickCount = totalPop * prior;
      var healthyCount = totalPop * (1 - prior);

      var truePositives = sickCount * sens;
      var falseNegatives = sickCount * (1 - sens);
      var falsePositives = healthyCount * (1 - spec);
      var trueNegatives = healthyCount * spec;

      var totalPositiveTests = truePositives + falsePositives;
      var posterior = totalPositiveTests > 0 ? (truePositives / totalPositiveTests) : 0;

      hudPosterior.textContent = (posterior * 100).toFixed(2) + '%';
      hudTp.textContent = Math.round(truePositives).toLocaleString() + ' people';
      hudFp.textContent = Math.round(falsePositives).toLocaleString() + ' people';

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      // Split canvas: Left side is Bayes Probability Tree, Right side is Population Grid / Bar Breakdown
      var leftW = Math.min(300, W * 0.48);
      var rightX = leftW + 20;
      var rightW = W - rightX - 20;

      // ── LEFT: Bayes Tree ──
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#f5f5f4';
      ctx.textAlign = 'left';
      ctx.fillText('Bayesian Probability Tree', 15, 25);

      var startX = 25, startY = H / 2;
      var node1X = 110, node1Y_top = H * 0.25, node1Y_bot = H * 0.75;
      var node2X = 230;

      // Root to Disease/Healthy branches
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(node1X, node1Y_top);
      ctx.stroke();

      ctx.strokeStyle = '#a8a29e';
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(node1X, node1Y_bot);
      ctx.stroke();

      // Branch 1: Sick (Prior)
      ctx.fillStyle = '#c4b5fd';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('P(H) = ' + (prior * 100).toFixed(1) + '%', (startX + node1X) / 2, node1Y_top - 6);
      ctx.fillText('P(¬H) = ' + ((1 - prior) * 100).toFixed(1) + '%', (startX + node1X) / 2, node1Y_bot + 16);

      // Nodes
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath(); ctx.arc(node1X, node1Y_top, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#44403c';
      ctx.beginPath(); ctx.arc(node1X, node1Y_bot, 6, 0, Math.PI * 2); ctx.fill();

      // Sub-branches from Sick
      // Sick -> Positive
      ctx.strokeStyle = '#10b981';
      ctx.beginPath(); ctx.moveTo(node1X, node1Y_top); ctx.lineTo(node2X, node1Y_top - 35); ctx.stroke();
      // Sick -> Negative
      ctx.strokeStyle = '#f59e0b';
      ctx.beginPath(); ctx.moveTo(node1X, node1Y_top); ctx.lineTo(node2X, node1Y_top + 35); ctx.stroke();

      // Sub-branches from Healthy
      // Healthy -> Positive (False positive)
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath(); ctx.moveTo(node1X, node1Y_bot); ctx.lineTo(node2X, node1Y_bot - 35); ctx.stroke();
      // Healthy -> Negative
      ctx.strokeStyle = '#6b7280';
      ctx.beginPath(); ctx.moveTo(node1X, node1Y_bot); ctx.lineTo(node2X, node1Y_bot + 35); ctx.stroke();

      // Sub-labels
      ctx.font = '9px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#10b981';
      ctx.fillText('True Pos: ' + Math.round(truePositives), node2X + 6, node1Y_top - 32);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText('False Neg: ' + Math.round(falseNegatives), node2X + 6, node1Y_top + 38);

      ctx.fillStyle = '#ef4444';
      ctx.fillText('False Pos: ' + Math.round(falsePositives), node2X + 6, node1Y_bot - 32);
      ctx.fillStyle = '#9ca3af';
      ctx.fillText('True Neg: ' + Math.round(trueNegatives), node2X + 6, node1Y_bot + 38);

      // ── RIGHT: Visual Confusion Proportion Bar ──
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#f5f5f4';
      ctx.fillText('Given a Positive Test Result:', rightX, 25);

      var boxY = 48;
      var boxH = 40;
      var barW = rightW;

      var tpRatio = totalPositiveTests > 0 ? (truePositives / totalPositiveTests) : 0;
      var fpRatio = totalPositiveTests > 0 ? (falsePositives / totalPositiveTests) : 0;

      // Draw stacked comparison bar of positive tests
      var tpBarW = barW * tpRatio;
      var fpBarW = barW * fpRatio;

      ctx.fillStyle = '#10b981'; // Green: TP
      ctx.fillRect(rightX, boxY, tpBarW, boxH);
      ctx.fillStyle = '#ef4444'; // Red: FP
      ctx.fillRect(rightX + tpBarW, boxY, fpBarW, boxH);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.strokeRect(rightX, boxY, barW, boxH);

      // Labels below bar
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = '#10b981';
      ctx.textAlign = 'left';
      ctx.fillText('■ True Positives (' + (tpRatio * 100).toFixed(1) + '%)', rightX, boxY + boxH + 18);

      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'right';
      ctx.fillText('False Positives (' + (fpRatio * 100).toFixed(1) + '%) ■', rightX + barW, boxY + boxH + 18);

      // Large Posterior Gauge Card
      var gaugeY = boxY + boxH + 45;
      var gaugeH = H - gaugeY - 15;
      ctx.fillStyle = 'rgba(41, 37, 36, 0.85)';
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(rightX, gaugeY, barW, gaugeH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#a8a29e';
      ctx.font = '11px Inter, sans-serif';
      ctx.fillText('Posterior Probability P(Sick | Positive Test)', rightX + barW / 2, gaugeY + 22);

      ctx.fillStyle = posterior > 0.5 ? '#10b981' : '#f59e0b';
      ctx.font = 'bold 24px JetBrains Mono, monospace';
      ctx.fillText((posterior * 100).toFixed(1) + '%', rightX + barW / 2, gaugeY + 54);

      ctx.fillStyle = '#d6d3d1';
      ctx.font = '11px Inter, sans-serif';
      var insight = posterior < 0.5
        ? 'Base rate fallacy in action: Despite >90% test accuracy, a positive test means only ' + (posterior * 100).toFixed(1) + '% chance of sickness because the disease is rare.'
        : 'High prevalence or extreme specificity shifts posterior probability above 50%.';
      wrapText(ctx, insight, rightX + 12, gaugeY + 76, barW - 24, 15);
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      var words = text.split(' ');
      var line = '';
      for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';
        var metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    }

    sliderPrior.addEventListener('input', draw);
    sliderSens.addEventListener('input', draw);
    sliderSpec.addEventListener('input', draw);
    window.addEventListener('resize', draw);
    draw();
  }

  /* ============================================================
     LAB 3: Randomized Quicksort Comparisons & Concentration Lab
     ============================================================ */
  function initLab3() {
    var canvas = document.getElementById('prob-lab3-canvas');
    var sliderN = document.getElementById('lab3-n-slider');
    var valN = document.getElementById('lab3-n-val');
    var btnSort = document.getElementById('lab3-sort-btn');
    var btnSim = document.getElementById('lab3-sim-btn');

    var hudComps = document.getElementById('lab3-hud-comps');
    var hudTheory = document.getElementById('lab3-hud-theory');
    var hudWorst = document.getElementById('lab3-hud-worst');

    if (!canvas || !sliderN) return;

    var runStats = []; // record of comparisons from multiple runs

    function simulateQuicksort(arr) {
      var comps = 0;
      function qsort(sub) {
        if (sub.length <= 1) return sub;
        var pIdx = Math.floor(Math.random() * sub.length);
        var pivot = sub[pIdx];
        var left = [], right = [];
        for (var i = 0; i < sub.length; i++) {
          if (i === pIdx) continue;
          comps++;
          if (sub[i] < pivot) left.push(sub[i]);
          else right.push(sub[i]);
        }
        return qsort(left).concat([pivot], qsort(right));
      }
      qsort(arr);
      return comps;
    }

    function drawSingleRun() {
      var n = parseInt(sliderN.value, 10);
      valN.textContent = n;
      var arr = [];
      for (var i = 0; i < n; i++) arr.push(i + 1);
      // shuffle
      for (var j = arr.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var temp = arr[j]; arr[j] = arr[k]; arr[k] = temp;
      }

      var actualComps = simulateQuicksort(arr);
      runStats.push(actualComps);
      if (runStats.length > 300) runStats.shift();

      render(actualComps);
    }

    function drawManyRuns() {
      var n = parseInt(sliderN.value, 10);
      runStats = [];
      for (var r = 0; r < 250; r++) {
        var arr = [];
        for (var i = 0; i < n; i++) arr.push(i + 1);
        for (var j = arr.length - 1; j > 0; j--) {
          var k = Math.floor(Math.random() * (j + 1));
          var temp = arr[j]; arr[j] = arr[k]; arr[k] = temp;
        }
        runStats.push(simulateQuicksort(arr));
      }
      render(runStats[runStats.length - 1]);
    }

    function render(latestComps) {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      var n = parseInt(sliderN.value, 10);
      var theoretical = 2 * n * Math.log(n); // 2n ln n
      var worstCase = (n * (n - 1)) / 2;

      hudComps.textContent = latestComps ? latestComps : '–';
      hudTheory.textContent = theoretical.toFixed(1) + ' (2n ln n)';
      hudWorst.textContent = worstCase + ' (n²/2)';

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      // Plot margins
      var padL = 60, padR = 30, padT = 35, padB = 45;
      var pw = W - padL - padR;
      var ph = H - padT - padB;

      ctx.fillStyle = '#f5f5f4';
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Quicksort Comparisons Histogram (' + runStats.length + ' trials)', padL, 22);

      if (runStats.length === 0) {
        ctx.fillStyle = '#a8a29e';
        ctx.textAlign = 'center';
        ctx.fillText('Click "Run Single Sort" or "Simulate 250 Runs" to view comparison counts.', W / 2, H / 2);
        return;
      }

      // Compute histogram bins
      var minVal = Math.min.apply(null, runStats);
      var maxVal = Math.max.apply(null, runStats);
      var minRange = Math.min(minVal, Math.floor(theoretical * 0.6));
      var maxRange = Math.max(maxVal, Math.ceil(theoretical * 1.5));
      var numBins = 24;
      var binWidthVal = Math.max(1, (maxRange - minRange) / numBins);

      var bins = new Array(numBins).fill(0);
      for (var s = 0; s < runStats.length; s++) {
        var bIdx = Math.min(numBins - 1, Math.floor((runStats[s] - minRange) / binWidthVal));
        if (bIdx >= 0 && bIdx < numBins) bins[bIdx]++;
      }
      var maxBinCount = Math.max.apply(null, bins);
      if (maxBinCount === 0) maxBinCount = 1;

      // Draw Bars
      var barPixelW = pw / numBins;
      for (var b = 0; b < numBins; b++) {
        var count = bins[b];
        var barH = (count / maxBinCount) * ph;
        var bx = padL + b * barPixelW;
        var by = padT + ph - barH;

        ctx.fillStyle = 'rgba(139, 92, 246, 0.7)';
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1;
        ctx.fillRect(bx + 1, by, barPixelW - 2, barH);
        ctx.strokeRect(bx + 1, by, barPixelW - 2, barH);
      }

      // Draw Theoretical Line (2n ln n)
      var theoryX = padL + ((theoretical - minRange) / (maxRange - minRange)) * pw;
      if (theoryX >= padL && theoryX <= W - padR) {
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(theoryX, padT);
        ctx.lineTo(theoryX, padT + ph);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('E[C] ≈ ' + theoretical.toFixed(0), theoryX, padT - 8);
      }

      // Latest Run marker
      if (latestComps) {
        var curX = padL + ((latestComps - minRange) / (maxRange - minRange)) * pw;
        if (curX >= padL && curX <= W - padR) {
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(curX, padT);
          ctx.lineTo(curX, padT + ph);
          ctx.stroke();

          ctx.fillStyle = '#fbbf24';
          ctx.font = 'bold 11px JetBrains Mono, monospace';
          ctx.fillText('Latest: ' + latestComps, curX, padT + ph + 24);
        }
      }

      // X-axis labels
      ctx.fillStyle = '#a8a29e';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(minRange, padL, padT + ph + 14);
      ctx.fillText(maxRange, W - padR, padT + ph + 14);
      ctx.fillText('Comparisons performed', padL + pw / 2, padT + ph + 34);
    }

    sliderN.addEventListener('input', function () {
      runStats = [];
      drawSingleRun();
    });
    btnSort.addEventListener('click', drawSingleRun);
    btnSim.addEventListener('click', drawManyRuns);
    window.addEventListener('resize', function () { render(runStats[runStats.length - 1]); });
    drawManyRuns();
  }

  /* ============================================================
     LAB 4: Key Distributions Explorer Lab
     ============================================================ */
  function initLab4() {
    var canvas = document.getElementById('prob-lab4-canvas');
    var selectDist = document.getElementById('lab4-dist-select');
    var sliderP1 = document.getElementById('lab4-p1-slider');
    var sliderP2 = document.getElementById('lab4-p2-slider');
    var lblP1 = document.getElementById('lab4-p1-lbl');
    var lblP2 = document.getElementById('lab4-p2-lbl');
    var valP1 = document.getElementById('lab4-p1-val');
    var valP2 = document.getElementById('lab4-p2-val');

    var hudMean = document.getElementById('lab4-hud-mean');
    var hudVar = document.getElementById('lab4-hud-var');
    var hudStd = document.getElementById('lab4-hud-std');

    if (!canvas || !selectDist) return;

    function factorial(n) {
      if (n <= 1) return 1;
      var f = 1;
      for (var i = 2; i <= n; i++) f *= i;
      return f;
    }

    function nCr(n, r) {
      if (r < 0 || r > n) return 0;
      return factorial(n) / (factorial(r) * factorial(n - r));
    }

    function updateControls() {
      var dist = selectDist.value;
      sliderP2.parentElement.style.display = 'block';

      if (dist === 'bernoulli') {
        lblP1.textContent = 'Probability p:';
        sliderP1.min = 0.05; sliderP1.max = 0.95; sliderP1.step = 0.05; sliderP1.value = 0.6;
        sliderP2.parentElement.style.display = 'none';
      } else if (dist === 'binomial') {
        lblP1.textContent = 'Number of trials n:';
        sliderP1.min = 5; sliderP1.max = 40; sliderP1.step = 1; sliderP1.value = 20;
        lblP2.textContent = 'Success prob p:';
        sliderP2.min = 0.05; sliderP2.max = 0.95; sliderP2.step = 0.05; sliderP2.value = 0.4;
      } else if (dist === 'geometric') {
        lblP1.textContent = 'Success prob p:';
        sliderP1.min = 0.05; sliderP1.max = 0.8; sliderP1.step = 0.05; sliderP1.value = 0.25;
        sliderP2.parentElement.style.display = 'none';
      } else if (dist === 'poisson') {
        lblP1.textContent = 'Rate λ (lambda):';
        sliderP1.min = 0.5; sliderP1.max = 20; sliderP1.step = 0.5; sliderP1.value = 5;
        sliderP2.parentElement.style.display = 'none';
      } else if (dist === 'uniform') {
        lblP1.textContent = 'Lower bound a:';
        sliderP1.min = -10; sliderP1.max = 0; sliderP1.step = 1; sliderP1.value = -4;
        lblP2.textContent = 'Upper bound b:';
        sliderP2.min = 1; sliderP2.max = 10; sliderP2.step = 1; sliderP2.value = 6;
      } else if (dist === 'normal') {
        lblP1.textContent = 'Mean μ (mu):';
        sliderP1.min = -5; sliderP1.max = 5; sliderP1.step = 0.5; sliderP1.value = 0;
        lblP2.textContent = 'Std Dev σ (sigma):';
        sliderP2.min = 0.5; sliderP2.max = 4; sliderP2.step = 0.1; sliderP2.value = 1.5;
      } else if (dist === 'exponential') {
        lblP1.textContent = 'Rate λ (lambda):';
        sliderP1.min = 0.2; sliderP1.max = 3; sliderP1.step = 0.1; sliderP1.value = 1.0;
        sliderP2.parentElement.style.display = 'none';
      }
      draw();
    }

    function draw() {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      var dist = selectDist.value;
      var p1 = parseFloat(sliderP1.value);
      var p2 = parseFloat(sliderP2.value);

      valP1.textContent = p1;
      valP2.textContent = p2;

      var mean = 0, variance = 0, std = 0;

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      var padL = 50, padR = 30, padT = 35, padB = 45;
      var pw = W - padL - padR;
      var ph = H - padT - padB;

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var g = 0; g <= 4; g++) {
        var gy = padT + (g / 4) * ph;
        ctx.moveTo(padL, gy);
        ctx.lineTo(W - padR, gy);
      }
      ctx.stroke();

      if (dist === 'binomial') {
        var n = Math.round(p1);
        var p = p2;
        mean = n * p;
        variance = n * p * (1 - p);
        std = Math.sqrt(variance);

        var pmf = [];
        var maxP = 0;
        for (var k = 0; k <= n; k++) {
          var prob = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
          pmf.push(prob);
          if (prob > maxP) maxP = prob;
        }

        var barW = pw / (n + 1);
        for (var k2 = 0; k2 <= n; k2++) {
          var bh = (pmf[k2] / (maxP * 1.15)) * ph;
          var bx = padL + k2 * barW;
          var by = padT + ph - bh;
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(bx + 1, by, barW - 2, bh);
          ctx.strokeStyle = '#c4b5fd';
          ctx.strokeRect(bx + 1, by, barW - 2, bh);
        }

        // Labels
        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        for (var t = 0; t <= n; t += Math.max(1, Math.floor(n / 10))) {
          ctx.fillText(t, padL + (t + 0.5) * barW, padT + ph + 14);
        }
      } else if (dist === 'poisson') {
        var lambda = p1;
        mean = lambda;
        variance = lambda;
        std = Math.sqrt(variance);

        var maxK = Math.max(15, Math.ceil(lambda * 2.5));
        var pmfP = [];
        var maxPP = 0;
        for (var kp = 0; kp <= maxK; kp++) {
          var pr = (Math.pow(lambda, kp) * Math.exp(-lambda)) / factorial(kp);
          pmfP.push(pr);
          if (pr > maxPP) maxPP = pr;
        }

        var bWP = pw / (maxK + 1);
        for (var kp2 = 0; kp2 <= maxK; kp2++) {
          var bhP = (pmfP[kp2] / (maxPP * 1.15)) * ph;
          var bxP = padL + kp2 * bWP;
          var byP = padT + ph - bhP;
          ctx.fillStyle = '#06b6d4';
          ctx.fillRect(bxP + 1, byP, bWP - 2, bhP);
          ctx.strokeStyle = '#67e8f9';
          ctx.strokeRect(bxP + 1, byP, bWP - 2, bhP);
        }

        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        for (var tp = 0; tp <= maxK; tp += Math.max(1, Math.floor(maxK / 10))) {
          ctx.fillText(tp, padL + (tp + 0.5) * bWP, padT + ph + 14);
        }
      } else if (dist === 'normal') {
        var mu = p1;
        var sigma = p2;
        mean = mu;
        variance = sigma * sigma;
        std = sigma;

        var minX = mu - 4 * sigma;
        var maxX = mu + 4 * sigma;
        var maxPdf = 1 / (sigma * Math.sqrt(2 * Math.PI));

        // Area under curve
        ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.beginPath();
        ctx.moveTo(padL, padT + ph);
        for (var px = 0; px <= pw; px += 2) {
          var xCoord = minX + (px / pw) * (maxX - minX);
          var pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xCoord - mu) / sigma, 2));
          var py = padT + ph - (pdf / (maxPdf * 1.15)) * ph;
          ctx.lineTo(padL + px, py);
        }
        ctx.lineTo(padL + pw, padT + ph);
        ctx.closePath();
        ctx.fill();

        // Stroke curve
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (var px2 = 0; px2 <= pw; px2 += 2) {
          var xCoord2 = minX + (px2 / pw) * (maxX - minX);
          var pdf2 = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((xCoord2 - mu) / sigma, 2));
          var py2 = padT + ph - (pdf2 / (maxPdf * 1.15)) * ph;
          if (px2 === 0) ctx.moveTo(padL + px2, py2);
          else ctx.lineTo(padL + px2, py2);
        }
        ctx.stroke();

        // Mean indicator
        var meanX = padL + ((mu - minX) / (maxX - minX)) * pw;
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath(); ctx.moveTo(meanX, padT); ctx.lineTo(meanX, padT + ph); ctx.stroke();
        ctx.setLineDash([]);

        // Ticks
        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText((mu - 2 * sigma).toFixed(1), padL + (((mu - 2 * sigma) - minX) / (maxX - minX)) * pw, padT + ph + 14);
        ctx.fillText(mu.toFixed(1) + ' (μ)', meanX, padT + ph + 14);
        ctx.fillText((mu + 2 * sigma).toFixed(1), padL + (((mu + 2 * sigma) - minX) / (maxX - minX)) * pw, padT + ph + 14);
      } else if (dist === 'exponential') {
        var expLambda = p1;
        mean = 1 / expLambda;
        variance = 1 / (expLambda * expLambda);
        std = mean;

        var expMaxX = 5 / expLambda;
        var expMaxPdf = expLambda;

        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.beginPath();
        ctx.moveTo(padL, padT + ph);
        for (var ex = 0; ex <= pw; ex += 2) {
          var eXCoord = (ex / pw) * expMaxX;
          var ePdf = expLambda * Math.exp(-expLambda * eXCoord);
          var ePy = padT + ph - (ePdf / (expMaxPdf * 1.15)) * ph;
          ctx.lineTo(padL + ex, ePy);
        }
        ctx.lineTo(padL + pw, padT + ph);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (var ex2 = 0; ex2 <= pw; ex2 += 2) {
          var eXCoord2 = (ex2 / pw) * expMaxX;
          var ePdf2 = expLambda * Math.exp(-expLambda * eXCoord2);
          var ePy2 = padT + ph - (ePdf2 / (expMaxPdf * 1.15)) * ph;
          if (ex2 === 0) ctx.moveTo(padL + ex2, ePy2);
          else ctx.lineTo(padL + ex2, ePy2);
        }
        ctx.stroke();

        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('0', padL, padT + ph + 14);
        ctx.fillText((mean).toFixed(2) + ' (1/λ)', padL + (mean / expMaxX) * pw, padT + ph + 14);
        ctx.fillText((expMaxX).toFixed(1), W - padR, padT + ph + 14);
      } else if (dist === 'uniform') {
        var ua = Math.min(p1, p2 - 0.5);
        var ub = Math.max(p2, ua + 0.5);
        mean = (ua + ub) / 2;
        variance = Math.pow(ub - ua, 2) / 12;
        std = Math.sqrt(variance);

        var plotMin = ua - 2;
        var plotMax = ub + 2;
        var uHeight = 1 / (ub - ua);

        var uAx = padL + ((ua - plotMin) / (plotMax - plotMin)) * pw;
        var uBx = padL + ((ub - plotMin) / (plotMax - plotMin)) * pw;
        var uY = padT + ph * 0.35;

        ctx.fillStyle = 'rgba(245, 158, 11, 0.25)';
        ctx.fillRect(uAx, uY, uBx - uAx, (padT + ph) - uY);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(padL, padT + ph);
        ctx.lineTo(uAx, padT + ph);
        ctx.lineTo(uAx, uY);
        ctx.lineTo(uBx, uY);
        ctx.lineTo(uBx, padT + ph);
        ctx.lineTo(W - padR, padT + ph);
        ctx.stroke();

        ctx.fillStyle = '#a8a29e';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('a = ' + ua, uAx, padT + ph + 14);
        ctx.fillText('b = ' + ub, uBx, padT + ph + 14);
      } else {
        // Bernoulli / Geometric fallback
        mean = p1;
        variance = p1 * (1 - p1);
        std = Math.sqrt(variance);
      }

      hudMean.textContent = mean.toFixed(3);
      hudVar.textContent = variance.toFixed(3);
      hudStd.textContent = std.toFixed(3);
    }

    selectDist.addEventListener('change', updateControls);
    sliderP1.addEventListener('input', draw);
    sliderP2.addEventListener('input', draw);
    window.addEventListener('resize', draw);
    updateControls();
  }

  /* ============================================================
     LAB 5: Joint Distributions, Covariance & PCA Lab
     ============================================================ */
  function initLab5() {
    var canvas = document.getElementById('prob-lab5-canvas');
    var selectPreset = document.getElementById('lab5-preset-select');
    var btnRegen = document.getElementById('lab5-regen-btn');

    var hudCov = document.getElementById('lab5-hud-cov');
    var hudCorr = document.getElementById('lab5-hud-corr');
    var hudEig = document.getElementById('lab5-hud-eig');

    if (!canvas || !selectPreset) return;

    var points = [];

    function generatePoints() {
      var preset = selectPreset.value;
      points = [];
      var N = 80;

      for (var i = 0; i < N; i++) {
        var u1 = Math.random() + Math.random() + Math.random() - 1.5;
        var u2 = Math.random() + Math.random() + Math.random() - 1.5;
        var x = 0, y = 0;

        if (preset === 'pos') {
          x = u1 * 2;
          y = 0.85 * x + u2 * 0.8;
        } else if (preset === 'neg') {
          x = u1 * 2;
          y = -0.85 * x + u2 * 0.8;
        } else if (preset === 'uncorr') {
          x = u1 * 2;
          y = u2 * 2;
        } else if (preset === 'nonlinear') {
          x = (Math.random() - 0.5) * 5;
          y = (x * x - 2) * 0.6 + (Math.random() - 0.5) * 0.4;
        }
        points.push({ x: x, y: y });
      }
      draw();
    }

    function draw() {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      // Compute sample statistics
      var N = points.length;
      if (N === 0) return;

      var meanX = 0, meanY = 0;
      for (var i = 0; i < N; i++) {
        meanX += points[i].x;
        meanY += points[i].y;
      }
      meanX /= N; meanY /= N;

      var varX = 0, varY = 0, covXY = 0;
      for (var j = 0; j < N; j++) {
        var dx = points[j].x - meanX;
        var dy = points[j].y - meanY;
        varX += dx * dx;
        varY += dy * dy;
        covXY += dx * dy;
      }
      varX /= (N - 1);
      varY /= (N - 1);
      covXY /= (N - 1);

      var stdX = Math.sqrt(varX);
      var stdY = Math.sqrt(varY);
      var corr = (stdX * stdY > 1e-6) ? (covXY / (stdX * stdY)) : 0;

      // Eigendecomposition of 2x2 covariance matrix
      // lambda = (tr +- sqrt(tr^2 - 4 det)) / 2
      var tr = varX + varY;
      var det = varX * varY - covXY * covXY;
      var disc = Math.max(0, tr * tr - 4 * det);
      var lambda1 = (tr + Math.sqrt(disc)) / 2;
      var lambda2 = (tr - Math.sqrt(disc)) / 2;

      // Eigenvector for lambda1
      var v1x = 1, v1y = 0;
      if (Math.abs(covXY) > 1e-5) {
        v1x = lambda1 - varY;
        v1y = covXY;
      } else if (varX >= varY) {
        v1x = 1; v1y = 0;
      } else {
        v1x = 0; v1y = 1;
      }
      var v1norm = Math.sqrt(v1x * v1x + v1y * v1y);
      if (v1norm > 1e-6) { v1x /= v1norm; v1y /= v1norm; }

      // v2 is orthogonal
      var v2x = -v1y, v2y = v1x;

      hudCov.textContent = covXY.toFixed(3);
      hudCorr.textContent = corr.toFixed(3);
      hudEig.textContent = 'λ₁=' + lambda1.toFixed(2) + ', λ₂=' + lambda2.toFixed(2);

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      var cx = W / 2, cy = H / 2;
      var scale = Math.min(W, H) / 9; // pixels per unit

      // Axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy); ctx.lineTo(W, cy);
      ctx.moveTo(cx, 0); ctx.lineTo(cx, H);
      ctx.stroke();

      // Draw Principal Component Vectors (PCA axes)
      var len1 = Math.sqrt(lambda1) * scale * 1.8;
      var len2 = Math.sqrt(lambda2) * scale * 1.8;

      // PC 1 (Magenta/Purple)
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - v1x * len1, cy + v1y * len1);
      ctx.lineTo(cx + v1x * len1, cy - v1y * len1);
      ctx.stroke();

      // PC 2 (Cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - v2x * len2, cy + v2y * len2);
      ctx.lineTo(cx + v2x * len2, cy - v2y * len2);
      ctx.stroke();

      // Draw Data Points
      ctx.fillStyle = '#f59e0b';
      for (var p = 0; p < N; p++) {
        var px = cx + points[p].x * scale;
        var py = cy - points[p].y * scale;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Legend
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText('■ PC 1 (Max Variance Axis: λ₁ = ' + lambda1.toFixed(2) + ')', 15, 24);
      ctx.fillStyle = '#06b6d4';
      ctx.fillText('■ PC 2 (Orthogonal Axis: λ₂ = ' + lambda2.toFixed(2) + ')', 15, 42);
    }

    selectPreset.addEventListener('change', generatePoints);
    btnRegen.addEventListener('click', generatePoints);
    window.addEventListener('resize', draw);
    generatePoints();
  }

  /* ============================================================
     LAB 6: Limit Theorems & Monte Carlo Pi Lab
     ============================================================ */
  function initLab6() {
    var canvas = document.getElementById('prob-lab6-canvas');
    var selectMode = document.getElementById('lab6-mode-select');
    var sliderK = document.getElementById('lab6-k-slider');
    var valK = document.getElementById('lab6-k-val');
    var btnSim = document.getElementById('lab6-sim-btn');

    var hudMetric1 = document.getElementById('lab6-hud-m1');
    var hudMetric2 = document.getElementById('lab6-hud-m2');
    var hudMetric3 = document.getElementById('lab6-hud-m3');

    if (!canvas || !selectMode) return;

    var mcTotal = 0, mcInside = 0;
    var mcPoints = [];
    var diceHistogram = [];

    function runSimulation() {
      var mode = selectMode.value;
      if (mode === 'clt') {
        var numDice = parseInt(sliderK.value, 10);
        valK.textContent = numDice;
        var trials = 12000;
        var minSum = numDice, maxSum = numDice * 6;
        diceHistogram = new Array(maxSum - minSum + 1).fill(0);

        for (var t = 0; t < trials; t++) {
          var sum = 0;
          for (var d = 0; d < numDice; d++) {
            sum += Math.floor(Math.random() * 6) + 1;
          }
          diceHistogram[sum - minSum]++;
        }
      } else {
        // Monte Carlo Pi: add 1,000 dart throws
        for (var i = 0; i < 1000; i++) {
          var x = Math.random();
          var y = Math.random();
          var inside = (x * x + y * y <= 1);
          mcTotal++;
          if (inside) mcInside++;
          if (mcPoints.length < 1200) {
            mcPoints.push({ x: x, y: y, inside: inside });
          }
        }
      }
      draw();
    }

    function resetMC() {
      mcTotal = 0;
      mcInside = 0;
      mcPoints = [];
      runSimulation();
    }

    function draw() {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      var mode = selectMode.value;

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      if (mode === 'clt') {
        sliderK.parentElement.style.display = 'block';
        var numDice = parseInt(sliderK.value, 10);
        valK.textContent = numDice;

        var mu = numDice * 3.5;
        var variance = numDice * (35 / 12);
        var std = Math.sqrt(variance);

        hudMetric1.textContent = 'Sum Mean: ' + mu.toFixed(1);
        hudMetric2.textContent = 'Std Dev: ' + std.toFixed(2);
        hudMetric3.textContent = 'CLT: Bell curve fits tighter as k grows';

        if (diceHistogram.length === 0) return;

        var padL = 50, padR = 30, padT = 35, padB = 45;
        var pw = W - padL - padR;
        var ph = H - padT - padB;

        var maxCount = Math.max.apply(null, diceHistogram);
        var barW = pw / diceHistogram.length;

        // Draw histogram bars
        for (var b = 0; b < diceHistogram.length; b++) {
          var count = diceHistogram[b];
          var bh = (count / maxCount) * ph * 0.9;
          var bx = padL + b * barW;
          var by = padT + ph - bh;

          ctx.fillStyle = 'rgba(139, 92, 246, 0.65)';
          ctx.strokeStyle = '#8b5cf6';
          ctx.fillRect(bx + 1, by, barW - 2, bh);
          ctx.strokeRect(bx + 1, by, barW - 2, bh);
        }

        // Overlay theoretical Gaussian CLT curve
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (var px = 0; px <= pw; px += 2) {
          var sumVal = numDice + (px / pw) * (numDice * 5);
          var z = (sumVal - mu) / std;
          var pdf = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
          // Scale to peak of histogram
          var maxPdf = 1 / (std * Math.sqrt(2 * Math.PI));
          var py = padT + ph - (pdf / maxPdf) * (ph * 0.9);
          if (px === 0) ctx.moveTo(padL + px, py);
          else ctx.lineTo(padL + px, py);
        }
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 11px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('— Normal CLT Curve N(' + mu.toFixed(1) + ', ' + variance.toFixed(1) + ')', W - padR - 10, 22);

      } else {
        // Monte Carlo Mode
        sliderK.parentElement.style.display = 'none';

        var piEstimate = mcTotal > 0 ? (4 * mcInside / mcTotal) : 0;
        var piError = Math.abs(piEstimate - Math.PI);

        hudMetric1.textContent = 'π Estimate: ' + piEstimate.toFixed(4);
        hudMetric2.textContent = 'Absolute Error: ' + piError.toFixed(4);
        hudMetric3.textContent = 'Samples: ' + mcTotal.toLocaleString() + ' (Error ~ 1/√N)';

        var side = Math.min(W - 40, H - 40);
        var ox = (W - side) / 2;
        var oy = 20;

        // Draw bounding unit square
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 2;
        ctx.strokeRect(ox, oy, side, side);

        // Draw quarter circle arc
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ox, oy + side, side, -Math.PI / 2, 0);
        ctx.stroke();

        // Draw points
        for (var p = 0; p < mcPoints.length; p++) {
          var pt = mcPoints[p];
          var px2 = ox + pt.x * side;
          var py2 = oy + (1 - pt.y) * side;

          ctx.fillStyle = pt.inside ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)';
          ctx.beginPath();
          ctx.arc(px2, py2, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#f5f5f4';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Monte Carlo π Dartboard (Inside: ' + mcInside + ' / ' + mcTotal + ')', 20, 25);
      }
    }

    selectMode.addEventListener('change', function () {
      if (selectMode.value === 'mc') resetMC();
      else runSimulation();
    });
    sliderK.addEventListener('input', runSimulation);
    btnSim.addEventListener('click', runSimulation);
    window.addEventListener('resize', draw);
    runSimulation();
  }

  /* ============================================================
     LAB 7: Likelihood, MLE vs MAP & Confidence Intervals Lab
     ============================================================ */
  function initLab7() {
    var canvas = document.getElementById('prob-lab7-canvas');
    var sliderHeads = document.getElementById('lab7-heads-slider');
    var sliderN = document.getElementById('lab7-n-slider');
    var sliderPriorA = document.getElementById('lab7-a-slider');
    var sliderPriorB = document.getElementById('lab7-b-slider');

    var hudMle = document.getElementById('lab7-hud-mle');
    var hudMap = document.getElementById('lab7-hud-map');
    var hudCi = document.getElementById('lab7-hud-ci');

    if (!canvas || !sliderHeads) return;

    function draw() {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      var n = parseInt(sliderN.value, 10);
      sliderHeads.max = n;
      var k = Math.min(n, parseInt(sliderHeads.value, 10));
      sliderHeads.value = k;

      var alpha = parseFloat(sliderPriorA.value); // Beta prior alpha
      var betaVal = parseFloat(sliderPriorB.value); // Beta prior beta

      // MLE = k / n
      var pMle = n > 0 ? (k / n) : 0.5;

      // MAP = (k + alpha - 1) / (n + alpha + beta - 2)
      var denom = n + alpha + betaVal - 2;
      var pMap = denom > 0 ? ((k + alpha - 1) / denom) : pMle;
      pMap = Math.max(0, Math.min(1, pMap));

      // 95% Wald Confidence Interval
      var se = Math.sqrt(pMle * (1 - pMle) / n);
      var ciLow = Math.max(0, pMle - 1.96 * se);
      var ciHigh = Math.min(1, pMle + 1.96 * se);

      hudMle.textContent = (pMle * 100).toFixed(1) + '% (k/n)';
      hudMap.textContent = (pMap * 100).toFixed(1) + '% (Beta Prior)';
      hudCi.textContent = '[' + (ciLow * 100).toFixed(1) + '%, ' + (ciHigh * 100).toFixed(1) + '%]';

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      var padL = 50, padR = 30, padT = 35, padB = 45;
      var pw = W - padL - padR;
      var ph = H - padT - padB;

      // Draw Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (var p = 0; p <= 1; p += 0.2) {
        var gx = padL + p * pw;
        ctx.moveTo(gx, padT); ctx.lineTo(gx, padT + ph);
      }
      ctx.stroke();

      // Compute log-likelihood / posterior curves across p in [0.01, 0.99]
      var steps = 150;
      var likeCurve = [], priorCurve = [], postCurve = [];
      var maxLike = 0, maxPrior = 0, maxPost = 0;

      for (var s = 0; s <= steps; s++) {
        var pv = s / steps;
        if (pv <= 0.001) pv = 0.001;
        if (pv >= 0.999) pv = 0.999;

        // Log of Likelihood: k ln p + (n-k) ln (1-p)
        var logL = k * Math.log(pv) + (n - k) * Math.log(1 - pv);
        var like = Math.exp(logL - (k * Math.log(pMle || 0.5) + (n - k) * Math.log(1 - (pMle || 0.5)))); // normalized peak to 1

        // Prior: p^(alpha-1) * (1-p)^(beta-1)
        var priorDens = Math.pow(pv, alpha - 1) * Math.pow(1 - pv, betaVal - 1);

        // Posterior: p^(k+alpha-1) * (1-p)^(n-k+beta-1)
        var postDens = Math.pow(pv, k + alpha - 1) * Math.pow(1 - pv, n - k + betaVal - 1);

        likeCurve.push({ p: pv, v: like });
        priorCurve.push({ p: pv, v: priorDens });
        postCurve.push({ p: pv, v: postDens });

        if (like > maxLike) maxLike = like;
        if (priorDens > maxPrior) maxPrior = priorDens;
        if (postDens > maxPost) maxPost = postDens;
      }

      // Draw Prior Curve (Amber dotted)
      if (maxPrior > 0) {
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        for (var i1 = 0; i1 < priorCurve.length; i1++) {
          var px1 = padL + priorCurve[i1].p * pw;
          var py1 = padT + ph - (priorCurve[i1].v / maxPrior) * (ph * 0.7);
          if (i1 === 0) ctx.moveTo(px1, py1); else ctx.lineTo(px1, py1);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Draw Likelihood Curve (Cyan)
      if (maxLike > 0) {
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (var i2 = 0; i2 < likeCurve.length; i2++) {
          var px2 = padL + likeCurve[i2].p * pw;
          var py2 = padT + ph - (likeCurve[i2].v / maxLike) * (ph * 0.85);
          if (i2 === 0) ctx.moveTo(px2, py2); else ctx.lineTo(px2, py2);
        }
        ctx.stroke();
      }

      // Draw Posterior Curve (Purple filled)
      if (maxPost > 0) {
        ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
        ctx.beginPath();
        ctx.moveTo(padL, padT + ph);
        for (var i3 = 0; i3 < postCurve.length; i3++) {
          var px3 = padL + postCurve[i3].p * pw;
          var py3 = padT + ph - (postCurve[i3].v / maxPost) * (ph * 0.85);
          ctx.lineTo(px3, py3);
        }
        ctx.lineTo(padL + pw, padT + ph);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 3;
        ctx.beginPath();
        for (var i4 = 0; i4 < postCurve.length; i4++) {
          var px4 = padL + postCurve[i4].p * pw;
          var py4 = padT + ph - (postCurve[i4].v / maxPost) * (ph * 0.85);
          if (i4 === 0) ctx.moveTo(px4, py4); else ctx.lineTo(px4, py4);
        }
        ctx.stroke();
      }

      // Shaded 95% Confidence Interval band on X-axis
      var ciX1 = padL + ciLow * pw;
      var ciX2 = padL + ciHigh * pw;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
      ctx.fillRect(ciX1, padT + ph - 8, ciX2 - ciX1, 8);
      ctx.strokeStyle = '#10b981';
      ctx.strokeRect(ciX1, padT + ph - 8, ciX2 - ciX1, 8);

      // MLE Line
      var mleX = padL + pMle * pw;
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mleX, padT + 10); ctx.lineTo(mleX, padT + ph); ctx.stroke();

      // MAP Line
      var mapX = padL + pMap * pw;
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(mapX, padT + 10); ctx.lineTo(mapX, padT + ph); ctx.stroke();

      // Legend
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillStyle = '#06b6d4'; ctx.fillText('■ Likelihood L(p) [MLE = ' + (pMle * 100).toFixed(0) + '%]', 15, 20);
      ctx.fillStyle = '#f59e0b'; ctx.fillText('┄ Prior Beta(' + alpha + ',' + betaVal + ')', 210, 20);
      ctx.fillStyle = '#8b5cf6'; ctx.fillText('■ Posterior [MAP = ' + (pMap * 100).toFixed(0) + '%]', 370, 20);
      ctx.fillStyle = '#10b981'; ctx.fillText('■ 95% CI', W - padR - 65, 20);

      // X-axis labels
      ctx.fillStyle = '#a8a29e';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      for (var xp = 0; xp <= 1; xp += 0.2) {
        ctx.fillText((xp * 100).toFixed(0) + '%', padL + xp * pw, padT + ph + 16);
      }
      ctx.fillText('Parameter p (True Success Probability)', padL + pw / 2, padT + ph + 34);
    }

    sliderHeads.addEventListener('input', draw);
    sliderN.addEventListener('input', draw);
    sliderPriorA.addEventListener('input', draw);
    sliderPriorB.addEventListener('input', draw);
    window.addEventListener('resize', draw);
    draw();
  }

  /* ============================================================
     LAB 8: A/B Testing Simulator & The Peeking Trap Lab
     ============================================================ */
  function initLab8() {
    var canvas = document.getElementById('prob-lab8-canvas');
    var sliderLift = document.getElementById('lab8-lift-slider');
    var sliderN = document.getElementById('lab8-n-slider');
    var btnFixed = document.getElementById('lab8-fixed-btn');
    var btnPeek = document.getElementById('lab8-peek-btn');

    var hudZ = document.getElementById('lab8-hud-z');
    var hudPval = document.getElementById('lab8-hud-pval');
    var hudDecision = document.getElementById('lab8-hud-decision');

    if (!canvas || !sliderLift) return;

    var peekingWalk = []; // trajectory of z-scores over time

    function runFixedTest() {
      peekingWalk = [];
      var baseline = 0.05; // 5.0% baseline
      var lift = parseFloat(sliderLift.value) / 1000; // 0 to 20 / 1000 => 0 to 0.02 (0% to +2.0%)
      var pA = baseline;
      var pB = baseline + lift;
      var N = parseInt(sliderN.value, 10);

      var convA = 0, convB = 0;
      for (var i = 0; i < N; i++) {
        if (Math.random() < pA) convA++;
        if (Math.random() < pB) convB++;
      }

      var rateA = convA / N;
      var rateB = convB / N;
      var pPool = (convA + convB) / (2 * N);
      var se = Math.sqrt(pPool * (1 - pPool) * (2 / N));
      var z = se > 0 ? (rateB - rateA) / se : 0;

      // Two-tailed p-value via normal approximation
      var pVal = 2 * (1 - normalCdf(Math.abs(z)));

      hudZ.textContent = z.toFixed(2);
      hudPval.textContent = pVal < 0.0001 ? '< 0.0001' : pVal.toFixed(4);

      if (pVal < 0.05) {
        hudDecision.textContent = 'REJECT H₀ (Significant Lift ✓)';
        hudDecision.style.color = '#10b981';
      } else {
        hudDecision.textContent = 'FAIL TO REJECT H₀ (Inconclusive)';
        hudDecision.style.color = '#ef4444';
      }

      draw(z, pVal, null);
    }

    function runPeekingSimulation() {
      var baseline = 0.05;
      var lift = 0.0; // Strictly under H0 (true effect is EXACTLY ZERO)
      var N = parseInt(sliderN.value, 10);
      var checkInterval = Math.max(50, Math.floor(N / 100));

      peekingWalk = [];
      var convA = 0, convB = 0;
      var falseAlarmStep = null;

      for (var t = 1; t <= N; t++) {
        if (Math.random() < baseline) convA++;
        if (Math.random() < baseline) convB++;

        if (t % checkInterval === 0 && t >= 200) {
          var rA = convA / t;
          var rB = convB / t;
          var pP = (convA + convB) / (2 * t);
          var seT = Math.sqrt(pP * (1 - pP) * (2 / t));
          var zT = seT > 0 ? (rB - rA) / seT : 0;
          peekingWalk.push({ step: t, z: zT });

          if (Math.abs(zT) >= 1.96 && falseAlarmStep === null) {
            falseAlarmStep = t;
          }
        }
      }

      var lastZ = peekingWalk.length > 0 ? peekingWalk[peekingWalk.length - 1].z : 0;
      var lastP = 2 * (1 - normalCdf(Math.abs(lastZ)));

      hudZ.textContent = 'Walk checked ' + peekingWalk.length + ' times';
      hudPval.textContent = falseAlarmStep ? 'PEEKED: False Alarm at n=' + falseAlarmStep : 'No false alarm';
      hudDecision.textContent = falseAlarmStep ? 'TRAPPED! False Discovery Triggered!' : 'Surviving H₀ (No false alarm)';
      hudDecision.style.color = falseAlarmStep ? '#f59e0b' : '#10b981';

      draw(lastZ, lastP, peekingWalk);
    }

    function normalCdf(x) {
      // Numerical approximation of standard normal CDF
      var t = 1 / (1 + 0.2316419 * Math.abs(x));
      var d = 0.3989423 * Math.exp(-x * x / 2);
      var prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
      return x > 0 ? (1 - prob) : prob;
    }

    function draw(zScore, pVal, walk) {
      var setup = setupCanvas(canvas);
      if (!setup) return;
      var ctx = setup.ctx;
      var W = setup.width;
      var H = setup.height;

      // Background
      ctx.fillStyle = '#1c1917';
      ctx.fillRect(0, 0, W, H);

      var padL = 50, padR = 30, padT = 35, padB = 45;
      var pw = W - padL - padR;
      var ph = H - padT - padB;

      if (!walk) {
        // Mode 1: Standard Normal Distribution with Rejection Regions
        ctx.fillStyle = '#f5f5f4';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('Fixed-Horizon Test Statistic Distribution under H₀ ~ N(0, 1)', 15, 22);

        var minZ = -4, maxZ = 4;
        var maxPdf = 0.4;

        // Draw rejection regions (|z| >= 1.96)
        var zCritL = padL + ((-1.96 - minZ) / (maxZ - minZ)) * pw;
        var zCritR = padL + ((1.96 - minZ) / (maxZ - minZ)) * pw;

        // Left tail rejection fill
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(padL, padT, zCritL - padL, ph);
        // Right tail rejection fill
        ctx.fillRect(zCritR, padT, (padL + pw) - zCritR, ph);

        // Draw Normal Bell Curve
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (var px = 0; px <= pw; px += 2) {
          var zv = minZ + (px / pw) * (maxZ - minZ);
          var pdf = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * zv * zv);
          var py = padT + ph - (pdf / maxPdf) * ph;
          if (px === 0) ctx.moveTo(padL + px, py); else ctx.lineTo(padL + px, py);
        }
        ctx.stroke();

        // Critical line markers
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(zCritL, padT); ctx.lineTo(zCritL, padT + ph);
        ctx.moveTo(zCritR, padT); ctx.lineTo(zCritR, padT + ph);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('-1.96 (α=0.05)', zCritL, padT + ph + 16);
        ctx.fillText('+1.96 (α=0.05)', zCritR, padT + ph + 16);

        // Observed Z-score line
        var obsZ = Math.max(-3.9, Math.min(3.9, zScore));
        var obsX = padL + ((obsZ - minZ) / (maxZ - minZ)) * pw;

        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(obsX, padT - 5); ctx.lineTo(obsX, padT + ph); ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 12px JetBrains Mono, monospace';
        ctx.fillText('Observed z = ' + zScore.toFixed(2), obsX, padT - 10);

      } else {
        // Mode 2: Peeking Random Walk Trajectory over Sample Size
        ctx.fillStyle = '#f5f5f4';
        ctx.font = 'bold 12px Inter, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('The Peeking Trap: Test Statistic Random Walk over Sample Size (True Effect = 0)', 15, 22);

        var midY = padT + ph / 2;
        var yCritTop = midY - (1.96 / 4) * (ph / 2);
        var yCritBot = midY + (1.96 / 4) * (ph / 2);

        // Boundary lines at +- 1.96
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(padL, yCritTop); ctx.lineTo(W - padR, yCritTop);
        ctx.moveTo(padL, yCritBot); ctx.lineTo(W - padR, yCritBot);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = '#ef4444';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.textAlign = 'right';
        ctx.fillText('+1.96 Rejection Boundary (p < 0.05)', W - padR - 10, yCritTop - 6);
        ctx.fillText('-1.96 Rejection Boundary (p < 0.05)', W - padR - 10, yCritBot + 14);

        // Center line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padL, midY); ctx.lineTo(W - padR, midY); ctx.stroke();

        // Draw Walk Trajectory
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var w = 0; w < walk.length; w++) {
          var wx = padL + (w / (walk.length - 1)) * pw;
          var clampedZ = Math.max(-4, Math.min(4, walk[w].z));
          var wy = midY - (clampedZ / 4) * (ph / 2);
          if (w === 0) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
        ctx.stroke();

        // Highlight breaches
        for (var w2 = 0; w2 < walk.length; w2++) {
          if (Math.abs(walk[w2].z) >= 1.96) {
            var bx = padL + (w2 / (walk.length - 1)) * pw;
            var by = midY - (Math.max(-4, Math.min(4, walk[w2].z)) / 4) * (ph / 2);
            ctx.fillStyle = '#ef4444';
            ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
    }

    sliderLift.addEventListener('input', runFixedTest);
    sliderN.addEventListener('input', runFixedTest);
    btnFixed.addEventListener('click', runFixedTest);
    btnPeek.addEventListener('click', runPeekingSimulation);
    window.addEventListener('resize', runFixedTest);
    runFixedTest();
  }

  // Auto-initialize when sections are scrolled into view
  document.addEventListener('DOMContentLoaded', function () {
    observeLab('prob-lab1-canvas', initLab1);
    observeLab('prob-lab2-canvas', initLab2);
    observeLab('prob-lab3-canvas', initLab3);
    observeLab('prob-lab4-canvas', initLab4);
    observeLab('prob-lab5-canvas', initLab5);
    observeLab('prob-lab6-canvas', initLab6);
    observeLab('prob-lab7-canvas', initLab7);
    observeLab('prob-lab8-canvas', initLab8);
  });

})();
