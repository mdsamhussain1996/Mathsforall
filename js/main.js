// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ── HAMBURGER ──
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ── SCROLL ANIMATIONS ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ── SEARCH ──
const searchData = [
  { title: 'Linear Algebra', desc: 'Vectors, matrices, eigenvalues', url: 'cs-aiml.html#linear-algebra' },
  { title: 'Gradient Descent', desc: 'Optimization algorithm for ML', url: 'cs-aiml.html#optimization' },
  { title: 'Bayes Theorem', desc: 'Conditional probability', url: 'cs-aiml.html#probability' },
  { title: 'SVD', desc: 'Singular Value Decomposition', url: 'cs-aiml.html#linear-algebra' },
  { title: 'Forward Kinematics', desc: 'Robot end-effector position', url: 'robotics.html#kinematics' },
  { title: 'Inverse Kinematics', desc: 'Joint angles from position', url: 'robotics.html#kinematics' },
  { title: 'Rotation Matrix', desc: 'Coordinate frame transforms', url: 'robotics.html#transforms' },
  { title: 'Lyapunov Stability', desc: 'Stability analysis method', url: 'control.html#stability' },
  { title: 'State Space', desc: 'System representation', url: 'control.html#state-space' },
  { title: 'Phase Portrait', desc: 'Dynamical system visualization', url: 'control.html#phase' },
  { title: 'Differential Equations', desc: 'ODEs and PDEs', url: 'robotics.html#odes' },
  { title: 'Probability Distributions', desc: 'Normal, Poisson, Binomial', url: 'cs-aiml.html#probability' },
  { title: 'Fourier Transform', desc: 'Signal decomposition', url: 'more.html#physics' },
  { title: 'Game Theory', desc: 'Strategic decision making', url: 'more.html#economics' },
  { title: 'Population Dynamics', desc: 'Logistic growth models', url: 'more.html#biology' },
];

function handleSearch(q) {
  const box = document.getElementById('searchResults');
  if (!q.trim()) { box.style.display = 'none'; return; }
  const results = searchData.filter(d =>
    d.title.toLowerCase().includes(q.toLowerCase()) ||
    d.desc.toLowerCase().includes(q.toLowerCase())
  );
  if (!results.length) { box.innerHTML = '<p style="color:var(--text-muted);font-size:0.85rem;padding:0.5rem;">No results found.</p>'; box.style.display = 'block'; return; }
  box.innerHTML = results.slice(0, 6).map(r =>
    `<a href="${r.url}" style="display:block;padding:0.6rem 0.75rem;border-radius:8px;text-decoration:none;transition:background 0.2s;"
        onmouseover="this.style.background='rgba(30,111,255,0.1)'" onmouseout="this.style.background='none'">
      <div style="font-size:0.9rem;font-weight:600;color:var(--text-primary)">${r.title}</div>
      <div style="font-size:0.78rem;color:var(--text-muted)">${r.desc}</div>
    </a>`
  ).join('');
  box.style.display = 'block';
}

document.addEventListener('click', e => {
  if (!e.target.closest('#searchResults') && !e.target.closest('#searchInput')) {
    const box = document.getElementById('searchResults');
    if (box) box.style.display = 'none';
  }
});

// ── DAILY INSIGHTS ──
const insights = [
  { quote: "Mathematics is the language with which God has written the universe.", attr: "— Galileo Galilei" },
  { quote: "The only way to learn mathematics is to do mathematics.", attr: "— Paul Halmos" },
  { quote: "Pure mathematics is, in its way, the poetry of logical ideas.", attr: "— Albert Einstein" },
  { quote: "In mathematics, the art of proposing a question must be held of higher value than solving it.", attr: "— Georg Cantor" },
  { quote: "Mathematics is not about numbers, equations, computations, or algorithms — it is about understanding.", attr: "— William Paul Thurston" },
  { quote: "The mathematician does not study pure mathematics because it is useful; he studies it because he delights in it.", attr: "— Henri Poincaré" },
  { quote: "To those who do not know mathematics it is difficult to get across a real feeling as to the beauty of nature.", attr: "— Richard Feynman" },
];

let insightIdx = Math.floor(Math.random() * insights.length);

function showInsight() {
  const q = document.getElementById('insight-quote');
  const a = document.getElementById('insight-attr');
  if (!q || !a) return;
  q.style.opacity = 0;
  setTimeout(() => {
    q.textContent = insights[insightIdx].quote;
    a.textContent = insights[insightIdx].attr;
    q.style.opacity = 1;
    q.style.transition = 'opacity 0.5s ease';
  }, 300);
}

function nextInsight() {
  insightIdx = (insightIdx + 1) % insights.length;
  showInsight();
}

showInsight();

// ── HERO CANVAS – animated mathematical art ──
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;

  // Lissajous curves + floating particles
  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.6 + 0.2,
  }));

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Background gradient
    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/1.2);
    grad.addColorStop(0, 'rgba(41,37,36,0.95)');
    grad.addColorStop(1, 'rgba(28,25,23,0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = 'rgba(217,119,6,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    // Lissajous curve
    const cx = W / 2, cy = H / 2;
    const a = 3, b = 2, delta = t * 0.008;
    ctx.beginPath();
    for (let i = 0; i <= 360; i++) {
      const angle = (i / 360) * Math.PI * 2;
      const px = cx + 120 * Math.sin(a * angle + delta);
      const py = cy + 100 * Math.sin(b * angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    const lissGrad = ctx.createLinearGradient(cx - 120, cy - 100, cx + 120, cy + 100);
    lissGrad.addColorStop(0, 'rgba(217,119,6,0.8)');
    lissGrad.addColorStop(0.5, 'rgba(16,185,129,0.7)');
    lissGrad.addColorStop(1, 'rgba(217,119,6,0.6)');
    ctx.strokeStyle = lissGrad;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Sine wave
    ctx.beginPath();
    for (let x = 0; x < W; x += 2) {
      const y = cy + 30 * Math.sin((x / W) * Math.PI * 4 + t * 0.03);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(245,158,11,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217,119,6,${p.alpha})`;
      ctx.fill();
    });

    // Rotating triangle
    const triCx = W * 0.78, triCy = H * 0.22, triR = 35;
    ctx.save();
    ctx.translate(triCx, triCy);
    ctx.rotate(t * 0.012);
    ctx.beginPath();
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const px = triR * Math.cos(angle), py = triR * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = 'rgba(16,185,129,0.7)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Euler's identity text
    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText('e^(iπ) + 1 = 0', 20, H - 20);

    t++;
    requestAnimationFrame(draw);
  }

  draw();
})();
