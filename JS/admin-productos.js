/**
 * Tabla del mantenedor de productos: lista, permite editar y eliminar.
 */

function pintarTablaProductos() {
  const cuerpoTabla = document.getElementById("tablaProductos");
  const listaProductos = obtenerProductosAdmin();

  cuerpoTabla.innerHTML = "";

  listaProductos.forEach((producto) => {
    const fila = document.createElement("tr");

    const stockClase = producto.stock <= producto.stockCritico ? "stock-bajo" : "";

    fila.innerHTML = `
      <td><img class="miniatura" src="${producto.imagen}" alt="${producto.nombre}"></td>
      <td>${producto.nombre}</td>
      <td>${producto.tipo}</td>
      <td>${formatearPrecio(producto.precio)}</td>
      <td class="${stockClase}">${producto.stock}</td>
      <td>
        <a href="admin-producto-form.html?id=${producto.id}" class="btn btn-secundario">Editar</a>
        <button type="button" class="link-boton" data-accion="eliminar-producto" data-id="${producto.id}">Eliminar</button>
      </td>
    `;

    cuerpoTabla.appendChild(fila);
  });
}

pintarTablaProductos();

document.getElementById("tablaProductos").addEventListener("click", (evento) => {
  const boton = evento.target.closest('[data-accion="eliminar-producto"]');
  if (!boton) {
    return;
  }

  const confirmado = confirm("¿Eliminar este producto del catálogo?");
  if (!confirmado) {
    return;
  }

  eliminarProductoAdmin(Number(boton.dataset.id));
  pintarTablaProductos();
});
