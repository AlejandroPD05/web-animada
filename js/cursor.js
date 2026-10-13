/* Cursor propio: punto exacto + anillo con retarda.
   Solo en dispositivos de puntero fino y sin movimiento reducido.
   El cursor nativo se oculta únicamente cuando éste ya está vivo. */

import { finePointer, prefersReduced, on } from './util.js';

export function initCursor() {
  const root = document.getElementById('cursor');
  if (!root || !finePointer() || prefersReduced()) return;

  const dot = root.querySelector('.cursor-dot');
  const ring = root.querySelector('.cursor-ring');

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let rx = mx;
  let ry = my;
  let live = false;

  on(window, 'pointermove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    if (!live) {
      live = true;
      rx = mx;
      ry = my;
      root.classList.add('is-live');
      document.documentElement.classList.add('has-cursor');
    }
  }, { passive: true });

  on(document, 'pointerover', (e) => {
    const hot = e.target.closest && e.target.closest('a, button, summary, [data-node], .colophon-tech li');
    root.classList.toggle('is-hot', Boolean(hot));
  });

  on(document, 'pointerdown', () => root.classList.add('is-down'));
  on(document, 'pointerup', () => root.classList.remove('is-down'));

  const loop = () => {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
