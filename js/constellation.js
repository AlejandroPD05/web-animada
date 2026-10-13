/* Constelación: trazado de la línea + entrada escalonada de los nodos.
   Los nodos ya son navegables con teclado (tabindex + <title>). */

import { qsa, prefersReduced } from './util.js';

/* Campo de estrellas de fondo: determinista (mismo dibujo en cada
   carga) para que no "parpadee" entre visitas. */
function buildStars(root) {
  const svg = root.querySelector('.constellation-svg');
  if (!svg || svg.querySelector('.const-stars')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const group = document.createElementNS(NS, 'g');
  group.setAttribute('class', 'const-stars');

  let seed = 20260214;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };

  for (let i = 0; i < 72; i += 1) {
    const star = document.createElementNS(NS, 'circle');
    star.setAttribute('cx', (rnd() * 1000).toFixed(1));
    star.setAttribute('cy', (rnd() * 420).toFixed(1));
    star.setAttribute('r', (0.5 + rnd() * 1.7).toFixed(2));
    star.style.setProperty('--n', i);
    group.appendChild(star);
  }

  svg.insertBefore(group, svg.querySelector('.constellation-path'));
}


export function initConstellation() {
  const root = document.querySelector('.constellation');
  if (!root) return;

  buildStars(root);

  const nodes = qsa('[data-node]', root);
  nodes.forEach((node, i) => node.style.setProperty('--n', i));

  if (prefersReduced()) {
    root.classList.add('is-drawn');
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        root.classList.add('is-drawn');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );
  io.observe(root);
}
