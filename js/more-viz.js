// ── FOURIER SERIES ──
(function initFourier() {
  const canvas = document.getElementById('fourier-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  window.updateFourier = function() {
    const el = document.getElementById('fourier-n');
    const n = el ? parseInt(el.value) : 5;
    document.getElementById('fourier-n-v').textContent = n;
    draw(n);
  };

  // Square wave: f(x) = 4/π * Σ sin((2k-1)x)/(2k-1)
  function squareWave(x, N) {
    let sum = 0;
    for (let k = 1; k <= N; k++) {
      sum += Math.sin((2*k-1) * x) / (2*k-1);
    }
    return (4/Math.PI) * sum;
  }

  function draw(N) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const cy = H/2, amp = H/2 - 20;
    // Center line
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();

    // True square wave
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const x = (px / W) * 4 * Math.PI - 2 * Math.PI;
      const sq = x % (2*Math.PI) < Math.PI ? 1 : -1;
      const sy = cy - sq * amp * 0.8;
      px === 0 ? ctx.moveTo(px, sy) : ctx.lineTo(px, sy);
    }
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1; ctx.setLineDash([5,5]); ctx.stroke(); ctx.setLineDash([]);

    // Fourier approximation
    ctx.beginPath();
    for (let px = 0; px < W; px++) {
      const x = (px / W) * 4 * Math.PI - 2 * Math.PI;
      const y = squareWave(x, N);
      const sy = cy - y * amp * 0.8;
      px === 0 ? ctx.moveTo(px, sy) : ctx.lineTo(px, sy);
    }
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#1e6fff'); grad.addColorStop(0.5, '#00c9b8'); grad.addColorStop(1, '#7c3aed');
    ctx.strokeStyle = grad; ctx.lineWidth = 2.5; ctx.stroke();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`N = ${N} harmonics`, 10, 18);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('f(x) = 4/π Σ sin((2k-1)x)/(2k-1)', 10, H-8);
  }

  draw(5);
})();

// ── SUPPLY & DEMAND ──
(function initEcon() {
  const canvas = document.getElementById('econ-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  window.updateEcon = function() {
    const dEl = document.getElementById('econ-demand');
    const sEl = document.getElementById('econ-supply');
    const dShift = dEl ? parseInt(dEl.value) : 0;
    const sSlope = sEl ? parseInt(sEl.value) / 10 : 1.5;
    document.getElementById('econ-demand-v').textContent = dShift;
    document.getElementById('econ-supply-v').textContent = sSlope.toFixed(1);
    draw(dShift, sSlope);
  };

  function draw(dShift=0, sSlope=1.5) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(40, H); ctx.stroke(); // Y-axis (price)
    ctx.beginPath(); ctx.moveTo(0, H-30); ctx.lineTo(W, H-30); ctx.stroke(); // X-axis (quantity)

    // Demand: P = 200 - 1.5*Q + dShift (downward sloping)
    // Supply: P = 20 + sSlope*Q (upward sloping)
    // In screen coords: Q = (px-40)/sc, P maps to screen Y
    const sc = (W - 60) / 10; // 10 units of Q
    const pMax = 220;
    const toSy = P => (H - 30) - (P / pMax) * (H - 50);
    const toQ = px => (px - 40) / sc;

    // Demand curve
    ctx.beginPath();
    for (let px = 40; px < W; px++) {
      const Q = toQ(px);
      const P = 200 - 15 * Q + dShift * 3;
      if (P < 0 || P > pMax) continue;
      px === 40 ? ctx.moveTo(px, toSy(P)) : ctx.lineTo(px, toSy(P));
    }
    ctx.strokeStyle = '#f87171'; ctx.lineWidth = 2.5; ctx.stroke();

    // Supply curve
    ctx.beginPath();
    for (let px = 40; px < W; px++) {
      const Q = toQ(px);
      const P = 20 + sSlope * 15 * Q;
      if (P < 0 || P > pMax) continue;
      px === 40 ? ctx.moveTo(px, toSy(P)) : ctx.lineTo(px, toSy(P));
    }
    ctx.strokeStyle = '#00c9b8'; ctx.lineWidth = 2.5; ctx.stroke();

    // Equilibrium: 200 - 15Q + dShift*3 = 20 + sSlope*15*Q
    const Q_eq = (180 + dShift * 3) / (15 + sSlope * 15);
    const P_eq = 20 + sSlope * 15 * Q_eq;
    const ex = 40 + Q_eq * sc, ey = toSy(P_eq);

    if (isFinite(ex) && ex > 40 && ex < W && ey > 0 && ey < H) {
      // Dashed lines to axes
      ctx.setLineDash([4,4]); ctx.strokeStyle = 'rgba(245,158,11,0.5)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(ex, H-30); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(40, ey); ctx.stroke();
      ctx.setLineDash([]);

      // Equilibrium dot
      ctx.beginPath(); ctx.arc(ex, ey, 7, 0, Math.PI*2);
      ctx.fillStyle = '#f59e0b'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`P*=${P_eq.toFixed(0)}  Q*=${Q_eq.toFixed(1)}`, ex + 10, ey - 8);
    }

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f87171'; ctx.fillText('Demand ↘', W - 80, 20);
    ctx.fillStyle = '#00c9b8'; ctx.fillText('Supply ↗', W - 80, 36);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('Quantity →', W - 90, H - 10);
    ctx.save(); ctx.translate(20, H/2); ctx.rotate(-Math.PI/2);
    ctx.fillText('Price ↑', -25, 0); ctx.restore();
  }

  window.updateEcon();
})();

// ── SCATTER / REGRESSION ──
(function initDataViz() {
  const canvas = document.getElementById('data-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = 35;
  let seed = 42;

  function seededRandom() {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  }

  function generateData(r, noise) {
    seed = 123;
    const pts = [];
    for (let i = 0; i < 50; i++) {
      const x = seededRandom();
      const e = (seededRandom() - 0.5) * noise / 50;
      const y = r * x + Math.sqrt(1 - r*r) * e + (1 - r) * 0.5;
      pts.push({ x, y: Math.max(0, Math.min(1, y)) });
    }
    return pts;
  }

  window.updateDataViz = function() {
    const rEl = document.getElementById('data-corr');
    const nEl = document.getElementById('data-noise');
    const r = rEl ? parseInt(rEl.value) / 100 : 0.7;
    const noise = nEl ? parseInt(nEl.value) : 20;
    document.getElementById('data-corr-v').textContent = r.toFixed(2);
    document.getElementById('data-noise-v').textContent = (noise/10).toFixed(1);
    draw(r, noise);
  };

  function draw(r=0.7, noise=20) {
    const pts = generateData(r, noise);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const toSx = v => pad + v * (W - 2*pad);
    const toSy = v => (H - pad) - v * (H - 2*pad);

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, 0); ctx.lineTo(pad, H - pad); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(pad, H-pad); ctx.lineTo(W, H-pad); ctx.stroke();

    // Regression line
    const n = pts.length;
    const mx = pts.reduce((s,p) => s+p.x,0)/n, my = pts.reduce((s,p) => s+p.y,0)/n;
    const ssxy = pts.reduce((s,p) => s+(p.x-mx)*(p.y-my),0);
    const ssx = pts.reduce((s,p) => s+(p.x-mx)**2,0);
    const slope = ssxy/ssx, intercept = my - slope*mx;
    ctx.beginPath();
    ctx.moveTo(toSx(0), toSy(intercept));
    ctx.lineTo(toSx(1), toSy(slope + intercept));
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 2; ctx.stroke();

    // Points
    pts.forEach(p => {
      ctx.beginPath(); ctx.arc(toSx(p.x), toSy(p.y), 4, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(30,111,255,0.7)'; ctx.fill();
      ctx.strokeStyle = 'rgba(30,111,255,0.9)'; ctx.lineWidth = 1; ctx.stroke();
    });

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`r = ${r.toFixed(2)}`, 8, 16);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`ŷ = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`, 8, H - 8);
  }

  window.updateDataViz();
})();

// ── SIR MODEL ──
(function initSIR() {
  const canvas = document.getElementById('sir-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  window.updateSIR = function() {
    const bEl = document.getElementById('sir-beta');
    const gEl = document.getElementById('sir-gamma');
    const beta = bEl ? parseInt(bEl.value) / 100 : 0.25;
    const gamma = gEl ? parseInt(gEl.value) / 100 : 0.10;
    document.getElementById('sir-beta-v').textContent = beta.toFixed(2);
    document.getElementById('sir-gamma-v').textContent = gamma.toFixed(2);
    draw(beta, gamma);
  };

  function draw(beta=0.25, gamma=0.1) {
    const N = 1000, I0 = 1, R0 = 0;
    let S = N - I0, I = I0, R = R0;
    const dt = 0.5, tMax = 200;
    const Sarr = [S], Iarr = [I], Rarr = [R];
    for (let t = 0; t < tMax; t += dt) {
      const dS = -beta * S * I / N;
      const dI = beta * S * I / N - gamma * I;
      const dR = gamma * I;
      S += dS*dt; I += dI*dt; R += dR*dt;
      Sarr.push(S); Iarr.push(I); Rarr.push(R);
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    const steps = Sarr.length;
    const drawLine = (arr, color) => {
      ctx.beginPath();
      arr.forEach((v, i) => {
        const sx = (i / steps) * W;
        const sy = H - 20 - (v / N) * (H - 35);
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    };

    drawLine(Sarr, '#1e6fff');
    drawLine(Iarr, '#f87171');
    drawLine(Rarr, '#00c9b8');

    // R0 indicator
    const R0val = beta / gamma;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = R0val > 1 ? '#f87171' : '#00c9b8';
    ctx.fillText(`R₀ = β/γ = ${R0val.toFixed(2)} ${R0val > 1 ? '→ Epidemic' : '→ Controlled'}`, 8, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('Time →', W - 65, H - 6);
  }

  window.updateSIR();
})();
