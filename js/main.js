// ── NAVBAR SCROLL & ACCESSIBILITY ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── HAMBURGER ──
function toggleNav() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// ── ACCESSIBLE DROPDOWNS (KEYBOARD & TAP) ──
function initAccessibleDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(dd => {
    const toggle = dd.querySelector('.nav-dropdown-toggle');
    const menu = dd.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains('open');
      dropdowns.forEach(other => {
        if (other !== dd) {
          other.classList.remove('open');
          const t = other.querySelector('.nav-dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      dd.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    // Keyboard support: Enter / Space / Escape / Arrows
    toggle.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dd.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        const firstLink = menu.querySelector('a');
        if (firstLink) firstLink.focus();
      } else if (e.key === 'Escape') {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    menu.addEventListener('keydown', (e) => {
      const links = Array.from(menu.querySelectorAll('a'));
      const idx = links.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && idx < links.length - 1) {
        e.preventDefault();
        links[idx + 1].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (idx > 0) links[idx - 1].focus();
        else toggle.focus();
      } else if (e.key === 'Escape') {
        dd.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) {
      dropdowns.forEach(dd => {
        dd.classList.remove('open');
        const toggle = dd.querySelector('.nav-dropdown-toggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
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

// ── CODE SNIPPET COPY BUTTON ──
function initCodeCopy() {
  document.querySelectorAll('.code-box-copy, .code-copy-btn, .code-header button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const container = btn.closest('.code-box') || btn.closest('.code-block');
      if (!container) return;
      const codeEl = container.querySelector('pre code, .code-content, pre');
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.innerText).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = orig;
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  });
}

// ── REAL STATS COUNT-UP ANIMATION ──
function initStatsCountUp() {
  const statElements = document.querySelectorAll('.stat-value[data-target]');
  if (!statElements.length) return;

  const statsContainer = document.querySelector('.hero-stats');
  if (!statsContainer) return;

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const duration = 1200;
          const start = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(ease * target);
            el.textContent = current + suffix;
            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              el.textContent = target + suffix;
            }
          }
          requestAnimationFrame(update);
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.2 });

  statsObserver.observe(statsContainer);
}

// ── SEARCH ──
const searchData = [
  { title: "The Maths Behind Everyday Apps", desc: "Interactive stories: Google, ChatGPT, Shazam, WhatsApp, Netflix, JPEG", url: "maths-behind.html" },
  { title: "How Google Ranked the Web (PageRank)", desc: "Eigenvectors and random surfer Markov chains", url: "maths-behind/google-pagerank.html" },
  { title: "How ChatGPT Pays Attention", desc: "Query, Key, Value dot products and softmax matrix transformations", url: "maths-behind/chatgpt-attention.html" },
  { title: "How Shazam Recognises a Song", desc: "Fast Fourier Transform (FFT) and spectrogram peak hashes", url: "maths-behind/shazam-fourier.html" },
  { title: "How WhatsApp Keeps Secrets", desc: "Diffie-Hellman key exchange and modular arithmetic trapdoors", url: "maths-behind/whatsapp-rsa.html" },
  { title: "How Netflix Guesses Your Next Show", desc: "Low-rank SVD and latent factor collaborative filtering", url: "maths-behind/netflix-svd.html" },
  { title: "How JPEG Shrinks Photos", desc: "2D Discrete Cosine Transform (DCT) and perceptual quantization", url: "maths-behind/jpeg-dct.html" },

  { title: 'Linear Algebra Master Curriculum', desc: 'Complete 10-chapter curriculum with interactive simulations', url: 'linear-algebra.html' },
  { title: 'Vectors & Vector Operations', desc: 'Displacements, addition, and scaling in ℝⁿ', url: 'linear-algebra.html#topic-1-1' },
  { title: 'Dot Product & Projections', desc: 'Angles, lengths, Cauchy-Schwarz, and orthogonal shadows', url: 'linear-algebra.html#topic-1-2' },
  { title: 'Cross Product in ℝ³', desc: 'Right-hand rule, perpendicular normals, and torque', url: 'linear-algebra.html#topic-1-3' },
  { title: 'Linear Combinations & Span', desc: 'Reachable spaces and subspace generators', url: 'linear-algebra.html#topic-2-1' },
  { title: 'Linear Independence & Dependence', desc: 'Redundancy test and non-trivial zero combinations', url: 'linear-algebra.html#topic-2-2' },
  { title: 'Basis & Dimension', desc: 'Minimal spanning sets and coordinate representations', url: 'linear-algebra.html#topic-2-3' },
  { title: 'Systems of Equations & Row/Column Pictures', desc: 'Simultaneous constraints and hyperplane intersections', url: 'linear-algebra.html#topic-3-1' },
  { title: 'Gaussian Elimination & RREF', desc: 'Pivots, row operations, and echelon reduction', url: 'linear-algebra.html#topic-3-2' },
  { title: 'Matrix Inverses & Gauss-Jordan', desc: 'Invertibility conditions and elementary matrices', url: 'linear-algebra.html#topic-3-3' },
  { title: 'Linear Transformations & Matrix Representation', desc: 'Matrices as spatial mappings, rotations, and shears', url: 'linear-algebra.html#topic-4-1' },
  { title: 'Matrix Multiplication & Composition', desc: 'Chaining transformations and non-commutativity (AB ≠ BA)', url: 'linear-algebra.html#topic-4-2' },
  { title: 'The Four Fundamental Subspaces', desc: 'Strang big picture: Row space, Nullspace, Column space', url: 'linear-algebra.html#topic-4-3' },
  { title: 'Determinants & Area Scaling', desc: 'Signed area, volume multiplication, and orientation flip', url: 'linear-algebra.html#topic-5-1' },
  { title: "Cramer's Rule & Invertibility Criteria", desc: 'Volume ratio formulas and singular matrices', url: 'linear-algebra.html#topic-5-2' },
  { title: 'Orthogonal Projections', desc: 'Minimum distance projections and projection matrices', url: 'linear-algebra.html#topic-6-1' },
  { title: 'Gram-Schmidt Process & QR Factorization', desc: 'Orthonormal bases and stable QR decomposition', url: 'linear-algebra.html#topic-6-2' },
  { title: 'Least Squares Linear Regression', desc: 'Normal equations and optimal curve fitting', url: 'linear-algebra.html#topic-6-3' },
  { title: 'Eigenvalues & Eigenvectors', desc: 'Invariant axes, scaling factor λ, and characteristic polynomial', url: 'linear-algebra.html#topic-7-1' },
  { title: 'Diagonalization & Matrix Powers', desc: 'Eigen-basis conversion, A^k, and dynamical systems', url: 'linear-algebra.html#topic-7-2' },
  { title: 'Spectral Theorem for Symmetric Matrices', desc: 'Real eigenvalues, orthogonal eigenvectors, and principal axes', url: 'linear-algebra.html#topic-7-3' },
  { title: 'Singular Value Decomposition (SVD)', desc: 'Geometric pipeline: Rotation → Stretch → Rotation (A = UΣVᵀ)', url: 'linear-algebra.html#topic-8-1' },
  { title: 'Low-Rank Matrix Approximation', desc: 'Eckart-Young-Mirsky theorem and image compression', url: 'linear-algebra.html#topic-8-2' },
  { title: 'Moore-Penrose Pseudoinverse', desc: 'Minimum-norm solutions for non-square matrices (A⁺)', url: 'linear-algebra.html#topic-8-3' },
  { title: 'Quadratic Forms & Energy Surfaces', desc: 'Paraboloid bowls, saddles, and multivariate curvature', url: 'linear-algebra.html#topic-9-1' },
  { title: 'Positive Definiteness & Cholesky Decomposition', desc: 'Sylvester test and matrix square root (A = LLᵀ)', url: 'linear-algebra.html#topic-9-2' },
  { title: 'Principal Component Analysis (PCA)', desc: 'Maximum variance projections and covariance eigen-decomposition', url: 'linear-algebra.html#topic-10-1' },
  { title: 'Tensors & Self-Attention in Transformers', desc: 'Multilinear arrays and QKᵀ scaled dot-product', url: 'linear-algebra.html#topic-10-2' },
  { title: 'Graph Laplacians & Spectral Clustering', desc: 'Degree, Adjacency, Laplacian L = D - A, and Fiedler vector', url: 'linear-algebra.html#topic-10-3' },
  { title: 'Gradient Descent', desc: 'Optimization algorithm for ML', url: 'cs-aiml.html#optimization' },
  { title: 'Bayes Theorem', desc: 'Conditional probability', url: 'cs-aiml.html#probability' },
  { title: 'Forward Kinematics', desc: 'Robot end-effector position', url: 'robotics.html#kinematics' },
  { title: 'Rotation Matrix', desc: 'Coordinate frame transforms', url: 'robotics.html#transforms' },
  { title: 'Lyapunov Stability', desc: 'Stability analysis method', url: 'control.html#stability' },
  { title: 'State Space', desc: 'System representation', url: 'control.html#state-space' },
  { title: 'Systems of Linear Equations', desc: 'Graphing, substitution, and elimination', url: 'systems-of-equations.html' },
  { title: 'Discrete Mathematics for CS', desc: 'Logic, sets, combinatorics, recurrences, graphs and RSA', url: 'discrete-maths.html' },
  { title: 'Logic, Truth Tables & Induction', desc: 'Propositions, quantifiers and mathematical induction', url: 'discrete-maths.html#ch1' },
  { title: 'Sets, Relations & Functions', desc: 'Equivalence relations, injective and surjective maps', url: 'discrete-maths.html#ch2' },
  { title: 'Combinatorics & Pigeonhole Principle', desc: 'Permutations, combinations and counting', url: 'discrete-maths.html#ch3' },
  { title: 'Recurrences, Big-O & Master Theorem', desc: 'Solving T(n) for divide-and-conquer algorithms', url: 'discrete-maths.html#ch4' },
  { title: 'Graph Theory: BFS, DFS & Dijkstra', desc: 'Trees, shortest paths and graph colouring', url: 'discrete-maths.html#ch5' },
  { title: 'Number Theory & RSA', desc: 'Modular arithmetic, GCD and public-key cryptography', url: 'discrete-maths.html#ch6' },
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

// ── DAILY INSIGHTS: CS & MATHEMATICS GIANTS ──
const insights = [
  { quote: "Computer Science is no more about computers than astronomy is about telescopes.", attr: "— Edsger W. Dijkstra" },
  { quote: "Science is what we understand well enough to explain to a computer. Art is everything else we do.", attr: "— Donald E. Knuth" },
  { quote: "Mathematical reasoning may be regarded schematically as the exercise of two faculties: intuition and ingenuity.", attr: "— Alan Turing" },
  { quote: "The only way to learn mathematics is to do mathematics.", attr: "— Paul Halmos" },
  { quote: "The purpose of computing is insight, not numbers.", attr: "— Richard Hamming" },
  { quote: "The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.", attr: "— Ada Lovelace" },
  { quote: "Information is the resolution of uncertainty.", attr: "— Claude Shannon" },
  { quote: "If people do not believe that mathematics is simple, it is only because they do not realize how complicated life is.", attr: "— John von Neumann" }
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

// ── LAZY-INITIALISED HERO CANVAS ──
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;
  let animId = null;
  let isVisible = false;

  const particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 2 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.6 + 0.2,
  }));

  function draw() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, W/1.2);
    grad.addColorStop(0, 'rgba(41,37,36,0.95)');
    grad.addColorStop(1, 'rgba(28,25,23,0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(217,119,6,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

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

    ctx.beginPath();
    for (let x = 0; x < W; x += 2) {
      const y = cy + 30 * Math.sin((x / W) * Math.PI * 4 + t * 0.03);
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(245,158,11,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(217,119,6,${p.alpha})`;
      ctx.fill();
    });

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

    ctx.font = '500 14px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.fillText('e^(iπ) + 1 = 0', 20, H - 20);

    t++;
    animId = requestAnimationFrame(draw);
  }

  // IntersectionObserver to pause when offscreen
  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        if (!animId) draw();
      } else {
        isVisible = false;
        if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }
    });
  }, { threshold: 0.05 });

  heroObserver.observe(canvas);
}

// ── DOM READY INIT ──
document.addEventListener('DOMContentLoaded', () => {
  initAccessibleDropdowns();
  initStatsCountUp();
  initCodeCopy();
  showInsight();
  initHeroCanvas();
});
