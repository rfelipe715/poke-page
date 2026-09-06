/* ============================================================
   CATÁLOGO — Dibuja las tarjetas y controla la página cartas.html
   (búsqueda, filtros, orden, paginación y vista rápida).
   ============================================================ */

const CLAVE_FAVORITOS = "pokestore:favoritos";
const CARTAS_POR_PAGINA = 12;

let favoritos = leerDato(CLAVE_FAVORITOS, []);

/* ---------- Favoritos ---------- */

function esFavorita(id) {
  return favoritos.includes(id);
}

function alternarFavorito(id) {
  const carta = buscarCarta(id);

  if (esFavorita(id)) {
    favoritos = favoritos.filter((favorito) => favorito !== id);
    mostrarAviso(`${carta.nombre} fuera de favoritos`);
  } else {
    favoritos.push(id);
    mostrarAviso(`${carta.nombre} en favoritos`, "Guardado en este navegador", "exito");
  }

  guardarDato(CLAVE_FAVORITOS, favoritos);

  document
    .querySelectorAll(`[data-favorito="${id}"]`)
    .forEach((boton) => boton.setAttribute("aria-pressed", String(esFavorita(id))));

  // Si estamos en el catálogo con el filtro "sólo favoritas" activo,
  // hay que volver a dibujar la grilla
  if (document.querySelector("#grilla-catalogo") && filtros.soloFavoritos) {
    aplicarFiltros();
  }
}

/* ---------- Tarjeta de carta ---------- */

function estrellasHtml(carta) {
  return `<span class="estrellas">${icono("estrella", true)}
    ${carta.valoracion.toFixed(1)} <span>(${carta.resenas})</span></span>`;
}

function cartaHtml(carta) {
  const precio = precioFinal(carta);
  const tipo = buscarTipo(carta.tipo);
  const agotada = carta.stock === 0;

  const etiqueta = carta.descuento
    ? `<span class="pildora pildora-descuento">-${carta.descuento}%</span>`
    : agotada
    ? '<span class="pildora pildora-agotado">Agotada</span>'
    : "";

  return `
    <article class="carta" data-tipo="${carta.tipo}" data-carta="${carta.id}">
      <div class="carta-media">
        <div class="carta-etiquetas">
          ${etiqueta}
          <button class="carta-favorito" data-favorito="${carta.id}"
            aria-pressed="${esFavorita(carta.id)}"
            aria-label="Guardar ${carta.nombre} en favoritos">
            ${icono("corazon")}
          </button>
        </div>

        <img src="${carta.imagen}" alt="Carta de ${carta.nombre}"
          loading="lazy" data-respaldo>

        <button class="carta-vista" data-vista="${carta.id}">Vista rápida</button>
      </div>

      <div class="carta-cuerpo">
        <div class="carta-meta">
          <span class="pildora pildora-tipo">${tipo.emoji} ${tipo.nombre}</span>
          ${estrellasHtml(carta)}
        </div>

        <h3 class="carta-titulo">${carta.nombre}</h3>
        <p class="texto-menor">${carta.rareza} · nº ${carta.numero}/102 · Set Base</p>

        <div class="carta-precio">
          <span class="precio-actual">${formatoPrecio(precio)}</span>
          ${
            carta.descuento
              ? `<span class="precio-antiguo">${formatoPrecio(carta.precio)}</span>`
              : ""
          }
        </div>

        <div class="carta-acciones">
          <button class="btn btn-primario btn-chico" data-agregar="${carta.id}"
            ${agotada ? "disabled" : ""}>
            ${agotada ? "Sin stock" : "Agregar"}
          </button>
        </div>
      </div>
    </article>`;
}

function dibujarCartas(contenedor, listaDeCartas) {
  contenedor.innerHTML = listaDeCartas.map(cartaHtml).join("");
  activarImagenesDeRespaldo(contenedor);
  marcarCartasEnCarrito();
}

// Muestra en el botón si la carta ya está en el carrito
function marcarCartasEnCarrito() {
  document.querySelectorAll("[data-agregar]").forEach((boton) => {
    const carta = buscarCarta(boton.dataset.agregar);
    const cantidad = cantidadEnCarrito(carta.id);

    if (carta.stock === 0) {
      return;
    }

    boton.textContent = cantidad > 0 ? `En el carrito (${cantidad})` : "Agregar";
    boton.classList.toggle("btn-primario", cantidad === 0);
    boton.classList.toggle("btn-secundario", cantidad > 0);
  });
}

/* ---------- Vista rápida ---------- */

function abrirVistaRapida(id) {
  const carta = buscarCarta(id);
  const tipo = buscarTipo(carta.tipo);
  const precio = precioFinal(carta);

  abrirModal(
    `<div class="vista-rapida" data-tipo="${carta.tipo}">
      <div class="vista-rapida-media">
        <img src="${carta.imagen}" alt="Carta de ${carta.nombre}" data-respaldo>
      </div>

      <div class="vista-rapida-info">
        <div class="carta-meta">
          <span class="pildora pildora-tipo">${tipo.emoji} ${tipo.nombre}</span>
          ${estrellasHtml(carta)}
        </div>

        <h2>${carta.nombre}</h2>
        <p class="descripcion">${carta.descripcion}</p>

        <div class="carta-precio">
          <span class="precio-actual">${formatoPrecio(precio)}</span>
          ${
            carta.descuento
              ? `<span class="precio-antiguo">${formatoPrecio(carta.precio)}</span>
                 <span class="pildora pildora-descuento">-${carta.descuento}%</span>`
              : ""
          }
        </div>

        <dl class="datos-carta">
          <div class="dato"><dt>Rareza</dt><dd>${carta.rareza}</dd></div>
          <div class="dato"><dt>Número</dt><dd>${carta.numero}/102</dd></div>
          <div class="dato"><dt>Colección</dt><dd>Set Base 1999</dd></div>
          <div class="dato">
            <dt>Stock</dt>
            <dd>${carta.stock > 0 ? `${carta.stock} unidades` : "Agotada"}</dd>
          </div>
        </dl>

        <div class="carta-acciones">
          <button class="btn btn-primario btn-grande" data-agregar="${carta.id}"
            ${carta.stock === 0 ? "disabled" : ""}>
            ${icono("carrito")}
            ${carta.stock === 0 ? "Sin stock" : "Agregar al carrito"}
          </button>
          <button class="btn btn-secundario" data-favorito="${carta.id}"
            aria-pressed="${esFavorita(carta.id)}" aria-label="Guardar en favoritos">
            ${icono("corazon")}
          </button>
        </div>
      </div>
    </div>`,
    `Vista rápida de ${carta.nombre}`
  );
}

/* ---------- Clics compartidos por todas las páginas ---------- */

document.addEventListener("click", (evento) => {
  const botonVista = evento.target.closest("[data-vista]");
  if (botonVista) {
    abrirVistaRapida(botonVista.dataset.vista);
    return;
  }

  const botonFavorito = evento.target.closest("[data-favorito]");
  if (botonFavorito) {
    alternarFavorito(botonFavorito.dataset.favorito);
  }
});

/* ============================================================
   Página cartas.html
   ============================================================ */

const filtros = {
  texto: "",
  tipos: [],
  rarezas: [],
  precioMaximo: 0,
  soloOfertas: false,
  soloFavoritos: false,
  orden: "relevancia",
  visibles: CARTAS_POR_PAGINA,
};

const PRECIO_TOPE = Math.max(...CARTAS.map(precioFinal));

/* ---------- Filtrado y orden ---------- */

function cartasFiltradas() {
  const texto = filtros.texto.trim().toLowerCase();

  let resultado = CARTAS.filter((carta) => {
    if (texto && !carta.nombre.toLowerCase().includes(texto)) {
      return false;
    }
    if (filtros.tipos.length > 0 && !filtros.tipos.includes(carta.tipo)) {
      return false;
    }
    if (filtros.rarezas.length > 0 && !filtros.rarezas.includes(carta.rareza)) {
      return false;
    }
    if (precioFinal(carta) > filtros.precioMaximo) {
      return false;
    }
    if (filtros.soloOfertas && !carta.descuento) {
      return false;
    }
    if (filtros.soloFavoritos && !esFavorita(carta.id)) {
      return false;
    }
    return true;
  });

  const ordenadores = {
    relevancia: (a, b) =>
      Number(b.destacada) - Number(a.destacada) ||
      RAREZAS.indexOf(b.rareza) - RAREZAS.indexOf(a.rareza) ||
      b.valoracion - a.valoracion,
    "precio-asc": (a, b) => precioFinal(a) - precioFinal(b),
    "precio-desc": (a, b) => precioFinal(b) - precioFinal(a),
    nombre: (a, b) => a.nombre.localeCompare(b.nombre),
    valoracion: (a, b) => b.valoracion - a.valoracion,
    descuento: (a, b) => b.descuento - a.descuento,
  };

  return resultado.sort(ordenadores[filtros.orden]);
}

/* ---------- Fichas de filtros activos ---------- */

function fichasActivasHtml() {
  const fichas = [];

  if (filtros.texto.trim()) {
    fichas.push(["texto", `"${escaparHtml(filtros.texto.trim())}"`]);
  }

  filtros.tipos.forEach((id) => fichas.push([`tipo:${id}`, buscarTipo(id).nombre]));
  filtros.rarezas.forEach((rareza) => fichas.push([`rareza:${rareza}`, rareza]));

  if (filtros.soloOfertas) {
    fichas.push(["ofertas", "Sólo ofertas"]);
  }
  if (filtros.soloFavoritos) {
    fichas.push(["favoritos", "Sólo favoritos"]);
  }
  if (filtros.precioMaximo < PRECIO_TOPE) {
    fichas.push(["precio", `Hasta ${formatoPrecio(filtros.precioMaximo)}`]);
  }

  return fichas
    .map(
      ([clave, etiqueta]) => `
      <span class="ficha-activa">
        ${etiqueta}
        <button data-borrar-ficha="${clave}" aria-label="Quitar filtro ${etiqueta}">
          ${icono("cerrar")}
        </button>
      </span>`
    )
    .join("");
}

function borrarFicha(clave) {
  if (clave === "texto") {
    filtros.texto = "";
    document.querySelector("#buscar-carta").value = "";
  } else if (clave.startsWith("tipo:")) {
    filtros.tipos = filtros.tipos.filter((tipo) => tipo !== clave.slice(5));
  } else if (clave.startsWith("rareza:")) {
    filtros.rarezas = filtros.rarezas.filter((rareza) => rareza !== clave.slice(7));
  } else if (clave === "ofertas") {
    filtros.soloOfertas = false;
  } else if (clave === "favoritos") {
    filtros.soloFavoritos = false;
  } else if (clave === "precio") {
    filtros.precioMaximo = PRECIO_TOPE;
  }

  sincronizarControles();
  aplicarFiltros();
}

function limpiarFiltros() {
  filtros.texto = "";
  filtros.tipos = [];
  filtros.rarezas = [];
  filtros.precioMaximo = PRECIO_TOPE;
  filtros.soloOfertas = false;
  filtros.soloFavoritos = false;
  filtros.orden = "relevancia";

  sincronizarControles();
  aplicarFiltros();
}

// Deja los controles del formulario mostrando el estado real de los filtros
function sincronizarControles() {
  document.querySelector("#buscar-carta").value = filtros.texto;
  document.querySelector("#orden").value = filtros.orden;
  document.querySelector("#precio-maximo").value = filtros.precioMaximo;
  document.querySelector("#valor-precio").textContent = formatoPrecio(
    filtros.precioMaximo
  );

  document.querySelectorAll("[data-filtro-tipo]").forEach((casilla) => {
    casilla.checked = filtros.tipos.includes(casilla.value);
  });

  document.querySelectorAll("[data-filtro-rareza]").forEach((casilla) => {
    casilla.checked = filtros.rarezas.includes(casilla.value);
  });

  document.querySelector("#filtro-ofertas").checked = filtros.soloOfertas;
  document.querySelector("#filtro-favoritos").checked = filtros.soloFavoritos;

  document
    .querySelector("#buscador-catalogo")
    .classList.toggle("con-texto", filtros.texto !== "");
}

/* ---------- Dibujo del catálogo ---------- */

function aplicarFiltros(reiniciarPagina = true) {
  if (reiniciarPagina) {
    filtros.visibles = CARTAS_POR_PAGINA;
  }

  const resultado = cartasFiltradas();
  const visibles = resultado.slice(0, filtros.visibles);
  const grilla = document.querySelector("#grilla-catalogo");

  if (resultado.length === 0) {
    grilla.innerHTML = `
      <div class="estado-vacio" style="grid-column:1/-1">
        <div class="icono-vacio">${icono("buscar")}</div>
        <h3>No encontramos cartas</h3>
        <p>Prueba con otro nombre o quita algunos filtros.</p>
        <button class="btn btn-secundario" id="vaciar-filtros-vacio">
          Limpiar filtros
        </button>
      </div>`;
  } else {
    dibujarCartas(grilla, visibles);
  }

  document.querySelector("#conteo-resultados").innerHTML =
    resultado.length === 0
      ? "Sin resultados"
      : `Mostrando <strong>${visibles.length}</strong> de
         <strong>${resultado.length}</strong> cartas`;

  document.querySelector("#fichas-activas").innerHTML = fichasActivasHtml();

  const pie = document.querySelector("#pie-catalogo");
  const quedan = resultado.length - visibles.length;

  pie.innerHTML =
    quedan > 0
      ? `<button class="btn btn-secundario btn-grande" id="cargar-mas">
           Cargar ${Math.min(quedan, CARTAS_POR_PAGINA)} cartas más
         </button>
         <p>Quedan ${quedan} por mostrar</p>`
      : resultado.length > CARTAS_POR_PAGINA
      ? "<p>Ya viste todo el catálogo 🎉</p>"
      : "";

  actualizarUrl();
}

// Deja los filtros principales en la barra de direcciones para poder compartirlos
function actualizarUrl() {
  const parametros = new URLSearchParams();

  if (filtros.texto.trim()) {
    parametros.set("q", filtros.texto.trim());
  }
  if (filtros.tipos.length > 0) {
    parametros.set("tipo", filtros.tipos.join(","));
  }
  if (filtros.orden !== "relevancia") {
    parametros.set("orden", filtros.orden);
  }

  const consulta = parametros.toString();
  history.replaceState(null, "", consulta ? `?${consulta}` : location.pathname);
}

function leerFiltrosDeLaUrl() {
  const parametros = new URLSearchParams(location.search);

  filtros.texto = parametros.get("q") || "";
  filtros.precioMaximo = PRECIO_TOPE;

  const tipo = parametros.get("tipo");
  if (tipo) {
    filtros.tipos = tipo.split(",").filter(buscarTipo);
  }

  const orden = parametros.get("orden");
  if (orden) {
    filtros.orden = orden;
    if (orden === "descuento") {
      filtros.soloOfertas = true;
    }
  }
}

/* ---------- Construcción de la barra de filtros ---------- */

function dibujarOpcionesDeFiltro() {
  const porTipo = contarPorTipo();
  const porRareza = contarPorRareza();

  document.querySelector("#opciones-tipo").innerHTML = TIPOS.map(
    (tipo) => `
    <label class="opcion">
      <input type="checkbox" value="${tipo.id}" data-filtro-tipo>
      ${tipo.emoji} ${tipo.nombre}
      <span class="cantidad">${porTipo[tipo.id] || 0}</span>
    </label>`
  ).join("");

  document.querySelector("#opciones-rareza").innerHTML = [...RAREZAS]
    .reverse()
    .map(
      (rareza) => `
      <label class="opcion">
        <input type="checkbox" value="${rareza}" data-filtro-rareza>
        ${rareza}
        <span class="cantidad">${porRareza[rareza] || 0}</span>
      </label>`
    )
    .join("");

  const control = document.querySelector("#precio-maximo");
  control.min = 0;
  control.max = PRECIO_TOPE;
  control.step = 1000;
  control.value = PRECIO_TOPE;
}

/* ---------- Arranque de cartas.html ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const grilla = document.querySelector("#grilla-catalogo");
  if (!grilla) {
    return; // no estamos en el catálogo
  }

  dibujarOpcionesDeFiltro();
  leerFiltrosDeLaUrl();
  sincronizarControles();
  aplicarFiltros();

  const buscador = document.querySelector("#buscar-carta");
  buscador.addEventListener("input", () => {
    filtros.texto = buscador.value;
    document
      .querySelector("#buscador-catalogo")
      .classList.toggle("con-texto", buscador.value !== "");
    aplicarFiltros();
  });

  document.querySelector("#limpiar-busqueda").addEventListener("click", () => {
    filtros.texto = "";
    sincronizarControles();
    aplicarFiltros();
    buscador.focus();
  });

  document.querySelector("#orden").addEventListener("change", (evento) => {
    filtros.orden = evento.target.value;
    aplicarFiltros();
  });

  document.querySelector("#precio-maximo").addEventListener("input", (evento) => {
    filtros.precioMaximo = Number(evento.target.value);
    document.querySelector("#valor-precio").textContent = formatoPrecio(
      filtros.precioMaximo
    );
    aplicarFiltros();
  });

  document.querySelector("#panel-filtros").addEventListener("change", (evento) => {
    const control = evento.target;

    if (control.matches("[data-filtro-tipo]")) {
      filtros.tipos = [...document.querySelectorAll("[data-filtro-tipo]:checked")].map(
        (casilla) => casilla.value
      );
    } else if (control.matches("[data-filtro-rareza]")) {
      filtros.rarezas = [
        ...document.querySelectorAll("[data-filtro-rareza]:checked"),
      ].map((casilla) => casilla.value);
    } else if (control.id === "filtro-ofertas") {
      filtros.soloOfertas = control.checked;
    } else if (control.id === "filtro-favoritos") {
      filtros.soloFavoritos = control.checked;
    } else {
      return;
    }

    aplicarFiltros();
  });

  // Botones que aparecen y desaparecen: se escuchan desde el documento
  document.addEventListener("click", (evento) => {
    if (evento.target.closest("#cargar-mas")) {
      filtros.visibles += CARTAS_POR_PAGINA;
      aplicarFiltros(false);
      return;
    }

    if (
      evento.target.closest("#limpiar-filtros") ||
      evento.target.closest("#vaciar-filtros-vacio")
    ) {
      limpiarFiltros();
      return;
    }

    const ficha = evento.target.closest("[data-borrar-ficha]");
    if (ficha) {
      borrarFicha(ficha.dataset.borrarFicha);
    }
  });

  // Panel de filtros en pantallas pequeñas
  const panelFiltros = document.querySelector("#panel-filtros");
  const telonFiltros = document.querySelector("#telon-filtros");

  document.querySelector("#abrir-filtros").addEventListener("click", () => {
    panelFiltros.classList.add("abierto");
    telonFiltros.classList.add("abierto");
    document.body.classList.add("sin-scroll");
  });

  function cerrarFiltros() {
    panelFiltros.classList.remove("abierto");
    telonFiltros.classList.remove("abierto");
    document.body.classList.remove("sin-scroll");
  }

  telonFiltros.addEventListener("click", cerrarFiltros);
  document.querySelector("#cerrar-filtros").addEventListener("click", cerrarFiltros);
});
