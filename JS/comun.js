/* ============================================================
   COMÚN — Lo que usan todas las páginas:
   iconos, tema claro/oscuro, cabecera, pie, avisos y modales.
   ============================================================ */

/* ---------- Ayudantes cortos ---------- */

function escaparHtml(texto) {
  const reemplazos = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(texto).replace(/[&<>"']/g, (caracter) => reemplazos[caracter]);
}

function guardarDato(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function leerDato(clave, porDefecto) {
  const guardado = localStorage.getItem(clave);
  if (guardado === null) {
    return porDefecto;
  }
  return JSON.parse(guardado);
}

// Si una imagen del CDN externo falla, mostramos la de respaldo
function activarImagenesDeRespaldo(contenedor = document) {
  const imagenes = contenedor.querySelectorAll("img[data-respaldo]");
  imagenes.forEach((imagen) => {
    imagen.onerror = () => {
      imagen.onerror = null;
      imagen.src = IMAGEN_RESPALDO;
    };
  });
}

/* ---------- Iconos SVG dibujados a mano ---------- */

const ICONOS = {
  carrito:
    '<circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.4 12.1a2 2 0 0 0 2 1.6h8.3a2 2 0 0 0 2-1.6L21.5 7H6"/>',
  buscar: '<circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.6-4.6"/>',
  usuario:
    '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  chevron: '<path d="m6 9.5 6 6 6-6"/>',
  sol: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/>',
  luna: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  cerrar: '<path d="M18 6 6 18M6 6l12 12"/>',
  mas: '<path d="M12 5v14M5 12h14"/>',
  menos: '<path d="M5 12h14"/>',
  basura:
    '<path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6"/>',
  corazon:
    '<path d="M20.8 4.9a5.4 5.4 0 0 0-7.7 0L12 6l-1.1-1.1a5.4 5.4 0 1 0-7.7 7.7l1.1 1.1L12 21.5l7.7-7.8 1.1-1.1a5.4 5.4 0 0 0 0-7.7z"/>',
  estrella:
    '<path d="m12 2.5 2.9 5.9 6.6 1-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5-4.8-4.6 6.6-1z"/>',
  envio:
    '<path d="M1.5 4h13v11h-13zM14.5 8h4l3 3v4h-7z"/><circle cx="5.5" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/>',
  escudo: '<path d="M12 22s8-4.2 8-10.2V5.2L12 2 4 5.2V11.8C4 17.8 12 22 12 22z"/>',
  check: '<path d="m20 6.5-11 11-5-5"/>',
  ojo: '<path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/>',
  ojoCerrado:
    '<path d="M17.9 17.9A10.3 10.3 0 0 1 12 19.5C5.5 19.5 1.5 12 1.5 12a19 19 0 0 1 5.1-5.9m3.7-1.4A10.3 10.3 0 0 1 12 4.5c6.5 0 10.5 7.5 10.5 7.5a19 19 0 0 1-2.2 3.2M2 2l20 20M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
  arriba: '<path d="M12 20V4M5 11l7-7 7 7"/>',
  filtro: '<path d="M21.5 3h-19l7.6 9v6.5l3.8 2V12z"/>',
  flecha: '<path d="M4 12h16M13 5l7 7-7 7"/>',
  salir: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  reloj: '<circle cx="12" cy="12" r="9.5"/><path d="M12 6.5V12l4 2.2"/>',
  correo:
    '<rect x="2" y="4.5" width="20" height="15" rx="2.5"/><path d="m2.5 6.5 9.5 7 9.5-7"/>',
  instagram:
    '<rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/>',
  equis:
    '<path d="M3 3h4.5l5 6.8L18.2 3H21l-7.2 8.4L21.4 21h-4.5l-5.3-7.2L5.2 21H2.4l7.6-8.9z"/>',
  youtube: '<rect x="2" y="5" width="20" height="14" rx="4.5"/><path d="m10.5 9 5 3-5 3z"/>',
  pokebola:
    '<circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h6M15.5 12h6"/><circle cx="12" cy="12" r="3.2"/>',
};

function icono(nombre, relleno = false) {
  return `<svg viewBox="0 0 24 24" fill="${relleno ? "currentColor" : "none"}"
    stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true">${ICONOS[nombre]}</svg>`;
}

// El HTML marca dónde va cada icono con data-icono="nombre"
function dibujarIconosDeclarados(contenedor = document) {
  contenedor.querySelectorAll("[data-icono]").forEach((elemento) => {
    elemento.innerHTML = icono(elemento.dataset.icono);
  });

  // Todo buscador lleva la lupa a la izquierda
  contenedor.querySelectorAll(".buscador").forEach((buscador) => {
    if (!buscador.querySelector(":scope > svg")) {
      buscador.insertAdjacentHTML("afterbegin", icono("buscar"));
    }
  });
}

/* ---------- Tema claro / oscuro ---------- */

const CLAVE_TEMA = "pokestore:tema";

function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema;
  guardarDato(CLAVE_TEMA, tema);

  document.querySelectorAll("[data-accion='tema']").forEach((boton) => {
    boton.innerHTML = icono(tema === "oscuro" ? "sol" : "luna");
    boton.setAttribute(
      "aria-label",
      tema === "oscuro" ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
    );
  });
}

function alternarTema() {
  const actual = document.documentElement.dataset.tema;
  aplicarTema(actual === "oscuro" ? "claro" : "oscuro");
}

/* ---------- Avisos flotantes ---------- */

function mostrarAviso(titulo, detalle = "", tono = "info") {
  let contenedor = document.querySelector(".avisos");

  if (!contenedor) {
    contenedor = document.createElement("div");
    contenedor.className = "avisos";
    contenedor.setAttribute("role", "status");
    contenedor.setAttribute("aria-live", "polite");
    document.body.append(contenedor);
  }

  const iconosPorTono = { info: "pokebola", exito: "check", error: "cerrar" };

  const aviso = document.createElement("div");
  aviso.className = "aviso";
  aviso.dataset.tono = tono;
  aviso.innerHTML = `
    <span class="aviso-icono">${icono(iconosPorTono[tono])}</span>
    <div class="aviso-texto">
      <strong>${escaparHtml(titulo)}</strong>
      ${detalle ? `<span>${escaparHtml(detalle)}</span>` : ""}
    </div>`;

  contenedor.append(aviso);

  setTimeout(() => {
    aviso.classList.add("saliendo");
    setTimeout(() => aviso.remove(), 300);
  }, 3400);
}

/* ---------- Modal reutilizable ---------- */

let elementoConFocoPrevio = null;

function obtenerModal() {
  let modal = document.querySelector("#modal");
  if (modal) {
    return modal;
  }

  modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.innerHTML = `
    <div class="modal-caja">
      <button class="modal-cerrar" data-cerrar-modal aria-label="Cerrar">
        ${icono("cerrar")}
      </button>
      <div class="modal-contenido"></div>
    </div>`;
  document.body.append(modal);

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal || evento.target.closest("[data-cerrar-modal]")) {
      cerrarModal();
    }
  });

  return modal;
}

function abrirModal(contenido, etiqueta = "Ventana") {
  const modal = obtenerModal();
  modal.querySelector(".modal-contenido").innerHTML = contenido;
  modal.setAttribute("aria-label", etiqueta);

  elementoConFocoPrevio = document.activeElement;
  modal.classList.add("abierto");
  document.body.classList.add("sin-scroll");

  const primerFoco =
    modal.querySelector("button:not(.modal-cerrar), a[href], input") ||
    modal.querySelector(".modal-cerrar");
  primerFoco.focus();

  activarImagenesDeRespaldo(modal);
  return modal;
}

function cerrarModal() {
  const modal = document.querySelector("#modal.abierto");
  if (!modal) {
    return;
  }

  modal.classList.remove("abierto");

  if (!document.querySelector(".panel.abierto, .filtros.abierto")) {
    document.body.classList.remove("sin-scroll");
  }

  if (elementoConFocoPrevio) {
    elementoConFocoPrevio.focus();
  }
}

function modalEstaAbierto() {
  return Boolean(document.querySelector("#modal.abierto"));
}

/* ---------- Cabecera y pie compartidos ---------- */

const ENLACES_NAV = [
  { href: "index.html", texto: "Inicio" },
  { href: "cartas.html", texto: "Catálogo" },
  { href: "index.html#beneficios", texto: "Beneficios" },
  { href: "index.html#nosotros", texto: "Nosotros" },
  { href: "index.html#contacto", texto: "Contacto" },
];

function paginaActual() {
  const archivo = window.location.pathname.split("/").pop();
  return archivo === "" ? "index.html" : archivo;
}

function enlacesNavegacion() {
  return ENLACES_NAV.map((enlace) => {
    const esActual =
      !enlace.href.includes("#") && enlace.href === paginaActual();
    return `<a href="${enlace.href}" class="${esActual ? "activo" : ""}">${
      enlace.texto
    }</a>`;
  }).join("");
}

function dibujarCabecera() {
  const cabecera = document.querySelector("[data-cabecera]");
  if (!cabecera) {
    return;
  }

  cabecera.className = "cabecera";
  cabecera.innerHTML = `
    <div class="cabecera-interior contenedor">
      <a class="marca" href="index.html" aria-label="PokéStore, ir al inicio">
        <span class="pokebola" aria-hidden="true"></span>
        <span>Poké<em>Store</em></span>
      </a>

      <nav class="nav-principal" aria-label="Navegación principal">
        ${enlacesNavegacion()}
      </nav>

      <div class="acciones-cabecera">
        <button class="btn-icono" data-accion="tema" aria-label="Cambiar tema"></button>
        <div class="menu-cuenta" data-zona-cuenta></div>
        <button class="btn-carrito" data-accion="abrir-carrito" aria-label="Abrir carrito">
          ${icono("carrito")}
          <span>Carrito</span>
          <span class="carrito-num" data-carrito-num>0</span>
        </button>
        <button class="btn-icono btn-menu" data-accion="menu"
          aria-label="Abrir menú" aria-expanded="false">${icono("menu")}</button>
      </div>
    </div>

    <nav class="nav-movil" id="nav-movil" aria-label="Navegación móvil">
      ${enlacesNavegacion()}
    </nav>`;
}

function dibujarPie() {
  const pie = document.querySelector("[data-pie]");
  if (!pie) {
    return;
  }

  const enlacesTipos = TIPOS.map(
    (tipo) =>
      `<li><a href="cartas.html?tipo=${tipo.id}">${tipo.emoji} ${tipo.nombre}</a></li>`
  ).join("");

  const redes = [
    ["instagram", "Instagram"],
    ["equis", "X"],
    ["youtube", "YouTube"],
  ]
    .map(
      ([clave, nombre]) =>
        `<a href="#" aria-label="${nombre}" title="${nombre}">${icono(clave)}</a>`
    )
    .join("");

  pie.className = "pie";
  pie.innerHTML = `
    <div class="contenedor">
      <div class="pie-grilla">
        <div class="pie-marca">
          <a class="marca" href="index.html">
            <span class="pokebola" aria-hidden="true"></span>
            <span>Poké<em>Store</em></span>
          </a>
          <p>
            Cartas del Set Base revisadas una por una y enviadas en funda
            protectora a todo Chile. Coleccionar también es cuidar.
          </p>
          <div class="redes">${redes}</div>
        </div>

        <div class="pie-columna">
          <h3>Catálogo</h3>
          <ul>${enlacesTipos}</ul>
        </div>

        <div class="pie-columna">
          <h3>Tienda</h3>
          <ul>
            <li><a href="cartas.html">Todas las cartas</a></li>
            <li><a href="cartas.html?orden=descuento">Ofertas</a></li>
            <li><a href="index.html#nosotros">Nosotros</a></li>
            <li><a href="index.html#contacto">Contacto</a></li>
            <li><a href="login.html">Mi cuenta</a></li>
          </ul>
        </div>

        <div class="pie-columna">
          <h3>Boletín</h3>
          <p class="texto-menor">Recibe los nuevos ingresos antes que nadie.</p>
          <form class="boletin" id="form-boletin">
            <label class="solo-lectores" for="correo-boletin">Correo electrónico</label>
            <input id="correo-boletin" type="email" placeholder="tu@correo.cl" required>
            <button class="btn btn-primario" type="submit">Unirme</button>
          </form>
        </div>
      </div>

      <div class="pie-legal">
        <span>© <span id="anio-actual"></span> PokéStore · Proyecto académico DUOC UC</span>
        <span class="aclaracion">
          Sitio ficticio con fines educativos. Pokémon y sus marcas pertenecen a
          Nintendo, Game Freak y The Pokémon Company; este proyecto no está
          afiliado ni patrocinado por ellos.
        </span>
      </div>
    </div>`;
}

/* ---------- Revelado de secciones al hacer scroll ---------- */

function activarRevelado(contenedor = document) {
  const elementos = contenedor.querySelectorAll(".revelar:not(.visible)");

  // Si el navegador no soporta el observador, mostramos todo de una vez
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add("visible");
          observador.unobserve(entrada.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );

  elementos.forEach((elemento) => observador.observe(elemento));
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", () => {
  dibujarCabecera();
  dibujarPie();
  dibujarIconosDeclarados();
  aplicarTema(document.documentElement.dataset.tema || "claro");

  const anio = document.querySelector("#anio-actual");
  if (anio) {
    anio.textContent = new Date().getFullYear();
  }

  // Botón para volver arriba
  const botonArriba = document.createElement("button");
  botonArriba.className = "btn-arriba";
  botonArriba.setAttribute("aria-label", "Volver arriba");
  botonArriba.innerHTML = icono("arriba");
  botonArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  document.body.append(botonArriba);

  const cabecera = document.querySelector(".cabecera");

  function alDesplazar() {
    if (cabecera) {
      cabecera.classList.toggle("fijada", window.scrollY > 8);
    }
    botonArriba.classList.toggle("visible", window.scrollY > 600);
  }

  window.addEventListener("scroll", alDesplazar, { passive: true });
  alDesplazar();

  // Clics generales de la cabecera
  document.addEventListener("click", (evento) => {
    if (evento.target.closest("[data-accion='tema']")) {
      alternarTema();
      return;
    }

    const botonMenu = evento.target.closest("[data-accion='menu']");
    if (botonMenu) {
      const navMovil = document.querySelector("#nav-movil");
      const abierto = navMovil.classList.toggle("abierto");
      botonMenu.setAttribute("aria-expanded", String(abierto));
      botonMenu.innerHTML = icono(abierto ? "cerrar" : "menu");
      return;
    }

    // Al hacer clic fuera se cierra el menú de la cuenta
    if (!evento.target.closest(".menu-cuenta")) {
      document
        .querySelector(".desplegable.abierto")
        ?.classList.remove("abierto");
    }
  });

  // Escape cierra la capa que esté abierta
  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Escape") {
      return;
    }

    if (modalEstaAbierto()) {
      cerrarModal();
    } else if (document.querySelector(".panel.abierto")) {
      cerrarCarrito();
    } else {
      document.querySelector(".filtros.abierto")?.classList.remove("abierto");
      document.querySelector(".desplegable.abierto")?.classList.remove("abierto");
    }
  });

  // El foco no se escapa del modal mientras está abierto
  document.addEventListener("keydown", (evento) => {
    if (evento.key !== "Tab" || !modalEstaAbierto()) {
      return;
    }

    const modal = document.querySelector("#modal");
    const focos = [
      ...modal.querySelectorAll("button, a[href], input, select, textarea"),
    ].filter((elemento) => !elemento.disabled && elemento.offsetParent !== null);

    if (focos.length === 0) {
      return;
    }

    const primero = focos[0];
    const ultimo = focos[focos.length - 1];

    if (evento.shiftKey && document.activeElement === primero) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primero.focus();
    }
  });

  // Boletín del pie
  const formBoletin = document.querySelector("#form-boletin");
  if (formBoletin) {
    formBoletin.addEventListener("submit", (evento) => {
      evento.preventDefault();
      const correo = formBoletin.querySelector("input").value.trim();
      mostrarAviso("¡Listo!", `Te avisaremos a ${correo}`, "exito");
      formBoletin.reset();
    });
  }

  activarRevelado();
  activarImagenesDeRespaldo();
});
