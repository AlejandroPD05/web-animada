/* Orquestador: monta todo en orden y degrada con elegancia
   si alguna librería externa no llega a cargar. */

import { hasGsap, prefersReduced, qsa } from './util.js';
import { initSmooth } from './smooth.js';
import { initLoader } from './loader.js';
import { initSplit, initReveals, prepareHero, playHero, initHeroMotion } from './reveal.js';
import { initTimeline } from './timeline.js';
import { initConstellation } from './constellation.js';
import { initCursor } from './cursor.js';
import { initSpotlight } from './spotlight.js';
import { initParticles } from './particles.js';
import { initBloom } from './bloom.js';

// 0. Señal de vida: desactiva la red de seguridad del <head>.
//    Si algo revienta en caliente, la página degrada a estática
//    en lugar de quedarse a medias.
document.documentElement.setAttribute('data-ready', '');
window.addEventListener('error', () => {
  document.getElementById('preloader')?.remove();
  document.documentElement.classList.remove('js');
});

if (hasGsap()) document.documentElement.classList.add('has-gsap');
if (prefersReduced()) document.documentElement.classList.add('reduced');

// 1. Tipografía partida ANTES de cualquier revelado:
//    el estado inicial vive en CSS, así que nada parpadea.
initSplit();

// 2. Capas ambientales
initParticles();
initCursor();
initSpotlight();
initSmooth();

// 3. Revelados y contenido ligado al scroll
prepareHero();
initReveals();
initTimeline();
initConstellation();
initBloom();

// 4. Intro: la cortina entrega el hero
initLoader((instant) => {
  if (instant) {
    qsa('.hero [data-reveal], .hero [data-split]').forEach((el) => {
      el.style.setProperty('--d', '0s');
      el.classList.add('is-in');
    });
    const cue = document.querySelector('.scroll-cue');
    if (cue) {
      cue.style.transition = 'none';
      cue.style.opacity = '1';
      cue.style.transform = 'none';
    }
    return;
  }
  playHero();
});

// 5. Motion ligado al scroll (requiere GSAP)
initHeroMotion();
