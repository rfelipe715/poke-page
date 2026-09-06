/**
 * Lógica de la página de detalle de un producto (detalle.html?id=3).
 */

const parametrosDetalle = new URLSearchParams(window.location.search);
const idProductoDetalle = Number(parametrosDetalle.get("id"));
const producto = buscarProductoPorId(idProductoDetalle);

if (!producto) {
  document.getElementById("detalleWrap").innerHTML =
    "<p>No encontramos esa carta. <a href=\"cartas.html\">Vuelve al catálogo</a>.</p>";
} else {
  document.title = `${producto.nombre} | PokéStore`;

  document.getElementById("migaNombre").textContent = producto.nombre;
  document.getElementById("detalleImagen").src = producto.imagen;
  document.getElementById("detalleImagen").alt = producto.nombre;
  document.getElementById("detalleTipo").textContent = producto.tipo;
  document.getElementById("detalleNombre").textContent = producto.nombre;
  document.getElementById("detalleDescripcion").textContent =
    producto.descripcion;

  let precioHTML = formatearPrecio(producto.precio);
  if (producto.precioAnterior > 0) {
    precioHTML = `<span class="old-price">${formatearPrecio(producto.precioAnterior)}</span> ${formatearPrecio(producto.precio)}`;
  }
  document.getElementById("detallePrecio").innerHTML = precioHTML;

  const elementoStock = document.getElementById("detalleStock");
  if (producto.stock === 0) {
    elementoStock.textContent = "Sin stock por ahora.";
    elementoStock.classList.add("stock-bajo");
  } else if (producto.stock <= producto.stockCritico) {
    elementoStock.textContent = `¡Últimas unidades! Quedan ${producto.stock}.`;
    elementoStock.classList.add("stock-bajo");
  } else {
    elementoStock.textContent = `Stock disponible: ${producto.stock} unidades.`;
  }

  // ---------- Selector de cantidad ----------
  let cantidadElegida = 1;
  const elementoCantidad = document.getElementById("cantidadValor");

  document.getElementById("sumarCantidad").addEventListener("click", () => {
    if (cantidadElegida < producto.stock) {
      cantidadElegida = cantidadElegida + 1;
      elementoCantidad.textContent = cantidadElegida;
    }
  });

  document.getElementById("restarCantidad").addEventListener("click", () => {
    if (cantidadElegida > 1) {
      cantidadElegida = cantidadElegida - 1;
      elementoCantidad.textContent = cantidadElegida;
    }
  });

  // ---------- Botón agregar al carro ----------
  const botonAgregar = document.getElementById("detalleAgregar");

  if (producto.stock === 0) {
    botonAgregar.disabled = true;
    botonAgregar.textContent = "Sin stock";
  } else {
    botonAgregar.addEventListener("click", () => {
      for (let i = 0; i < cantidadElegida; i++) {
        agregarAlCarrito(producto.id);
      }
    });
  }

  // ---------- Productos relacionados (mismo tipo) ----------
  const relacionados = productos.filter(
    (item) => item.tipo === producto.tipo && item.id !== producto.id,
  );
  renderizarProductos(
    document.getElementById("relacionadosGrid"),
    relacionados.slice(0, 6),
  );
}
