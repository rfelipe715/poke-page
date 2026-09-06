/* ============================================================
   CUENTA — Inicio de sesión, registro y sesión activa.
   Todo es simulado en el navegador: no hay servidor detrás.
   ============================================================ */

const CLAVE_SESION = "pokestore:sesion";
const CLAVE_USUARIOS = "pokestore:usuarios";

// Cuentas de demostración que vienen con la tienda
const USUARIOS_DEMO = [
  { nombre: "Bryan", email: "bryan@tienda.cl", password: "1234", rol: "admin" },
  { nombre: "Ignacio", email: "ignacio@tienda.cl", password: "1234", rol: "admin" },
  { nombre: "Felipe", email: "felipe@tienda.cl", password: "1234", rol: "admin" },
];

function todosLosUsuarios() {
  return [...USUARIOS_DEMO, ...leerDato(CLAVE_USUARIOS, [])];
}

function usuarioConectado() {
  return leerDato(CLAVE_SESION, null);
}

function iniciarSesion(usuario) {
  guardarDato(CLAVE_SESION, {
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol,
  });
}

function cerrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
  dibujarZonaCuenta();
  mostrarAviso("Sesión cerrada", "Hasta la próxima 👋");
}

/* ---------- Menú de cuenta en la cabecera ---------- */

function dibujarZonaCuenta() {
  const zona = document.querySelector("[data-zona-cuenta]");
  if (!zona) {
    return;
  }

  const usuario = usuarioConectado();

  if (!usuario) {
    zona.innerHTML = `
      <a class="btn-icono" href="login.html" aria-label="Iniciar sesión"
        title="Iniciar sesión">${icono("usuario")}</a>`;
    return;
  }

  const iniciales = usuario.nombre.slice(0, 2).toUpperCase();

  zona.innerHTML = `
    <button class="avatar" id="boton-avatar" aria-haspopup="true"
      aria-expanded="false" aria-label="Menú de ${usuario.nombre}">
      ${iniciales}
    </button>

    <div class="desplegable" id="menu-usuario">
      <div class="desplegable-cabeza">
        <strong>${escaparHtml(usuario.nombre)}</strong>
        <span>${escaparHtml(usuario.email)}</span>
        <span class="insignia-rol">${usuario.rol}</span>
      </div>
      <a href="cartas.html">${icono("carrito")} Seguir comprando</a>
      <button class="peligro" id="boton-salir">${icono("salir")} Cerrar sesión</button>
    </div>`;

  const botonAvatar = zona.querySelector("#boton-avatar");
  const menu = zona.querySelector("#menu-usuario");

  botonAvatar.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    botonAvatar.setAttribute("aria-expanded", String(abierto));
  });

  zona.querySelector("#boton-salir").addEventListener("click", cerrarSesion);
}

/* ---------- Validación de los formularios ---------- */

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function marcarCampo(campo, esValido, textoError) {
  const contenedor = campo.closest(".campo");
  contenedor.classList.toggle("invalido", !esValido);

  if (!esValido) {
    contenedor.querySelector(".campo-error").textContent = textoError;
  }

  return esValido;
}

function limpiarErrores(formulario) {
  formulario.querySelectorAll(".campo.invalido").forEach((campo) => {
    campo.classList.remove("invalido");
  });
}

/* ---------- Inicio de sesión ---------- */

function manejarLogin(formulario) {
  limpiarErrores(formulario);

  const campoCorreo = formulario.querySelector("#login-correo");
  const campoClave = formulario.querySelector("#login-clave");
  const correo = campoCorreo.value.trim().toLowerCase();
  const clave = campoClave.value;

  const correoOk = marcarCampo(
    campoCorreo,
    CORREO_VALIDO.test(correo),
    "Escribe un correo válido"
  );
  const claveOk = marcarCampo(
    campoClave,
    clave.length > 0,
    "Ingresa tu contraseña"
  );

  if (!correoOk || !claveOk) {
    return;
  }

  const usuario = todosLosUsuarios().find(
    (usuario) => usuario.email.toLowerCase() === correo
  );

  if (!usuario || usuario.password !== clave) {
    marcarCampo(campoClave, false, "Correo o contraseña incorrectos");
    campoClave.value = "";
    campoClave.focus();
    mostrarAviso("No pudimos entrar", "Revisa tus datos e intenta de nuevo", "error");
    return;
  }

  iniciarSesion(usuario);
  mostrarAviso(`¡Hola de nuevo, ${usuario.nombre}!`, "Sesión iniciada", "exito");

  const destino =
    new URLSearchParams(location.search).get("volver") || "index.html";

  setTimeout(() => {
    window.location.href = destino;
  }, 700);
}

/* ---------- Registro ---------- */

function manejarRegistro(formulario) {
  limpiarErrores(formulario);

  const campoNombre = formulario.querySelector("#registro-nombre");
  const campoCorreo = formulario.querySelector("#registro-correo");
  const campoClave = formulario.querySelector("#registro-clave");
  const campoRepetir = formulario.querySelector("#registro-repetir");
  const campoTerminos = formulario.querySelector("#registro-terminos");

  const correo = campoCorreo.value.trim().toLowerCase();
  const yaExiste = todosLosUsuarios().some(
    (usuario) => usuario.email.toLowerCase() === correo
  );

  const validaciones = [
    marcarCampo(
      campoNombre,
      campoNombre.value.trim().length >= 3,
      "Al menos 3 caracteres"
    ),
    marcarCampo(
      campoCorreo,
      CORREO_VALIDO.test(correo) && !yaExiste,
      yaExiste ? "Ese correo ya tiene una cuenta" : "Escribe un correo válido"
    ),
    marcarCampo(
      campoClave,
      campoClave.value.length >= 4,
      "Usa al menos 4 caracteres"
    ),
    marcarCampo(
      campoRepetir,
      campoRepetir.value === campoClave.value && campoRepetir.value !== "",
      "Las contraseñas no coinciden"
    ),
  ];

  if (!campoTerminos.checked) {
    mostrarAviso("Falta un paso", "Debes aceptar los términos", "error");
    return;
  }

  if (validaciones.includes(false)) {
    return;
  }

  const nuevoUsuario = {
    nombre: campoNombre.value.trim(),
    email: correo,
    password: campoClave.value,
    rol: "cliente",
  };

  const registrados = leerDato(CLAVE_USUARIOS, []);
  registrados.push(nuevoUsuario);
  guardarDato(CLAVE_USUARIOS, registrados);

  iniciarSesion(nuevoUsuario);
  mostrarAviso(`¡Bienvenido, ${nuevoUsuario.nombre}!`, "Cuenta creada", "exito");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 900);
}

/* ---------- Medidor de seguridad de la contraseña ---------- */

function nivelDeClave(clave) {
  let nivel = 0;

  if (clave.length >= 4) {
    nivel += 1;
  }
  if (clave.length >= 8) {
    nivel += 1;
  }
  if (/[0-9]/.test(clave) && /[a-zA-Z]/.test(clave)) {
    nivel += 1;
  }

  return Math.min(nivel, 3);
}

function actualizarMedidor(clave) {
  const medidor = document.querySelector("#medidor-clave");
  const texto = document.querySelector("#medidor-texto");
  const nivel = clave === "" ? 0 : nivelDeClave(clave);
  const etiquetas = ["", "Débil", "Aceptable", "Segura"];

  medidor.dataset.nivel = nivel;
  texto.textContent = nivel === 0 ? "Mínimo 4 caracteres" : etiquetas[nivel];
}

/* ---------- Arranque ---------- */

document.addEventListener("DOMContentLoaded", () => {
  dibujarZonaCuenta();

  const formLogin = document.querySelector("#form-login");
  if (!formLogin) {
    return; // no estamos en login.html
  }

  const formRegistro = document.querySelector("#form-registro");
  const pestanas = document.querySelector("#pestanas-cuenta");

  // Cambio entre "Iniciar sesión" y "Crear cuenta"
  pestanas.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-pestana]");
    if (!boton) {
      return;
    }

    const destino = boton.dataset.pestana;
    pestanas.dataset.activa = destino;

    pestanas.querySelectorAll("button[data-pestana]").forEach((otro) => {
      otro.setAttribute("aria-selected", String(otro === boton));
    });

    formLogin.hidden = destino !== "login";
    formRegistro.hidden = destino !== "registro";
  });

  formLogin.addEventListener("submit", (evento) => {
    evento.preventDefault();
    manejarLogin(formLogin);
  });

  formRegistro.addEventListener("submit", (evento) => {
    evento.preventDefault();
    manejarRegistro(formRegistro);
  });

  // Mostrar u ocultar la contraseña
  document.querySelectorAll(".btn-ojo").forEach((boton) => {
    boton.innerHTML = icono("ojo");

    boton.addEventListener("click", () => {
      const entrada = boton.previousElementSibling;
      const oculta = entrada.type === "password";

      entrada.type = oculta ? "text" : "password";
      boton.innerHTML = icono(oculta ? "ojoCerrado" : "ojo");
      boton.setAttribute(
        "aria-label",
        oculta ? "Ocultar contraseña" : "Mostrar contraseña"
      );
    });
  });

  document.querySelector("#registro-clave").addEventListener("input", (evento) => {
    actualizarMedidor(evento.target.value);
  });

  // Botones que rellenan una cuenta de prueba
  document.querySelector("#lista-demo").innerHTML = USUARIOS_DEMO.map(
    (usuario) => `<button type="button" data-demo="${usuario.email}">
      ${usuario.email}</button>`
  ).join("");

  document.querySelector("#lista-demo").addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-demo]");
    if (!boton) {
      return;
    }

    document.querySelector("#login-correo").value = boton.dataset.demo;
    document.querySelector("#login-clave").value = "1234";
    limpiarErrores(formLogin);
    mostrarAviso("Datos cargados", "Ahora presiona Iniciar sesión");
  });

  // Si venimos del carrito, avisamos por qué pedimos la sesión
  if (new URLSearchParams(location.search).has("volver")) {
    mostrarAviso(
      "Casi listo",
      "Inicia sesión para confirmar tu pedido",
      "info"
    );
  }
});
