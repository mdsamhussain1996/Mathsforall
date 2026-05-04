// ── VECTOR TRANSFORMATION VISUALIZATION ──
(function initVecViz() {
  const canvas = document.getElementById('vec-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const scale = 60;

  let matrix = [[1, 0.5], [-0.5, 1]];

  const originalVecs = [
    { x: 1, y: 0, color: '#d97706', label: 'e₁' },
    { x: 0, y: 1, color: '#00c9b8', label: 'e₂' },
    { x: 1, y: 1, color: '#f59e0b', label: 'v' },
  ];

  function getVal(id, divisor) { const el = document.getElementById(id); return el ? parseInt(el.value) / divisor : 0; }

  window.updateMatrix = function() {
    const vals = ['m11','m12','m21','m22'].map(id => getVal(id, 10));
    ['m11v','m12v','m21v','m22v'].forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = vals[i].toFixed(1);
    });
    matrix = [[vals[0], vals[1]], [vals[2], vals[3]]];
    draw();
  };

  function transform(v) {
    return {
      x: matrix[0][0] * v.x + matrix[0][1] * v.y,
      y: matrix[1][0] * v.x + matrix[1][1] * v.y
    };
  }

  function drawArrow(x1, y1, x2, y2, color, label, dashed=false) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 2;
    if (dashed) ctx.setLineDash([5,4]);
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.setLineDash([]);
    // Arrowhead
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const len = 10;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - len * Math.cos(ang - 0.4), y2 - len * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - len * Math.cos(ang + 0.4), y2 - len * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
    if (label) {
      ctx.font = '500 12px "JetBrains Mono", monospace';
      ctx.fillText(label, x2 + 6, y2 - 6);
    }
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Original vectors (faded)
    originalVecs.forEach(v => {
      drawArrow(cx, cy, cx + v.x * scale, cy - v.y * scale, v.color + '55', v.label, true);
    });

    // Transformed vectors
    originalVecs.forEach(v => {
      const t = transform(v);
      drawArrow(cx, cy, cx + t.x * scale, cy - t.y * scale, v.color, 'A·' + v.label);
    });

    // Label
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(`A = [[${matrix[0][0].toFixed(1)}, ${matrix[0][1].toFixed(1)}], [${matrix[1][0].toFixed(1)}, ${matrix[1][1].toFixed(1)}]]`, 8, H - 10);
  }

  draw();
  window.updateMatrix(); // sync display
})();

// ── PROBABILITY DISTRIBUTION ──
(function initProbViz() {
  const canvas = document.getElementById('prob-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  function gaussian(x, mu, sigma) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
  }

  window.updateProb = function() {
    const muEl = document.getElementById('prob-mu');
    const sigEl = document.getElementById('prob-sigma');
    const mu = muEl ? parseInt(muEl.value) / 10 : 0;
    const sigma = sigEl ? parseInt(sigEl.value) / 10 : 1.5;
    document.getElementById('prob-mu-v').textContent = mu.toFixed(1);
    document.getElementById('prob-sigma-v').textContent = sigma.toFixed(1);
    draw(mu, sigma);
  };

  function draw(mu=0, sigma=1.5) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const xRange = 5, yMax = gaussian(mu, mu, sigma) * 1.1;
    const toScreenX = x => ((x - mu + xRange) / (2 * xRange)) * (W - 40) + 20;
    const toScreenY = y => H - 30 - (y / yMax) * (H - 50);

    // Fill area
    ctx.beginPath();
    const startX = mu - xRange;
    ctx.moveTo(toScreenX(startX), H - 30);
    for (let i = 0; i <= 200; i++) {
      const x = startX + (i / 200) * xRange * 2;
      ctx.lineTo(toScreenX(x), toScreenY(gaussian(x, mu, sigma)));
    }
    ctx.lineTo(toScreenX(mu + xRange), H - 30);
    ctx.closePath();
    const fillGrad = ctx.createLinearGradient(0, 0, 0, H);
    fillGrad.addColorStop(0, 'rgba(217,119,6,0.3)');
    fillGrad.addColorStop(1, 'rgba(217,119,6,0.02)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    // Curve
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const x = startX + (i / 200) * xRange * 2;
      const sy = toScreenY(gaussian(x, mu, sigma));
      i === 0 ? ctx.moveTo(toScreenX(x), sy) : ctx.lineTo(toScreenX(x), sy);
    }
    ctx.strokeStyle = '#d97706'; ctx.lineWidth = 2.5; ctx.stroke();

    // Mean line
    ctx.beginPath();
    ctx.moveTo(toScreenX(mu), 10);
    ctx.lineTo(toScreenX(mu), H - 30);
    ctx.strokeStyle = 'rgba(245,158,11,0.6)'; ctx.lineWidth = 1.5; ctx.setLineDash([5,4]);
    ctx.stroke(); ctx.setLineDash([]);

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f59e0b';
    ctx.fillText('μ = ' + mu.toFixed(1), toScreenX(mu) + 5, 20);
    ctx.fillStyle = 'rgba(217,119,6,0.1)';
    ctx.fillText('σ = ' + sigma.toFixed(1), 10, 20);

    // X-axis labels
    for (let i = -2; i <= 2; i++) {
      const x = mu + i * sigma;
      if (x < mu - xRange || x > mu + xRange) continue;
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillText((i === 0 ? 'μ' : `μ${i > 0 ? '+' : ''}${i}σ`), toScreenX(x) - 10, H - 8);
    }
  }

  draw();
  window.updateProb();
})();

// ── 2D OPTIMIZATION SURFACE ──
(function initOptViz() {
  const canvas = document.getElementById('opt-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  let pos = { x: -0.7, y: 0.7 };
  let history = [{ ...pos }];
  let running = true;
  let animId = null;
  let step = 0;

  function loss(x, y) { return 0.6 * x * x + 1.2 * y * y + 0.3 * Math.sin(x * 5) * Math.sin(y * 5); }
  function grad(x, y) {
    return {
      dx: 1.2 * x + 1.5 * Math.cos(x * 5) * Math.sin(y * 5),
      dy: 2.4 * y + 1.5 * Math.sin(x * 5) * Math.cos(y * 5)
    };
  }

  function getLR() {
    const el = document.getElementById('opt-lr');
    return el ? parseInt(el.value) / 100 : 0.1;
  }

  window.updateOptViz = function() {
    const el = document.getElementById('opt-lr');
    const v = document.getElementById('opt-lr-v');
    if (el && v) v.textContent = (parseInt(el.value) / 100).toFixed(2);
  };

  window.restartOpt = function() {
    pos = { x: (Math.random() - 0.5) * 1.4, y: (Math.random() - 0.5) * 1.2 };
    history = [{ ...pos }]; step = 0; running = true;
    document.getElementById('opt-toggle-btn').textContent = '⏸ Pause';
    if (animId) cancelAnimationFrame(animId);
    animate();
  };

  window.toggleOpt = function() {
    running = !running;
    document.getElementById('opt-toggle-btn').textContent = running ? '⏸ Pause' : '▶ Resume';
    if (running) animate();
  };

  function toScreen(x, y) {
    return { sx: (x + 1) / 2 * W, sy: (1 - (y + 1) / 2) * H };
  }

  function drawContours() {
    const levels = [0.02, 0.08, 0.18, 0.32, 0.5, 0.72, 1.0];
    const colors = ['#10b981','#d97706','#f59e0b','#fbbf24','#fef3c7','#fff7ed','#fffaf0'];
    levels.forEach((lv, li) => {
      // Simple contour approximation by drawing ellipses
      const rx = Math.sqrt(lv / 0.6) * (W / 2);
      const ry = Math.sqrt(lv / 1.2) * (H / 2);
      ctx.beginPath();
      ctx.ellipse(W / 2, H / 2, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = colors[li] + '40';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    // Heatmap
    const imgData = ctx.createImageData(W, H);
    for (let px = 0; px < W; px++) {
      for (let py = 0; py < H; py++) {
        const wx = (px / W) * 2 - 1, wy = 1 - (py / H) * 2;
        const l = loss(wx, wy);
        const t = Math.min(l / 1.5, 1);
        const idx = (py * W + px) * 4;
        imgData.data[idx] = Math.floor(6 + t * 30);
        imgData.data[idx+1] = Math.floor(15 + t * 20);
        imgData.data[idx+2] = Math.floor(30 + (1-t) * 80);
        imgData.data[idx+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    drawContours();

    // Path
    if (history.length > 1) {
      ctx.beginPath();
      history.forEach((p, i) => {
        const { sx, sy } = toScreen(p.x, p.y);
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      ctx.strokeStyle = 'rgba(245,158,11,0.8)'; ctx.lineWidth = 2; ctx.stroke();
    }

    // Current point
    const { sx, sy } = toScreen(pos.x, pos.y);
    ctx.beginPath(); ctx.arc(sx, sy, 6, 0, Math.PI*2);
    ctx.fillStyle = '#f59e0b'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    // Minimum
    ctx.beginPath(); ctx.arc(W/2, H/2, 5, 0, Math.PI*2);
    ctx.fillStyle = '#00c9b8'; ctx.fill();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`Step: ${step}  L=${loss(pos.x,pos.y).toFixed(4)}`, 8, 18);
  }

  function animate() {
    drawFrame();
    if (running && step < 120 && (Math.abs(grad(pos.x, pos.y).dx) > 0.001 || Math.abs(grad(pos.x, pos.y).dy) > 0.001)) {
      const lr = getLR();
      const g = grad(pos.x, pos.y);
      pos.x -= lr * g.dx; pos.y -= lr * g.dy;
      pos.x = Math.max(-1, Math.min(1, pos.x));
      pos.y = Math.max(-1, Math.min(1, pos.y));
      history.push({ ...pos }); step++;
      setTimeout(() => { animId = requestAnimationFrame(animate); }, 80);
    }
  }

  window.restartOpt();
  window.updateOptViz();
})();

// ── SPAN AND BASIS VISUALIZATION ──
(function initSpanViz() {
  const canvas = document.getElementById('span-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const scale = 80;

  window.updateSpanViz = function() {
    const el1 = document.getElementById('v1-angle');
    const el2 = document.getElementById('v2-angle');
    if (!el1 || !el2) return;
    const a1 = parseInt(el1.value) * Math.PI / 180;
    const a2 = parseInt(el2.value) * Math.PI / 180;
    
    const v1 = { x: Math.cos(a1), y: Math.sin(a1) };
    const v2 = { x: Math.cos(a2), y: Math.sin(a2) };
    
    draw(v1, v2);
  };

  function drawArrow(x1, y1, x2, y2, color, label) {
    ctx.save();
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const len = 12;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - len * Math.cos(ang - 0.4), y2 - len * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - len * Math.cos(ang + 0.4), y2 - len * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fill();
    if (label) {
      ctx.font = 'bold 14px "Inter", sans-serif';
      ctx.fillText(label, x2 + 8, y2 - 8);
    }
    ctx.restore();
  }

  function draw(v1, v2) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(124,58,237,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Check Linear Independence
    const crossProduct = Math.abs(v1.x * v2.y - v1.y * v2.x);
    const isIndependent = crossProduct > 0.05;
    
    const infoEl = document.getElementById('span-info');
    if (infoEl) {
      infoEl.textContent = isIndependent 
        ? "Linear Independence: YES. Span: Full 2D Plane." 
        : "Linear Independence: NO (Collinear). Span: A single line.";
      infoEl.style.color = isIndependent ? "var(--teal)" : "var(--gold)";
    }

    // Draw Span (shaded area or line)
    if (isIndependent) {
      ctx.fillStyle = 'rgba(217,119,6,0.05)';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.strokeStyle = 'rgba(245,158,11,0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - v1.x * 1000, cy + v1.y * 1000);
      ctx.lineTo(cx + v1.x * 1000, cy - v1.y * 1000);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, H); ctx.stroke();

    // Draw Vectors
    drawArrow(cx, cy, cx + v1.x * scale, cy - v1.y * scale, '#d97706', 'v₁');
    drawArrow(cx, cy, cx + v2.x * scale, cy - v2.y * scale, '#10b981', 'v₂');
    
    // Linear Combination Example
    if (isIndependent) {
      const target = { x: 1.5, y: 1.2 };
      // Solve: c1*v1 + c2*v2 = target
      // c1*v1.x + c2*v2.x = target.x
      // c1*v1.y + c2*v2.y = target.y
      const det = v1.x * v2.y - v1.y * v2.x;
      const c1 = (target.x * v2.y - target.y * v2.x) / det;
      const c2 = (v1.x * target.y - v1.y * target.x) / det;
      
      const p1 = { x: c1 * v1.x, y: c1 * v1.y };
      const p2 = { x: target.x, y: target.y };
      
      // Draw parallelogram
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      ctx.moveTo(cx + p1.x * scale, cy - p1.y * scale);
      ctx.lineTo(cx + p2.x * scale, cy - p2.y * scale);
      ctx.lineTo(cx + (p2.x - p1.x) * scale, cy - (p2.y - p1.y) * scale);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.beginPath();
      ctx.arc(cx + target.x * scale, cy - target.y * scale, 4, 0, Math.PI*2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillText(`Target = ${c1.toFixed(1)}v₁ + ${c2.toFixed(1)}v₂`, cx + target.x * scale + 5, cy - target.y * scale - 5);
    }
  }

  window.updateSpanViz();
})();

// ── BASIS TRANSFORMATION VISUALIZER ──
(function initBasisViz() {
  const canvas = document.getElementById('basis-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const centerX = W / 2, centerY = H / 2;
  const scale = 50;

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    // Standard Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    for(let i = -10; i <= 10; i++) {
      ctx.moveTo(centerX + i * scale, 0); ctx.lineTo(centerX + i * scale, H);
      ctx.moveTo(0, centerY + i * scale); ctx.lineTo(W, centerY + i * scale);
    }
    ctx.stroke();

    // Basis 1 (Standard)
    ctx.strokeStyle = '#2ecc71';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + scale, centerY);
    ctx.moveTo(centerX, centerY); ctx.lineTo(centerX, centerY - scale);
    ctx.stroke();

    // Basis 2 (Skewed)
    const time = Date.now() * 0.001;
    const v1 = { x: Math.cos(time), y: Math.sin(time) };
    const v2 = { x: -0.5, y: 1 };

    ctx.strokeStyle = '#f1c40f';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + v1.x * scale, centerY - v1.y * scale);
    ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + v2.x * scale, centerY - v2.y * scale);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#ecf0f1';
    ctx.font = '10px Inter';
    ctx.fillText('Standard Basis', centerX + 10, centerY + 20);
    ctx.fillStyle = '#f1c40f';
    ctx.fillText('New Basis', centerX + v1.x * scale + 5, centerY - v1.y * scale - 5);

    requestAnimationFrame(draw);
  }
  draw();
})();

/**
 * Eigenvector & Application Visualizations
 */
(function initEigenViz() {
  const canvas = document.getElementById('eigen-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const matrix = [[1.5, 0.5], [0.5, 1.5]];

  function draw() {
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const scale = 50;
    const time = Date.now() * 0.001;
    
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    // Vector
    const x = Math.cos(time);
    const y = Math.sin(time);
    
    // Transformed
    const tx = matrix[0][0] * x + matrix[0][1] * y;
    const ty = matrix[1][0] * x + matrix[1][1] * y;

    // Draw Original
    ctx.strokeStyle = '#f1c40f';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + x * scale, cy - y * scale); ctx.stroke();
    
    // Draw Transformed
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + tx * scale, cy - ty * scale); ctx.stroke();

    // Check Alignment
    const cross = Math.abs(x * ty - y * tx);
    if (cross < 0.1) {
      ctx.fillStyle = '#2ecc71';
      ctx.font = 'bold 12px Inter';
      ctx.fillText('ALIGNED!', 10, 20);
    }

    requestAnimationFrame(draw);
  }
  draw();
})();

(function initPCAScree() {
  const canvas = document.getElementById('pca-scree-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const values = [40, 25, 15, 10, 5, 3, 2];

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    const barWidth = (W - 40) / values.length;
    values.forEach((v, i) => {
      const h = (v / 40) * (H - 40);
      ctx.fillStyle = i < 3 ? '#10b981' : 'rgba(255,255,255,0.1)';
      ctx.fillRect(20 + i * barWidth, H - 20 - h, barWidth - 4, h);
    });
    
    // Cumulative line
    ctx.strokeStyle = '#f1c40f';
    ctx.beginPath();
    let sum = 0;
    const total = values.reduce((a, b) => a + b, 0);
    values.forEach((v, i) => {
      sum += v;
      const x = 20 + i * barWidth + barWidth / 2;
      const y = H - 20 - (sum / total) * (H - 40);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  draw();
})();

(function initSVDDecay() {
  const canvas = document.getElementById('svd-decay-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function draw() {
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#1c1917'; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 50; i++) {
      const x = 20 + (i / 50) * (W - 40);
      const y = 20 + (H - 40) * (1 - Math.exp(-i / 5));
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    
    // Elbow indicator
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(20 + (10/50)*(W-40), 20 + (H-40)*(1-Math.exp(-10/5)), 4, 0, Math.PI*2); ctx.fill();
  }
  draw();
})();
