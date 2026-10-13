/* Campo de motas en un único canvas 2D.
   - sprite pre-renderizado: cero gradientes por frame
   - un solo rAF compartido, pausado con la pestaña oculta
   - sin ejecutar nada si el usuario pide movimiento reducido */

import { prefersReduced, on } from './util.js';

const PALETTE = [
  ['rgba(255,255,255,0.9)', 'rgba(140,235,180,0.32)', 'rgba(79,190,131,0)'],
  ['rgba(255,246,240,0.9)', 'rgba(231,183,163,0.3)', 'rgba(231,183,163,0)'],
];

function makeSprite(stops) {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, stops[0]);
  g.addColorStop(0.35, stops[1]);
  g.addColorStop(1, stops[2]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return c;
}

export function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas || prefersReduced()) {
    if (canvas) canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const sprites = PALETTE.map(makeSprite);
  let dpr = 1;
  let w = 0;
  let h = 0;
  let motes = [];
  let running = true;
  let rafId = 0;
  let t = 0;

  const rand = (min, max) => min + Math.random() * (max - min);

  const spawn = (initial) => ({
    x: Math.random(),
    y: initial ? Math.random() : rand(1.05, 1.25),
    r: rand(0.2, 0.8),
    vy: rand(0.00008, 0.00032),
    amp: rand(0.006, 0.035),
    speed: rand(0.4, 1.1),
    phase: Math.random() * Math.PI * 2,
    alpha: rand(0.1, 0.34),
    sprite: Math.random() > 0.72 ? 1 : 0,
  });

  const build = () => {
    const count = Math.round(Math.min(38, Math.max(18, w / 40)));
    motes = Array.from({ length: count }, () => spawn(true));
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  };

  const frame = () => {
    if (!running) return;
    t += 1;
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < motes.length; i += 1) {
      const m = motes[i];
      m.y -= m.vy * 60;
      if (m.y < -0.1) Object.assign(m, spawn(false));

      const px = (m.x + Math.sin(t * 0.004 * m.speed + m.phase) * m.amp) * w;
      const py = m.y * h;
      const radius = m.r * 14;

      ctx.globalAlpha = m.alpha * Math.min(1, m.y * 4) * Math.min(1, (1 - m.y) * 5 + 0.35);
      ctx.drawImage(sprites[m.sprite], px - radius, py - radius, radius * 2, radius * 2);
    }

    ctx.globalAlpha = 1;
    rafId = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  on(window, 'resize', () => {
    cancelAnimationFrame(rafId);
    resize();
    if (running) rafId = requestAnimationFrame(frame);
  });

  on(document, 'visibilitychange', () => (document.hidden ? stop() : start()));

  resize();
  running = false;
  start();
}
