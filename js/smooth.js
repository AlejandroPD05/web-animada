/* Scroll suave con Lenis, sincronizado con ScrollTrigger.
   Si la librería no carga (o el usuario pide movimiento reducido)
   el scroll nativo sigue siendo 100% funcional. */

import { hasGsap, prefersReduced, on } from './util.js';

let lenis = null;

export function initSmooth() {
  if (prefersReduced()) return null;
  if (typeof window.Lenis === 'undefined') return null;

  lenis = new window.Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  if (hasGsap()) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    lenis.on('scroll', window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => lenis.raf(time * 1000));
    window.gsap.ticker.lagSmoothing(0);
  } else {
    let raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }

  // Anclas: el scroll nativo ya está anulado, hay que traducirlo.
  on(document, 'click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -20 });
  });

  return lenis;
}

export const getLenis = () => lenis;
export const stopScroll = () => lenis && lenis.stop();
export const startScroll = () => lenis && lenis.start();
