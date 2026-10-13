/* Revelados: splitter, entradas por scroll, intro del hero
   y la iluminación palabra a palabra del manifiesto. */

import { qs, qsa, split, setBaseDelay, hasGsap, prefersReduced } from './util.js';

export function initSplit() {
  qsa('[data-split]').forEach((el) => split(el, el.dataset.split));
}

/* ---------------- Entradas por scroll ---------------- */
function observeEach(elements, cb, options) {
  const targets = elements.filter((el) => el);
  if (!targets.length) return;
  if (!('IntersectionObserver' in window)) {
    targets.forEach(cb);
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      cb(entry.target);
      io.unobserve(entry.target);
    });
  }, options);
  targets.forEach((t) => io.observe(t));
}

export function initReveals() {
  const outside = (el) => !el.closest('.hero');

  if (prefersReduced()) {
    qsa('[data-reveal], [data-illuminate], [data-split], .manifesto-rule')
      .forEach((el) => el.classList.add('is-in'));
    return;
  }

  observeEach(qsa('[data-reveal]').filter(outside), (el) => el.classList.add('is-in'), { threshold: 0.4 });
  observeEach(qsa('[data-split]').filter(outside), (el) => el.classList.add('is-in'), { threshold: 0.35 });
  observeEach(qsa('[data-illuminate]'), (el) => el.classList.add('is-in'), { threshold: 0.6 });
  observeEach(qsa('.manifesto-rule'), (el) => el.classList.add('is-in'), { threshold: 0.6 });
}

/* ---------------- Intro del hero (tras la cortina) ---------------- */
export function playHero() {
  const kicker = qs('.hero-kicker');
  const title = qs('.hero-title');
  const sub = qs('.hero-sub');
  const cue = qs('.scroll-cue');

  const steps = [
    [kicker, '0.05s'],
    [title, '0.18s'],
    [sub, '0.52s'],
  ];

  steps.forEach(([el, delay]) => {
    if (!el) return;
    setBaseDelay(el, delay);
    el.classList.add('is-in');
  });

  if (cue) {
    cue.style.transition = 'opacity 0.8s var(--ease-out-expo) 1s, transform 0.8s var(--ease-out-expo) 1s';
    cue.style.opacity = '1';
    cue.style.transform = 'translateY(0)';
  }
}

export function prepareHero() {
  const cue = qs('.scroll-cue');
  if (cue) {
    cue.style.opacity = '0';
    cue.style.transform = 'translateY(14px)';
  }
}

/* ---------------- Movimiento ligado al scroll ---------------- */
export function initHeroMotion() {
  if (!hasGsap() || prefersReduced()) return;

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  gsap.to('.hero-inner', {
    yPercent: -22,
    opacity: 0,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 25%', scrub: 0.6 },
  });

  gsap.to('.hero-mesh', {
    yPercent: 14,
    scale: 1.12,
    ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 },
  });

  // Iluminación palabra a palabra, atada al progreso real del scroll
  const manifesto = qs('[data-illuminate]');
  if (manifesto) {
    const words = qsa('.word', manifesto);
    gsap.to(words, {
      color: '#EDEFEA',
      ease: 'none',
      stagger: 0.35,
      scrollTrigger: {
        trigger: manifesto,
        start: 'top 82%',
        end: 'bottom 58%',
        scrub: 0.5,
      },
    });
  }
}
