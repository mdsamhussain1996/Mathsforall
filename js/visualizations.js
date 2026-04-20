// ── GRADIENT DESCENT VISUALIZATION ──
(function initGD() {
  const canvas = document.getElementById('gd-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Loss landscape: f(x) = (x-cx)^2 + some local minima offset
  let pos = { x: 0.1 }; // normalized [-1,1]
  let history = [];
  let animId = null;
  let step = 0;

  function loss(x) { return 0.8 * x * x + 0.1 * Math.sin(x * 8); }
  function dLoss(x) { return 1.6 * x + 0.8 * Math.cos(x * 8); }

  function getLR() {
    const s = document.getElementById('lr-slider');
    return s ? parseInt(s.value) / 100 : 0.15;
  }

  function restart() {
    pos.x = (Math.random() - 0.5) * 1.8;
    history = [pos.x];
    step = 0;
    if (animId) cancelAnimationFrame(animId);
    animate();
  }

  window.updateGD = function() {
    const s = document.getElementById('lr-slider');
    const v = document.getElementById('lr-val');
    if (s && v) v.textContent = (parseInt(s.value) / 100).toFixed(2);
  };

  window.restartGD = restart;

  function toScreen(x, y) {
    return {
      sx: (x / 2 + 0.5) * W,
      sy: H - (y + 0.1) / 1.0 * H * 0.85 - 10
    };
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // BG
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(217,119,6,0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Loss curve
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const nx = -1 + (i / 200) * 2;
      const ny = loss(nx);
      const { sx, sy } = toScreen(nx, ny);
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    }
    const curveGrad = ctx.createLinearGradient(0, 0, W, 0);
    curveGrad.addColorStop(0, '#d97706');
    curveGrad.addColorStop(0.5, '#10b981');
    curveGrad.addColorStop(1, '#f59e0b');
    ctx.strokeStyle = curveGrad;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under curve
    ctx.beginPath();
    const startP = toScreen(-1, loss(-1));
    ctx.moveTo(startP.sx, H);
    ctx.lineTo(startP.sx, startP.sy);
    for (let i = 1; i <= 200; i++) {
      const nx = -1 + (i / 200) * 2;
      const { sx, sy } = toScreen(nx, loss(nx));
      ctx.lineTo(sx, sy);
    }
    const endP = toScreen(1, loss(1));
    ctx.lineTo(endP.sx, H);
    ctx.closePath();
    ctx.fillStyle = 'rgba(217,119,6,0.05)';
    ctx.fill();

    // Path history
    if (history.length > 1) {
      ctx.beginPath();
      history.forEach((hx, i) => {
        const { sx, sy } = toScreen(hx, loss(hx));
        i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
      });
      ctx.strokeStyle = 'rgba(245,158,11,0.7)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Current point
    const { sx, sy } = toScreen(pos.x, loss(pos.x));
    ctx.beginPath();
    ctx.arc(sx, sy, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('Loss L(w)', 10, 20);
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(`Step: ${step}`, W - 80, 20);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(`L = ${loss(pos.x).toFixed(4)}`, W - 110, 38);
  }

  function animate() {
    drawFrame();
    if (step < 80 && Math.abs(dLoss(pos.x)) > 0.001) {
      const lr = getLR();
      pos.x -= lr * dLoss(pos.x);
      pos.x = Math.max(-1, Math.min(1, pos.x));
      history.push(pos.x);
      step++;
      setTimeout(() => { animId = requestAnimationFrame(animate); }, 60);
    }
  }

  restart();
})();
