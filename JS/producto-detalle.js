/**
 * Lógica de la página de detalle de producto (producto.html)
 *
 * Reglas:
 * - El producto se busca en el arreglo `productos` (JS/productos.js) según
 *   el parámetro ?id= de la URL.
 * - La cantidad seleccionada respeta el stock del producto y el tope
 *   general del carrito (STOCK_MAXIMO, definido en JS/js.js).
 * - Los productos relacionados son otras cartas del mismo tipo.
 */

const contenedorDetalle = document.querySelector(".detalle-producto");
const seccionRelacionados = document.querySelector(".productos-relacionados");

const parametrosDetalle = new URLSearchParams(window.location.search);
const idProducto = parametrosDetalle.get("id");
const producto = productos.find((producto) => producto.id === idProducto);

if (!producto) {
  contenedorDetalle.innerHTML = `
    <p class="producto-no-encontrado">
      No encontramos esa carta. <a href="cartas.html">Vuelve al catálogo</a>.
    </p>
  `;
  seccionRelacionados.hidden = true;
} else {
  mostrarProducto(producto);
}

function mostrarProducto(producto) {
  document.title = `${producto.nombre} - PokéStore`;

  const enlaceCategoria = document.getElementById("breadcrumbCategoria");
  enlaceCategoria.textContent = NOMBRE_TIPO[producto.tipo] ?? producto.tipo;
  enlaceCategoria.href = `cartas.html?tipo=${producto.tipo}`;

  document.getElementById("breadcrumbProducto").textContent = producto.nombre;
  document.getElementById("productoNombre").textContent = producto.nombre;
  document.getElementById("productoPrecio").textContent = formatearPrecio(producto.precio);
  document.getElementById("productoDescripcion").textContent = producto.descripcion;

  mostrarGaleria(producto);
  configurarSelectorCantidad(producto);
  mostrarRelacionados(producto);
}

function mostrarGaleria(producto) {
  const imagenes = [
    { src: producto.imagen, etiqueta: "Frente" },
    { src: "img/poke-bola.png", etiqueta: "Reverso" },
  ];

  const imagenPrincipal = document.getElementById("imagenPrincipal");
  imagenPrincipal.src = imagenes[0].src;
  imagenPrincipal.alt = producto.nombre;

  const contenedorMiniaturas = document.getElementById("miniaturas");
  contenedorMiniaturas.innerHTML = imagenes
    .map(
      (imagen, indice) => `
        <button
          type="button"
          class="miniatura ${indice === 0 ? "activa" : ""}"
          data-imagen="${imagen.src}"
        >
          <img src="${imagen.src}" alt="${imagen.etiqueta} de ${producto.nombre}" />
        </button>
      `
    )
    .join("");

  contenedorMiniaturas.querySelectorAll(".miniatura").forEach((miniatura) => {
    miniatura.addEventListener("click", () => {
      imagenPrincipal.src = miniatura.dataset.imagen;

      contenedorMiniaturas
        .querySelectorAll(".miniatura")
        .forEach((otra) => otra.classList.remove("activa"));

      miniatura.classList.add("activa");
    });
  });
}

function configurarSelectorCantidad(producto) {
  const stockDisponible = Math.min(producto.stock, STOCK_MAXIMO);

  const spanCantidad = document.getElementById("cantidadSeleccionada");
  const botonRestar = document.getElementById("restarCantidad");
  const botonSumar = document.getElementById("sumarCantidad");
  const botonAgregar = document.getElementById("btnAgregarDetalle");

  let cantidad = CANTIDAD_MINIMA;

  function actualizarBotones() {
    spanCantidad.textContent = cantidad;
    botonRestar.disabled = cantidad <= CANTIDAD_MINIMA;
    botonSumar.disabled = cantidad >= stockDisponible;
  }

  if (stockDisponible === 0) {
    spanCantidad.textContent = 0;
    botonRestar.disabled = true;
    botonSumar.disabled = true;
    botonAgregar.disabled = true;
    botonAgregar.textContent = "Sin stock";
    return;
  }

  actualizarBotones();

  botonRestar.addEventListener("click", () => {
    if (cantidad > CANTIDAD_MINIMA) {
      cantidad -= 1;
      actualizarBotones();
    }
  });

  botonSumar.addEventListener("click", () => {
    if (cantidad < stockDisponible) {
      cantidad += 1;
      actualizarBotones();
    }
  });

  botonAgregar.addEventListener("click", () => {
    agregarDetalleAlCarrito(producto, cantidad, stockDisponible);
  });
}

function agregarDetalleAlCarrito(producto, cantidad, stockDisponible) {
  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === producto.id);

  if (itemExistente) {
    itemExistente.cantidad = Math.min(itemExistente.cantidad + cantidad, stockDisponible);
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad: Math.min(cantidad, stockDisponible),
    });
  }

  guardarCarrito(carrito);
  renderizarCarrito();
  cartDrawer.classList.add("open");
}

function mostrarRelacionados(producto) {
  const relacionados = productos
    .filter((otro) => otro.tipo === producto.tipo && otro.id !== producto.id)
    .slice(0, 4);

  const contenedorRelacionados = document.getElementById("relacionadosGrid");

  contenedorRelacionados.innerHTML = relacionados.length
    ? relacionados.map(crearTarjetaRelacionadaHTML).join("")
    : "<p>No hay más cartas de este tipo por ahora.</p>";
}

function crearTarjetaRelacionadaHTML(producto) {
  return `
    <article class="card" data-tipo="${producto.tipo}" data-id="${producto.id}">
      <div class="card-img">
        <img src="${producto.imagen}" alt="${producto.nombre}" />
      </div>

      <div class="card-info">
        <h3 class="card-title">${producto.nombre}</h3>
        <p class="card-price">${formatearPrecio(producto.precio)}</p>
        <button class="btn-comprar">Agregar al carro</button>
      </div>
    </article>
  `;
}
