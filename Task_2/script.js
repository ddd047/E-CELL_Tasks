/* =====================================================
   E-Cell UIET Kurukshetra — script.js
   Navbar · Mobile menu · Global grid · Particles ·
   Reveal · Counters · Forms · Scroll accent
   ===================================================== */

'use strict';

/* ── Shared accent color (mutated by initScrollAccent, read by initGlobalGrid) ── */
let gridAccent = [79, 158, 255]; // default: brand blue

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initGlobalGrid();   // animated circuit grid — must come before initScrollAccent
  initParticles();
  initScrollReveal();
  initCounters();
  initForms();
  initScrollAccent(); // begins grid color-shifting after grid is live
});

/* ─────────────────────────────────────────
   NAVBAR — transparent → glass on scroll
   ───────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const update = () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ─────────────────────────────────────────
   MOBILE HAMBURGER MENU
   ───────────────────────────────────────── */
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('hidden') === false;
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ─────────────────────────────────────────
   GLOBAL ANIMATED CIRCUIT GRID
   Fixed canvas, z-index: 3.
   Renders a living circuit-board pattern with:
   • faint grid lines (colour shifts with scroll)
   • pulsing dot markers at intersections
   • moving light-pulse "traces" along grid axes
   ───────────────────────────────────────── */
function initGlobalGrid() {
  const canvas = document.getElementById('global-grid');
  if (!canvas) return;
  const ctx  = canvas.getContext('2d');
  const CELL = 52;         // grid cell size (px)
  const PALETTE = [
    [79,  158, 255],  // blue
    [6,   182, 212],  // cyan
    [124, 58,  237],  // purple
    [56,  189, 248],  // neon blue
  ];

  let W, H, pulses, tick = 0;

  /* ── Resize: fit canvas to viewport ── */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    spawnPulses();
  }

  /* ── Spawn / re-spawn all pulse objects ── */
  function spawnPulses() {
    pulses = [];
    const count = Math.max(10, Math.round((W * H) / 25000));
    for (let i = 0; i < count; i++) pulses.push(makePulse(true));
  }

  /* ── Create one pulse trace ── */
  function makePulse(scattered) {
    const horiz   = Math.random() > 0.5;
    const speed   = Math.random() * 2.0 + 0.9;
    const tailLen = Math.random() * 90 + 55;
    const color   = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const op      = Math.random() * 0.45 + 0.28;
    const cols    = Math.floor(W / CELL);
    const rows    = Math.floor(H / CELL);

    if (horiz) {
      const row = Math.floor(Math.random() * (rows + 1));
      const rtl = Math.random() > 0.5;          // right-to-left?
      return {
        x:  scattered ? Math.random() * W : (rtl ? W + tailLen + 10 : -tailLen - 10),
        y:  row * CELL,
        vx: rtl ? -speed : speed,
        vy: 0,
        tailLen, color, op,
      };
    } else {
      const col = Math.floor(Math.random() * (cols + 1));
      const uup = Math.random() > 0.5;          // upward?
      return {
        x:  col * CELL,
        y:  scattered ? Math.random() * H : (uup ? H + tailLen + 10 : -tailLen - 10),
        vx: 0,
        vy: uup ? -speed : speed,
        tailLen, color, op,
      };
    }
  }

  /* ── Main draw loop ── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    tick++;

    const cols  = Math.ceil(W / CELL);
    const rows  = Math.ceil(H / CELL);
    const [ar, ag, ab] = gridAccent;  // updated by initScrollAccent

    /* Grid lines */
    ctx.lineWidth = 0.5;
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * CELL, 0);
      ctx.lineTo(c * CELL, H);
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.08)`;
      ctx.stroke();
    }
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * CELL);
      ctx.lineTo(W, r * CELL);
      ctx.strokeStyle = `rgba(${ar},${ag},${ab},0.08)`;
      ctx.stroke();
    }

    /* Intersection dots + occasional "+" crosshair markers */
    for (let c = 0; c <= cols; c++) {
      for (let r = 0; r <= rows; r++) {
        const x = c * CELL, y = r * CELL;
        const wave = Math.sin(tick * 0.016 + c * 0.75 + r * 0.55) * 0.5 + 0.5;

        /* Base dot */
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ar},${ag},${ab},${0.07 + wave * 0.10})`;
        ctx.fill();

        /* Sparse brighter crosshairs */
        if (c % 5 === 0 && r % 5 === 0) {
          const pulse = Math.sin(tick * 0.022 + c * 1.1 + r * 0.85) * 0.5 + 0.5;
          if (pulse > 0.52) {
            const s = 5;
            ctx.strokeStyle = `rgba(${ar},${ag},${ab},${pulse * 0.24})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
            ctx.moveTo(x, y - s); ctx.lineTo(x, y + s);
            ctx.stroke();
            ctx.lineWidth = 0.5;
          }
        }
      }
    }

    /* Moving light pulses */
    pulses.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      /* Off-screen → respawn fresh */
      const offX = p.x > W + p.tailLen + 20 || p.x < -p.tailLen - 20;
      const offY = p.y > H + p.tailLen + 20 || p.y < -p.tailLen - 20;
      if (offX || offY) { pulses[i] = makePulse(false); return; }

      /* Tail gradient */
      const spd = Math.abs(p.vx) || Math.abs(p.vy);
      const tx = p.x - p.vx * (p.tailLen / spd);
      const ty = p.y - p.vy * (p.tailLen / spd);
      const [r, g, b] = p.color;

      const tailGrad = ctx.createLinearGradient(tx, ty, p.x, p.y);
      tailGrad.addColorStop(0,   `rgba(${r},${g},${b},0)`);
      tailGrad.addColorStop(0.65,`rgba(${r},${g},${b},${p.op * 0.5})`);
      tailGrad.addColorStop(1,   `rgba(${r},${g},${b},${p.op})`);

      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(p.x, p.y);
      ctx.strokeStyle = tailGrad;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      /* Head — bright dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${p.op})`;
      ctx.fill();

      /* Head — outer halo */
      const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 9);
      halo.addColorStop(0, `rgba(${r},${g},${b},${p.op * 0.45})`);
      halo.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize, { passive: true });
}

/* ─────────────────────────────────────────
   SCROLL-DRIVEN ACCENT COLOUR TRANSITION
   Smoothly interpolates gridAccent between
   per-section colour palettes as user scrolls.
   This makes the circuit grid shift colour
   continuously across the whole page.
   ───────────────────────────────────────── */
function initScrollAccent() {
  const ACCENTS = [
    { id: 'home',    c: [79,  158, 255] },  // blue
    { id: 'about',   c: [124, 58,  237] },  // purple
    { id: 'events',  c: [79,  158, 255] },  // blue
    { id: 'team',    c: [6,   182, 212] },  // cyan
    { id: 'join',    c: [124, 58,  237] },  // purple
    { id: 'contact', c: [56,  189, 248] },  // neon
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t)   { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  let ticking = false;

  function update() {
    const sy = window.scrollY + window.innerHeight * 0.42;
    let ci = ACCENTS.length - 1;
    let t  = 0;

    for (let i = 0; i < ACCENTS.length - 1; i++) {
      const el   = document.getElementById(ACCENTS[i].id);
      const next = document.getElementById(ACCENTS[i + 1].id);
      if (!el || !next) continue;
      const top  = el.offsetTop;
      const ntop = next.offsetTop;
      if (sy >= top && sy < ntop) {
        ci = i;
        t  = easeInOut(Math.max(0, Math.min(1, (sy - top) / (ntop - top))));
        break;
      }
    }

    const c1 = ACCENTS[ci].c;
    const c2 = ACCENTS[Math.min(ci + 1, ACCENTS.length - 1)].c;

    // Mutate the shared array in-place so initGlobalGrid reads updated values
    gridAccent[0] = Math.round(lerp(c1[0], c2[0], t));
    gridAccent[1] = Math.round(lerp(c1[1], c2[1], t));
    gridAccent[2] = Math.round(lerp(c1[2], c2[2], t));

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });

  update(); // initialise on load
}

/* ─────────────────────────────────────────
   PARTICLE CANVAS  (hero section only)
   ───────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, animId;
  const COUNT  = 65;
  const COLORS = [
    'rgba(79,158,255,',
    'rgba(124,58,237,',
    'rgba(56,189,248,',
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.4,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,158,255,${0.07 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.alpha})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    animId = requestAnimationFrame(loop);
  }

  function start() { if (!animId) loop(); }
  function stop()  { cancelAnimationFrame(animId); animId = null; }

  resize();
  particles = Array.from({ length: COUNT }, makeParticle);

  // Only animate while hero is visible (battery-friendly)
  const heroSection = document.getElementById('home');
  const io = new IntersectionObserver(entries => {
    entries[0].isIntersecting ? start() : stop();
  });
  io.observe(heroSection);

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: COUNT }, makeParticle);
  }, { passive: true });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL
   ───────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || 0, 10);
      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────
   ANIMATED COUNTERS
   ───────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const v = 1 - Math.pow(1 - t, 3); // ease-out cubic
    el.textContent = Math.round(v * target);
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ─────────────────────────────────────────
   FORM HANDLING (client-side demo)
   ───────────────────────────────────────── */
function initForms() {
  handleForm('join-form',    'submit-join-btn',    'form-success',    'Submit Application', '🎉 Application submitted! We\'ll be in touch soon.');
  handleForm('contact-form', 'contact-submit-btn', 'contact-success', 'Send Message',       '✅ Message sent! We\'ll get back to you shortly.');
}

function handleForm(formId, btnId, successId, defaultLabel, successMsg) {
  const form    = document.getElementById(formId);
  const btn     = document.getElementById(btnId);
  const success = document.getElementById(successId);
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const span = btn.querySelector('span');
    btn.disabled = true;
    if (span) span.textContent = 'Sending…';

    setTimeout(() => {
      success.textContent = successMsg;
      form.reset();
      btn.disabled = false;
      if (span) span.textContent = defaultLabel;
      setTimeout(() => { success.textContent = ''; }, 5500);
    }, 1100);
  });
}
