// ── STATE TRAJECTORY ──
(function initStateViz() {
  const canvas = document.getElementById('state-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  window.updateStateViz = function() {
    const sigEl = document.getElementById('pole-sigma');
    const omEl = document.getElementById('pole-omega');
    const sigma = sigEl ? parseInt(sigEl.value) / 10 : -1.0;
    const omega = omEl ? parseInt(omEl.value) / 10 : 2.0;
    document.getElementById('pole-sigma-v').textContent = sigma.toFixed(1);
    document.getElementById('pole-omega-v').textContent = omega.toFixed(1);
    draw(sigma, omega);
  };

  function draw(sigma, omega) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Simulate x(t) = e^{sigma*t} * cos(omega*t)
    const dt = 0.05, tMax = 12;
    const xArr = [], yArr = [];
    for (let t = 0; t <= tMax; t += dt) {
      const amp = Math.exp(sigma * t);
      if (!isFinite(amp) || Math.abs(amp) > 1e4) break;
      xArr.push(amp * Math.cos(omega * t));
      yArr.push(amp * Math.sin(omega * t));
    }

    const maxVal = Math.max(...xArr.map(Math.abs), ...yArr.map(Math.abs), 0.01);
    const sc = (W / 2 - 20) / maxVal;
    const toSx = v => W / 2 + v * sc;
    const toSy = v => H / 2 - v * sc;

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H); ctx.stroke();

    // Spiral
    if (xArr.length > 1) {
      ctx.beginPath();
      xArr.forEach((x, i) => {
        const sx = toSx(x), sy = toSy(yArr[i]);
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      const color = sigma < 0 ? '#00c9b8' : '#f87171';
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();

      // Dot at end
      const last = xArr.length - 1;
      ctx.beginPath(); ctx.arc(toSx(xArr[last]), toSy(yArr[last]), 5, 0, Math.PI*2);
      ctx.fillStyle = '#f59e0b'; ctx.fill();
    }

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    const stable = sigma < 0;
    ctx.fillStyle = stable ? '#00c9b8' : '#f87171';
    ctx.fillText(stable ? '✓ STABLE' : '✗ UNSTABLE', 8, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(`Poles: ${sigma.toFixed(1)} ± ${omega.toFixed(1)}j`, 8, H-8);
    ctx.fillText('x₁', W-18, H/2-6);
    ctx.fillText('x₂', W/2+6, 14);
  }

  window.updateStateViz();
})();

// ── LYAPUNOV FUNCTION ──
(function initLyap() {
  const canvas = document.getElementById('lyap-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;

  window.updateLyap = function() {
    const el = document.getElementById('lyap-alpha');
    const alpha = el ? parseInt(el.value) / 10 : 1.0;
    document.getElementById('lyap-alpha-v').textContent = alpha.toFixed(1);
    draw(alpha);
  };

  function draw(alpha=1.0) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Draw heatmap for V(x) = x1² + alpha*x2²
    const imgData = ctx.createImageData(W, H);
    for (let px = 0; px < W; px++) {
      for (let py = 0; py < H; py++) {
        const x1 = (px - cx) / 60, x2 = (cy - py) / 60;
        const V = x1 * x1 + alpha * x2 * x2;
        const t = Math.min(V / 6, 1);
        const idx = (py * W + px) * 4;
        imgData.data[idx]   = Math.floor(6 + t * 80);
        imgData.data[idx+1] = Math.floor(15 + (1-t) * 60);
        imgData.data[idx+2] = Math.floor(30 + (1-t) * 100);
        imgData.data[idx+3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // Level sets (ellipses)
    const levels = [0.2, 0.5, 1.0, 2.0, 3.5];
    const colors = ['#00c9b8','#1e8fff','#4d8fff','#7aa6ff','#9ab8ff'];
    levels.forEach((lv, li) => {
      const rx = Math.sqrt(lv) * 60;
      const ry = Math.sqrt(lv / alpha) * 60;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI*2);
      ctx.strokeStyle = colors[li] + 'cc'; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Trajectories (simulated)
    const initPts = [[1.5, 1.5], [-1.5, 1.2], [1.2, -1.5], [-1.2, -1.0]];
    initPts.forEach(([x1, x2]) => {
      ctx.beginPath();
      const dt = 0.05;
      let sx = x1, sy = x2;
      for (let i = 0; i < 60; i++) {
        const px = cx + sx * 60, py = cy - sy * 60;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        sx += dt * (-sx - 0.5 * sy);
        sy += dt * (0.3 * sx - alpha * sy);
      }
      ctx.strokeStyle = 'rgba(245,158,11,0.7)'; ctx.lineWidth = 1.5; ctx.stroke();

      // Arrow dot
      ctx.beginPath(); ctx.arc(cx + x1*60, cy - x2*60, 4, 0, Math.PI*2);
      ctx.fillStyle = '#f59e0b'; ctx.fill();
    });

    // Origin
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2);
    ctx.fillStyle = '#00c9b8'; ctx.fill();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(`V(x) = x₁² + ${alpha.toFixed(1)}x₂²`, 8, 16);
  }

  window.updateLyap();
})();

// ── PHASE PORTRAIT ──
(function initPhase() {
  const canvas = document.getElementById('phase-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2;
  const scale = 55;

  window.updatePhase = function() {
    const dEl = document.getElementById('phase-damp');
    const oEl = document.getElementById('phase-omega');
    const b = dEl ? parseInt(dEl.value) / 10 : 0.8;
    const w2 = oEl ? parseInt(oEl.value) / 10 : 1.5;
    document.getElementById('phase-damp-v').textContent = b.toFixed(1);
    document.getElementById('phase-omega-v').textContent = w2.toFixed(1);
    draw(b, w2);
  };

  function draw(b=0.8, w2=1.5) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.06)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    // Vector field
    const step = 35;
    for (let px = step/2; px < W; px += step) {
      for (let py = step/2; py < H; py += step) {
        const x1 = (px - cx) / scale;
        const x2 = (cy - py) / scale;
        const dx1 = x2;
        const dx2 = -w2 * Math.sin(x1) - b * x2;
        const mag = Math.sqrt(dx1*dx1 + dx2*dx2) || 1;
        const nx = dx1/mag * 12, ny = dx2/mag * 12;
        const t = Math.min(mag / 4, 1);
        const col = `rgba(${Math.floor(30 + t*200)},${Math.floor(111 + t*50)},${Math.floor(255 - t*200)},0.4)`;
        ctx.strokeStyle = col; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + nx, py - ny); ctx.stroke();
      }
    }

    // Trajectories
    const initPts = [[2.5, 1.5], [-2.5, -1.5], [1.5, -2.0], [0.5, 2.0], [-1.5, 1.0]];
    const tColors = ['#1e6fff','#00c9b8','#7c3aed','#f59e0b','#f87171'];
    initPts.forEach(([x10, x20], ci) => {
      ctx.beginPath();
      let x1 = x10, x2 = x20;
      const dt = 0.04;
      for (let i = 0; i < 200; i++) {
        const px = cx + x1 * scale, py = cy - x2 * scale;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        const dx1 = x2;
        const dx2 = -w2 * Math.sin(x1) - b * x2;
        x1 += dx1 * dt; x2 += dx2 * dt;
      }
      ctx.strokeStyle = tColors[ci % tColors.length] + 'cc';
      ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Equilibrium at origin
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2);
    ctx.fillStyle = '#00c9b8'; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('θ (position)', W-95, cy-6);
    ctx.fillText('θ̇ (velocity)', cx+6, 14);
    ctx.fillStyle = b > 0 ? '#00c9b8' : '#f59e0b';
    ctx.fillText(b > 0 ? '● Stable Spiral' : '● Center (b=0)', 8, 16);
  }

  window.updatePhase();
})();
