/* Spotlight + tilt de las tarjetas.
   El puntero escribe --px/--py (registradas, así que el gradiente
   las interpola) y --rx/--ry hacen el giro en perspectiva.
   Solo con puntero fino: en táctil no hay "hover" que siga. */

import { qsa, finePointer } from './util.js';

const MAX_TILT = 5; // grados

export function initSpotlight() {
  if (!finePointer()) return;

  qsa('.milestone-card').forEach((card) => {
    const set = (prop, value) => card.style.setProperty(prop, value);

    card.addEventListener('pointerenter', () => set('--spot', '1'));

    card.addEventListener(
      'pointermove',
      (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        set('--px', (x * 100).toFixed(2));
        set('--py', (y * 100).toFixed(2));
        set('--rx', `${((0.5 - y) * MAX_TILT).toFixed(2)}deg`);
        set('--ry', `${((x - 0.5) * MAX_TILT).toFixed(2)}deg`);
      },
      { passive: true }
    );

    const reset = () => {
      set('--spot', '0');
      set('--rx', '0deg');
      set('--ry', '0deg');
    };

    card.addEventListener('pointerleave', reset);
    card.addEventListener('pointercancel', reset);
  });
}
