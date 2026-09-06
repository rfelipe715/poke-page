/**
 * Formulario para crear o editar un producto.
 * Si la URL trae ?id=3, se carga ese producto para editarlo.
 * Si no trae id, es un producto nuevo.
 */

const parametrosProducto = new URLSearchParams(window.location.search);
const idProductoEditar = Number(parametrosProducto.get("id"));
const productoExistente = idProductoEditar
  ? obtenerProductoAdminPorId(idProductoEditar)
  : null;

const campoCodigo = document.getElementById("prod-codigo");
const campoCategoria = document.getElementById("prod-categoria");
const campoNombreProducto = document.getElementById("prod-nombre");
const campoDescripcion = document.getElementById("prod-descripcion");
const campoPrecio = document.getElementById("prod-precio");
const campoPrecioAnterior = document.getElementById("prod-precio-anterior");
const campoStock = document.getElementById("prod-stock");
const campoStockCritico = document.getElementById("prod-stock-critico");
const campoImagen = document.getElementById("prod-imagen");
const campoDestacada = document.getElementById("prod-destacada");

const errorCodigo = document.getElementById("error-prod-codigo");
const errorCategoria = document.getElementById("error-prod-categoria");
const errorNombreProducto = document.getElementById("error-prod-nombre");
const errorDescripcion = document.getElementById("error-prod-descripcion");
const errorPrecio = document.getElementById("error-prod-precio");
const errorPrecioAnterior = document.getElementById("error-prod-precio-anterior");
const errorStock = document.getElementById("error-prod-stock");
const errorStockCritico = document.getElementById("error-prod-stock-critico");

// El código no tiene largo máximo, solo mínimo de 3 caracteres.
function validarCodigo(campo, elementoError) {
  const valor = campo.value.trim();

  if (valor === "") {
    mostrarError(campo, elementoError, "El código es obligatorio.");
    return false;
  }

  if (valor.length < 3) {
    mostrarError(campo, elementoError, "El código debe tener al menos 3 caracteres.");
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

// Precio anterior y stock crítico son opcionales, pero si se llenan
// deben ser números mayores o iguales a 0.
function validarNumeroOpcional(campo, elementoError, nombreCampo) {
  const valor = campo.value.trim();

  if (valor === "") {
    limpiarError(campo, elementoError);
    return true;
  }

  const numero = Number(valor);

  if (Number.isNaN(numero) || numero < 0) {
    mostrarError(campo, elementoError, `${nombreCampo} debe ser 0 o más.`);
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

// Si venimos a editar, se llena el formulario con los datos guardados.
if (productoExistente) {
  document.getElementById("tituloFormularioProducto").textContent =
    "Editar producto";

  campoCodigo.value = productoExistente.codigo || "";
  campoCategoria.value = productoExistente.tipo;
  campoNombreProducto.value = productoExistente.nombre;
  campoDescripcion.value = productoExistente.descripcion;
  campoPrecio.value = productoExistente.precio;
  campoPrecioAnterior.value = productoExistente.precioAnterior || "";
  campoStock.value = productoExistente.stock;
  campoStockCritico.value = productoExistente.stockCritico || "";
  campoImagen.value = productoExistente.imagen || "";
  campoDestacada.checked = Boolean(productoExistente.destacada);
}

// Validaciones en tiempo real.
campoCodigo.addEventListener("input", () => validarCodigo(campoCodigo, errorCodigo));
campoCategoria.addEventListener("change", () =>
  validarSeleccion(campoCategoria, errorCategoria, "una categoría"),
);
campoNombreProducto.addEventListener("input", () =>
  validarTexto(campoNombreProducto, errorNombreProducto, "El nombre", 100),
);
campoDescripcion.addEventListener("input", () =>
  validarTextoOpcional(campoDescripcion, errorDescripcion, "La descripción", 500),
);
campoPrecio.addEventListener("input", () =>
  validarNumero(campoPrecio, errorPrecio, "El precio", 0),
);
campoPrecioAnterior.addEventListener("input", () =>
  validarNumeroOpcional(campoPrecioAnterior, errorPrecioAnterior, "El precio anterior"),
);
campoStock.addEventListener("input", () =>
  validarNumero(campoStock, errorStock, "El stock", 0),
);
campoStockCritico.addEventListener("input", () =>
  validarNumeroOpcional(campoStockCritico, errorStockCritico, "El stock crítico"),
);

document.getElementById("formProducto").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const codigoValido = validarCodigo(campoCodigo, errorCodigo);
  const categoriaValida = validarSeleccion(campoCategoria, errorCategoria, "una categoría");
  const nombreValido = validarTexto(campoNombreProducto, errorNombreProducto, "El nombre", 100);
  const descripcionValida = validarTextoOpcional(
    campoDescripcion,
    errorDescripcion,
    "La descripción",
    500,
  );
  const precioValido = validarNumero(campoPrecio, errorPrecio, "El precio", 0);
  const precioAnteriorValido = validarNumeroOpcional(
    campoPrecioAnterior,
    errorPrecioAnterior,
    "El precio anterior",
  );
  const stockValido = validarNumero(campoStock, errorStock, "El stock", 0);
  const stockCriticoValido = validarNumeroOpcional(
    campoStockCritico,
    errorStockCritico,
    "El stock crítico",
  );

  const formularioValido =
    codigoValido &&
    categoriaValida &&
    nombreValido &&
    descripcionValida &&
    precioValido &&
    precioAnteriorValido &&
    stockValido &&
    stockCriticoValido;

  if (!formularioValido) {
    return;
  }

  const producto = {
    id: productoExistente ? productoExistente.id : 0,
    codigo: campoCodigo.value.trim(),
    nombre: campoNombreProducto.value.trim(),
    tipo: campoCategoria.value,
    descripcion: campoDescripcion.value.trim(),
    precio: Number(campoPrecio.value),
    precioAnterior: Number(campoPrecioAnterior.value) || 0,
    stock: Number(campoStock.value),
    stockCritico: Number(campoStockCritico.value) || 0,
    imagen:
      campoImagen.value.trim() ||
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    destacada: campoDestacada.checked,
  };

  guardarProductoAdmin(producto);
  window.location.href = "admin-productos.html";
});
