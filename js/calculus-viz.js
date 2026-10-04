/* ============================================================
   Maths for All — Interactive Visualizations: CALCULUS & OPTIMISATION
   Course: calculus-optimisation.html (7 Interactive Canvas Labs)
   1. initSecantTangentLab
   2. initGradientContourLab
   3. initCompGraphLab
   4. initBackpropLab
   5. initConvexityLab
   6. initOptimizerRaceLab
   7. initLagrangeLab
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initSecantTangentLab();
  initGradientContourLab();
  initCompGraphLab();
  initBackpropLab();
  initConvexityLab();
  initOptimizerRaceLab();
  initLagrangeLab();
});

// Helper for high DPI canvas scaling
function setupDPI(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || canvas.width || 600;
  const height = rect.height || canvas.height || 360;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return { ctx, width, height, dpr };
}

// ════════════════════════════════════════════════════════════
// LAB 1: SECANT & TANGENT CONVERGENCE (CHAPTER 1)
// ════════════════════════════════════════════════════════════
function initSecantTangentLab() {
  const canvas = document.getElementById("canvas-secant-tangent");
  if (!canvas) return;

  const sliderX = document.getElementById("slider-tangent-x");
  const sliderH = document.getElementById("slider-tangent-h");
  const valXEl = document.getElementById("val-tangent-x");
  const valHEl = document.getElementById("val-tangent-h");
  const readAnalytic = document.getElementById("readout-analytic");
  const readNumeric = document.getElementById("readout-numeric");
  const readError = document.getElementById("readout-error");

  // f(x) = 0.25*x^3 - x + 1.2
  function f(x) { return 0.25 * Math.pow(x, 3) - x + 1.2; }
  function df(x) { return 0.75 * Math.pow(x, 2) - 1.0; }

  function draw() {
    const { ctx, width, height } = setupDPI(canvas);
    const x0 = parseFloat(sliderX.value);
    const h = parseFloat(sliderH.value);

    valXEl.textContent = x0.toFixed(2);
    valHEl.textContent = h.toFixed(3);

    const exact = df(x0);
    const num = (f(x0 + h) - f(x0)) / h;
    const err = Math.abs(exact - num);

    if (readAnalytic) readAnalytic.textContent = exact.toFixed(4);
    if (readNumeric) readNumeric.textContent = num.toFixed(4);
    if (readError) readError.textContent = err.toExponential(3);

    // Coordinate mapping: x in [-2.5, 3.5], y in [-1, 6]
    const minX = -2.2, maxX = 3.2;
    const minY = -1.2, maxY = 5.5;

    function toScreenX(x) { return ((x - minX) / (maxX - minX)) * width; }
    function toScreenY(y) { return height - ((y - minY) / (maxY - minY)) * height; }

    // Clear background
    ctx.fillStyle = "#141210";
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    for (let x = -2; x <= 3; x += 1) {
      ctx.beginPath();
      ctx.moveTo(toScreenX(x), 0);
      ctx.lineTo(toScreenX(x), height);
      ctx.stroke();
    }
    for (let y = -1; y <= 5; y += 1) {
      ctx.beginPath();
      ctx.moveTo(0, toScreenY(y));
      ctx.lineTo(width, toScreenY(y));
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(width, toScreenY(0));
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), height);
    ctx.stroke();

    // Plot f(x)
    ctx.strokeStyle = "#38bdf8"; // sky blue
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const rx = minX + (px / width) * (maxX - minX);
      const ry = f(rx);
      const py = toScreenY(ry);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Tangent Line at x0 (Amber)
    const y0 = f(x0);
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    const tX1 = x0 - 1.5, tY1 = y0 - exact * 1.5;
    const tX2 = x0 + 1.5, tY2 = y0 + exact * 1.5;
    ctx.moveTo(toScreenX(tX1), toScreenY(tY1));
    ctx.lineTo(toScreenX(tX2), toScreenY(tY2));
    ctx.stroke();
    ctx.setLineDash([]);

    // Secant Line through (x0, f(x0)) and (x0+h, f(x0+h)) (Rose Red)
    const x1 = x0 + h;
    const y1 = f(x1);
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const sX1 = x0 - 0.8, sY1 = y0 - num * 0.8;
    const sX2 = x1 + 0.8, sY2 = y1 + num * 0.8;
    ctx.moveTo(toScreenX(sX1), toScreenY(sY1));
    ctx.lineTo(toScreenX(sX2), toScreenY(sY2));
    ctx.stroke();

    // Points P and Q
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(toScreenX(x0), toScreenY(y0), 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(toScreenX(x1), toScreenY(y1), 6, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = "12px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#d97706";
    ctx.fillText(`P (x₀=${x0.toFixed(2)})`, toScreenX(x0) - 40, toScreenY(y0) - 12);
    ctx.fillStyle = "#f43f5e";
    ctx.fillText(`Q (x₀+h=${x1.toFixed(2)})`, toScreenX(x1) + 10, toScreenY(y1) + 16);
  }

  sliderX.addEventListener("input", draw);
  sliderH.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}

// ════════════════════════════════════════════════════════════
// LAB 2: MULTIVARIABLE CONTOURS & GRADIENT (CHAPTER 2)
// ════════════════════════════════════════════════════════════
function initGradientContourLab() {
  const canvas = document.getElementById("canvas-gradient-contour");
  if (!canvas) return;

  const sliderX = document.getElementById("slider-grad-x");
  const sliderY = document.getElementById("slider-grad-y");
  const sliderAngle = document.getElementById("slider-grad-angle");
  const valXEl = document.getElementById("val-grad-x");
  const valYEl = document.getElementById("val-grad-y");
  const valAngleEl = document.getElementById("val-grad-angle");
  const readNorm = document.getElementById("readout-grad-norm");
  const readDirDeriv = document.getElementById("readout-dir-deriv");

  // Paraboloid: f(x, y) = 0.5*x^2 + y^2
  function f(x, y) { return 0.5 * x * x + y * y; }
  function grad(x, y) { return [x, 2.0 * y]; }

  function draw() {
    const { ctx, width, height } = setupDPI(canvas);
    const x0 = parseFloat(sliderX.value);
    const y0 = parseFloat(sliderY.value);
    const deg = parseFloat(sliderAngle.value);
    const rad = (deg * Math.PI) / 180;

    valXEl.textContent = x0.toFixed(2);
    valYEl.textContent = y0.toFixed(2);
    valAngleEl.textContent = `${deg}°`;

    const g = grad(x0, y0);
    const gNorm = Math.sqrt(g[0] * g[0] + g[1] * g[1]);
    const u = [Math.cos(rad), Math.sin(rad)];
    const dirDeriv = g[0] * u[0] + g[1] * u[1];

    if (readNorm) readNorm.textContent = gNorm.toFixed(3);
    if (readDirDeriv) readDirDeriv.textContent = dirDeriv.toFixed(3);

    const minCoord = -3.2, maxCoord = 3.2;
    function toScreenX(x) { return ((x - minCoord) / (maxCoord - minCoord)) * width; }
    function toScreenY(y) { return height - ((y - minCoord) / (maxCoord - minCoord)) * height; }

    // Clear
    ctx.fillStyle = "#12100e";
    ctx.fillRect(0, 0, width, height);

    // Draw level curves (ellipses: 0.5*x^2 + y^2 = c)
    const levels = [0.2, 0.6, 1.2, 2.0, 3.2, 4.8, 6.8, 9.2];
    ctx.lineWidth = 1.5;
    levels.forEach((c) => {
      ctx.strokeStyle = "rgba(217, 119, 6, 0.25)";
      ctx.beginPath();
      // x = sqrt(2c)*cos(t), y = sqrt(c)*sin(t)
      const a = Math.sqrt(2 * c);
      const b = Math.sqrt(c);
      for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.05) {
        const cx = a * Math.cos(t);
        const cy = b * Math.sin(t);
        const px = toScreenX(cx);
        const py = toScreenY(cy);
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Current level curve through (x0, y0)
    const cCurrent = f(x0, y0);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
    ctx.lineWidth = 2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    const aCur = Math.sqrt(2 * cCurrent);
    const bCur = Math.sqrt(cCurrent);
    for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.05) {
      const cx = aCur * Math.cos(t);
      const cy = bCur * Math.sin(t);
      const px = toScreenX(cx);
      const py = toScreenY(cy);
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(width, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), height);
    ctx.stroke();

    const pX = toScreenX(x0);
    const pY = toScreenY(y0);

    // Helper: draw arrow
    function drawArrow(fromX, fromY, toX, toY, color, width, label) {
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = width;
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();

      const angle = Math.atan2(toY - fromY, toX - fromX);
      const headLen = 10;
      ctx.beginPath();
      ctx.moveTo(toX, toY);
      ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      if (label) {
        ctx.font = "12px 'JetBrains Mono', monospace";
        ctx.fillText(label, toX + 8, toY - 4);
      }
    }

    // Direction vector u (Cyan)
    const arrowLenU = 50;
    const uEndX = pX + arrowLenU * u[0];
    const uEndY = pY - arrowLenU * u[1];
    drawArrow(pX, pY, uEndX, uEndY, "#06b6d4", 2.5, "u (Direction)");

    // Gradient vector grad f (Amber)
    const scaleG = 25;
    const gEndX = pX + g[0] * scaleG;
    const gEndY = pY - g[1] * scaleG;
    drawArrow(pX, pY, gEndX, gEndY, "#d97706", 3, "∇f (Steepest Ascent)");

    // Probe point
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(pX, pY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  sliderX.addEventListener("input", draw);
  sliderY.addEventListener("input", draw);
  sliderAngle.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}

// ════════════════════════════════════════════════════════════
// LAB 3: COMPUTATIONAL GRAPH EVALUATOR (CHAPTER 3)
// ════════════════════════════════════════════════════════════
function initCompGraphLab() {
  const canvas = document.getElementById("canvas-comp-graph");
  if (!canvas) return;

  const sliderX = document.getElementById("slider-cg-x");
  const sliderY = document.getElementById("slider-cg-y");
  const valXEl = document.getElementById("val-cg-x");
  const valYEl = document.getElementById("val-cg-y");

  function draw() {
    const { ctx, width, height } = setupDPI(canvas);
    const x = parseFloat(sliderX.value);
    const y = parseFloat(sliderY.value);

    valXEl.textContent = x.toFixed(2);
    valYEl.textContent = y.toFixed(2);

    // Forward evaluation:
    // u = x + y
    // v = y - 2
    // z = u * v
    const u = x + y;
    const v = y - 2.0;
    const z = u * v;

    // Backward evaluation:
    const dz_dz = 1.0;
    const dz_du = dz_dz * v;
    const dz_dv = dz_dz * u;
    const dz_dx = dz_du * 1.0;
    const dz_dy = dz_du * 1.0 + dz_dv * 1.0;

    // Clear
    ctx.fillStyle = "#141210";
    ctx.fillRect(0, 0, width, height);

    // Node coordinates (responsive layout)
    const nX = width * 0.12;
    const nMid = width * 0.48;
    const nOut = width * 0.84;

    const nodes = {
      x: { x: nX, y: height * 0.3, name: "x", fwd: x.toFixed(2), bwd: dz_dx.toFixed(2) },
      y: { x: nX, y: height * 0.7, name: "y", fwd: y.toFixed(2), bwd: dz_dy.toFixed(2) },
      u: { x: nMid, y: height * 0.35, name: "u = x + y", fwd: u.toFixed(2), bwd: dz_du.toFixed(2) },
      v: { x: nMid, y: height * 0.65, name: "v = y - 2", fwd: v.toFixed(2), bwd: dz_dv.toFixed(2) },
      z: { x: nOut, y: height * 0.5, name: "z = u · v", fwd: z.toFixed(2), bwd: "1.00" }
    };

    // Draw connection edges
    function drawEdge(from, to, label) {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(from.x + 40, from.y);
      ctx.lineTo(to.x - 40, to.y);
      ctx.stroke();

      // Midpoint label
      const mx = (from.x + 40 + to.x - 40) / 2;
      const my = (from.y + to.y) / 2;
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText(label, mx - 10, my - 6);
    }

    drawEdge(nodes.x, nodes.u, "+");
    drawEdge(nodes.y, nodes.u, "+");
    drawEdge(nodes.y, nodes.v, "-2");
    drawEdge(nodes.u, nodes.z, "×");
    drawEdge(nodes.v, nodes.z, "×");

    // Draw Node Boxes
    Object.values(nodes).forEach(n => {
      const boxW = 86;
      const boxH = 54;
      const rx = n.x - boxW / 2;
      const ry = n.y - boxH / 2;

      // Card body
      ctx.fillStyle = "#1e1b18";
      ctx.strokeStyle = "rgba(217, 119, 6, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(rx, ry, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      // Node Name
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(n.name, n.x, ry + 15);

      // Forward pill (Green)
      ctx.fillStyle = "rgba(16, 185, 129, 0.2)";
      ctx.beginPath();
      ctx.roundRect(rx + 6, ry + 22, 34, 18, 4);
      ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#10b981";
      ctx.fillText(n.fwd, rx + 23, ry + 35);

      // Backward pill (Orange/Red)
      ctx.fillStyle = "rgba(244, 63, 94, 0.2)";
      ctx.beginPath();
      ctx.roundRect(rx + 46, ry + 22, 34, 18, 4);
      ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#f43f5e";
      ctx.fillText(n.bwd, rx + 63, ry + 35);
    });

    ctx.textAlign = "left";
    // Legend
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#10b981";
    ctx.fillText("■ Green: Forward Pass (Value)", 15, height - 25);
    ctx.fillStyle = "#f43f5e";
    ctx.fillText("■ Red: Backward Pass (Adjoint ∂z/∂•)", 15, height - 10);
  }

  sliderX.addEventListener("input", draw);
  sliderY.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}

// ════════════════════════════════════════════════════════════
// LAB 4: BACKPROPAGATION BY HAND VISUALIZER (CHAPTER 4)
// ════════════════════════════════════════════════════════════
function initBackpropLab() {
  const canvas = document.getElementById("canvas-backprop");
  if (!canvas) return;

  const btnStep = document.getElementById("btn-bp-step");
  const btnReset = document.getElementById("btn-bp-reset");
  const sliderLR = document.getElementById("slider-bp-lr");
  const valLREl = document.getElementById("val-bp-lr");
  const readLoss = document.getElementById("readout-bp-loss");
  const readPred = document.getElementById("readout-bp-pred");

  // State of network weights
  let x = [0.05, 0.10];
  let target = 0.50;
  let W1 = [[0.15, 0.20], [0.25, 0.30]]; // 2 hidden neurons
  let b1 = [0.35, 0.35];
  let W2 = [0.40, 0.45];
  let b2 = 0.60;

  function sigmoid(v) { return 1.0 / (1.0 + Math.exp(-v)); }

  function forward() {
    const z1_0 = x[0] * W1[0][0] + x[1] * W1[1][0] + b1[0];
    const z1_1 = x[0] * W1[0][1] + x[1] * W1[1][1] + b1[1];
    const a1_0 = sigmoid(z1_0);
    const a1_1 = sigmoid(z1_1);
    const z2 = a1_0 * W2[0] + a1_1 * W2[1] + b2;
    const y_hat = sigmoid(z2);
    const loss = 0.5 * Math.pow(y_hat - target, 2);
    return { z1: [z1_0, z1_1], a1: [a1_0, a1_1], z2, y_hat, loss };
  }

  function backward(fwd) {
    const dL_dyhat = fwd.y_hat - target;
    const dyhat_dz2 = fwd.y_hat * (1 - fwd.y_hat);
    const delta2 = dL_dyhat * dyhat_dz2;

    const dW2 = [delta2 * fwd.a1[0], delta2 * fwd.a1[1]];
    const db2 = delta2;

    const delta1_0 = delta2 * W2[0] * (fwd.a1[0] * (1 - fwd.a1[0]));
    const delta1_1 = delta2 * W2[1] * (fwd.a1[1] * (1 - fwd.a1[1]));

    const dW1 = [
      [delta1_0 * x[0], delta1_1 * x[0]],
      [delta1_0 * x[1], delta1_1 * x[1]]
    ];
    const db1 = [delta1_0, delta1_1];

    return { delta2, dW2, db2, delta1: [delta1_0, delta1_1], dW1, db1 };
  }

  function draw() {
    const { ctx, width, height } = setupDPI(canvas);
    const lr = parseFloat(sliderLR.value);
    valLREl.textContent = lr.toFixed(2);

    const fwd = forward();
    if (readLoss) readLoss.textContent = fwd.loss.toFixed(6);
    if (readPred) readPred.textContent = fwd.y_hat.toFixed(4);

    ctx.fillStyle = "#141210";
    ctx.fillRect(0, 0, width, height);

    // Layer x positions
    const l1X = width * 0.15;
    const l2X = width * 0.50;
    const l3X = width * 0.85;

    const yIn = [height * 0.32, height * 0.68];
    const yHid = [height * 0.32, height * 0.68];
    const yOut = height * 0.50;

    // Connections Input -> Hidden
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.strokeStyle = "rgba(217, 119, 6, 0.3)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(l1X, yIn[i]);
        ctx.lineTo(l2X, yHid[j]);
        ctx.stroke();

        ctx.font = "10px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        const mx = (l1X * 2 + l2X) / 3;
        const my = (yIn[i] * 2 + yHid[j]) / 3;
        ctx.fillText(`w=${W1[i][j].toFixed(2)}`, mx, my);
      }
    }

    // Connections Hidden -> Output
    for (let j = 0; j < 2; j++) {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(l2X, yHid[j]);
      ctx.lineTo(l3X, yOut);
      ctx.stroke();

      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      const mx = (l2X + l3X * 2) / 3;
      const my = (yHid[j] + yOut * 2) / 3;
      ctx.fillText(`w=${W2[j].toFixed(2)}`, mx - 10, my);
    }

    // Draw Neurons
    function drawNeuron(px, py, label, val, sub) {
      ctx.fillStyle = "#26221f";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(label, px, py - 4);
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = "#38bdf8";
      ctx.fillText(val, px, py + 10);
      if (sub) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        ctx.fillText(sub, px, py + 36);
      }
    }

    drawNeuron(l1X, yIn[0], "x₁", x[0].toFixed(2), "Input 1");
    drawNeuron(l1X, yIn[1], "x₂", x[1].toFixed(2), "Input 2");

    drawNeuron(l2X, yHid[0], "h₁", fwd.a1[0].toFixed(3), "Hidden 1");
    drawNeuron(l2X, yHid[1], "h₂", fwd.a1[1].toFixed(3), "Hidden 2");

    drawNeuron(l3X, yOut, "ŷ", fwd.y_hat.toFixed(3), `Target: ${target}`);

    ctx.textAlign = "left";
  }

  btnStep.addEventListener("click", () => {
    const lr = parseFloat(sliderLR.value);
    const fwd = forward();
    const bwd = backward(fwd);

    // Apply gradient update W = W - lr * grad
    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        W1[i][j] -= lr * bwd.dW1[i][j];
      }
      b1[i] -= lr * bwd.db1[i];
      W2[i] -= lr * bwd.dW2[i];
    }
    b2 -= lr * bwd.db2;

    draw();
  });

  btnReset.addEventListener("click", () => {
    W1 = [[0.15, 0.20], [0.25, 0.30]];
    b1 = [0.35, 0.35];
    W2 = [0.40, 0.45];
    b2 = 0.60;
    draw();
  });

  sliderLR.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}

// ════════════════════════════════════════════════════════════
// LAB 5: CONVEXITY & CHORD EXPLORER (CHAPTER 5)
// ════════════════════════════════════════════════════════════
function initConvexityLab() {
  const canvas = document.getElementById("canvas-convexity");
  if (!canvas) return;

  const btnConvex = document.getElementById("btn-convex-true");
  const btnNonConvex = document.getElementById("btn-convex-false");
  const sliderT = document.getElementById("slider-convex-t");
  const valTEl = document.getElementById("val-convex-t");
  const statusEl = document.getElementById("status-convexity");

  let isConvex = true;

  // Functions:
  // Convex: f(x) = 0.4 * x^2 + 0.5
  // Non-Convex: f(x) = 0.08 * (x^4 - 4.5*x^2 + x + 8)
  function f(x) {
    if (isConvex) return 0.4 * x * x + 0.5;
    return 0.08 * (Math.pow(x, 4) - 4.5 * Math.pow(x, 2) + x + 8.0);
  }

  function draw() {
    const { ctx, width, height } = setupDPI(canvas);
    const t = parseFloat(sliderT.value);
    valTEl.textContent = t.toFixed(2);

    const x1 = -2.2;
    const x2 = 2.2;
    const y1 = f(x1);
    const y2 = f(x2);

    // Convex combination point
    const x_blend = t * x1 + (1 - t) * x2;
    const y_curve = f(x_blend);
    const y_chord = t * y1 + (1 - t) * y2;

    const conditionHolds = y_curve <= y_chord + 0.0001;

    if (statusEl) {
      if (conditionHolds) {
        statusEl.innerHTML = `<span style="color:#10b981;">✓ Convex Chord Condition Satisfied: f(tx₁ + (1-t)x₂) ≤ t f(x₁) + (1-t) f(x₂)</span>`;
      } else {
        statusEl.innerHTML = `<span style="color:#f43f5e;">✗ Violated: Curve lies strictly ABOVE the chord (Non-Convex Region!)</span>`;
      }
    }

    const minX = -3.2, maxX = 3.2;
    const minY = -0.5, maxY = 4.5;
    function toScreenX(x) { return ((x - minX) / (maxX - minX)) * width; }
    function toScreenY(y) { return height - ((y - minY) / (maxY - minY)) * height; }

    ctx.fillStyle = "#141210";
    ctx.fillRect(0, 0, width, height);

    // Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(width, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), height);
    ctx.stroke();

    // Plot curve f(x)
    ctx.strokeStyle = isConvex ? "#10b981" : "#f43f5e";
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const rx = minX + (px / width) * (maxX - minX);
      const ry = f(rx);
      const py = toScreenY(ry);
      if (px === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Plot Secant Chord between x1 and x2
    ctx.strokeStyle = "#38bdf8"; // cyan chord
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(toScreenX(x1), toScreenY(y1));
    ctx.lineTo(toScreenX(x2), toScreenY(y2));
    ctx.stroke();
    ctx.setLineDash([]);

    // Endpoints (x1, y1) and (x2, y2)
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(toScreenX(x1), toScreenY(y1), 6, 0, Math.PI * 2);
    ctx.arc(toScreenX(x2), toScreenY(y2), 6, 0, Math.PI * 2);
    ctx.fill();

    // Chord test vertical line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(toScreenX(x_blend), toScreenY(y_curve));
    ctx.lineTo(toScreenX(x_blend), toScreenY(y_chord));
    ctx.stroke();

    // Chord Point (Blue) & Curve Point (Orange)
    ctx.fillStyle = "#38bdf8";
    ctx.beginPath();
    ctx.arc(toScreenX(x_blend), toScreenY(y_chord), 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(toScreenX(x_blend), toScreenY(y_curve), 6, 0, Math.PI * 2);
    ctx.fill();

    // Labels
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("Chord Point", toScreenX(x_blend) + 10, toScreenY(y_chord) - 8);
    ctx.fillStyle = "#d97706";
    ctx.fillText("f(x_blend)", toScreenX(x_blend) + 10, toScreenY(y_curve) + 15);
  }

  btnConvex.addEventListener("click", () => {
    isConvex = true;
    btnConvex.classList.add("active");
    btnNonConvex.classList.remove("active");
    draw();
  });

  btnNonConvex.addEventListener("click", () => {
    isConvex = false;
    btnNonConvex.classList.add("active");
    btnConvex.classList.remove("active");
    draw();
  });

  sliderT.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}

// ════════════════════════════════════════════════════════════
// LAB 6: OPTIMIZER RACE PLAYGROUND (CHAPTER 6)
// ════════════════════════════════════════════════════════════
function initOptimizerRaceLab() {
  const canvas = document.getElementById("canvas-optim-race");
  if (!canvas) return;

  const btnStart = document.getElementById("btn-race-start");
  const btnReset = document.getElementById("btn-race-reset");
  const sliderLR = document.getElementById("slider-race-lr");
  const valLREl = document.getElementById("val-race-lr");

  // Anisotropic Quadratic Bowl: f(x, y) = 8*x^2 + 0.8*y^2 (steep canyon!)
  function grad(p) { return [16.0 * p[0], 1.6 * p[1]]; }

  const startPos = [-2.8, 2.6];

  let agents = {
    gd: { name: "Vanilla GD", color: "#f43f5e", pos: [...startPos], hist: [[...startPos]] },
    momentum: { name: "Momentum", color: "#38bdf8", pos: [...startPos], vel: [0, 0], hist: [[...startPos]] },
    rmsprop: { name: "RMSprop", color: "#a855f7", pos: [...startPos], s: [0, 0], hist: [[...startPos]] },
    adam: { name: "Adam", color: "#10b981", pos: [...startPos], m: [0, 0], v: [0, 0], t: 0, hist: [[...startPos]] }
  };

  let isRunning = false;
  let animId = null;

  function resetRace() {
    isRunning = false;
    if (animId) cancelAnimationFrame(animId);
    agents.gd.pos = [...startPos]; agents.gd.hist = [[...startPos]];
    agents.momentum.pos = [...startPos]; agents.momentum.vel = [0, 0]; agents.momentum.hist = [[...startPos]];
    agents.rmsprop.pos = [...startPos]; agents.rmsprop.s = [0, 0]; agents.rmsprop.hist = [[...startPos]];
    agents.adam.pos = [...startPos]; agents.adam.m = [0, 0]; agents.adam.v = [0, 0]; agents.adam.t = 0; agents.adam.hist = [[...startPos]];
    btnStart.textContent = "▶ Start Race";
    drawStatic();
  }

  function stepOptimizers() {
    const lr = parseFloat(sliderLR.value);

    // 1. Vanilla GD
    const gGD = grad(agents.gd.pos);
    agents.gd.pos[0] -= lr * gGD[0];
    agents.gd.pos[1] -= lr * gGD[1];
    agents.gd.hist.push([...agents.gd.pos]);

    // 2. Momentum (beta=0.88)
    const gM = grad(agents.momentum.pos);
    const beta = 0.88;
    agents.momentum.vel[0] = beta * agents.momentum.vel[0] + lr * gM[0];
    agents.momentum.vel[1] = beta * agents.momentum.vel[1] + lr * gM[1];
    agents.momentum.pos[0] -= agents.momentum.vel[0];
    agents.momentum.pos[1] -= agents.momentum.vel[1];
    agents.momentum.hist.push([...agents.momentum.pos]);

    // 3. RMSprop (beta2=0.92)
    const gR = grad(agents.rmsprop.pos);
    const beta2R = 0.92;
    agents.rmsprop.s[0] = beta2R * agents.rmsprop.s[0] + (1 - beta2R) * gR[0] * gR[0];
    agents.rmsprop.s[1] = beta2R * agents.rmsprop.s[1] + (1 - beta2R) * gR[1] * gR[1];
    agents.rmsprop.pos[0] -= (lr / (Math.sqrt(agents.rmsprop.s[0]) + 1e-7)) * gR[0];
    agents.rmsprop.pos[1] -= (lr / (Math.sqrt(agents.rmsprop.s[1]) + 1e-7)) * gR[1];
    agents.rmsprop.hist.push([...agents.rmsprop.pos]);

    // 4. Adam (beta1=0.9, beta2=0.99)
    agents.adam.t += 1;
    const gA = grad(agents.adam.pos);
    const b1 = 0.9, b2 = 0.99;
    agents.adam.m[0] = b1 * agents.adam.m[0] + (1 - b1) * gA[0];
    agents.adam.m[1] = b1 * agents.adam.m[1] + (1 - b1) * gA[1];
    agents.adam.v[0] = b2 * agents.adam.v[0] + (1 - b2) * gA[0] * gA[0];
    agents.adam.v[1] = b2 * agents.adam.v[1] + (1 - b2) * gA[1] * gA[1];
    const mHat0 = agents.adam.m[0] / (1 - Math.pow(b1, agents.adam.t));
    const mHat1 = agents.adam.m[1] / (1 - Math.pow(b1, agents.adam.t));
    const vHat0 = agents.adam.v[0] / (1 - Math.pow(b2, agents.adam.t));
    const vHat1 = agents.adam.v[1] / (1 - Math.pow(b2, agents.adam.t));
    agents.adam.pos[0] -= (lr / (Math.sqrt(vHat0) + 1e-7)) * mHat0;
    agents.adam.pos[1] -= (lr / (Math.sqrt(vHat1) + 1e-7)) * mHat1;
    agents.adam.hist.push([...agents.adam.pos]);
  }

  function drawStatic() {
    const { ctx, width, height } = setupDPI(canvas);
    valLREl.textContent = parseFloat(sliderLR.value).toFixed(3);

    const minC = -3.5, maxC = 3.5;
    function toScreenX(x) { return ((x - minC) / (maxC - minC)) * width; }
    function toScreenY(y) { return height - ((y - minC) / (maxC - minC)) * height; }

    ctx.fillStyle = "#12100e";
    ctx.fillRect(0, 0, width, height);

    // Contours of 8*x^2 + 0.8*y^2 = c
    const levels = [0.8, 2.5, 6.0, 12.0, 22.0, 36.0, 56.0];
    levels.forEach(c => {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      const a = Math.sqrt(c / 8.0);
      const b = Math.sqrt(c / 0.8);
      for (let t = 0; t <= Math.PI * 2 + 0.1; t += 0.05) {
        const px = toScreenX(a * Math.cos(t));
        const py = toScreenY(b * Math.sin(t));
        if (t === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });

    // Draw Trajectory paths
    Object.values(agents).forEach(ag => {
      ctx.strokeStyle = ag.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ag.hist.forEach((pt, i) => {
        const px = toScreenX(pt[0]);
        const py = toScreenY(pt[1]);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();

      // Current particle position
      const curX = toScreenX(ag.pos[0]);
      const curY = toScreenY(ag.pos[1]);
      ctx.fillStyle = ag.color;
      ctx.beginPath();
      ctx.arc(curX, curY, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Optimum (0, 0)
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.arc(toScreenX(0), toScreenY(0), 4, 0, Math.PI * 2);
    ctx.fill();

    // Legend
    ctx.font = "11px 'JetBrains Mono', monospace";
    let legX = 15;
    Object.values(agents).forEach(ag => {
      ctx.fillStyle = ag.color;
      ctx.fillText(`● ${ag.name}`, legX, 22);
      legX += 110;
    });
  }

  function loop() {
    if (!isRunning) return;
    for (let k = 0; k < 2; k++) {
      if (agents.gd.hist.length < 180) {
        stepOptimizers();
      } else {
        isRunning = false;
        btnStart.textContent = "▶ Race Finished";
      }
    }
    drawStatic();
    if (isRunning) animId = requestAnimationFrame(loop);
  }

  btnStart.addEventListener("click", () => {
    if (!isRunning) {
      isRunning = true;
      btnStart.textContent = "⏸ Pause";
      loop();
    } else {
      isRunning = false;
      btnStart.textContent = "▶ Resume";
      if (animId) cancelAnimationFrame(animId);
    }
  });

  btnReset.addEventListener("click", resetRace);
  sliderLR.addEventListener("input", drawStatic);
  window.addEventListener("resize", drawStatic);
  drawStatic();
}

// ════════════════════════════════════════════════════════════
// LAB 7: CONSTRAINED OPTIMISATION & LAGRANGE (CHAPTER 7)
// ════════════════════════════════════════════════════════════
function initLagrangeLab() {
  const canvas = document.getElementById("canvas-lagrange");
  if (!canvas) return;

  const sliderT = document.getElementById("slider-lag-pos");
  const valTEl = document.getElementById("val-lag-pos");
  const readCost = document.getElementById("readout-lag-cost");
  const readAngle = document.getElementById("readout-lag-angle");

  // Minimize f(x, y) = x^2 + y^2 subject to x + 2y = 4
  // Constraint parametrization:
  // Let y = t, then x = 4 - 2t
  function getPoint(t) {
    const y = t;
    const x = 4.0 - 2.0 * t;
    return [x, y];
  }

  function draw() {
    const { ctx, width, height } = setupDPI(canvas);
    const t = parseFloat(sliderT.value);
    valTEl.textContent = t.toFixed(2);

    const [x0, y0] = getPoint(t);
    const cost = x0 * x0 + y0 * y0;

    // Gradients:
    // grad f = [2x, 2y]
    // grad g = [1, 2]
    const gf = [2.0 * x0, 2.0 * y0];
    const gg = [1.0, 2.0];

    const gfNorm = Math.sqrt(gf[0] * gf[0] + gf[1] * gf[1]);
    const ggNorm = Math.sqrt(gg[0] * gg[0] + gg[1] * gg[1]);
    const dot = gf[0] * gg[0] + gf[1] * gg[1];
    const cosAngle = Math.max(-1, Math.min(1, dot / (gfNorm * ggNorm + 1e-9)));
    const angleDeg = (Math.acos(cosAngle) * 180) / Math.PI;

    if (readCost) readCost.textContent = cost.toFixed(3);
    if (readAngle) readAngle.textContent = `${angleDeg.toFixed(1)}° (Collinear at 0°/180°)`;

    const minC = -2.5, maxC = 5.0;
    function toScreenX(x) { return ((x - minC) / (maxC - minC)) * width; }
    function toScreenY(y) { return height - ((y - minC) / (maxC - minC)) * height; }

    ctx.fillStyle = "#12100e";
    ctx.fillRect(0, 0, width, height);

    // Draw concentric circles f(x, y) = c
    const radiuses = [1.0, 1.78, 2.5, 3.2, 4.0, 4.8];
    radiuses.forEach(r => {
      ctx.strokeStyle = "rgba(217, 119, 6, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(toScreenX(0), toScreenY(0), (r / (maxC - minC)) * width, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Constraint line: x + 2y = 4 -> y = (4 - x) / 2
    ctx.strokeStyle = "#38bdf8"; // bright cyan line
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    const xLine1 = minC, yLine1 = (4.0 - xLine1) / 2.0;
    const xLine2 = maxC, yLine2 = (4.0 - xLine2) / 2.0;
    ctx.moveTo(toScreenX(xLine1), toScreenY(yLine1));
    ctx.lineTo(toScreenX(xLine2), toScreenY(yLine2));
    ctx.stroke();

    // Optimal tangency point: x*=0.8, y*=1.6
    const optX = 0.8, optY = 1.6;
    ctx.fillStyle = "rgba(16, 185, 129, 0.8)";
    ctx.beginPath();
    ctx.arc(toScreenX(optX), toScreenY(optY), 6, 0, Math.PI * 2);
    ctx.fill();

    // Axes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, toScreenY(0));
    ctx.lineTo(width, toScreenY(0));
    ctx.moveTo(toScreenX(0), 0);
    ctx.lineTo(toScreenX(0), height);
    ctx.stroke();

    // Current point on constraint
    const pX = toScreenX(x0);
    const pY = toScreenY(y0);

    function drawArrow(fx, fy, tx, ty, col, wid, lbl) {
      ctx.strokeStyle = col;
      ctx.fillStyle = col;
      ctx.lineWidth = wid;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(tx, ty);
      ctx.stroke();

      const a = Math.atan2(ty - fy, tx - fx);
      const hl = 9;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx - hl * Math.cos(a - Math.PI / 6), ty - hl * Math.sin(a - Math.PI / 6));
      ctx.lineTo(tx - hl * Math.cos(a + Math.PI / 6), ty - hl * Math.sin(a + Math.PI / 6));
      ctx.closePath();
      ctx.fill();

      if (lbl) {
        ctx.font = "11px 'JetBrains Mono', monospace";
        ctx.fillText(lbl, tx + 6, ty - 4);
      }
    }

    // Vectors at current point
    const scale = 22;
    drawArrow(pX, pY, pX + gf[0] * scale, pY - gf[1] * scale, "#d97706", 2.5, "∇f");
    drawArrow(pX, pY, pX + gg[0] * scale * 1.5, pY - gg[1] * scale * 1.5, "#38bdf8", 2.5, "∇g");

    // Current test point
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(pX, pY, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#38bdf8";
    ctx.fillText("Constraint: x + 2y = 4", toScreenX(2.5), toScreenY(0.7) - 10);
    ctx.fillStyle = "#10b981";
    ctx.fillText("★ Optimum (0.8, 1.6)", toScreenX(optX) + 10, toScreenY(optY) - 10);
  }

  sliderT.addEventListener("input", draw);
  window.addEventListener("resize", draw);
  draw();
}
