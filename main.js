/* ============================================================
   QUICKBEE — MAIN.JS
   ============================================================ */

// ---- NAV SCROLL EFFECT ----
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}, { passive: true });

// ---- MOBILE HAMBURGER ----
const hamburger = document.getElementById('hamburger');
let mobileMenu = null;

if (hamburger) {
  hamburger.addEventListener('click', openMobileMenu);
}

function openMobileMenu() {
  mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu open';
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html', label: 'Home' },
    { href: 'about.html', label: 'About' },
    { href: 'services.html', label: 'Services' },
    { href: 'team.html', label: 'Team' },
  ];
  const linksHTML = links.map(l => {
    const active = l.href === currentPage ? ' style="color:var(--gold-pale)"' : '';
    return `<a href="${l.href}"${active}>${l.label}</a>`;
  }).join('');
  mobileMenu.innerHTML = `
    <button class="mobile-close" id="mobileClose" aria-label="Close menu">✕</button>
    ${linksHTML}
    <a href="index.html#contact" class="mobile-cta">Partner With Us</a>
  `;
  document.body.appendChild(mobileMenu);
  document.body.style.overflow = 'hidden';

  document.getElementById('mobileClose').addEventListener('click', closeMobileMenu);
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMobileMenu();
  });
  // Close on Escape key
  document.addEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
  if (e.key === 'Escape') closeMobileMenu();
}

function closeMobileMenu() {
  if (mobileMenu) {
    mobileMenu.remove();
    mobileMenu = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleEscKey);
  }
}

// ---- REVEAL ON SCROLL (IntersectionObserver) ----
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      // Don't unobserve so re-scroll doesn't flicker; remove this if you want replay
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

reveals.forEach(el => revealObserver.observe(el));

// ---- ANIMATED GOLD CARD COUNTER ----
function animateCounter(el, target, suffix, decimals = 0) {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = startVal + (target - startVal) * eased;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Observe gold card to trigger counter
const goldCard = document.querySelector('.gold-card');
if (goldCard) {
  const gcValue = goldCard.querySelector('.gc-value');
  const gcInr = goldCard.querySelector('.gc-inr');
  let counted = false;

  const cardObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      if (gcValue) animateCounter(gcValue, 24.85, ' g', 2);
      if (gcInr) {
        setTimeout(() => {
          let val = 0;
          const target = 174232;
          const duration = 1800;
          const start = performance.now();
          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            val = Math.floor(target * eased);
            gcInr.textContent = '₹ ' + val.toLocaleString('en-IN');
            if (progress < 1) requestAnimationFrame(update);
          }
          requestAnimationFrame(update);
        }, 200);
      }
    }
  }, { threshold: 0.5 });

  cardObs.observe(goldCard);
}

// ---- GOLD PROGRESS BAR ANIMATION ----
const gcProgress = document.querySelector('.gc-progress');
if (gcProgress) {
  gcProgress.style.width = '0%';
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(() => {
        gcProgress.style.transition = 'width 1.6s cubic-bezier(.25,.46,.45,.94)';
        gcProgress.style.width = '82%';
      }, 400);
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(gcProgress);
}

// ---- SUBTLE PARALLAX ON HERO ORBS ----
const orbs = document.querySelectorAll('.gold-orb');
if (orbs.length && window.innerWidth > 768) {
  window.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 10;
      orb.style.transform = `translate(${dx * depth}px, ${dy * depth}px)`;
    });
  }, { passive: true });
}

// ---- SMOOTH ANCHOR SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- PAGE TRANSITION FADE IN ----
document.body.style.opacity = '0';
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '1';
});

// ---- ACTIVE NAV LINK ----
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});
