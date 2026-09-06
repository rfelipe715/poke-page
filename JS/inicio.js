/* ============================================================
   INICIO — Todo lo que ocurre sólo en index.html:
   portada, categorías, destacadas, cuenta regresiva y contacto.
   ============================================================ */

/* ---------- Categorías ---------- */

function dibujarCategorias() {
  const contenedor = document.querySelector("#grilla-categorias");
  const porTipo = contarPorTipo();

  contenedor.innerHTML = TIPOS.map(
    (tipo) => `
    <a class="categoria revelar" href="cartas.html?tipo=${tipo.id}"
      data-tipo="${tipo.id}">
      <span class="categoria-emoji">${tipo.emoji}</span>
      <strong>${tipo.nombre}</strong>
      <span>${porTipo[tipo.id]} cartas</span>
    </a>`
  ).join("");
}

/* ---------- Cartas destacadas ---------- */

function dibujarDestacadas() {
  const destacadas = CARTAS.filter((carta) => carta.destacada);
  dibujarCartas(document.querySelector("#grilla-destacadas"), destacadas);
}

/* ---------- Cartas flotantes de la portada ---------- */

function dibujarPortada() {
  const visual = document.querySelector("#portada-visual");
  const trio = ["blastoise", "charizard", "venusaur"].map(buscarCarta);

  visual.innerHTML = `
    <span class="destello" aria-hidden="true"></span>
    ${trio
      .map(
        (carta, indice) => `
      <div class="carta-flotante f${indice + 1}">
        <img src="${carta.imagen}" alt="Carta de ${carta.nombre}" data-respaldo>
      </div>`
      )
      .join("")}`;

  activarImagenesDeRespaldo(visual);

  // Las cartas siguen suavemente al puntero
  const prefiereMenosMovimiento = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefiereMenosMovimiento) {
    return;
  }

  const portada = document.querySelector(".portada");

  portada.addEventListener("mousemove", (evento) => {
    const caja = portada.getBoundingClientRect();
    const x = (evento.clientX - caja.left) / caja.width - 0.5;
    const y = (evento.clientY - caja.top) / caja.height - 0.5;

    visual.querySelectorAll(".carta-flotante").forEach((carta) => {
      carta.style.setProperty("--mx", (x * 24).toFixed(1));
      carta.style.setProperty("--my", (y * 24).toFixed(1));
    });
  });

  portada.addEventListener("mouseleave", () => {
    visual.querySelectorAll(".carta-flotante").forEach((carta) => {
      carta.style.setProperty("--mx", 0);
      carta.style.setProperty("--my", 0);
    });
  });
}

/* ---------- Cinta con los tipos ---------- */

function dibujarCinta() {
  const pista = document.querySelector("#cinta-pista");
  const items = TIPOS.map(
    (tipo) => `<span class="cinta-item"><i>${tipo.emoji}</i> ${tipo.nombre}</span>`
  ).join("");

  // Se duplica el contenido para que el desplazamiento no tenga cortes
  pista.innerHTML = items + items;
}

/* ---------- Cuenta regresiva de la promoción ---------- */

function actualizarCuentaRegresiva() {
  const finDelDia = new Date();
  finDelDia.setHours(23, 59, 59, 999);

  const restante = finDelDia - new Date();
  const horas = Math.floor(restante / 1000 / 60 / 60);
  const minutos = Math.floor((restante / 1000 / 60) % 60);
  const segundos = Math.floor((restante / 1000) % 60);

  const conDosDigitos = (numero) => String(numero).padStart(2, "0");

  document.querySelector("#cuenta-horas").textContent = conDosDigitos(horas);
  document.querySelector("#cuenta-minutos").textContent = conDosDigitos(minutos);
  document.querySelector("#cuenta-segundos").textContent = conDosDigitos(segundos);
}

/* ---------- Formulario de contacto ---------- */

function validarContacto(formulario) {
  const nombre = formulario.querySelector("#contacto-nombre");
  const correo = formulario.querySelector("#contacto-correo");
  const mensaje = formulario.querySelector("#contacto-mensaje");

  const errores = [
    [nombre, nombre.value.trim().length >= 3, "Escribe al menos 3 caracteres"],
    [correo, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.value), "Correo no válido"],
    [mensaje, mensaje.value.trim().length >= 10, "Cuéntanos un poco más (10+)"],
  ];

  let todoBien = true;

  for (const [campo, esValido, textoError] of errores) {
    const contenedor = campo.closest(".campo");
    contenedor.classList.toggle("invalido", !esValido);
    contenedor.querySelector(".campo-error").textContent = textoError;

    if (!esValido) {
      todoBien = false;
    }
  }

  return todoBien;
}

/* ---------- Arranque de index.html ---------- */

document.addEventListener("DOMContentLoaded", () => {
  if (!document.querySelector("#portada-visual")) {
    return; // no estamos en el inicio
  }

  dibujarPortada();
  dibujarCinta();
  dibujarCategorias();
  dibujarDestacadas();

  actualizarCuentaRegresiva();
  setInterval(actualizarCuentaRegresiva, 1000);

  // Buscador de la portada: lleva al catálogo con el texto ya aplicado
  const buscadorPortada = document.querySelector("#form-busqueda-portada");
  buscadorPortada.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const texto = buscadorPortada.querySelector("input").value.trim();
    window.location.href = texto
      ? `cartas.html?q=${encodeURIComponent(texto)}`
      : "cartas.html";
  });

  const formContacto = document.querySelector("#form-contacto");
  formContacto.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (!validarContacto(formContacto)) {
      mostrarAviso("Revisa el formulario", "Hay campos incompletos", "error");
      return;
    }

    mostrarAviso(
      "Mensaje enviado",
      "Te responderemos dentro de 24 horas",
      "exito"
    );
    formContacto.reset();
  });

  // Los elementos dibujados por JS también deben revelarse al hacer scroll
  activarRevelado();
});
