/* ============================================================
   CARRITO — Estado guardado en localStorage, panel lateral
   y confirmación del pedido.
   ============================================================ */

const CLAVE_CARRITO = "pokestore:carrito";
const MAXIMO_POR_CARTA = 9;
const ENVIO_GRATIS_DESDE = 40000;
const COSTO_ENVIO = 3990;

// Cada línea es { id, cantidad }. Descartamos las que ya no existen.
let lineasCarrito = leerDato(CLAVE_CARRITO, []).filter((linea) =>
  buscarCarta(linea.id)
);

function guardarCarrito() {
  guardarDato(CLAVE_CARRITO, lineasCarrito);
  dibujarCarrito();
}

/* ---------- Consultas ---------- */

function unidadesEnCarrito() {
  return lineasCarrito.reduce((total, linea) => total + linea.cantidad, 0);
}

function cantidadEnCarrito(id) {
  const linea = lineasCarrito.find((linea) => linea.id === id);
  return linea ? linea.cantidad : 0;
}

function totalesCarrito() {
  let subtotal = 0;
  let ahorro = 0;

  for (const linea of lineasCarrito) {
    const carta = buscarCarta(linea.id);
    subtotal += precioFinal(carta) * linea.cantidad;
    ahorro += (carta.precio - precioFinal(carta)) * linea.cantidad;
  }

  const envio =
    subtotal === 0 || subtotal >= ENVIO_GRATIS_DESDE ? 0 : COSTO_ENVIO;

  return { subtotal, ahorro, envio, total: subtotal + envio };
}

// Tope real: lo que quede en stock, nunca más de 9
function topeDe(carta) {
  return Math.min(MAXIMO_POR_CARTA, carta.stock);
}

/* ---------- Acciones ---------- */

function agregarAlCarrito(id, cantidad = 1) {
  const carta = buscarCarta(id);

  if (carta.stock === 0) {
    mostrarAviso("Sin stock", `${carta.nombre} no está disponible`, "error");
    return;
  }

  const actual = cantidadEnCarrito(id);
  const tope = topeDe(carta);

  if (actual >= tope) {
    mostrarAviso(
      "Máximo alcanzado",
      `Sólo quedan ${tope} unidades de ${carta.nombre}`,
      "error"
    );
    return;
  }

  const linea = lineasCarrito.find((linea) => linea.id === id);
  const nuevaCantidad = Math.min(actual + cantidad, tope);

  if (linea) {
    linea.cantidad = nuevaCantidad;
  } else {
    lineasCarrito.push({ id, cantidad: nuevaCantidad });
  }

  guardarCarrito();
  animarContadorCarrito();
  mostrarAviso(
    `${carta.nombre} agregado`,
    `${formatoPrecio(precioFinal(carta))} · ${carta.rareza}`,
    "exito"
  );
}

function cambiarCantidad(id, cantidad) {
  const carta = buscarCarta(id);
  const linea = lineasCarrito.find((linea) => linea.id === id);

  if (!linea) {
    return;
  }

  const nueva = Math.max(0, Math.min(cantidad, topeDe(carta)));

  if (nueva === 0) {
    quitarDelCarrito(id);
    return;
  }

  linea.cantidad = nueva;
  guardarCarrito();
}

function quitarDelCarrito(id) {
  const carta = buscarCarta(id);
  lineasCarrito = lineasCarrito.filter((linea) => linea.id !== id);
  guardarCarrito();
  mostrarAviso(`${carta.nombre} eliminado`, "Se quitó del carrito");
}

function vaciarCarrito(silencioso = false) {
  lineasCarrito = [];
  guardarCarrito();

  if (!silencioso) {
    mostrarAviso("Carrito vacío", "Se eliminaron todas las cartas");
  }
}

/* ---------- Panel lateral ---------- */

function crearPanelCarrito() {
  if (document.querySelector("#panel-carrito")) {
    return;
  }

  const telon = document.createElement("div");
  telon.className = "telon";
  telon.id = "telon-carrito";
  telon.addEventListener("click", cerrarCarrito);
  document.body.append(telon);

  const panel = document.createElement("aside");
  panel.id = "panel-carrito";
  panel.className = "panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Carrito de compras");
  panel.innerHTML = `
    <div class="panel-cabeza">
      <div>
        <h2>Tu carrito</h2>
        <p id="resumen-carrito">Sin cartas todavía</p>
      </div>
      <button class="btn-icono" data-cerrar-carrito aria-label="Cerrar carrito">
        ${icono("cerrar")}
      </button>
    </div>
    <div class="panel-cuerpo" id="lineas-carrito"></div>
    <div class="panel-pie" id="pie-carrito"></div>`;
  document.body.append(panel);

  panel.addEventListener("click", (evento) => {
    if (evento.target.closest("[data-cerrar-carrito], [data-ir-catalogo]")) {
      cerrarCarrito();
      return;
    }

    const quitar = evento.target.closest("[data-quitar]");
    if (quitar) {
      quitarDelCarrito(quitar.dataset.quitar);
      return;
    }

    const menos = evento.target.closest("[data-menos]");
    if (menos) {
      const id = menos.dataset.menos;
      cambiarCantidad(id, cantidadEnCarrito(id) - 1);
      return;
    }

    const mas = evento.target.closest("[data-mas]");
    if (mas) {
      const id = mas.dataset.mas;
      cambiarCantidad(id, cantidadEnCarrito(id) + 1);
      return;
    }

    if (evento.target.closest("[data-vaciar]")) {
      vaciarCarrito();
      return;
    }

    if (evento.target.closest("[data-pagar]")) {
      confirmarPedido();
    }
  });
}

function abrirCarrito() {
  crearPanelCarrito();
  document.querySelector("#panel-carrito").classList.add("abierto");
  document.querySelector("#telon-carrito").classList.add("abierto");
  document.body.classList.add("sin-scroll");
  document.querySelector("[data-cerrar-carrito]").focus();
}

function cerrarCarrito() {
  const panel = document.querySelector("#panel-carrito");
  if (!panel) {
    return;
  }

  panel.classList.remove("abierto");
  document.querySelector("#telon-carrito").classList.remove("abierto");

  if (!modalEstaAbierto()) {
    document.body.classList.remove("sin-scroll");
  }
}

/* ---------- Dibujo del carrito ---------- */

function lineaCarritoHtml(linea) {
  const carta = buscarCarta(linea.id);
  const precio = precioFinal(carta);
  const tope = topeDe(carta);

  return `
    <article class="linea-carrito" data-tipo="${carta.tipo}">
      <div class="linea-carrito-img">
        <img src="${carta.imagen}" alt="" loading="lazy" data-respaldo>
      </div>
      <div class="linea-carrito-info">
        <h3>${carta.nombre}</h3>
        <span class="sub">${carta.rareza} · ${formatoPrecio(precio)} c/u</span>

        <div class="linea-carrito-pie">
          <div class="contador-cant">
            <button data-menos="${carta.id}" aria-label="Quitar una unidad">
              ${icono("menos")}
            </button>
            <span>${linea.cantidad}</span>
            <button data-mas="${carta.id}" aria-label="Agregar una unidad"
              ${linea.cantidad >= tope ? "disabled" : ""}>
              ${icono("mas")}
            </button>
          </div>
          <strong>${formatoPrecio(precio * linea.cantidad)}</strong>
        </div>

        <button class="quitar-linea" data-quitar="${carta.id}">
          ${icono("basura")} Quitar
        </button>
      </div>
    </article>`;
}

function pieCarritoHtml() {
  if (lineasCarrito.length === 0) {
    return "";
  }

  const { subtotal, ahorro, envio, total } = totalesCarrito();
  const faltaParaEnvioGratis = ENVIO_GRATIS_DESDE - subtotal;

  return `
    <div class="resumen">
      <div class="resumen-fila">
        <span>Subtotal</span><span>${formatoPrecio(subtotal)}</span>
      </div>

      ${
        ahorro > 0
          ? `<div class="resumen-fila">
               <span>Descuentos</span>
               <span class="ahorro">-${formatoPrecio(ahorro)}</span>
             </div>`
          : ""
      }

      <div class="resumen-fila">
        <span>Envío</span>
        <span>${
          envio === 0 ? '<span class="ahorro">Gratis</span>' : formatoPrecio(envio)
        }</span>
      </div>

      ${
        faltaParaEnvioGratis > 0
          ? `<div class="resumen-fila">
               <span class="texto-menor">Agrega ${formatoPrecio(
                 faltaParaEnvioGratis
               )} más y el envío es gratis</span>
             </div>`
          : ""
      }

      <div class="resumen-fila total">
        <span>Total</span><span>${formatoPrecio(total)}</span>
      </div>
    </div>

    <button class="btn btn-primario btn-bloque btn-grande" data-pagar>
      ${icono("escudo")} Confirmar pedido
    </button>
    <button class="btn btn-fantasma btn-bloque btn-chico espacio-arriba" data-vaciar>
      Vaciar carrito
    </button>`;
}

function carritoVacioHtml() {
  return `
    <div class="estado-vacio">
      <div class="icono-vacio">${icono("carrito")}</div>
      <h3>Tu carrito está vacío</h3>
      <p>Explora el catálogo y suma tus primeras cartas a la colección.</p>
      <a class="btn btn-primario" href="cartas.html" data-ir-catalogo>Ver catálogo</a>
    </div>`;
}

function animarContadorCarrito() {
  document.querySelectorAll("[data-carrito-num]").forEach((contador) => {
    contador.classList.remove("saltar");
    void contador.offsetWidth; // reinicia la animación
    contador.classList.add("saltar");
  });
}

function dibujarCarrito() {
  const unidades = unidadesEnCarrito();

  document.querySelectorAll("[data-carrito-num]").forEach((contador) => {
    contador.textContent = unidades;
  });

  const cuerpo = document.querySelector("#lineas-carrito");
  if (!cuerpo) {
    return;
  }

  cuerpo.innerHTML =
    lineasCarrito.length > 0
      ? lineasCarrito.map(lineaCarritoHtml).join("")
      : carritoVacioHtml();

  document.querySelector("#pie-carrito").innerHTML = pieCarritoHtml();

  document.querySelector("#resumen-carrito").textContent =
    unidades === 0
      ? "Sin cartas todavía"
      : `${unidades} ${unidades === 1 ? "carta" : "cartas"}`;

  activarImagenesDeRespaldo(cuerpo);

  // La página del catálogo muestra "En el carrito" en las tarjetas
  if (typeof marcarCartasEnCarrito === "function") {
    marcarCartasEnCarrito();
  }
}

/* ---------- Confirmar pedido ---------- */

function confirmarPedido() {
  if (lineasCarrito.length === 0) {
    return;
  }

  const usuario = usuarioConectado();

  if (!usuario) {
    cerrarCarrito();
    mostrarAviso(
      "Inicia sesión",
      "Necesitas una cuenta para confirmar el pedido",
      "error"
    );
    setTimeout(() => {
      window.location.href = `login.html?volver=${paginaActual()}`;
    }, 900);
    return;
  }

  const { total } = totalesCarrito();
  const numeroPedido = `PKS-${Date.now().toString().slice(-6)}-${
    Math.floor(Math.random() * 900) + 100
  }`;

  cerrarCarrito();
  vaciarCarrito(true);

  abrirModal(
    `<div class="confirmacion">
      <div class="marca-exito">${icono("check")}</div>
      <h2>¡Pedido confirmado, ${escaparHtml(usuario.nombre)}!</h2>
      <p>
        Enviaremos el detalle de tu compra por ${formatoPrecio(total)} al correo
        <strong>${escaparHtml(usuario.email)}</strong>.
      </p>
      <div class="codigo-pedido">${numeroPedido}</div>
      <div class="botones-centrados">
        <a class="btn btn-primario" href="cartas.html">Seguir comprando</a>
        <button class="btn btn-secundario" data-cerrar-modal>Cerrar</button>
      </div>
      <p class="texto-menor">
        Proyecto académico: no se procesó ningún pago real.
      </p>
    </div>`,
    "Pedido confirmado"
  );
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", () => {
  crearPanelCarrito();
  dibujarCarrito();

  document.addEventListener("click", (evento) => {
    if (evento.target.closest("[data-accion='abrir-carrito']")) {
      abrirCarrito();
      return;
    }

    const boton = evento.target.closest("[data-agregar]");
    if (boton) {
      agregarAlCarrito(boton.dataset.agregar, Number(boton.dataset.cantidad) || 1);
    }
  });

  // Si el usuario tiene otra pestaña abierta, mantenemos el carrito al día
  window.addEventListener("storage", (evento) => {
    if (evento.key === CLAVE_CARRITO) {
      lineasCarrito = leerDato(CLAVE_CARRITO, []);
      dibujarCarrito();
    }
  });
});
