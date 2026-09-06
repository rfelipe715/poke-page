# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

PokéStore — a fictional Pokémon trading-card store. Semester project for Fullstack 2 at DUOC UC.

Static site: plain HTML/CSS/JavaScript. **No package.json, no build step, no bundler, no test framework, no linter.** Do not introduce npm tooling, frameworks, or a build pipeline — the assignment's premise is hand-written HTML/CSS/JS.

All content, identifiers, comments, and commit messages are in Spanish. Keep writing in Spanish.

## Running it

Open `index.html` in a browser, or `python -m http.server 8000`. Nothing to build, lint, or test — verification is visual.

Deployed via GitHub Pages from `master`: https://rfelipe715.github.io/poke-page/

For a quick headless check without a browser extension:

```bash
python -m http.server 8765 &
chrome --headless --disable-gpu --user-data-dir=/tmp/prof \
  --virtual-time-budget=8000 --dump-dom http://localhost:8765/cartas.html
```

Swap `--dump-dom` for `--screenshot=out.png --window-size=1440,1000` to look at the design.

## JavaScript style — important

The user explicitly rejected an earlier version written with a `window.PS` namespace object, IIFE wrappers, `"use strict"`, and `var`. Write **plain modern JavaScript**, the way it would be taught in class:

- `const`/`let`, arrow functions, template literals, `.map()`/`.filter()`, destructuring, optional chaining, default parameters.
- Each file is a classic `<script defer>` — **no ES modules**, no `import`/`export`. Opening `index.html` from the filesystem must keep working.
- Functions and constants are declared at top level and shared across files through the global scope. Because of this, **top-level names must stay unique across all of `JS/`**.
- No namespace objects, no IIFEs, no `"use strict"`, no `var`.

## Architecture

### Scripts load in a fixed order

Every page loads a subset of these, in this order — later files call functions from earlier ones:

`datos.js` → `comun.js` → `cuenta.js` → `carrito.js` → `catalogo.js` → `inicio.js`

`login.html` loads only the first three (it has no header, footer, or cart).

Each file's `DOMContentLoaded` handler runs in load order, which is what makes the sequence work: `comun.js` builds the header before `cuenta.js` fills the account slot and `carrito.js` reads the cart badge.

Page-specific files bail out early by checking for an element that only exists on their page (`#grilla-catalogo` for the catalog, `#portada-visual` for the home page), so it is safe to load them anywhere.

### Cards are data, not markup

`JS/datos.js` holds all 52 cards as plain objects. **The HTML contains no products.** `cartaHtml()` in `catalogo.js` builds every card; the home page and the catalog both render through `dibujarCartas()`.

Adding a card means adding an object to `CARTAS` — nothing else. Card numbers match the real Base Set (`images.pokemontcg.io/base1/<numero>.png`), so `numero`, `nombre`, and `imagen` must stay consistent with each other.

Card images are hot-linked from an external CDN. Anything rendering an `<img>` for a card should add `data-respaldo` and call `activarImagenesDeRespaldo()`, which swaps in `IMAGEN_RESPALDO` when the CDN fails.

### Header and footer are generated once

`dibujarCabecera()` and `dibujarPie()` in `comun.js` fill the `<header data-cabecera>` and `<footer data-pie>` placeholders. **Never paste header or nav markup into a page** — that duplication was the original problem this replaced.

Icons are inline SVG paths in the `ICONOS` object. Use `icono("nombre")` in a template literal, or put `data-icono="nombre"` on an element in the HTML and let `dibujarIconosDeclarados()` fill it.

### Single filter pipeline

The catalog has one `filtros` state object and one `aplicarFiltros()` that re-renders everything: grid, result count, active-filter chips, pagination, and the URL. Search, type, rarity, price, offers, favorites, and sort all mutate `filtros` and call it. **Do not add a second code path that hides cards directly** — the old version had two competing filters fighting over `style.display`.

`?tipo=`, `?q=` and `?orden=` are read on load and written back with `history.replaceState`, so filtered views are shareable.

### localStorage keys

All prefixed `pokestore:` — `tema`, `carrito`, `favoritos`, `sesion`, `usuarios`. Read and write through `leerDato()`/`guardarDato()` (they JSON-encode), including from the inline theme script in each page's `<head>`.

`USUARIOS_DEMO` in `cuenta.js` is seed data; registered users are appended to `pokestore:usuarios`. Confirming an order requires a session — `confirmarPedido()` redirects to `login.html?volver=<página>` when there is none.

### CSS layering

`base.css` (reset, design tokens, utilities) → `componentes.css` (buttons, cards, cart, modals, forms) → `layout.css` (header, hero, sections, footer) → `cuenta.css` (login page only). Load in that order; later files assume the tokens from `base.css`.

Theming is `data-tema="claro|oscuro"` on `<html>`, set by an inline script in each `<head>` before first paint to avoid a flash. Both themes must be styled — every colour comes from a custom property defined in both blocks.

Per-type colours come from `[data-tipo="fuego"]` etc. setting `--color-tipo`, which descendants read via `color-mix()`. Put `data-tipo` on the card root and the children pick it up.

Scroll reveal (`.revelar`) is hidden **only** under `html.js`, a class the inline head script adds. Without JavaScript the content stays visible — do not move that hiding rule out of the `.js` scope.
