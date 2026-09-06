# PokéStore

Proyecto de semestre — Desarrollo Full Stack II, DUOC UC.

Tienda online de cartas Pokémon para coleccionistas, hecha con HTML, CSS y
JavaScript (sin frameworks ni backend: los datos viven en el propio
JavaScript y se guardan en el `localStorage` del navegador).

## Integrantes

Bryan · Ignacio · Felipe

## Cómo verla

- **Home:** https://rfelipe715.github.io/poke-page/
- **Login:** https://rfelipe715.github.io/poke-page/login.html

También puedes abrir `index.html` directamente en el navegador; no
necesita servidor ni instalación.

## Usuarios de prueba

| Correo                         | Contraseña | Rol            |
| ------------------------------- | ---------- | -------------- |
| bryan@duoc.cl                   | 1234       | Administrador  |
| ignacio@duoc.cl                 | 1234       | Administrador  |
| felipe@duoc.cl                  | 1234       | Administrador  |
| valentina@profesor.duoc.cl      | 1234       | Vendedor       |
| cliente@gmail.com               | 1234       | Cliente        |

Solo se aceptan correos `@duoc.cl`, `@profesor.duoc.cl` o `@gmail.com`.

## Estructura del proyecto

```
index.html               Inicio (cartas destacadas)
cartas.html               Catálogo completo, buscador y filtro por tipo
detalle.html              Detalle de una carta (?id=)
login.html / registro.html   Acceso de usuarios
nosotros.html             Quiénes somos + video
blogs.html + blog-detalle-*.html   Blog de la tienda
contacto.html             Formulario de contacto
admin-*.html              Panel de administración (productos y usuarios)

styles.css                Única hoja de estilos del sitio
JS/productos.js           Catálogo de productos (arreglo de objetos)
JS/carrito.js             Lógica del carrito (localStorage)
JS/tarjetas.js            Cómo se dibuja una tarjeta de producto
JS/validaciones.js        Validaciones reutilizadas en los formularios
JS/regiones.js            Regiones y comunas de Chile
JS/admin-datos.js         Datos del panel admin (localStorage)
JS/admin.js               Acceso y menú del panel admin
```

## Funcionalidades

- Catálogo dinámico por tipo (fuego, agua, planta, eléctrico, psíquico,
  normal, lucha), con buscador y detalle de producto.
- Carrito de compras persistente (localStorage): agregar, cambiar
  cantidad, quitar y confirmar pedido.
- Inicio de sesión y registro con validaciones en tiempo real.
- Panel de administración con control de acceso por rol
  (administrador / vendedor / cliente): mantenedor de productos y de
  usuarios, con validación de RUN chileno y región/comuna encadenadas.

## Pendiente

- Completar el documento ERS y la planilla de requerimientos
  (`requisitos_examen/`), que se llenan en paralelo al desarrollo.
