/**
 * Crea el HTML de una tarjeta de producto (la que se ve en el inicio,
 * en la página de cartas y en "productos relacionados" del detalle).
 * Se usa en varias páginas para no repetir el mismo HTML cada vez.
 */

function crearTarjetaProducto(producto) {
  const tarjeta = document.createElement("article");
  tarjeta.className = "card";
  tarjeta.dataset.tipo = producto.tipo;
  tarjeta.dataset.id = producto.id;

  let insigniaHTML = "";
  if (producto.stock === 0) {
    insigniaHTML = '<span class="badge badge-agotado">Agotado</span>';
  } else if (producto.precioAnterior > 0) {
    const porcentaje = Math.round(
      (1 - producto.precio / producto.precioAnterior) * 100,
    );
    insigniaHTML = `<span class="badge">-${porcentaje}% OFF</span>`;
  }

  let precioHTML = formatearPrecio(producto.precio);
  if (producto.precioAnterior > 0) {
    precioHTML = `<span class="old-price">${formatearPrecio(producto.precioAnterior)}</span> ${formatearPrecio(producto.precio)}`;
  }

  tarjeta.innerHTML = `
    <div class="card-img">
      <img src="${producto.imagen}" alt="${producto.nombre}">
      ${insigniaHTML}
    </div>
    <div class="card-info">
      <h3 class="card-title">${producto.nombre}</h3>
      <p class="card-price">${precioHTML}</p>
      <button class="btn-comprar" ${producto.stock === 0 ? "disabled" : ""}>
        ${producto.stock === 0 ? "Sin stock" : "Agregar al carro"}
      </button>
    </div>
  `;

  return tarjeta;
}

/**
 * Dibuja una lista de productos dentro de un contenedor, reemplazando
 * lo que hubiera antes.
 */
function renderizarProductos(contenedor, listaProductos) {
  contenedor.innerHTML = "";

  if (listaProductos.length === 0) {
    contenedor.innerHTML =
      '<p class="sin-resultados">No encontramos cartas con ese criterio.</p>';
    return;
  }

  listaProductos.forEach((producto) => {
    contenedor.appendChild(crearTarjetaProducto(producto));
  });
}

// Hacer clic en la tarjeta (fuera del botón) lleva al detalle del producto.
document.addEventListener("click", (evento) => {
  const tarjeta = evento.target.closest(".card");
  if (!tarjeta) {
    return;
  }

  // Si el clic fue en el botón de comprar, ese botón ya tiene su propio evento.
  if (evento.target.closest(".btn-comprar")) {
    return;
  }

  window.location.href = `detalle.html?id=${tarjeta.dataset.id}`;
});
