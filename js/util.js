/* Utilidades compartidas — sin dependencias, sin estado global. */

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const mq = (q) => window.matchMedia(q);
export const prefersReduced = () => mq('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => mq('(hover: hover) and (pointer: fine)').matches;

export const hasGsap = () =>
  typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

export const on = (el, type, fn, opts) => el && el.addEventListener(type, fn, opts);

/**
 * Divide el texto en máscaras .word > .char.
 *  - mode 'chars': retardo por carácter (efecto máquina de escribir)
 *  - mode 'words': retardo por palabra (las letras de una palabra entran juntas)
 * Cada .word recibe además su propio --i para la iluminación.
 */
export function split(el, mode = 'words') {
  if (el.dataset.splitDone) return el;

  const text = el.textContent.trim().replace(/\s+/g, ' ');
  const frag = document.createDocumentFragment();
  const words = text.split(' ');
  let charIndex = 0;

  words.forEach((word, wi) => {
    const mask = document.createElement('span');
    mask.className = 'word';
    mask.style.setProperty('--i', wi);

    Array.from(word).forEach((ch) => {
      const c = document.createElement('span');
      c.className = 'char';
      c.style.setProperty('--i', mode === 'chars' ? charIndex++ : wi);
      c.textContent = ch;
      mask.appendChild(c);
    });

    frag.appendChild(mask);
    if (wi < words.length - 1) frag.appendChild(document.createTextNode(' '));
  });

  el.textContent = '';
  el.appendChild(frag);
  el.dataset.splitDone = '1';
  return el;
}

/** Retardo base para un elemento partido (se suma al escalonado). */
export const setBaseDelay = (el, value) => el.style.setProperty('--d', value);
