// ── ROBOT ARM VISUALIZATION ──
(function initRobotArm() {
  const canvas = document.getElementById('robot-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const base = { x: W / 2, y: H - 40 };

  function getVal(id) { const el = document.getElementById(id); return el ? parseFloat(el.value) : 0; }
  function deg2rad(d) { return d * Math.PI / 180; }

  window.updateRobot = function() {
    const t1 = getVal('theta1'), t2 = getVal('theta2');
    const l1 = getVal('l1'), l2 = getVal('l2');
    document.getElementById('theta1-v').textContent = t1.toFixed(0) + '°';
    document.getElementById('theta2-v').textContent = t2.toFixed(0) + '°';
    document.getElementById('l1-v').textContent = l1.toFixed(0);
    document.getElementById('l2-v').textContent = l2.toFixed(0);
    drawArm(t1, t2, l1, l2);
  };

  function drawLink(x1, y1, x2, y2, color, width=12) {
    ctx.save();
    ctx.lineCap = 'round';
    // Shadow
    ctx.shadowColor = color + '50';
    ctx.shadowBlur = 12;
    // Link body
    ctx.strokeStyle = color; ctx.lineWidth = width;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    // Highlight
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function drawJoint(x, y, r, color) {
    ctx.save();
    ctx.shadowColor = color; ctx.shadowBlur = 15;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
    ctx.restore();
  }

  function drawArm(t1, t2, l1, l2) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.06)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Ground
    ctx.fillStyle = 'rgba(30,111,255,0.1)';
    ctx.fillRect(0, H - 30, W, 30);
    ctx.fillStyle = 'rgba(30,111,255,0.3)';
    ctx.fillRect(0, H - 32, W, 2);

    const rad1 = deg2rad(t1);
    // Robot lifts Y up, canvas goes down — use negative sin for Y
    const j1 = {
      x: base.x + l1 * Math.cos(rad1),
      y: base.y - l1 * Math.sin(rad1)
    };

    const rad2 = deg2rad(t1 + t2);
    const ee = {
      x: j1.x + l2 * Math.cos(rad2),
      y: j1.y - l2 * Math.sin(rad2)
    };

    // Workspace boundary (dashed circle)
    ctx.beginPath();
    ctx.arc(base.x, base.y, l1 + l2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(30,111,255,0.1)'; ctx.lineWidth = 1;
    ctx.setLineDash([6,6]); ctx.stroke(); ctx.setLineDash([]);

    // Trajectory arc
    ctx.beginPath();
    for (let a = -180; a <= 180; a += 5) {
      const r = deg2rad(t1 + a);
      const r2 = deg2rad(t1 + a + t2);
      const tx = base.x + l1 * Math.cos(r) + l2 * Math.cos(r2);
      const ty = base.y - l1 * Math.sin(r) - l2 * Math.sin(r2);
      a === -180 ? ctx.moveTo(tx, ty) : ctx.lineTo(tx, ty);
    }
    ctx.strokeStyle = 'rgba(0,201,184,0.12)'; ctx.lineWidth = 1; ctx.stroke();

    // Links
    drawLink(base.x, base.y, j1.x, j1.y, '#1e6fff');
    drawLink(j1.x, j1.y, ee.x, ee.y, '#00c9b8');

    // Joints
    drawJoint(base.x, base.y, 10, '#1e6fff');
    drawJoint(j1.x, j1.y, 8, '#4d8fff');
    drawJoint(ee.x, ee.y, 7, '#f59e0b');

    // End-effector indicator
    ctx.save();
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.7;
    const sz = 12;
    ctx.beginPath(); ctx.moveTo(ee.x - sz, ee.y); ctx.lineTo(ee.x + sz, ee.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ee.x, ee.y - sz); ctx.lineTo(ee.x, ee.y + sz); ctx.stroke();
    ctx.restore();

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(`EE: (${(ee.x-base.x).toFixed(0)}, ${(base.y-ee.y).toFixed(0)})`, 8, 20);
    ctx.fillStyle = 'rgba(30,111,255,0.8)';
    ctx.fillText(`θ₁=${t1.toFixed(0)}°`, j1.x + 10, j1.y);
    ctx.fillStyle = 'rgba(0,201,184,0.8)';
    ctx.fillText(`θ₂=${t2.toFixed(0)}°`, ee.x + 10, ee.y);
  }

  window.updateRobot();
})();

// ── ROTATION VISUALIZATION ──
(function initRotViz() {
  const canvas = document.getElementById('rot-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2, scale = 90;
  let rotAnimId = null;

  function draw(angle) {
    const rad = angle * Math.PI / 180;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Axes
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,cy); ctx.lineTo(W,cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx,0); ctx.lineTo(cx,H); ctx.stroke();

    // Unit circle
    ctx.beginPath(); ctx.arc(cx, cy, scale, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(30,111,255,0.2)'; ctx.lineWidth = 1; ctx.stroke();

    // Arc
    ctx.beginPath(); ctx.arc(cx, cy, 30, 0, -rad, rad < 0);
    ctx.strokeStyle = 'rgba(245,158,11,0.5)'; ctx.lineWidth = 2; ctx.stroke();

    // Original vector e₁ (dashed)
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + scale, cy);
    ctx.strokeStyle = 'rgba(30,111,255,0.4)'; ctx.lineWidth = 2; ctx.setLineDash([5,4]); ctx.stroke(); ctx.setLineDash([]);

    // Rotated vector
    const rx = cx + scale * Math.cos(rad), ry = cy - scale * Math.sin(rad);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry);
    ctx.strokeStyle = '#1e6fff'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(rx, ry, 5, 0, Math.PI*2);
    ctx.fillStyle = '#1e6fff'; ctx.fill();

    // Rotated e₂
    const r2x = cx + scale * Math.cos(rad + Math.PI/2), r2y = cy - scale * Math.sin(rad + Math.PI/2);
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(r2x, r2y);
    ctx.strokeStyle = '#00c9b8'; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(r2x, r2y, 5, 0, Math.PI*2);
    ctx.fillStyle = '#00c9b8'; ctx.fill();

    // Labels
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillStyle = '#f59e0b'; ctx.fillText(`θ = ${angle.toFixed(0)}°`, cx + 35, cy - 38);
    ctx.fillStyle = '#1e6fff'; ctx.fillText('R·e₁', rx + 8, ry);
    ctx.fillStyle = '#00c9b8'; ctx.fillText('R·e₂', r2x + 8, r2y);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(`cos θ = ${Math.cos(rad).toFixed(2)}`, 8, H-20);
    ctx.fillText(`sin θ = ${Math.sin(rad).toFixed(2)}`, 8, H-6);
  }

  window.updateRot = function() {
    const el = document.getElementById('rot-angle');
    const v = document.getElementById('rot-angle-v');
    const angle = el ? parseFloat(el.value) : 45;
    if (v) v.textContent = angle.toFixed(0) + '°';
    if (rotAnimId) { cancelAnimationFrame(rotAnimId); rotAnimId = null; }
    draw(angle);
  };

  window.animateRot = function() {
    let a = 0;
    function step() {
      const el = document.getElementById('rot-angle');
      if (el) el.value = a;
      document.getElementById('rot-angle-v').textContent = a.toFixed(0) + '°';
      draw(a);
      a = (a + 1.5) % 360;
      rotAnimId = requestAnimationFrame(step);
    }
    if (rotAnimId) { cancelAnimationFrame(rotAnimId); rotAnimId = null; }
    else step();
  };

  draw(45);
})();

// ── ODE / SPRING-MASS ──
(function initODE() {
  const canvas = document.getElementById('ode-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  window.updateODE = function() {
    const kEl = document.getElementById('spring-k');
    const bEl = document.getElementById('damping-b');
    const k = kEl ? parseInt(kEl.value) / 10 : 2.0;
    const b = bEl ? parseInt(bEl.value) / 10 : 0.5;
    document.getElementById('spring-k-v').textContent = k.toFixed(1);
    document.getElementById('damping-b-v').textContent = b.toFixed(1);
    simulate(k, b);
  };

  function simulate(k=2.0, b=0.5) {
    const dt = 0.05, tMax = 15;
    const steps = Math.ceil(tMax / dt);
    const xs = [];
    let x = 1.0, v = 0;
    for (let i = 0; i < steps; i++) {
      const a = -k * x - b * v;
      v += a * dt; x += v * dt;
      xs.push(x);
    }

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#060f1e'; ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(30,111,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

    // Equilibrium line
    ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.lineWidth = 1; ctx.stroke();

    // Trajectory
    const maxX = Math.max(...xs.map(Math.abs), 0.001);
    ctx.beginPath();
    xs.forEach((xi, i) => {
      const sx = (i / steps) * W;
      const sy = H/2 - (xi / maxX) * (H/2 - 20);
      i === 0 ? ctx.moveTo(sx, sy) : ctx.lineTo(sx, sy);
    });
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#1e6fff');
    grad.addColorStop(0.5, '#00c9b8');
    grad.addColorStop(1, 'rgba(0,201,184,0.2)');
    ctx.strokeStyle = grad; ctx.lineWidth = 2; ctx.stroke();

    // Labels
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText('x(t) — Spring Displacement', 8, 16);
    ctx.fillStyle = '#00c9b8';
    ctx.fillText(`k=${k.toFixed(1)} (stiffness)  b=${b.toFixed(1)} (damping)`, 8, H-8);
  }

  window.updateODE();
})();
