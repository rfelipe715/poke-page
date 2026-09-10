# 🔴 PokéStore

Tienda web de cartas Pokémon para coleccionistas, desarrollada como proyecto de la asignatura **DSY1104 - Fullstack 2** de DUOC UC.

Es un sitio 100% front-end (HTML, CSS y JavaScript puro, sin frameworks) que simula un e-commerce: catálogo con filtros y buscador, carrito de compras persistente, inicio de sesión y una sección de "Mi cuenta".

## Demo en vivo

| Página | Enlace |
| --- | --- |
| 🏠 Inicio | https://rfelipe715.github.io/poke-page/ |
| 🃏 Catálogo completo | https://rfelipe715.github.io/poke-page/cartas.html |
| 🔐 Iniciar sesión | https://rfelipe715.github.io/poke-page/login.html |

## Funcionalidades

- **Catálogo de cartas** con tarjetas de producto (imagen, precio, descuento).
- **Filtro por categoría** (fuego, agua, planta, eléctrico, psíquico, normal, lucha), tanto con los botones como por parámetro en la URL (`cartas.html?tipo=fuego`).
- **Buscador en vivo** que filtra las cartas mientras se escribe.
- **Carrito de compras** lateral (drawer): agregar, subir/bajar cantidad, quitar producto y confirmar pedido. Se guarda en `localStorage`, así que no se pierde al cambiar de página ni al recargar.
- **Inicio de sesión** con usuarios de prueba y sesión persistente en `localStorage`.
- **Mi cuenta**: editar nombre/correo y cerrar sesión.
- **Diseño responsive**, adaptado a tablet y celular mediante media queries.

## Usuarios de prueba

| Correo | Contraseña |
| --- | --- |
| bryan@tienda.cl | 1234 |
| ignacio@tienda.cl | 1234 |
| felipe@tienda.cl | 1234 |

## Tecnologías

- HTML5 semántico
- CSS3 (Flexbox, Grid, media queries, transiciones)
- JavaScript vanilla (DOM, eventos, `localStorage`)

Sin build tools ni dependencias: es HTML/CSS/JS plano que corre directo en el navegador.

## Estructura del proyecto

```
poke-page/
├── index.html            # Página de inicio (home)
├── cartas.html           # Catálogo completo de cartas
├── login.html            # Inicio de sesión
├── mi-cuenta.html        # Perfil del usuario
├── styles.css            # Estilos del home y del catálogo
├── CSS/
│   ├── inicio-sesion.css # Estilos del login
│   └── mi-cuenta.css     # Estilos de "Mi cuenta"
├── JS/
│   ├── js.js              # Carrito, filtros, buscador y estado de sesión en el header
│   ├── inicio-sesion.js   # Lógica de login
│   └── mi-cuenta.js       # Lógica de "Mi cuenta"
└── img/
    └── poke-bola.png      # Logo
```

## Cómo verlo localmente

No requiere instalación ni dependencias:

1. Clona o descarga el repositorio.
2. Abre `index.html` en tu navegador (o usa la extensión "Live Server" de VS Code).
