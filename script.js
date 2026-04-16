/* ============================================
   FEIRA ECOA — SCRIPT
   Casa OPOCA · São Miguel Arcanjo, SP
   ============================================ */

'use strict';

/* === NAV === */
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Fechar menu ao clicar em link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  });
});

// Fechar menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!nav.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', false);
  }
});

/* === SCROLL REVEAL === */
function setupReveal() {
  const elements = document.querySelectorAll(
    '.hero-meta, .hero-title, .hero-sub, .hero-actions, ' +
    '.manifesto-label, .manifesto-title, .manifesto-text-block, .manifesto-pillars, ' +
    '.programa-header, .edicao, ' +
    '.galeria-header, .galeria-item, .galeria-texto-bloco, ' +
    '.frase-texto, ' +
    '.info-content, .info-mapa'
  );

  elements.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger para items de galeria e edições
    if (el.classList.contains('galeria-item')) {
      const idx = parseInt(el.dataset.index || 0);
      el.style.transitionDelay = `${(idx % 4) * 0.1}s`;
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* === GALERIA MODAL === */
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal(item) {
  const img = item.querySelector('.galeria-img img');
  const caption = item.querySelector('.galeria-caption')?.textContent || '';

  if (!img) return;

  modalContent.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    ">
      <img
        src="${img.src}"
        alt="${img.alt || caption}"
        style="
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          display: block;
          object-fit: contain;
        "
      >
      ${caption ? `
        <span style="
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
          position: absolute;
          bottom: 1.25rem;
          left: 1.25rem;
        ">${caption}</span>
      ` : ''}
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.galeria-item').forEach(item => {
  item.addEventListener('click', () => openModal(item));
  item.setAttribute('role', 'button');
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(item);
    }
  });
});

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

/* === HERO PARALLAX SUAVE === */
function setupParallax() {
  const heroBg = document.querySelector('.hero-bg-text');
  const heroCircle = document.querySelector('.hero-circle');
  if (!heroBg || !heroCircle) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const factor = scrollY * 0.15;
        heroBg.style.transform = `translate(-50%, calc(-50% + ${factor}px))`;
        heroCircle.style.transform = `translateY(${scrollY * 0.08}px)`;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/* === PROGRAMA: HOVER HIGHLIGHT === */
function setupProgramaInteraction() {
  const edicoes = document.querySelectorAll('.edicao');
  edicoes.forEach(ed => {
    ed.addEventListener('mouseenter', () => {
      edicoes.forEach(other => {
        if (other !== ed) other.style.opacity = '0.5';
      });
    });
    ed.addEventListener('mouseleave', () => {
      edicoes.forEach(other => other.style.opacity = '');
    });
  });
}

/* === CURSOR PERSONALIZADO (desktop) === */
function setupCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 10px;
    height: 10px;
    background: #c45c1a;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, opacity 0.3s;
    mix-blend-mode: multiply;
    opacity: 0;
  `;
  document.body.appendChild(cursor);

  const cursorOuter = document.createElement('div');
  cursorOuter.style.cssText = `
    position: fixed;
    width: 36px;
    height: 36px;
    border: 1px solid rgba(196,92,26,0.4);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    transform: translate(-50%, -50%);
    transition: width 0.3s, height 0.3s, transform 0.1s, opacity 0.3s;
    opacity: 0;
  `;
  document.body.appendChild(cursorOuter);

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.style.opacity = '1';
    cursorOuter.style.opacity = '1';
  });

  function animateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX + 'px';
    cursorOuter.style.top = outerY + 'px';
    requestAnimationFrame(animateOuter);
  }
  animateOuter();

  // Expand on clickable
  document.querySelectorAll('a, button, .galeria-item, .edicao').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '6px';
      cursor.style.height = '6px';
      cursorOuter.style.width = '52px';
      cursorOuter.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursorOuter.style.width = '36px';
      cursorOuter.style.height = '36px';
    });
  });
}

/* === ANIMAÇÃO TÍTULO HERO === */
function animateHeroTitle() {
  const lines = document.querySelectorAll('.title-line');
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(40px)';
    line.style.transition = `opacity 0.8s ease ${0.2 + i * 0.15}s, transform 0.8s ease ${0.2 + i * 0.15}s`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 50);
  });

  // Meta tags
  const meta = document.querySelector('.hero-meta');
  if (meta) {
    meta.style.opacity = '0';
    meta.style.transition = 'opacity 0.6s ease 0.1s';
    setTimeout(() => { meta.style.opacity = '1'; }, 50);
  }
}

/* === TEXTO DA SEÇÃO FRASE: EFEITO DE ENTRADA === */
function setupFraseImpacto() {
  const spans = document.querySelectorAll('.frase-texto span');
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      spans.forEach((span, i) => {
        span.style.opacity = '0';
        span.style.transform = 'translateX(-40px)';
        span.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
        requestAnimationFrame(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateX(0)';
        });
      });
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  const section = document.querySelector('.frase-impacto');
  if (section) observer.observe(section);
}

/* === INIT === */
document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  setupParallax();
  setupProgramaInteraction();
  setupCursor();
  animateHeroTitle();
  setupFraseImpacto();

  // Nav active state on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinksAll.forEach(link => {
          link.style.opacity = link.getAttribute('href') === `#${id}` ? '1' : '0.8';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => sectionObserver.observe(section));
});
