/* =========================================================
   E-Cell Landing Page — script.js
   Features: Navbar scroll, mobile menu, particle canvas,
             scroll reveal, counter animation, form handling
   ========================================================= */

'use strict';

/* ── DOM Ready ── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initParticles();
  initScrollReveal();
  initCounters();
  initForms();
  initSmoothScroll();
});

/* ============================================================
   NAVBAR — scroll behaviour
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });
}

/* ============================================================
   MOBILE HAMBURGER MENU
   ============================================================ */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles, animId;
  const PARTICLE_COUNT = 70;
  const COLORS = ['rgba(79,158,255,', 'rgba(124,58,237,', 'rgba(56,189,248,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a:  Math.random() * 0.6 + 0.1,
      color,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(79,158,255,${0.08 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    drawLines();
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${p.a})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });
    animId = requestAnimationFrame(draw);
  }

  function destroy() {
    cancelAnimationFrame(animId);
  }

  // Only run particles on hero visible
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        draw();
      } else {
        destroy();
      }
    });
  });

  init();
  heroObserver.observe(document.getElementById('home'));

  window.addEventListener('resize', () => {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, createParticle);
  }, { passive: true });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children in same parent
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Add staggered delays to sibling groups
  const staggerGroups = [
    '.about-grid .about-card',
    '.events-grid .event-card',
    '.team-grid .team-card',
    '.join-perks .perk-item',
  ];

  staggerGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, idx) => {
      el.dataset.delay = idx * 80;
    });
  });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ============================================================
   FORM HANDLING (client-side demo)
   ============================================================ */
function initForms() {
  // Join form
  const joinForm = document.getElementById('join-form');
  if (joinForm) {
    joinForm.addEventListener('submit', e => {
      e.preventDefault();
      const success = document.getElementById('form-success');
      const btn = joinForm.querySelector('button[type="submit"]');

      btn.disabled = true;
      btn.querySelector('span').textContent = 'Submitting…';

      setTimeout(() => {
        success.textContent = '🎉 Application submitted! We\'ll be in touch soon.';
        joinForm.reset();
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Submit Application';
        setTimeout(() => { success.textContent = ''; }, 5000);
      }, 1200);
    });
  }

  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const success = document.getElementById('contact-success');
      const btn = contactForm.querySelector('button[type="submit"]');

      btn.disabled = true;
      btn.querySelector('span').textContent = 'Sending…';

      setTimeout(() => {
        success.textContent = '✅ Message sent! We\'ll get back to you shortly.';
        contactForm.reset();
        btn.disabled = false;
        btn.querySelector('span').textContent = 'Send Message';
        setTimeout(() => { success.textContent = ''; }, 5000);
      }, 1000);
    });
  }
}

/* ============================================================
   SMOOTH SCROLL (for older Safari fallback)
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
