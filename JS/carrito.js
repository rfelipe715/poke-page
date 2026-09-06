/**
 * Lógica del carrito de compras.
 * El carrito se guarda en localStorage para que no se pierda al cambiar
 * de página. Solo guarda el id del producto y la cantidad; los datos del
 * producto (nombre, precio, imagen) siempre se leen desde productos.js.
 */

const CARRITO_STORAGE_KEY = "pokestore_carrito";

function obtenerCarrito() {
  const datosGuardados = localStorage.getItem(CARRITO_STORAGE_KEY);

  if (!datosGuardados) {
    return [];
  }

  return JSON.parse(datosGuardados);
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
}

function agregarAlCarrito(idProducto) {
  const producto = buscarProductoPorId(idProducto);

  if (!producto) {
    return;
  }

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === idProducto);

  if (itemExistente) {
    if (itemExistente.cantidad < producto.stock) {
      itemExistente.cantidad = itemExistente.cantidad + 1;
    }
  } else {
    carrito.push({ id: idProducto, cantidad: 1 });
  }

  guardarCarrito(carrito);
  actualizarCarritoEnPantalla();
  abrirPanelCarrito();
}

function cambiarCantidad(idProducto, delta) {
  const carrito = obtenerCarrito();
  const item = carrito.find((elemento) => elemento.id === idProducto);
  const producto = buscarProductoPorId(idProducto);

  if (!item || !producto) {
    return;
  }

  item.cantidad = item.cantidad + delta;

  if (item.cantidad > producto.stock) {
    item.cantidad = producto.stock;
  }

  if (item.cantidad < 1) {
    quitarDelCarrito(idProducto);
    return;
  }

  guardarCarrito(carrito);
  actualizarCarritoEnPantalla();
}

function quitarDelCarrito(idProducto) {
  const carrito = obtenerCarrito().filter((item) => item.id !== idProducto);
  guardarCarrito(carrito);
  actualizarCarritoEnPantalla();
}

function calcularCantidadTotal(carrito) {
  let total = 0;

  carrito.forEach((item) => {
    total = total + item.cantidad;
  });

  return total;
}

function calcularPrecioTotal(carrito) {
  let total = 0;

  carrito.forEach((item) => {
    const producto = buscarProductoPorId(item.id);

    if (producto) {
      total = total + producto.precio * item.cantidad;
    }
  });

  return total;
}

/**
 * Vuelve a dibujar el contador del header y el panel lateral del carrito
 * según lo que haya guardado en localStorage. Se llama cada vez que el
 * carrito cambia y también al cargar cualquier página.
 */
function actualizarCarritoEnPantalla() {
  const carrito = obtenerCarrito();

  const contador = document.getElementById("cartCount");
  if (contador) {
    contador.textContent = calcularCantidadTotal(carrito);
  }

  const contenedorItems = document.getElementById("drawerItems");
  const totalTexto = document.getElementById("drawerTotal");
  const botonConfirmar = document.getElementById("checkoutBtn");

  // Páginas como las del administrador no tienen panel de carrito.
  if (!contenedorItems) {
    return;
  }

  if (carrito.length === 0) {
    contenedorItems.innerHTML =
      '<div class="drawer-empty">Tu carrito está vacío.<br>Agrega alguna carta del catálogo.</div>';

    if (totalTexto) {
      totalTexto.textContent = formatearPrecio(0);
    }

    if (botonConfirmar) {
      botonConfirmar.disabled = true;
    }

    return;
  }

  contenedorItems.innerHTML = "";

  carrito.forEach((item) => {
    const producto = buscarProductoPorId(item.id);

    if (!producto) {
      return;
    }

    const fila = document.createElement("div");
    fila.className = "drawer-item";
    fila.innerHTML = `
      <img class="di-art" src="${producto.imagen}" alt="${producto.nombre}">
      <div class="di-info">
        <h4>${producto.nombre}</h4>
        <p>${formatearPrecio(producto.precio)} c/u</p>
        <div class="qty-row">
          <button class="qty-btn" data-accion="restar" data-id="${producto.id}">−</button>
          <span>${item.cantidad}</span>
          <button class="qty-btn" data-accion="sumar" data-id="${producto.id}">+</button>
          <button class="di-remove" data-accion="quitar" data-id="${producto.id}">Quitar</button>
        </div>
      </div>
    `;
    contenedorItems.appendChild(fila);
  });

  if (totalTexto) {
    totalTexto.textContent = formatearPrecio(calcularPrecioTotal(carrito));
  }

  if (botonConfirmar) {
    botonConfirmar.disabled = false;
  }
}

function abrirPanelCarrito() {
  const panel = document.getElementById("drawer");
  if (panel) {
    panel.classList.add("open");
  }
}

// Botones +/-/Quitar del panel del carrito (se crean dinámicamente).
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest("[data-accion]");
  if (!boton) {
    return;
  }

  const idProducto = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "sumar") {
    cambiarCantidad(idProducto, 1);
  } else if (accion === "restar") {
    cambiarCantidad(idProducto, -1);
  } else if (accion === "quitar") {
    quitarDelCarrito(idProducto);
  }
});

// Botones "Agregar al carro" de cualquier tarjeta de producto.
document.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".btn-comprar");
  if (!boton) {
    return;
  }

  const tarjeta = boton.closest("[data-id]");
  if (!tarjeta) {
    return;
  }

  agregarAlCarrito(Number(tarjeta.dataset.id));
});

// Abrir y cerrar el panel del carrito.
const botonAbrirCarrito = document.getElementById("openCart");
const botonCerrarCarrito = document.getElementById("closeCart");
const panelCarrito = document.getElementById("drawer");

if (botonAbrirCarrito) {
  botonAbrirCarrito.addEventListener("click", abrirPanelCarrito);
}

if (botonCerrarCarrito && panelCarrito) {
  botonCerrarCarrito.addEventListener("click", () => {
    panelCarrito.classList.remove("open");
  });
}

// Confirmar pedido: vacía el carrito y muestra un mensaje de agradecimiento.
const botonConfirmarPedido = document.getElementById("checkoutBtn");

if (botonConfirmarPedido) {
  botonConfirmarPedido.addEventListener("click", () => {
    guardarCarrito([]);

    const contenedorItems = document.getElementById("drawerItems");
    contenedorItems.innerHTML =
      '<div class="drawer-empty drawer-gracias">✅ ¡Gracias por tu compra!<br>Te contactaremos para coordinar el pago y el despacho.</div>';

    const contador = document.getElementById("cartCount");
    if (contador) {
      contador.textContent = 0;
    }

    const totalTexto = document.getElementById("drawerTotal");
    if (totalTexto) {
      totalTexto.textContent = formatearPrecio(0);
    }

    botonConfirmarPedido.disabled = true;
  });
}

// Pinta el contador del carrito apenas carga cualquier página.
actualizarCarritoEnPantalla();
