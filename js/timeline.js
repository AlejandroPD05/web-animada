/* Timeline: línea SVG que se dibuja con el scroll, hitos que
   se encienden al ser alcanzados y rail de capítulo en desktop. */

import { qs, qsa, hasGsap, prefersReduced, on } from './util.js';

export function initTimeline() {
  const track = qs('#timelineTrack');
  if (!track) return;

  const svg = qs('#timelineLine');
  const paths = [qs('#timelinePathBase'), qs('#timelinePathLit')].filter(Boolean);
  const lit = qs('#timelinePathLit');
  const milestones = qsa('[data-milestone]', track);

  /* ---- Geometría: el viewBox se mantiene 1:1 con los píxeles,
     así el trazo no se deforma al escalar. ---- */
  const measure = () => {
    const h = Math.max(1, Math.round(track.getBoundingClientRect().height));
    svg.setAttribute('viewBox', `0 0 2 ${h}`);
    const d = `M1 0 L1 ${h}`;
    paths.forEach((p) => p.setAttribute('d', d));
    return h;
  };

  measure();
  let raf = 0;
  on(window, 'resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(measure);
  });

  /* ---- Dibujo de la línea ---- */
  const setProgress = (p) => {
    if (lit) lit.style.strokeDashoffset = String(Math.max(0, Math.min(1, 1 - p)));
  };

  if (hasGsap() && !prefersReduced()) {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(lit, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: track,
        start: 'top 72%',
        end: 'bottom 78%',
        scrub: 0.35,
      },
    });

    // Recalcula tras cargar fuentes o cambiar el layout
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measure();
        ScrollTrigger.refresh();
      });
    }
  } else if (!prefersReduced()) {
    const onScroll = () => {
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.3;
      const passed = vh * 0.72 - rect.top;
      setProgress(passed / total);
    };
    on(window, 'scroll', onScroll, { passive: true });
    onScroll();
  } else {
    setProgress(1);
  }

  /* ---- Revelado + encendido de hitos ---- */
  if (prefersReduced()) {
    milestones.forEach((m) => m.classList.add('is-visible', 'is-lit'));
  } else {
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          revealIO.unobserve(entry.target);
        });
      },
      { threshold: 0.18 }
    );
    milestones.forEach((m) => revealIO.observe(m));
  }

  /* ---- Rail de capítulo ---- */
  const rail = qs('#chapterRail');
  const railDate = qs('#chapterDate');
  const railIndex = qs('#chapterIndex');
  let swapTimer = 0;
  let current = null;

  const setChapter = (el) => {
    if (!rail || current === el) return;
    current = el;
    const date = el.dataset.chapter;
    const index = el.dataset.index;

    if (prefersReduced()) {
      railDate.textContent = date;
      railIndex.textContent = `${index} / 05`;
      return;
    }

    rail.classList.add('is-swapping');
    clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      railDate.textContent = date;
      railIndex.textContent = `${index} / 05`;
      rail.classList.remove('is-swapping');
    }, 300);
  };

  if (rail) {
    const litIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-lit');
          setChapter(entry.target);
        });
      },
      // Banda estrecha en el centro del viewport: el hito "pasa por" ella
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    milestones.forEach((m) => litIO.observe(m));

    // El rail solo aparece mientras la línea de tiempo cruza la banda
    // central del viewport: nunca se cuela sobre el manifiesto.
    const sectionIO = new IntersectionObserver(
      (entries) => entries.forEach((e) => rail.classList.toggle('is-visible', e.isIntersecting)),
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    );
    sectionIO.observe(track);
  }
}
