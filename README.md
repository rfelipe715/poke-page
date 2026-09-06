# PokéStore

Tienda ficticia de cartas Pokémon del Set Base (1999).
Proyecto de semestre de **Fullstack 2 · DUOC UC**.

Hecho sólo con **HTML, CSS y JavaScript**: sin frameworks, sin librerías y sin
paso de compilación.

## Ver el sitio

- [Inicio](https://rfelipe715.github.io/poke-page/)
- [Catálogo](https://rfelipe715.github.io/poke-page/cartas.html)
- [Iniciar sesión](https://rfelipe715.github.io/poke-page/login.html)

## Ejecutar en local

Basta con abrir `index.html` en el navegador. Si prefieres un servidor:

```bash
python -m http.server 8000
```

Y entrar a <http://localhost:8000>.

## Qué incluye

- **Catálogo de 52 cartas** con búsqueda, filtros por tipo, rareza y precio,
  seis criterios de orden y botón de "cargar más".
- **Carrito funcional**: se guarda en `localStorage`, calcula descuentos, envío
  gratis sobre $40.000 y confirma el pedido con un número de seguimiento.
- **Cuentas de usuario**: inicio de sesión, registro y sesión persistente. Para
  confirmar un pedido hay que estar conectado.
- **Favoritos** guardados en el navegador.
- **Tema claro y oscuro**, con la preferencia recordada entre visitas.
- **Vista rápida** de cada carta en una ventana modal.
- Diseño adaptable a móvil y navegación por teclado.

### Cuentas de prueba

| Correo              | Contraseña |
| ------------------- | ---------- |
| `bryan@tienda.cl`   | `1234`     |
| `ignacio@tienda.cl` | `1234`     |
| `felipe@tienda.cl`  | `1234`     |

También puedes crear una cuenta nueva desde la pestaña **Crear cuenta**.

## Estructura

```
index.html      Portada
cartas.html     Catálogo completo
login.html      Inicio de sesión y registro

CSS/
  base.css        Reset, variables de color, tipografía y utilidades
  componentes.css Botones, tarjetas, formularios, carrito, modales
  layout.css      Cabecera, portada, secciones y pie
  cuenta.css      Página de login

JS/
  datos.js      Las 52 cartas y funciones de precio
  comun.js      Iconos, tema, cabecera, pie, avisos y modales
  cuenta.js     Login, registro y sesión
  carrito.js    Carrito y confirmación del pedido
  catalogo.js   Tarjetas, filtros, orden y vista rápida
  inicio.js     Portada, categorías, destacadas y contacto
```

La cabecera y el pie se generan desde `comun.js`, así que se editan en un solo
lugar y no hay que copiarlos en cada página.

Las imágenes de las cartas se cargan desde `images.pokemontcg.io`. Si el
servicio no responde, se muestra una imagen de reemplazo.

---

Sitio creado con fines educativos. Pokémon y sus marcas pertenecen a Nintendo,
Game Freak y The Pokémon Company. Este proyecto no está afiliado ni patrocinado
por ellos.
