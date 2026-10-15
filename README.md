# Nuestra historia

Web narrativa de scroll: una línea de tiempo que se dibuja a medida que avanzas, con
tipografía cinética, constelación de fechas y una flor que abre al final.

**Sin build, sin framework, sin fotos.** Todo es CSS moderno, SVG y JavaScript en módulos ES.

---

## Cómo verlo

**▶ Ver en vivo:** https://alejandropd05.github.io/web-animada/

Usa un servidor local (los módulos ES no se cargan desde `file://`):

```bash
npx serve .
# o
python -m http.server 8000
```

Si abres `index.html` directamente, un mecanismo de seguridad deja la página en modo
estático legible en lugar de romperse.

---

## Estructura

```
index.html              Semántico, sin divs decorativos innecesarios
styles/
  00-layer-order.css    Orden de @layer — la precedencia es literal y única
  10-tokens.css         @property registradas, paleta oklch, escalas fluidas
  20-base.css           Reset, tipografía, foco, grano SVG, scrollbar
  30-layout.css         Rejilla, container queries, colofón
  40-components.css     Preloader, hero, timeline, constelación, bloom, cursor
  50-motion.css         Revelados, keyframes, estados iniciales
  60-reduced.css        Capa completa de prefers-reduced-motion
js/
  main.js               Orquestador
  smooth.js             Lenis sincronizado con ScrollTrigger
  loader.js             Cortina tipográfica
  reveal.js             Splitter + revelados + scrub del manifiesto
  timeline.js           Línea SVG, encendido de hitos, rail de capítulo
  constellation.js      Trazado + campo de estrellas determinista
  spotlight.js          Seguimiento de puntero y tilt en las tarjetas
  cursor.js             Cursor propio con retarda
  particles.js          Campo de motas en canvas 2D
  bloom.js              Flor + ráfaga
  util.js               Helpers sin dependencias
```

---

## Técnicas

**CSS**

- `@property` registradas para que `--m1x`, `--px`, `--rx`, `--spot` **interpolen** en
  lugar de saltar: la malla del hero se anima con ellas.
- `@layer` declarado una vez: `tokens → base → layout → components → motion → reduced`.
- **Container query** en `.timeline`: las tarjetas reaccionan al ancho real del contenedor,
  no del viewport.
- `color-mix(in oklab, …)` sobre una paleta **oklch**.
- `<details>` nativo animado con **`grid-template-rows: 0fr → 1fr`** — accesible y
  funcional sin JS, sin adivinar `max-height`.
- `mask-composite: exclude` para el borde que sigue al puntero (spotlight).
- Escala tipográfica fluida con `clamp()`, `text-wrap: balance/pretty`.
- Grano de película con `feTurbulence` en data-URI: cero peticiones de red.

**Motion**

- GSAP + ScrollTrigger para los **scrubs**: parallax del hero, iluminación palabra a
  palabra, y la línea de tiempo dibujándose con `stroke-dashoffset` sobre `pathLength`.
- Revelados por clase con estado inicial en CSS: si el JS falla, nada queda oculto.
- `IntersectionObserver` para entradas y para la banda central que controla el rail.
- Canvas 2D con **sprite pre-renderizado** (cero gradientes por frame) y un único rAF,
  pausado con `visibilitychange`.

**SVG**

- `pathLength="1"` para normalizar trazados de distinta longitud.
- viewBox en píxeles 1:1 para que la línea no se deforme al escalar.
- Estrellas de fondo con PRNG sembrado: mismo dibujo en cada visita.

---

## Accesibilidad y degradación

- `prefers-reduced-motion` es una **capa propia** (`60-reduced.css`), no un parche:
  todo pasa a estado final, sin parpadeos, sin preloader, sin cursor personalizado.
- Con **JS desactivado** la página es legible: la flor aparece abierta, la línea entera,
  los `<details>` siguen funcionando.
- `skip-link`, `:focus-visible` diseñado, nodos de la constelación navegables con teclado.
- Sin desbordamiento horizontal en móvil. La línea y los marcadores comparten eje.

---

## Contenido

Los textos originales se conservan intactos. Se añadieron tres piezas de conexión
(fáciles de editar o borrar en `index.html`):

- El manifiesto de la sección `001`.
- El pie de la constelación: *«Cinco fechas. Una sola línea.»*
- El colofón con la lista de técnicas.
