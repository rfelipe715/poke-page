/**
 * Números que se muestran en las tarjetas del inicio del panel admin.
 */

document.getElementById("totalProductos").textContent =
  obtenerProductosAdmin().length;

document.getElementById("totalStockCritico").textContent =
  obtenerProductosAdmin().filter(
    (producto) => producto.stock <= producto.stockCritico,
  ).length;

document.getElementById("totalUsuarios").textContent =
  obtenerUsuariosAdmin().length;
