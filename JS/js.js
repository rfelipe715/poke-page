/**
 * Atributos HTML
 */

const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartDrawer = document.getElementById("drawer");
const cartCount = document.getElementById("cartCount");
const drawerItems = document.getElementById("drawerItems");
const drawerTotal = document.getElementById("drawerTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// FILTRO POR CATEGORIAS
const botonesCategorias = document.querySelectorAll(".lista-categorias button");
const cartas = document.querySelectorAll(".card");

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoriaSeleccionada = boton.dataset.categoria;

    cartas.forEach((carta) => {
      const tipoCarta = carta.dataset.tipo;

      if (
        categoriaSeleccionada === "todos" ||
        tipoCarta === categoriaSeleccionada
      ) {
        carta.style.display = "";
      } else {
        carta.style.display = "none";
      }
    });
  });
});

// BUSCADOR
const inputBuscar = document.getElementById("buscarCarta");
const botonBuscar = document.querySelector(".buscador button");

function buscarCarta() {
  const texto = inputBuscar.value.toLowerCase().trim();

  cartas.forEach((carta) => {
    const nombre = carta.querySelector(".card-title").textContent.toLowerCase();

    if (nombre.includes(texto)) {
      carta.style.display = "";
    } else {
      carta.style.display = "none";
    }
  });
}

// ABRIR Y CERRAR CARRITO
openCartBtn.addEventListener("click", () => {
  cartDrawer.classList.toggle("open");
});

closeCartBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

/**
 * CARRITO DE COMPRAS
 *
 * Reglas del carrito:
 * - Cantidad mínima por carta: 1. Para bajar de 1 se usa el botón "Quitar".
 * - Stock máximo por carta: 10 unidades (son cartas de colección, se limita
 *   la cantidad para simular disponibilidad limitada).
 * - El carrito se guarda en localStorage, así que se mantiene si el usuario
 *   navega entre index.html, cartas.html o el detalle de una carta.
 * - El botón "Confirmar pedido" solo se habilita cuando hay al menos 1 producto.
 */

const CANTIDAD_MINIMA = 1;
const STOCK_MAXIMO = 10;
const CARRITO_STORAGE_KEY = "poke_carrito";

function obtenerCarrito() {
  const carritoGuardado = localStorage.getItem(CARRITO_STORAGE_KEY);
  return carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
}

function generarIdProducto(nombre) {
  return nombre.trim().toLowerCase().replace(/\s+/g, "-");
}

function obtenerPrecioCarta(carta) {
  const precioOriginal = carta.querySelector(".card-price");
  const precioClonado = precioOriginal.cloneNode(true);

  const precioAnterior = precioClonado.querySelector(".old-price");
  if (precioAnterior) {
    precioAnterior.remove();
  }

  const soloNumeros = precioClonado.textContent.replace(/[^\d]/g, "");
  return Number(soloNumeros);
}

function formatearPrecio(valor) {
  return "$" + valor.toLocaleString("es-CL");
}

function agregarAlCarrito(carta) {
  const nombre = carta.querySelector(".card-title").textContent.trim();
  const precio = obtenerPrecioCarta(carta);
  const imagen = carta.querySelector(".card-img img").src;
  const id = generarIdProducto(nombre);

  const carrito = obtenerCarrito();
  const itemExistente = carrito.find((item) => item.id === id);

  if (itemExistente) {
    if (itemExistente.cantidad < STOCK_MAXIMO) {
      itemExistente.cantidad += 1;
    }
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: CANTIDAD_MINIMA });
  }

  guardarCarrito(carrito);
  renderizarCarrito();
  cartDrawer.classList.add("open");
}

function cambiarCantidad(id, delta) {
  const carrito = obtenerCarrito();
  const item = carrito.find((producto) => producto.id === id);
  if (!item) return;

  const nuevaCantidad = item.cantidad + delta;

  if (nuevaCantidad < CANTIDAD_MINIMA || nuevaCantidad > STOCK_MAXIMO) {
    return;
  }

  item.cantidad = nuevaCantidad;
  guardarCarrito(carrito);
  renderizarCarrito();
}

function quitarDelCarrito(id) {
  const carrito = obtenerCarrito().filter((producto) => producto.id !== id);
  guardarCarrito(carrito);
  renderizarCarrito();
}

function renderizarCarrito() {
  const carrito = obtenerCarrito();

  const totalItems = carrito.reduce((suma, item) => suma + item.cantidad, 0);
  cartCount.textContent = totalItems;

  if (carrito.length === 0) {
    drawerItems.innerHTML = `
      <div class="drawer-empty">
        Tu carrito está vacío.<br />
        Agrega alguna carta del catálogo.
      </div>
    `;
  } else {
    drawerItems.innerHTML = carrito
      .map((item) => {
        const sinBajar = item.cantidad <= CANTIDAD_MINIMA ? "disabled" : "";
        const sinSubir = item.cantidad >= STOCK_MAXIMO ? "disabled" : "";

        return `
      <div class="drawer-item" data-id="${item.id}">
        <img class="di-art" src="${item.imagen}" alt="${item.nombre}" />
        <div class="di-info">
          <h4>${item.nombre}</h4>
          <p>${formatearPrecio(item.precio)}</p>
          <div class="qty-row">
            <button class="qty-btn" data-accion="restar" ${sinBajar}>-</button>
            <span>${item.cantidad}</span>
            <button class="qty-btn" data-accion="sumar" ${sinSubir}>+</button>
          </div>
        </div>
        <button class="di-remove" data-accion="quitar">Quitar</button>
      </div>
    `;
      })
      .join("");
  }

  const total = carrito.reduce(
    (suma, item) => suma + item.precio * item.cantidad,
    0
  );
  drawerTotal.textContent = formatearPrecio(total);

  checkoutBtn.disabled = carrito.length === 0;
}

// AGREGAR AL CARRITO DESDE CUALQUIER CARTA (index, cartas y detalle)
document.addEventListener("click", (evento) => {
  const botonComprar = evento.target.closest(".btn-comprar");
  if (!botonComprar) return;

  const carta = botonComprar.closest(".card");
  if (!carta) return;

  agregarAlCarrito(carta);
});

// SUBIR, BAJAR Y QUITAR PRODUCTOS DESDE EL CARRITO
drawerItems.addEventListener("click", (evento) => {
  const fila = evento.target.closest(".drawer-item");
  if (!fila) return;

  const id = fila.dataset.id;
  const accion = evento.target.dataset.accion;

  if (accion === "sumar") {
    cambiarCantidad(id, 1);
  } else if (accion === "restar") {
    cambiarCantidad(id, -1);
  } else if (accion === "quitar") {
    quitarDelCarrito(id);
  }
});

// CONFIRMAR PEDIDO
checkoutBtn.addEventListener("click", () => {
  if (checkoutBtn.disabled) return;

  alert("¡Pedido confirmado! Gracias por tu compra.");

  guardarCarrito([]);
  renderizarCarrito();
  cartDrawer.classList.remove("open");
});

renderizarCarrito();

// EVENTOS DEL BUSCADOR
botonBuscar.addEventListener("click", buscarCarta);

inputBuscar.addEventListener("input", buscarCarta);

//Filtro para inicio
const parametrosURL = new URLSearchParams(window.location.search);

const tipoURL = parametrosURL.get("tipo");

if (tipoURL) {
  cartas.forEach((carta) => {
    const tipoCarta = carta.dataset.tipo;

    if (tipoCarta === tipoURL) {
      carta.style.display = "";
    } else {
      carta.style.display = "none";
    }
  });
}

const usuarioHeader = document.getElementById('usuario-header');
const nombreHeader = document.getElementById('nombre-header');

const nombreUsuario = localStorage.getItem('nombre_usuario');

if (nombreUsuario) {

    nombreHeader.textContent = nombreUsuario;

    // Si ya inició sesión, el monito manda a la cuenta
    usuarioHeader.href = 'mi-cuenta.html';

} else {

    // Si no inició sesión, manda al login
    usuarioHeader.href = 'login.html';

}