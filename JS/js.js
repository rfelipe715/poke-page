/**
 * Lógica del catálogo: pinta las cartas destacadas del inicio, todas las
 * cartas de cartas.html, y maneja el buscador y el filtro por categoría.
 * Usa el arreglo "productos" definido en productos.js.
 */

// ---------- CARTAS DESTACADAS (solo existe en index.html) ----------
const grillaDestacadas = document.getElementById("grillaDestacadas");

if (grillaDestacadas) {
  const destacados = productos.filter((producto) => producto.destacada);
  renderizarProductos(grillaDestacadas, destacados);
}

// ---------- TODAS LAS CARTAS (solo existe en cartas.html) ----------
const grillaCartas = document.getElementById("grillaCartas");

if (grillaCartas) {
  renderizarProductos(grillaCartas, productos);

  // Si se llega desde "cartas.html?tipo=fuego", se deja ese filtro activo.
  const parametrosURL = new URLSearchParams(window.location.search);
  const tipoURL = parametrosURL.get("tipo");

  if (tipoURL) {
    const productosFiltrados = productos.filter(
      (producto) => producto.tipo === tipoURL,
    );
    renderizarProductos(grillaCartas, productosFiltrados);
  }

  // Marca el botón de categoría que corresponde al filtro actual.
  const botonesCategorias = document.querySelectorAll(".lista-categorias button");

  botonesCategorias.forEach((boton) => {
    const categoriaDelBoton = tipoURL ? tipoURL : "todos";
    if (boton.dataset.categoria === categoriaDelBoton) {
      boton.classList.add("activa");
    }
  });

  // Filtro por categoría (clic en los botones de arriba de la grilla).
  botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", () => {
      const categoriaSeleccionada = boton.dataset.categoria;

      botonesCategorias.forEach((otroBoton) => {
        otroBoton.classList.remove("activa");
      });
      boton.classList.add("activa");

      if (categoriaSeleccionada === "todos") {
        renderizarProductos(grillaCartas, productos);
      } else {
        const productosFiltrados = productos.filter(
          (producto) => producto.tipo === categoriaSeleccionada,
        );
        renderizarProductos(grillaCartas, productosFiltrados);
      }
    });
  });

  // Buscador por nombre.
  const inputBuscar = document.getElementById("buscarCarta");
  const botonBuscar = document.getElementById("botonBuscar");

  function buscarCarta() {
    const texto = inputBuscar.value.toLowerCase().trim();
    const productosFiltrados = productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(texto),
    );
    renderizarProductos(grillaCartas, productosFiltrados);
  }

  botonBuscar.addEventListener("click", buscarCarta);
  inputBuscar.addEventListener("input", buscarCarta);
}

// ---------- BOTONES DE CATEGORÍA DEL INICIO ----------
// En el inicio los botones solo llevan a cartas.html con el filtro elegido.
const botonesCategoriasInicio = document.querySelectorAll(
  ".categorias-inicio button",
);

botonesCategoriasInicio.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoria = boton.dataset.categoria;

    if (categoria === "todos") {
      window.location.href = "cartas.html";
    } else {
      window.location.href = `cartas.html?tipo=${categoria}`;
    }
  });
});
