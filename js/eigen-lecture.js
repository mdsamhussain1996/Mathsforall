// eigen-lecture.js - Interactive simulations for Eigenvalues in AI/ML

// 1. Foundation: Interactive Transformation
(function initFoundation() {
  const canvas = document.getElementById('found-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('found-slider');
  
  const matrix = [[1.5, 0.5], [0.5, 1.5]]; // Eigenvectors: [1,1] and [-1,1]
  
  function draw() {
    const w = canvas.width, h = canvas.height;
    const cx = w/2, cy = h/2, scale = 80;
    const angle = slider.value * Math.PI / 180;
    
    ctx.clearRect(0,0,w,h);
    // Grid
    ctx.strokeStyle='rgba(255,255,255,0.05)';
    for(let i=-5; i<=5; i++) {
      ctx.beginPath(); ctx.moveTo(cx+i*20,0); ctx.lineTo(cx+i*20,h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0,cy+i*20); ctx.lineTo(w,cy+i*20); ctx.stroke();
    }
    
    // Original Vector
    const vx = Math.cos(angle), vy = Math.sin(angle);
    // Transformed
    const tx = matrix[0][0]*vx + matrix[0][1]*vy;
    const ty = matrix[1][0]*vx + matrix[1][1]*vy;
    
    // Draw orig
    ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+vx*scale, cy-vy*scale); ctx.stroke();
    
    // Draw trans
    ctx.strokeStyle='#3b82f6'; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(cx+tx*scale, cy-ty*scale); ctx.stroke();
    
    const cross = Math.abs(vx*ty - vy*tx);
    if(cross < 0.05) {
      ctx.fillStyle='#2ecc71'; ctx.font='bold 14px sans-serif';
      ctx.fillText('Aligned! (Eigenvector)', 10, 20);
    }
  }
  
  slider.addEventListener('input', draw);
  draw();
})();

// 2. PCA Scree Plot
(function initPCA() {
  const canvas = document.getElementById('pca-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const slider = document.getElementById('pca-slider');
  const kval = document.getElementById('pca-k-val');
  
  const variances = [40, 25, 15, 10, 5, 2, 1, 1, 0.5, 0.5];
  const totalVar = variances.reduce((a,b)=>a+b, 0);
  
  function draw() {
    const k = parseInt(slider.value);
    kval.textContent = k;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    
    const barW = (w - 40) / 10;
    let cum = 0;
    
    for(let i=0; i<10; i++) {
      const v = variances[i];
      const barH = (v/40) * (h-60);
      
      // Draw bar
      ctx.fillStyle = i < k ? '#10b981' : 'rgba(255,255,255,0.1)';
      ctx.fillRect(20 + i*barW + 2, h-30 - barH, barW-4, barH);
      
      if(i < k) cum += v;
    }
    
    // Draw cumulative line
    let curCum = 0;
    ctx.strokeStyle='#f59e0b'; ctx.lineWidth=2; ctx.beginPath();
    for(let i=0; i<10; i++) {
      curCum += variances[i];
      const y = h-30 - (curCum/totalVar)*(h-60);
      const x = 20 + i*barW + barW/2;
      if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    ctx.stroke();
    
    ctx.fillStyle='#fff'; ctx.font='12px sans-serif';
    ctx.fillText(`Cumulative Variance: ${Math.round((cum/totalVar)*100)}%`, 20, 20);
  }
  
  slider.addEventListener('input', draw);
  draw();
})();

// 3. SVD Simulator
(function initSVD() {
  const cOrig = document.getElementById('svd-orig-canvas');
  const cAppx = document.getElementById('svd-approx-canvas');
  if(!cOrig) return;
  const ctxO = cOrig.getContext('2d');
  const ctxA = cAppx.getContext('2d');
  const slider = document.getElementById('svd-slider');
  const stats = document.getElementById('svd-stats');
  const kval = document.getElementById('svd-k-val');
  
  const dim = 50;
  // Generate a procedural image (checkerboard + circle + noise)
  const origData = [];
  for(let y=0; y<dim; y++) {
    const row = [];
    for(let x=0; x<dim; x++) {
      let val = Math.sin(x/5)*Math.cos(y/5)*0.5 + 0.5;
      if(Math.pow(x-25,2)+Math.pow(y-25,2) < 100) val = 1;
      row.push(val);
    }
    origData.push(row);
  }
  
  // Very rough simulation of SVD by just keeping low frequency components
  function draw() {
    const k = parseInt(slider.value);
    kval.textContent = k;
    
    function render(ctx, data, isApprox) {
      const w = 200, h = 200;
      const cellW = w/dim, cellH = h/dim;
      for(let y=0; y<dim; y++) {
        for(let x=0; x<dim; x++) {
          let v = data[y][x];
          if(isApprox) {
            // Fake SVD: blur and add noise based on (50-k)
            const blur = (50-k)/50;
            v = v * (1-blur) + 0.5 * blur;
            // add artifacts
            if(k < 20) v += Math.sin(x*y*k)*0.1;
            v = Math.max(0, Math.min(1, v));
          }
          const c = Math.floor(v*255);
          ctx.fillStyle = `rgb(${c},${c},${c})`;
          ctx.fillRect(x*cellW, y*cellH, cellW, cellH);
        }
      }
    }
    
    render(ctxO, origData, false);
    render(ctxA, origData, true);
    
    const compression = Math.round((1 - (k*(dim*2+1))/(dim*dim)) * 100);
    stats.innerHTML = `Data Size: ${k*(dim*2+1)} numbers (Original: 2500) | Compression: <strong>${Math.max(0,compression)}% saved</strong>`;
  }
  
  slider.addEventListener('input', draw);
  draw();
})();

// 4. Eigenfaces Simulator
(function initEigenfaces() {
  if(!document.getElementById('ef-mean')) return;
  const slider = document.getElementById('ef-slider');
  const kval = document.getElementById('ef-k-val');
  
  function drawFace(id, baseColor, featureSize) {
    const ctx = document.getElementById(id).getContext('2d');
    ctx.fillStyle = '#111'; ctx.fillRect(0,0,100,100);
    ctx.fillStyle = baseColor;
    ctx.beginPath(); ctx.ellipse(50, 50, 30+featureSize, 40+featureSize, 0, 0, Math.PI*2); ctx.fill();
  }
  
  // Static
  drawFace('ef-mean', '#555', 0);
  drawFace('ef-1', 'rgba(255,100,100,0.5)', 5);
  drawFace('ef-2', 'rgba(100,255,100,0.5)', -5);
  
  function updateRecon() {
    const k = parseInt(slider.value);
    kval.textContent = k;
    const ctx = document.getElementById('ef-recon').getContext('2d');
    ctx.fillStyle = '#111'; ctx.fillRect(0,0,100,100);
    
    // Simulate getting sharper
    const clarity = k/20;
    const size = 30 + (5 * clarity);
    ctx.fillStyle = `rgb(${100+100*clarity}, ${100+100*clarity}, ${100+150*clarity})`;
    ctx.beginPath(); ctx.ellipse(50, 50, size, 40+size*0.2, 0, 0, Math.PI*2); ctx.fill();
    // Eyes
    if(k > 5) { ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(35,40,4,0,6); ctx.arc(65,40,4,0,6); ctx.fill(); }
    if(k > 10) { ctx.beginPath(); ctx.arc(50,65,10,0,Math.PI); ctx.stroke(); }
  }
  
  slider.addEventListener('input', updateRecon);
  updateRecon();
})();

// 5. Recommender Systems
(function initRec() {
  const canvas = document.getElementById('rec-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Points
  const users = [{x: 0.8, y: 0.2, n:'Alice'}, {x: -0.5, y: 0.6, n:'Bob'}, {x: -0.4, y: 0.7, n:'Dave'}];
  const items = [{x: 0.7, y: 0.1, n:'Action1'}, {x: 0.9, y: 0.3, n:'Action2'}, {x: -0.6, y: 0.8, n:'Romance1'}];
  
  function draw() {
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);
    
    // Axes
    ctx.strokeStyle='rgba(255,255,255,0.1)'; ctx.beginPath();
    ctx.moveTo(w/2,0); ctx.lineTo(w/2,h); ctx.moveTo(0,h/2); ctx.lineTo(w,h/2); ctx.stroke();
    
    function drawPts(pts, color) {
      ctx.fillStyle = color;
      pts.forEach(p => {
        const px = w/2 + p.x*(w/2 - 20);
        const py = h/2 - p.y*(h/2 - 20);
        ctx.beginPath(); ctx.arc(px,py,5,0,6); ctx.fill();
        ctx.font='10px sans-serif'; ctx.fillText(p.n, px+8, py+3);
      });
    }
    
    drawPts(users, '#3b82f6'); // Users blue
    drawPts(items, '#ef4444'); // Items red
    
    // Link Bob and Dave
    ctx.strokeStyle='rgba(255,255,255,0.2)'; ctx.beginPath();
    const bx = w/2 - 0.5*(w/2-20), by = h/2 - 0.6*(h/2-20);
    const dx = w/2 - 0.4*(w/2-20), dy = h/2 - 0.7*(h/2-20);
    ctx.moveTo(bx,by); ctx.lineTo(dx,dy); ctx.stroke();
  }
  draw();
})();

// 6. Spectral & PageRank
(function initGraphs() {
  const cSpec = document.getElementById('spectral-canvas');
  const cPage = document.getElementById('pagerank-canvas');
  if(!cSpec || !cPage) return;
  
  // Spectral
  const ctxS = cSpec.getContext('2d');
  const nodes = [
    {x:40,y:50},{x:80,y:30},{x:70,y:80}, // cluster 1
    {x:220,y:150},{x:260,y:120},{x:250,y:170} // cluster 2
  ];
  ctxS.strokeStyle='rgba(255,255,255,0.2)';
  nodes.forEach((n1,i) => {
    nodes.forEach((n2,j) => {
      if(i!==j) {
        ctxS.beginPath(); ctxS.moveTo(n1.x,n1.y); ctxS.lineTo(n2.x,n2.y); ctxS.stroke();
      }
    });
  });
  // Bridge
  ctxS.strokeStyle='#f59e0b'; ctxS.beginPath(); ctxS.moveTo(80,30); ctxS.lineTo(220,150); ctxS.stroke();
  
  nodes.forEach((n,i) => {
    ctxS.fillStyle = i<3 ? '#10b981' : '#8b5cf6';
    ctxS.beginPath(); ctxS.arc(n.x,n.y,10,0,6); ctxS.fill();
  });
  
  // PageRank
  const ctxP = cPage.getContext('2d');
  ctxP.strokeStyle='#3b82f6'; ctxP.lineWidth=2;
  ctxP.beginPath();
  for(let i=0; i<10; i++) {
    const y = 150 - 100*(1 - Math.exp(-i/2));
    if(i===0) ctxP.moveTo(20+i*25, y); else ctxP.lineTo(20+i*25, y);
  }
  ctxP.stroke();
  ctxP.fillStyle='rgba(255,255,255,0.5)'; ctxP.font='10px sans-serif';
  ctxP.fillText("Iterations →", 100, 180);
})();
