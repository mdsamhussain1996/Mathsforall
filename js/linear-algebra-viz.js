/**
 * linear-algebra-viz.js
 * High-performance interactive Canvas & SVG engine for Linear Algebra topics.
 * Supports draggable vectors, matrix transformations, geometric decompositions,
 * step-by-step algorithms, and real-time parameter sweeps.
 */

// Helper utility: clamp
function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. TOPIC 1.1: Vector Addition & Scalar Multiplication
// ─────────────────────────────────────────────────────────────────────────────
function initVectorAdditionViz() {
  const canvas = document.getElementById('canvas-vec-add');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let u = { x: 3, y: 2 };
  let v = { x: 1, y: 4 };
  let c1 = 1.0;
  let c2 = 1.0;
  let dragging = null; // 'u' or 'v'

  const sliderC1 = document.getElementById('slider-vec-c1');
  const sliderC2 = document.getElementById('slider-vec-c2');
  const readout = document.getElementById('readout-vec-add');

  function toScreen(pt, w, h, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }

  function toMath(pt, w, h, scale, origin) {
    return { x: (pt.x - origin.x) / scale, y: -(pt.y - origin.y) / scale };
  }

  function drawArrow(from, to, color, width = 3, headLen = 10) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(to.x - headLen * Math.cos(angle - Math.PI / 6), to.y - headLen * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(to.x - headLen * Math.cos(angle + Math.PI / 6), to.y - headLen * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fill();
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 28;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = origin.x % scale; x < w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = origin.y % scale; y < h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); ctx.stroke();

    const cu = { x: u.x * c1, y: u.y * c1 };
    const cv = { x: v.x * c2, y: v.y * c2 };
    const wVec = { x: cu.x + cv.x, y: cu.y + cv.y };

    const sO = origin;
    const sU = toScreen(cu, w, h, scale, origin);
    const sV = toScreen(cv, w, h, scale, origin);
    const sW = toScreen(wVec, w, h, scale, origin);

    // Parallelogram dashed lines
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sU.x, sU.y); ctx.lineTo(sW.x, sW.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sV.x, sV.y); ctx.lineTo(sW.x, sW.y); ctx.stroke();
    ctx.setLineDash([]);

    // Vector u (Amber)
    drawArrow(sO, sU, '#f59e0b', 3);
    // Vector v (Cyan)
    drawArrow(sO, sV, '#06b6d4', 3);
    // Resultant w (Emerald)
    drawArrow(sO, sW, '#10b981', 4, 12);

    // Draggable handles
    const origU = toScreen(u, w, h, scale, origin);
    const origV = toScreen(v, w, h, scale, origin);
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(origU.x, origU.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath(); ctx.arc(origV.x, origV.y, 6, 0, Math.PI * 2); ctx.fill();

    // Text labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`u (${u.x.toFixed(1)}, ${u.y.toFixed(1)})`, origU.x + 8, origU.y - 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`v (${v.x.toFixed(1)}, ${v.y.toFixed(1)})`, origV.x + 8, origV.y - 8);
    ctx.fillStyle = '#34d399';
    ctx.fillText(`w = c₁u + c₂v (${wVec.x.toFixed(1)}, ${wVec.y.toFixed(1)})`, sW.x + 10, sW.y + 4);

    if (readout) {
      readout.textContent = `u = [${cu.x.toFixed(1)}, ${cu.y.toFixed(1)}]ᵀ | v = [${cv.x.toFixed(1)}, ${cv.y.toFixed(1)}]ᵀ | w = [${wVec.x.toFixed(1)}, ${wVec.y.toFixed(1)}]ᵀ`;
    }
  }

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function onPointerDown(evt) {
    const pos = getMousePos(evt);
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 28;
    const screenU = toScreen(u, w, h, scale, origin);
    const screenV = toScreen(v, w, h, scale, origin);

    const distU = Math.hypot(pos.x - screenU.x, pos.y - screenU.y);
    const distV = Math.hypot(pos.x - screenV.x, pos.y - screenV.y);

    if (distU < 15) { dragging = 'u'; evt.preventDefault(); }
    else if (distV < 15) { dragging = 'v'; evt.preventDefault(); }
  }

  function onPointerMove(evt) {
    if (!dragging) return;
    evt.preventDefault();
    const pos = getMousePos(evt);
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 28;
    const mathPt = toMath(pos, w, h, scale, origin);

    if (dragging === 'u') {
      u.x = clamp(Math.round(mathPt.x * 2) / 2, -7, 7);
      u.y = clamp(Math.round(mathPt.y * 2) / 2, -5, 5);
    } else if (dragging === 'v') {
      v.x = clamp(Math.round(mathPt.x * 2) / 2, -7, 7);
      v.y = clamp(Math.round(mathPt.y * 2) / 2, -5, 5);
    }
    draw();
  }

  function onPointerUp() { dragging = null; }

  canvas.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  canvas.addEventListener('touchstart', onPointerDown, { passive: false });
  window.addEventListener('touchmove', onPointerMove, { passive: false });
  window.addEventListener('touchend', onPointerUp);

  if (sliderC1) sliderC1.addEventListener('input', (e) => { c1 = parseFloat(e.target.value); draw(); });
  if (sliderC2) sliderC2.addEventListener('input', (e) => { c2 = parseFloat(e.target.value); draw(); });

  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TOPIC 1.2: Dot Product, Length, Angles & Projections
// ─────────────────────────────────────────────────────────────────────────────
function initDotProductViz() {
  const canvas = document.getElementById('canvas-dot-prod');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let u = { x: 4, y: 1 };
  let v = { x: 2, y: 3 };
  let dragging = null;

  const readout = document.getElementById('readout-dot-prod');
  const badgeState = document.getElementById('badge-dot-state');

  function toScreen(pt, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }
  function toMath(pt, scale, origin) {
    return { x: (pt.x - origin.x) / scale, y: -(pt.y - origin.y) / scale };
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 32;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let x = origin.x % scale; x < w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = origin.y % scale; y < h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath(); ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); ctx.stroke();

    const lenU = Math.hypot(u.x, u.y);
    const lenV = Math.hypot(v.x, v.y);
    const dot = u.x * v.x + u.y * v.y;
    const cosTheta = clamp(dot / (lenU * lenV || 1), -1, 1);
    const thetaRad = Math.acos(cosTheta);
    const thetaDeg = (thetaRad * 180 / Math.PI);

    // Projection of u onto v
    const scalarProj = dot / (lenV || 1);
    const projVec = {
      x: (scalarProj * v.x) / (lenV || 1),
      y: (scalarProj * v.y) / (lenV || 1)
    };

    const sO = origin;
    const sU = toScreen(u, scale, origin);
    const sV = toScreen(v, scale, origin);
    const sProj = toScreen(projVec, scale, origin);

    // Draw line of span(v)
    const normV = { x: v.x / lenV, y: v.y / lenV };
    const ext1 = toScreen({ x: normV.x * 12, y: normV.y * 12 }, scale, origin);
    const ext2 = toScreen({ x: -normV.x * 12, y: -normV.y * 12 }, scale, origin);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath(); ctx.moveTo(ext1.x, ext1.y); ctx.lineTo(ext2.x, ext2.y); ctx.stroke();
    ctx.setLineDash([]);

    // Orthogonal drop line (u to proj)
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sU.x, sU.y); ctx.lineTo(sProj.x, sProj.y); ctx.stroke();
    ctx.setLineDash([]);

    // Projection vector
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sProj.x, sProj.y); ctx.stroke();

    // Vectors u & v
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sU.x, sU.y); ctx.stroke();
    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sV.x, sV.y); ctx.stroke();

    // Angle Arc
    const angleU = Math.atan2(-u.y, u.x);
    const angleV = Math.atan2(-v.y, v.x);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(sO.x, sO.y, 35, Math.min(angleU, angleV), Math.max(angleU, angleV));
    ctx.stroke();

    // Handles
    ctx.fillStyle = '#fbbf24'; ctx.beginPath(); ctx.arc(sU.x, sU.y, 6, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#38bdf8'; ctx.beginPath(); ctx.arc(sV.x, sV.y, 6, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24'; ctx.fillText('u', sU.x + 8, sU.y - 6);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('v', sV.x + 8, sV.y - 6);
    ctx.fillStyle = '#c084fc'; ctx.fillText(`proj_v(u)`, sProj.x + 6, sProj.y + 16);
    ctx.fillStyle = '#34d399'; ctx.fillText(`θ = ${thetaDeg.toFixed(1)}°`, sO.x + 40, sO.y - 20);

    if (readout) {
      readout.textContent = `u·v = ${dot.toFixed(2)} | ‖u‖ = ${lenU.toFixed(2)} | ‖v‖ = ${lenV.toFixed(2)} | cos(θ) = ${cosTheta.toFixed(2)}`;
    }
    if (badgeState) {
      if (Math.abs(dot) < 0.15) {
        badgeState.textContent = 'Orthogonal (u ⊥ v, 90°)';
        badgeState.style.background = '#10b981';
      } else if (dot > 0) {
        badgeState.textContent = 'Acute Angle (u·v > 0)';
        badgeState.style.background = '#0284c7';
      } else {
        badgeState.textContent = 'Obtuse Angle (u·v < 0)';
        badgeState.style.background = '#e11d48';
      }
    }
  }

  function getMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
    const clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  function onDown(evt) {
    const pos = getMousePos(evt);
    const origin = { x: canvas.width / 2, y: canvas.height / 2 };
    const scale = 32;
    const sU = toScreen(u, scale, origin);
    const sV = toScreen(v, scale, origin);
    if (Math.hypot(pos.x - sU.x, pos.y - sU.y) < 16) { dragging = 'u'; evt.preventDefault(); }
    else if (Math.hypot(pos.x - sV.x, pos.y - sV.y) < 16) { dragging = 'v'; evt.preventDefault(); }
  }

  function onMove(evt) {
    if (!dragging) return;
    evt.preventDefault();
    const pos = getMousePos(evt);
    const origin = { x: canvas.width / 2, y: canvas.height / 2 };
    const scale = 32;
    const math = toMath(pos, scale, origin);
    if (dragging === 'u') {
      u.x = clamp(math.x, -6, 6);
      u.y = clamp(math.y, -5, 5);
    } else {
      v.x = clamp(math.x, -6, 6);
      v.y = clamp(math.y, -5, 5);
    }
    draw();
  }

  canvas.addEventListener('mousedown', onDown);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', () => dragging = null);
  canvas.addEventListener('touchstart', onDown, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', () => dragging = null);

  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TOPIC 2.1: Span & Linear Combinations Mixer
// ─────────────────────────────────────────────────────────────────────────────
function initSpanViz() {
  const canvas = document.getElementById('canvas-span-mix');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let v1 = { x: 2, y: 1 };
  let v2 = { x: -1, y: 2 };
  let c1 = 1.0;
  let c2 = 1.0;

  const sliderC1 = document.getElementById('slider-span-c1');
  const sliderC2 = document.getElementById('slider-span-c2');
  const btnCollinear = document.getElementById('btn-span-collinear');
  const btnIndependent = document.getElementById('btn-span-indep');
  const readout = document.getElementById('readout-span');

  function toScreen(pt, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 35;

    ctx.clearRect(0, 0, w, h);

    const det = v1.x * v2.y - v1.y * v2.x;
    const isCollinear = Math.abs(det) < 0.05;

    // Span representation
    if (isCollinear) {
      // Span is a 1D line
      const norm = Math.hypot(v1.x, v1.y) || 1;
      const dx = (v1.x / norm) * 15;
      const dy = (v1.y / norm) * 15;
      const p1 = toScreen({ x: -dx, y: -dy }, scale, origin);
      const p2 = toScreen({ x: dx, y: dy }, scale, origin);

      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    } else {
      // Span is all of R^2: draw faint coordinate grid for this basis
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
      ctx.lineWidth = 1;
      for (let i = -6; i <= 6; i++) {
        const line1A = toScreen({ x: i * v1.x - 10 * v2.x, y: i * v1.y - 10 * v2.y }, scale, origin);
        const line1B = toScreen({ x: i * v1.x + 10 * v2.x, y: i * v1.y + 10 * v2.y }, scale, origin);
        ctx.beginPath(); ctx.moveTo(line1A.x, line1A.y); ctx.lineTo(line1B.x, line1B.y); ctx.stroke();

        const line2A = toScreen({ x: -10 * v1.x + i * v2.x, y: -10 * v1.y + i * v2.y }, scale, origin);
        const line2B = toScreen({ x: 10 * v1.x + i * v2.x, y: 10 * v1.y + i * v2.y }, scale, origin);
        ctx.beginPath(); ctx.moveTo(line2A.x, line2A.y); ctx.lineTo(line2B.x, line2B.y); ctx.stroke();
      }
    }

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); ctx.stroke();

    // Basis vectors
    const sO = origin;
    const sV1 = toScreen(v1, scale, origin);
    const sV2 = toScreen(v2, scale, origin);

    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sV1.x, sV1.y); ctx.stroke();

    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sV2.x, sV2.y); ctx.stroke();

    // Target linear combination vector p = c1*v1 + c2*v2
    const target = { x: c1 * v1.x + c2 * v2.x, y: c1 * v1.y + c2 * v2.y };
    const sT = toScreen(target, scale, origin);

    // Path showing c1*v1 then c2*v2
    const sC1V1 = toScreen({ x: c1 * v1.x, y: c1 * v1.y }, scale, origin);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sC1V1.x, sC1V1.y); ctx.lineTo(sT.x, sT.y); ctx.stroke();
    ctx.setLineDash([]);

    // Target vector
    ctx.strokeStyle = '#10b981'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sT.x, sT.y); ctx.stroke();
    ctx.fillStyle = '#34d399'; ctx.beginPath(); ctx.arc(sT.x, sT.y, 6, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24'; ctx.fillText('v₁', sV1.x + 6, sV1.y);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('v₂', sV2.x + 6, sV2.y);
    ctx.fillStyle = '#34d399'; ctx.fillText(`p = ${c1.toFixed(1)}v₁ + ${c2.toFixed(1)}v₂`, sT.x + 8, sT.y - 8);

    if (readout) {
      if (isCollinear) {
        readout.textContent = `COLLINEAR! det = 0. Span is a 1D line in ℝ² (Rank 1). Cannot reach any point outside this line.`;
        readout.style.color = '#ef4444';
      } else {
        readout.textContent = `INDEPENDENT! det = ${det.toFixed(1)}. Span is all of ℝ² (Dimension 2). Any point can be reached!`;
        readout.style.color = '#38bdf8';
      }
    }
  }

  if (sliderC1) sliderC1.addEventListener('input', (e) => { c1 = parseFloat(e.target.value); draw(); });
  if (sliderC2) sliderC2.addEventListener('input', (e) => { c2 = parseFloat(e.target.value); draw(); });
  if (btnCollinear) btnCollinear.addEventListener('click', () => {
    v1 = { x: 2, y: 1 };
    v2 = { x: 4, y: 2 }; // Collinear!
    draw();
  });
  if (btnIndependent) btnIndependent.addEventListener('click', () => {
    v1 = { x: 2, y: 1 };
    v2 = { x: -1, y: 2 }; // Independent!
    draw();
  });

  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TOPIC 4.1: Matrices as 2D Linear Transformations Playground
// ─────────────────────────────────────────────────────────────────────────────
function initTransform2DViz() {
  const canvas = document.getElementById('canvas-transform-2d');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Matrix: [ [a, b], [c, d] ]
  let a = 1, b = 0;
  let c = 0, d = 1;

  const sliderA = document.getElementById('slider-tf-a');
  const sliderB = document.getElementById('slider-tf-b');
  const sliderC = document.getElementById('slider-tf-c');
  const sliderD = document.getElementById('slider-tf-d');
  const readout = document.getElementById('readout-tf-det');

  function toScreen(pt, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }

  function transform(pt) {
    return {
      x: a * pt.x + b * pt.y,
      y: c * pt.x + d * pt.y
    };
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 36;

    ctx.clearRect(0, 0, w, h);

    // Draw background original faint grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = -8; x <= 8; x++) {
      const p1 = toScreen({ x, y: -8 }, scale, origin);
      const p2 = toScreen({ x, y: 8 }, scale, origin);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }
    for (let y = -8; y <= 8; y++) {
      const p1 = toScreen({ x: -8, y }, scale, origin);
      const p2 = toScreen({ x, y: 8 }, scale, origin);
      ctx.beginPath(); ctx.moveTo(p1.x, p1.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
    }

    // Draw TRANSFORMED GRID
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1;
    for (let i = -6; i <= 6; i++) {
      // vertical grid lines transformed
      const pA = toScreen(transform({ x: i, y: -6 }), scale, origin);
      const pB = toScreen(transform({ x: i, y: 6 }), scale, origin);
      ctx.beginPath(); ctx.moveTo(pA.x, pA.y); ctx.lineTo(pB.x, pB.y); ctx.stroke();

      // horizontal grid lines transformed
      const pC = toScreen(transform({ x: -6, y: i }), scale, origin);
      const pD = toScreen(transform({ x: 6, y: i }), scale, origin);
      ctx.beginPath(); ctx.moveTo(pC.x, pC.y); ctx.lineTo(pD.x, pD.y); ctx.stroke();
    }

    // Axes (transformed)
    const axX1 = toScreen(transform({ x: -8, y: 0 }), scale, origin);
    const axX2 = toScreen(transform({ x: 8, y: 0 }), scale, origin);
    const axY1 = toScreen(transform({ x: 0, y: -8 }), scale, origin);
    const axY2 = toScreen(transform({ x: 0, y: 8 }), scale, origin);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(axX1.x, axX1.y); ctx.lineTo(axX2.x, axX2.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(axY1.x, axY1.y); ctx.lineTo(axY2.x, axY2.y); ctx.stroke();

    // Unit square transformed (0,0) -> (1,0) -> (1,1) -> (0,1)
    const p0 = toScreen(transform({ x: 0, y: 0 }), scale, origin);
    const p1 = toScreen(transform({ x: 1, y: 0 }), scale, origin); // T(i) = [a, c]
    const p2 = toScreen(transform({ x: 1, y: 1 }), scale, origin);
    const p3 = toScreen(transform({ x: 0, y: 1 }), scale, origin); // T(j) = [b, d]

    const det = a * d - b * c;
    ctx.fillStyle = det >= 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.lineTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.lineTo(p3.x, p3.y);
    ctx.closePath();
    ctx.fill();

    // Basis vectors i & j transformed
    ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 3; // T(i)
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y); ctx.stroke();

    ctx.strokeStyle = '#06b6d4'; ctx.lineWidth = 3; // T(j)
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p3.x, p3.y); ctx.stroke();

    // Labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24'; ctx.fillText(`T(i) = [${a.toFixed(1)}, ${c.toFixed(1)}]ᵀ`, p1.x + 8, p1.y);
    ctx.fillStyle = '#38bdf8'; ctx.fillText(`T(j) = [${b.toFixed(1)}, ${d.toFixed(1)}]ᵀ`, p3.x + 8, p3.y);

    if (readout) {
      readout.textContent = `det(A) = ad - bc = (${a.toFixed(1)}·${d.toFixed(1)}) - (${b.toFixed(1)}·${c.toFixed(1)}) = ${det.toFixed(2)} ${det < 0 ? '(Flipped orientation!)' : det === 0 ? '(Space collapsed!)' : '(Area scaling factor)'}`;
      readout.style.color = det === 0 ? '#ef4444' : det < 0 ? '#f43f5e' : '#34d399';
    }
  }

  function setMatrix(na, nb, nc, nd) {
    a = na; b = nb; c = nc; d = nd;
    if (sliderA) sliderA.value = a;
    if (sliderB) sliderB.value = b;
    if (sliderC) sliderC.value = c;
    if (sliderD) sliderD.value = d;
    draw();
  }

  if (sliderA) sliderA.addEventListener('input', (e) => { a = parseFloat(e.target.value); draw(); });
  if (sliderB) sliderB.addEventListener('input', (e) => { b = parseFloat(e.target.value); draw(); });
  if (sliderC) sliderC.addEventListener('input', (e) => { c = parseFloat(e.target.value); draw(); });
  if (sliderD) sliderD.addEventListener('input', (e) => { d = parseFloat(e.target.value); draw(); });

  // Presets
  const btnIdentity = document.getElementById('btn-tf-id');
  const btnRot45 = document.getElementById('btn-tf-rot');
  const btnShear = document.getElementById('btn-tf-shear');
  const btnReflect = document.getElementById('btn-tf-refl');
  const btnSingular = document.getElementById('btn-tf-sing');

  if (btnIdentity) btnIdentity.addEventListener('click', () => setMatrix(1, 0, 0, 1));
  if (btnRot45) btnRot45.addEventListener('click', () => setMatrix(0.7, -0.7, 0.7, 0.7));
  if (btnShear) btnShear.addEventListener('click', () => setMatrix(1, 1.2, 0, 1));
  if (btnReflect) btnReflect.addEventListener('click', () => setMatrix(-1, 0, 0, 1));
  if (btnSingular) btnSingular.addEventListener('click', () => setMatrix(1, 2, 0.5, 1));

  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. TOPIC 3.2: Step-by-Step Gaussian Elimination Interactive Stepper
// ─────────────────────────────────────────────────────────────────────────────
function initGaussianEliminationViz() {
  const container = document.getElementById('gauss-elim-container');
  if (!container) return;

  const steps = [
    {
      title: "Initial Augmented Matrix [A | b]",
      desc: "System of 3 equations with 3 unknowns.",
      matrix: [
        [2, 1, -1, 8],
        [-3, -1, 2, -11],
        [-2, 1, 2, -3]
      ],
      pivot: [0, 0],
      op: "Original system"
    },
    {
      title: "Step 1: Eliminate x from Row 2",
      desc: "Operation: R₂ ← R₂ + (3/2)R₁ to clear entry below pivot.",
      matrix: [
        [2, 1, -1, 8],
        [0, 0.5, 0.5, 1],
        [-2, 1, 2, -3]
      ],
      pivot: [1, 1],
      op: "R₂ ← R₂ + 1.5·R₁"
    },
    {
      title: "Step 2: Eliminate x from Row 3",
      desc: "Operation: R₃ ← R₃ + R₁ to clear entry below first pivot.",
      matrix: [
        [2, 1, -1, 8],
        [0, 0.5, 0.5, 1],
        [0, 2, 1, 5]
      ],
      pivot: [1, 1],
      op: "R₃ ← R₃ + R₁"
    },
    {
      title: "Step 3: Eliminate y from Row 3 (REF Form Reached!)",
      desc: "Operation: R₃ ← R₃ - 4·R₂. Notice upper triangular form.",
      matrix: [
        [2, 1, -1, 8],
        [0, 0.5, 0.5, 1],
        [0, 0, -1, 1]
      ],
      pivot: [2, 2],
      op: "R₃ ← R₃ - 4·R₂"
    },
    {
      title: "Step 4: Scale Pivots to 1 (Backwards Elimination to RREF)",
      desc: "Scale R₃ ← -R₃ and R₂ ← 2·R₂.",
      matrix: [
        [2, 1, -1, 8],
        [0, 1, 1, 2],
        [0, 0, 1, -1]
      ],
      pivot: [2, 2],
      op: "R₂ ← 2·R₂, R₃ ← -R₃"
    },
    {
      title: "Step 5: Back-Substitute into Row 2 and Row 1",
      desc: "Clear entries above third pivot (z = -1).",
      matrix: [
        [2, 1, 0, 7],
        [0, 1, 0, 3],
        [0, 0, 1, -1]
      ],
      pivot: [1, 1],
      op: "R₂ ← R₂ - R₃, R₁ ← R₁ + R₃"
    },
    {
      title: "Step 6: Reduced Row Echelon Form (RREF) Reached!",
      desc: "R₁ ← (R₁ - R₂) / 2. Direct unique solution found!",
      matrix: [
        [1, 0, 0, 2],
        [0, 1, 0, 3],
        [0, 0, 1, -1]
      ],
      pivot: [0, 0],
      op: "R₁ ← (R₁ - R₂) / 2",
      solved: true
    }
  ];

  let currentStep = 0;
  const titleEl = document.getElementById('gauss-step-title');
  const descEl = document.getElementById('gauss-step-desc');
  const opBadge = document.getElementById('gauss-op-badge');
  const matrixEl = document.getElementById('gauss-matrix-display');
  const btnPrev = document.getElementById('btn-gauss-prev');
  const btnNext = document.getElementById('btn-gauss-next');
  const btnReset = document.getElementById('btn-gauss-reset');

  function render() {
    const s = steps[currentStep];
    if (titleEl) titleEl.textContent = s.title;
    if (descEl) descEl.textContent = s.desc;
    if (opBadge) opBadge.textContent = s.op;

    if (matrixEl) {
      let html = `<div style="display:inline-grid;grid-template-columns:repeat(3, 48px) 16px 48px;gap:8px;padding:12px;background:#09090b;border:1px solid rgba(255,255,255,0.1);border-radius:8px;font-family:'JetBrains Mono',monospace;text-align:center;">`;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const val = s.matrix[r][c];
          const isPivot = (r === s.pivot[0] && c === s.pivot[1]);
          const color = isPivot ? '#fbbf24' : (val === 0 ? 'rgba(255,255,255,0.25)' : '#e2e8f0');
          html += `<div style="color:${color};font-weight:${isPivot ? '700' : '400'};background:${isPivot ? 'rgba(217,119,6,0.2)' : 'transparent'};padding:6px 0;border-radius:4px;">${val}</div>`;
        }
        // Augmented line
        html += `<div style="border-left:2px solid rgba(217,119,6,0.5);margin:2px 0;"></div>`;
        // b vector
        html += `<div style="color:#38bdf8;font-weight:600;padding:6px 0;">${s.matrix[r][3]}</div>`;
      }
      html += `</div>`;

      if (s.solved) {
        html += `<div style="margin-top:12px;color:#34d399;font-weight:600;font-size:0.9rem;">✓ Solution: x = 2, y = 3, z = -1</div>`;
      }
      matrixEl.innerHTML = html;
    }

    if (btnPrev) btnPrev.disabled = (currentStep === 0);
    if (btnNext) btnNext.disabled = (currentStep === steps.length - 1);
  }

  if (btnPrev) btnPrev.addEventListener('click', () => { if (currentStep > 0) { currentStep--; render(); } });
  if (btnNext) btnNext.addEventListener('click', () => { if (currentStep < steps.length - 1) { currentStep++; render(); } });
  if (btnReset) btnReset.addEventListener('click', () => { currentStep = 0; render(); });

  render();
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TOPIC 6.3: Least Squares Approximation & Linear Regression
// ─────────────────────────────────────────────────────────────────────────────
function initLeastSquaresViz() {
  const canvas = document.getElementById('canvas-least-squares');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let points = [
    { x: 1, y: 1.5 },
    { x: 2, y: 2.8 },
    { x: 3, y: 2.2 },
    { x: 4, y: 4.1 },
    { x: 5, y: 4.8 },
    { x: 6, y: 5.5 }
  ];

  const readout = document.getElementById('readout-least-squares');
  const btnReset = document.getElementById('btn-ls-reset');

  function toScreen(pt, origin, scaleX, scaleY) {
    return { x: origin.x + pt.x * scaleX, y: origin.y - pt.y * scaleY };
  }
  function toMath(pt, origin, scaleX, scaleY) {
    return { x: (pt.x - origin.x) / scaleX, y: -(pt.y - origin.y) / scaleY };
  }

  function computeFit() {
    const n = points.length;
    let sumX = 0, sumY = 0, sumXX = 0, sumXY = 0;
    for (let p of points) {
      sumX += p.x;
      sumY += p.y;
      sumXX += p.x * p.x;
      sumXY += p.x * p.y;
    }
    const denom = (n * sumXX - sumX * sumX);
    const m = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;
    const c = denom === 0 ? 0 : (sumY - m * sumX) / n;

    let sse = 0;
    for (let p of points) {
      const pred = m * p.x + c;
      sse += Math.pow(p.y - pred, 2);
    }
    return { m, c, sse };
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    const origin = { x: 50, y: h - 50 };
    const scaleX = (w - 80) / 8;
    const scaleY = (h - 80) / 8;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(origin.x, 20); ctx.lineTo(origin.x, origin.y); ctx.lineTo(w - 20, origin.y); ctx.stroke();

    // Ticks
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    for (let x = 1; x <= 7; x++) {
      const s = toScreen({ x, y: 0 }, origin, scaleX, scaleY);
      ctx.fillText(x, s.x - 3, origin.y + 15);
    }
    for (let y = 1; y <= 7; y++) {
      const s = toScreen({ x: 0, y }, origin, scaleX, scaleY);
      ctx.fillText(y, origin.x - 20, s.y + 4);
    }

    const { m, c, sse } = computeFit();

    // Regression line
    const pStart = toScreen({ x: 0, y: c }, origin, scaleX, scaleY);
    const pEnd = toScreen({ x: 8, y: m * 8 + c }, origin, scaleX, scaleY);

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(pStart.x, pStart.y); ctx.lineTo(pEnd.x, pEnd.y); ctx.stroke();

    // Residual squares & error lines
    for (let p of points) {
      const predY = m * p.x + c;
      const sActual = toScreen(p, origin, scaleX, scaleY);
      const sPred = toScreen({ x: p.x, y: predY }, origin, scaleX, scaleY);

      // Residual drop line
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(sActual.x, sActual.y); ctx.lineTo(sPred.x, sPred.y); ctx.stroke();

      // Shaded square box representing e_i^2
      const sqSize = sActual.y - sPred.y;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
      ctx.fillRect(sPred.x, sPred.y, -sqSize, sqSize);

      // Data point dot
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(sActual.x, sActual.y, 6, 0, Math.PI * 2); ctx.fill();
    }

    if (readout) {
      readout.textContent = `ŷ = ${m.toFixed(2)}x + ${c.toFixed(2)} | Sum of Squared Errors (SSE) = ${sse.toFixed(2)}`;
    }
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleFactorX = canvas.width / rect.width;
    const scaleFactorY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleFactorX;
    const clickY = (e.clientY - rect.top) * scaleFactorY;

    const origin = { x: 50, y: canvas.height - 50 };
    const scaleX = (canvas.width - 80) / 8;
    const scaleY = (canvas.height - 80) / 8;
    const math = toMath({ x: clickX, y: clickY }, origin, scaleX, scaleY);

    if (math.x >= 0.5 && math.x <= 7.5 && math.y >= 0.5 && math.y <= 7.5) {
      points.push({ x: math.x, y: math.y });
      draw();
    }
  });

  if (btnReset) btnReset.addEventListener('click', () => {
    points = [
      { x: 1, y: 1.5 }, { x: 2, y: 2.8 }, { x: 3, y: 2.2 },
      { x: 4, y: 4.1 }, { x: 5, y: 4.8 }, { x: 6, y: 5.5 }
    ];
    draw();
  });

  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. TOPIC 7.1: Eigenvalues & Eigenvectors Sweep
// ─────────────────────────────────────────────────────────────────────────────
function initEigenvaluesViz() {
  const canvas = document.getElementById('canvas-eigen-sweep');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Matrix: [ [2, 1], [1, 2] ]
  // Eigenvalues: lambda1 = 3 (v1 = [1, 1]ᵀ, theta = 45°), lambda2 = 1 (v2 = [-1, 1]ᵀ, theta = 135°)
  const A = [[2, 1], [1, 2]];

  const slider = document.getElementById('slider-eigen-angle');
  const readout = document.getElementById('readout-eigen');
  const badge = document.getElementById('badge-eigen-status');

  function toScreen(pt, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }

  function draw() {
    const angleDeg = parseFloat(slider.value);
    const angleRad = (angleDeg * Math.PI) / 180;
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Grid & axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let x = origin.x % scale; x < w; x += scale) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = origin.y % scale; y < h; y += scale) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath(); ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); ctx.stroke();

    // Input unit vector x
    const vx = Math.cos(angleRad);
    const vy = Math.sin(angleRad);

    // Output transformed vector Ax
    const ax = A[0][0] * vx + A[0][1] * vy;
    const ay = A[1][0] * vx + A[1][1] * vy;

    const sO = origin;
    const sX = toScreen({ x: vx, y: vy }, scale, origin);
    const sAx = toScreen({ x: ax, y: ay }, scale, origin);

    // Cross product to test alignment (parallel vectors have cross product 0)
    const cross = vx * ay - vy * ax;
    const isEigen = Math.abs(cross) < 0.08;

    // Draw unit circle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath(); ctx.arc(sO.x, sO.y, scale, 0, Math.PI * 2); ctx.stroke();

    // Input vector x (Amber)
    ctx.strokeStyle = isEigen ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sX.x, sX.y); ctx.stroke();

    // Output vector Ax (Cyan / Glowing Green if Eigen)
    ctx.strokeStyle = isEigen ? '#34d399' : '#06b6d4';
    ctx.lineWidth = isEigen ? 5 : 3;
    ctx.beginPath(); ctx.moveTo(sO.x, sO.y); ctx.lineTo(sAx.x, sAx.y); ctx.stroke();

    // Handles & points
    ctx.fillStyle = isEigen ? '#10b981' : '#f59e0b';
    ctx.beginPath(); ctx.arc(sX.x, sX.y, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = isEigen ? '#34d399' : '#06b6d4';
    ctx.beginPath(); ctx.arc(sAx.x, sAx.y, 6, 0, Math.PI * 2); ctx.fill();

    // Labels
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#fbbf24'; ctx.fillText('x', sX.x + 8, sX.y - 4);
    ctx.fillStyle = '#38bdf8'; ctx.fillText('Ax', sAx.x + 8, sAx.y - 4);

    const stretch = Math.hypot(ax, ay) / Math.hypot(vx, vy);

    if (readout) {
      readout.textContent = `x = [${vx.toFixed(2)}, ${vy.toFixed(2)}]ᵀ | Ax = [${ax.toFixed(2)}, ${ay.toFixed(2)}]ᵀ | Stretch Factor = ${stretch.toFixed(2)}`;
    }
    if (badge) {
      if (isEigen) {
        const lambda = stretch.toFixed(1);
        badge.textContent = `★ EIGENVECTOR! Ax = ${lambda}x (λ = ${lambda})`;
        badge.style.background = '#10b981';
      } else {
        badge.textContent = `Off-Axis: Ax rotates away from x`;
        badge.style.background = 'rgba(255,255,255,0.1)';
      }
    }
  }

  if (slider) slider.addEventListener('input', draw);
  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. TOPIC 8.1: SVD 3-Stage Geometric Pipeline
// ─────────────────────────────────────────────────────────────────────────────
function initSVDViz() {
  const canvas = document.getElementById('canvas-svd-pipeline');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stage = 3; // 0 = Circle, 1 = Rotated V^T, 2 = Stretched Sigma, 3 = Rotated U
  const slider = document.getElementById('slider-svd-stage');
  const readout = document.getElementById('readout-svd-stage');

  // Matrix A = U * Sigma * V^T
  // Sigma = diag(2.4, 0.9)
  // V = Rot(30 deg), U = Rot(60 deg)
  const sigma1 = 2.4, sigma2 = 0.9;
  const thetaV = 30 * Math.PI / 180;
  const thetaU = 60 * Math.PI / 180;

  function toScreen(pt, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }

  function draw() {
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 50;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath(); ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); ctx.stroke();

    const currentStage = parseFloat(slider.value); // 0 to 3 continuously

    // Interpolate transformation:
    // t0->1: Apply V^T (rotate by -thetaV * t)
    // t1->2: Stretch by Sigma
    // t2->3: Apply U (rotate by thetaU * t)
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2.5;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';

    ctx.beginPath();
    for (let deg = 0; deg <= 360; deg += 3) {
      const rad = deg * Math.PI / 180;
      let x = Math.cos(rad);
      let y = Math.sin(rad);

      // Stage 1: V^T rotation
      const t1 = clamp(currentStage, 0, 1);
      const curAngV = -thetaV * t1;
      let rx1 = Math.cos(curAngV) * x - Math.sin(curAngV) * y;
      let ry1 = Math.sin(curAngV) * x + Math.cos(curAngV) * y;

      // Stage 2: Sigma stretching
      const t2 = clamp(currentStage - 1, 0, 1);
      let sx = rx1 * (1 + (sigma1 - 1) * t2);
      let sy = ry1 * (1 + (sigma2 - 1) * t2);

      // Stage 3: U rotation
      const t3 = clamp(currentStage - 2, 0, 1);
      const curAngU = thetaU * t3;
      let fx = Math.cos(curAngU) * sx - Math.sin(curAngU) * sy;
      let fy = Math.sin(curAngU) * sx + Math.cos(curAngU) * sy;

      const s = toScreen({ x: fx, y: fy }, scale, origin);
      if (deg === 0) ctx.moveTo(s.x, s.y);
      else ctx.lineTo(s.x, s.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Singular vectors: axes of the ellipse
    const tTotal = currentStage;
    let desc = "";
    if (tTotal < 0.5) desc = "Step 0: Unit Sphere/Circle in Domain Space";
    else if (tTotal < 1.5) desc = "Step 1: Orthogonal Rotation by Vᵀ (Aligning with principal input axes)";
    else if (tTotal < 2.5) desc = "Step 2: Scaling along axes by Singular Values (σ₁ = 2.4, σ₂ = 0.9)";
    else desc = "Step 3: Orthogonal Rotation by U into Codomain Space (Final Ellipse)";

    if (readout) readout.textContent = desc;
  }

  if (slider) slider.addEventListener('input', draw);
  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. TOPIC 10.1: PCA Principal Component Analysis Interactive Point Cloud
// ─────────────────────────────────────────────────────────────────────────────
function initPCAViz() {
  const canvas = document.getElementById('canvas-pca');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Generate synthetic correlated Gaussian data points
  const points = [];
  const count = 30;
  for (let i = 0; i < count; i++) {
    const t = (i - count / 2) * 0.35;
    const noiseX = (Math.sin(i * 99) * 0.4);
    const noiseY = (Math.cos(i * 77) * 0.4);
    // Correlated along 35 degrees line
    points.push({
      x: t * Math.cos(0.6) - noiseY * Math.sin(0.6),
      y: t * Math.sin(0.6) + noiseY * Math.cos(0.6)
    });
  }

  const slider = document.getElementById('slider-pca-angle');
  const readout = document.getElementById('readout-pca-var');

  function toScreen(pt, scale, origin) {
    return { x: origin.x + pt.x * scale, y: origin.y - pt.y * scale };
  }

  function draw() {
    const angleDeg = parseFloat(slider.value);
    const angleRad = (angleDeg * Math.PI) / 180;
    const w = canvas.width, h = canvas.height;
    const origin = { x: w / 2, y: h / 2 };
    const scale = 40;

    ctx.clearRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath(); ctx.moveTo(0, origin.y); ctx.lineTo(w, origin.y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(origin.x, 0); ctx.lineTo(origin.x, h); ctx.stroke();

    // Axis vector w
    const wx = Math.cos(angleRad);
    const wy = Math.sin(angleRad);

    // Draw projection axis line
    const ax1 = toScreen({ x: -wx * 8, y: -wy * 8 }, scale, origin);
    const ax2 = toScreen({ x: wx * 8, y: wy * 8 }, scale, origin);
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ax1.x, ax1.y); ctx.lineTo(ax2.x, ax2.y); ctx.stroke();

    let sumProjSq = 0;

    // Draw points and projections
    for (let p of points) {
      // Scalar projection: p . w
      const proj = p.x * wx + p.y * wy;
      sumProjSq += proj * proj;

      const projPt = { x: proj * wx, y: proj * wy };
      const sP = toScreen(p, scale, origin);
      const sProj = toScreen(projPt, scale, origin);

      // Projection drop line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath(); ctx.moveTo(sP.x, sP.y); ctx.lineTo(sProj.x, sProj.y); ctx.stroke();
      ctx.setLineDash([]);

      // 1D projected point
      ctx.fillStyle = '#34d399';
      ctx.beginPath(); ctx.arc(sProj.x, sProj.y, 3.5, 0, Math.PI * 2); ctx.fill();

      // Original 2D point
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath(); ctx.arc(sP.x, sP.y, 4.5, 0, Math.PI * 2); ctx.fill();
    }

    const variance = (sumProjSq / count).toFixed(2);
    const isMax = Math.abs(angleDeg - 35) < 5 || Math.abs(angleDeg - 215) < 5;

    if (readout) {
      readout.textContent = `Axis Angle: ${angleDeg}° | Projected Variance: ${variance} ${isMax ? '★ MAXIMUM VARIANCE (1st Principal Component PC1)!' : ''}`;
      readout.style.color = isMax ? '#34d399' : '#e2e8f0';
    }
  }

  if (slider) slider.addEventListener('input', draw);
  draw();
}

// ─────────────────────────────────────────────────────────────────────────────
// Master Bootstrap: Initialize all visualizations once DOM is ready
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initVectorAdditionViz();
  initDotProductViz();
  initSpanViz();
  initTransform2DViz();
  initGaussianEliminationViz();
  initLeastSquaresViz();
  initEigenvaluesViz();
  initSVDViz();
  initPCAViz();
});
