/* Preloader tipográfico: contador + cortina en dos planos.
   Reglas:
   - con reduced-motion no aparece nunca;
   - si ya se vio en esta sesión, se acorta;
   - si el JS falla, .no-js lo oculta (regla CSS). */

import { qs, prefersReduced } from './util.js';
import { stopScroll, startScroll } from './smooth.js';

const pad = (n) => String(Math.min(100, Math.round(n))).padStart(2, '0');

export function initLoader(onDone) {
  const el = qs('#preloader');

  if (!el || prefersReduced()) {
    document.documentElement.classList.add('reduced');
    el && el.remove();
    onDone(true);
    return;
  }

  const count = qs('#preloaderCount');
  const rule = el.querySelector('.preloader-rule');
  const seen = sessionStorage.getItem('nh-seen') === '1';
  const duration = seen ? 380 : 1250;
  const start = performance.now();

  stopScroll();

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutCubic: arranca rápido, termina con precisión
    const eased = 1 - Math.pow(1 - t, 3);
    const value = eased * 100;
    if (count) count.textContent = pad(value);
    if (rule) rule.style.setProperty('--load', eased.toFixed(3));

    if (t < 1) {
      requestAnimationFrame(tick);
      return;
    }
    finish();
  };

  const finish = () => {
    sessionStorage.setItem('nh-seen', '1');
    el.classList.add('is-out');

    window.setTimeout(() => {
      el.classList.add('is-open');
      startScroll();
      onDone(false);
    }, 420);

    window.setTimeout(() => {
      el.classList.add('is-done');
      el.remove();
    }, 1600);
  };

  requestAnimationFrame(tick);
}
