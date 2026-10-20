(function(){
  function store(key, val) {
    try {
      if (val === undefined) { return localStorage.getItem(key); }
      if (val === null) { localStorage.removeItem(key); } else { localStorage.setItem(key, val); }
    } catch (e) {}
    return null;
  }

  // --- thème : auto -> clair -> sombre -------------------------------
  var themeBtn = document.getElementById('theme');
  var THEMES = ['auto', 'light', 'dark'];
  var LABELS = { auto: 'Auto', light: 'Clair', dark: 'Sombre' };
  function applyTheme(t) {
    if (t === 'auto') { document.documentElement.removeAttribute('data-theme'); }
    else { document.documentElement.setAttribute('data-theme', t); }
    if (themeBtn) {
      themeBtn.textContent = LABELS[t];
      themeBtn.setAttribute('aria-label', 'Thème : ' + LABELS[t] + ' (changer)');
    }
  }
  var current = store('pmrs-theme') || 'auto';
  if (THEMES.indexOf(current) < 0) { current = 'auto'; }
  applyTheme(current);
  if (themeBtn) {
    themeBtn.addEventListener('click', function(){
      current = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      store('pmrs-theme', current === 'auto' ? null : current);
      applyTheme(current);
    });
  }

  // --- menu mobile ---------------------------------------------------
  var menuBtn = document.getElementById('menu');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function(){
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function(e){
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- copier --------------------------------------------------------
  function copyText(btn, text) {
    var label = btn.textContent;
    var done = function(msg){
      btn.textContent = msg;
      setTimeout(function(){ btn.textContent = label; }, 1600);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function(){ done('Copié'); }, function(){ done('Échec'); });
    } else {
      done('Échec');
    }
  }
  document.querySelectorAll('[data-copy]').forEach(function(btn){
    btn.addEventListener('click', function(){
      var src = btn.getAttribute('data-copy');
      var el = src.charAt(0) === '#' ? document.querySelector(src) : null;
      copyText(btn, el ? el.textContent.trim() : src);
    });
  });

  // --- échelles de bande (lectures de fréquence) ---------------------
  function pos(f, lo, hi) { return ((f - lo) / (hi - lo) * 100).toFixed(3) + '%'; }
  function tick(parent, left, label) {
    var el = document.createElement('i');
    el.className = 'tick' + (label ? ' on' : '');
    el.style.left = left;
    if (label) { el.setAttribute('data-label', label); }
    parent.appendChild(el);
  }

  // PMR446 : 16 canaux analogiques, 446,00625 MHz + n x 12,5 kHz
  var pmr = document.getElementById('track-pmr');
  if (pmr) {
    for (var i = 0; i < 16; i++) {
      tick(pmr, pos(446.00625 + i * 0.0125, 446, 446.2), i === 6 ? 'CH 7' : null);
    }
  }

  // MeshCore : canal unique dans la sous-bande 10 % / 500 mW
  var mc = document.getElementById('track-mc');
  if (mc) {
    var LO = 869.4, HI = 869.65, F = 869.618, BW = 0.0625;
    var band = document.createElement('b');
    band.className = 'band';
    band.style.left = pos(F - BW / 2, LO, HI);
    band.style.width = (BW / (HI - LO) * 100).toFixed(3) + '%';
    mc.appendChild(band);
    for (var j = 1; j <= 4; j++) { tick(mc, pos(LO + j * 0.05, LO, HI), null); }
    tick(mc, pos(F, LO, HI), '62,5 kHz');
  }

  // --- graphique Ciaran : sites mobiles hors service, Finistère -------
  var chart = document.getElementById('ciaran');
  if (chart) {
    var DATA = [['J+1', 564], ['J+8', 180], ['J+11', 54], ['J+15', 23], ['J+18', 15]];
    var NS = 'http://www.w3.org/2000/svg';
    var tip = chart.querySelector('.tip');
    var mk = function(tag, attrs, parent){
      var el = document.createElementNS(NS, tag);
      for (var k in attrs) { el.setAttribute(k, attrs[k]); }
      if (parent) { parent.appendChild(el); }
      return el;
    };
    var draw = function(){
      var old = chart.querySelector('svg');
      if (old) { old.remove(); }
      var W = Math.max(280, chart.clientWidth), H = 260;
      var m = { t: 24, r: 8, b: 28, l: 36 };
      var iw = W - m.l - m.r, ih = H - m.t - m.b, max = 600;
      var svg = mk('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, role: 'img',
        'aria-label': 'Sites mobiles hors service dans le Finistère : 564 à J+1, 180 à J+8, 54 à J+11, 23 à J+15, 15 à J+18' });
      chart.insertBefore(svg, tip);
      [0, 200, 400, 600].forEach(function(v){
        var y = m.t + ih - v / max * ih;
        mk('line', { x1: m.l, x2: W - m.r, y1: y, y2: y, 'class': 'grid-l' }, svg);
        var t = mk('text', { x: m.l - 8, y: y + 4, 'text-anchor': 'end', 'class': 'axis-t' }, svg);
        t.textContent = v;
      });
      var step = iw / DATA.length, bw = Math.min(56, step * 0.5);
      DATA.forEach(function(d, i){
        var cx = m.l + step * i + step / 2;
        var h = d[1] / max * ih, x = cx - bw / 2, y = m.t + ih - h, r = Math.min(4, h);
        mk('path', { 'class': 'bar', d: 'M' + x + ',' + (m.t + ih) + 'V' + (y + r) + 'Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
          'H' + (x + bw - r) + 'Q' + (x + bw) + ',' + y + ' ' + (x + bw) + ',' + (y + r) + 'V' + (m.t + ih) + 'Z' }, svg);
        var lab = mk('text', { x: cx, y: H - 8, 'text-anchor': 'middle', 'class': 'axis-t' }, svg);
        lab.textContent = d[0];
        if (i === 0 || i === DATA.length - 1) {
          var v = mk('text', { x: cx, y: y - 7, 'text-anchor': 'middle', 'class': 'val' }, svg);
          v.textContent = d[1];
        }
        var hit = mk('rect', { 'class': 'bar-hit', x: m.l + step * i, y: m.t, width: step, height: ih }, svg);
        hit.addEventListener('mouseenter', function(){
          tip.innerHTML = '<b>' + d[0] + '</b> · ' + d[1] + ' sites hors service';
          tip.style.left = (cx / W * 100) + '%';
          tip.style.top = y + 'px';
          tip.classList.add('on');
        });
        hit.addEventListener('mouseleave', function(){ tip.classList.remove('on'); });
      });
    };
    draw();
    var rt;
    window.addEventListener('resize', function(){ clearTimeout(rt); rt = setTimeout(draw, 120); });
  }

  // --- résilience : perte d'un répéteur, en 4 temps ------------------
  var res = document.getElementById('resilience');
  if (res) {
    var EDGE = { route: 'dg-route', flood: 'dg-flood', broken: 'dg-broken', idle: 'dg-link' };
    var STEPS = [
      { e: { 'a-r1': 'route', 'r1-r2': 'route', 'r2-r3': 'route', 'r3-b': 'route', 'r1-r4': 'idle', 'r4-r3': 'idle' },
        n: { r2: 'rep', r4: 'idle' },
        h: 'Fonctionnement nominal',
        p: 'Le message de A vers B emprunte une route apprise : A → R1 → R2 → R3 → B. Les répéteurs non sollicités restent en veille.' },
      { e: { 'a-r1': 'route', 'r1-r2': 'broken', 'r2-r3': 'broken', 'r3-b': 'idle', 'r1-r4': 'idle', 'r4-r3': 'idle' },
        n: { r2: 'dead', r4: 'idle' },
        h: 'Le répéteur R2 tombe',
        p: 'Panne d\'alimentation, dégât matériel, vol du boîtier : la route mémorisée est rompue et le message n\'est plus acquitté.' },
      { e: { 'a-r1': 'route', 'r1-r2': 'broken', 'r2-r3': 'broken', 'r3-b': 'flood', 'r1-r4': 'flood', 'r4-r3': 'flood' },
        n: { r2: 'dead', r4: 'rep' },
        h: 'Le réseau cherche une autre route',
        p: 'Faute d\'accusé de réception, MeshCore réessaie puis le message repart en diffusion sur le maillage et explore les liaisons encore disponibles.' },
      { e: { 'a-r1': 'route', 'r1-r2': 'idle', 'r2-r3': 'idle', 'r3-b': 'route', 'r1-r4': 'route', 'r4-r3': 'route' },
        n: { r2: 'dead', r4: 'rep' },
        h: 'Nouvelle route mémorisée',
        p: 'L\'accusé de réception de B indique le trajet réellement emprunté : A → R1 → R4 → R3 → B devient la route de référence. Aucune intervention humaine.' }
    ];
    var NODE = {
      rep: ['dg-rep', 'dg-rep-t'], idle: ['dg-idle', 'dg-idle-t'], dead: ['dg-dead', 'dg-dead-t']
    };
    var buttons = res.querySelectorAll('.steps button');
    var cap = res.querySelector('.step-caption');
    var show = function(k){
      var s = STEPS[k];
      Object.keys(s.e).forEach(function(id){
        res.querySelector('[data-edge="' + id + '"]').setAttribute('class', EDGE[s.e[id]]);
      });
      Object.keys(s.n).forEach(function(id){
        var g = res.querySelector('[data-node="' + id + '"]');
        var c = NODE[s.n[id]];
        g.querySelector('circle').setAttribute('class', c[0] + (s.n[id] === 'dead' ? ' dg-pulse' : ''));
        var t = g.querySelector('text');
        t.setAttribute('class', c[1]);
        t.textContent = s.n[id] === 'dead' ? '✕' : id.toUpperCase();
      });
      cap.querySelector('h3').textContent = (k + 1) + ' · ' + s.h;
      cap.querySelector('p').textContent = s.p;
      buttons.forEach(function(b, i){ b.setAttribute('aria-pressed', i === k ? 'true' : 'false'); });
    };
    buttons.forEach(function(b, i){ b.addEventListener('click', function(){ show(i); }); });
    show(0);

    // Sur petit écran, disposition resserrée pour garder des nœuds lisibles
    var LAYOUTS = {
      wide:   { box: '0 0 800 260', p: { a: [60, 200], r1: [230, 120], r2: [400, 70], r3: [570, 120], b: [740, 200], r4: [400, 205] } },
      narrow: { box: '0 0 400 290', p: { a: [36, 248], r1: [112, 145], r2: [200, 46], r3: [288, 145], b: [364, 248], r4: [200, 244] } }
    };
    var svg = res.querySelector('svg');
    var layout = function(){
      var narrow = svg.clientWidth < 560;
      var L = LAYOUTS[narrow ? 'narrow' : 'wide'];
      svg.setAttribute('viewBox', L.box);
      svg.classList.toggle('narrow', narrow);
      res.querySelectorAll('[data-pos]').forEach(function(g){
        var c = L.p[g.getAttribute('data-pos')];
        g.querySelector('circle').setAttribute('cx', c[0]);
        g.querySelector('circle').setAttribute('cy', c[1]);
        g.querySelector('circle').setAttribute('r', (narrow ? 6 : 0) + (/^[ab]$/.test(g.getAttribute('data-pos')) ? 24 : 26));
        g.querySelector('text').setAttribute('x', c[0]);
        g.querySelector('text').setAttribute('y', c[1] + (narrow ? 6 : 5));
      });
      res.querySelectorAll('[data-edge]').forEach(function(l){
        var ends = l.getAttribute('data-edge').split('-');
        l.setAttribute('x1', L.p[ends[0]][0]); l.setAttribute('y1', L.p[ends[0]][1]);
        l.setAttribute('x2', L.p[ends[1]][0]); l.setAttribute('y2', L.p[ends[1]][1]);
      });
    };
    layout();
    var rl;
    window.addEventListener('resize', function(){ clearTimeout(rl); rl = setTimeout(layout, 120); });
  }

  // --- check-list de conditionnement (mémorisée dans ce navigateur) ---
  var check = document.getElementById('checklist');
  if (check) {
    var boxes = check.querySelectorAll('input[type="checkbox"]');
    var count = document.getElementById('check-count');
    var update = function(){
      var n = 0;
      boxes.forEach(function(b){ if (b.checked) { n++; } });
      if (count) { count.textContent = n + ' / ' + boxes.length + ' vérifiés'; }
    };
    boxes.forEach(function(b, i){
      b.checked = store('pmrs-check-' + i) === '1';
      b.addEventListener('change', function(){
        store('pmrs-check-' + i, b.checked ? '1' : null);
        update();
      });
    });
    var reset = document.getElementById('check-reset');
    if (reset) {
      reset.addEventListener('click', function(){
        boxes.forEach(function(b, i){ b.checked = false; store('pmrs-check-' + i, null); });
        update();
      });
    }
    update();
  }

  // --- sommaire : chapitre courant -----------------------------------
  var toc = document.querySelector('.toc');
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    toc.querySelectorAll('a').forEach(function(a){ links[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting && links[en.target.id]) {
          Object.keys(links).forEach(function(k){ links[k].classList.remove('active'); });
          links[en.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    document.querySelectorAll('.chap[id]').forEach(function(s){ io.observe(s); });
  }
})();
