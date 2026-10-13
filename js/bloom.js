/* Flor final: ráfaga de motas generada al vuelo + disparo
   de la animación cuando la sección entra en pantalla. */

import { qs, prefersReduced } from './util.js';

function buildBurst(container) {
  const total = 26;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < total; i += 1) {
    const mote = document.createElement('i');
    const angle = (i / total) * Math.PI * 2 + Math.random() * 0.45;
    // Distancia grande de partida: así las motas salen ya fuera del
    // diámetro de la flor y no se pierden sobre los pétalos.
    const distance = 145 + Math.random() * 165;
    const size = 3.5 + Math.random() * 5;

    mote.style.setProperty('--dx', `${(Math.cos(angle) * distance).toFixed(1)}px`);
    mote.style.setProperty('--dy', `${(Math.sin(angle) * distance).toFixed(1)}px`);
    mote.style.setProperty('--sz', `${size.toFixed(1)}px`);
    mote.style.setProperty('--c', Math.random() > 0.6 ? 'var(--warm)' : 'var(--green)');
    mote.style.setProperty('--dl', `${(0.7 + Math.random() * 0.5).toFixed(2)}s`);
    frag.appendChild(mote);
  }

  container.appendChild(frag);
}

export function initBloom() {
  const bloom = qs('#bloom');
  if (!bloom) return;

  const burst = qs('#bloomBurst');
  if (burst && !prefersReduced()) buildBurst(burst);

  if (prefersReduced()) {
    bloom.classList.add('is-in');
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        bloom.classList.add('is-in');
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );
  io.observe(bloom);
}
