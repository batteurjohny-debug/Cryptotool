(function(){
  const cv = document.getElementById('rain');
  if (!cv) return;
  const cx = cv.getContext('2d');
  const fs = 18, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let W, H, drops = [], last = 0, timer;
  function step(){
    cx.fillStyle = 'rgba(5,11,20,.14)';
    cx.fillRect(0, 0, W, H);
    cx.font = '13px monospace';
    for (let i = 0; i < drops.length; i++){
      const n = 1 + Math.floor(Math.random() * 26);
      cx.fillStyle = Math.random() > .96 ? '#e6feff' : '#2fd6e6';
      cx.fillText(n, i * fs, drops[i] * fs);
      if (drops[i] * fs > H && Math.random() > .975) drops[i] = 0;
      drops[i]++;
    }
  }
  function loop(t){
    if (t - last > 45){ last = t; step(); }
    requestAnimationFrame(loop);
  }
  function size(){
    const d = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d;
    cx.setTransform(d, 0, 0, d, 0, 0);
    cx.fillStyle = '#050b14'; cx.fillRect(0, 0, W, H);
    drops = Array.from({ length: Math.ceil(W / fs) }, () => -Math.random() * 40);
    if (reduce) for (let k = 0; k < 70; k++) step();
  }
  size();
  addEventListener('resize', () => { clearTimeout(timer); timer = setTimeout(size, 200); });
  if (!reduce) requestAnimationFrame(loop);
})();
