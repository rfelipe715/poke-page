/**
 * Lógica del formulario de registro de usuario.
 * No hay servidor: los datos válidos se guardan en localStorage solo
 * para poder mostrarlos después en el mantenedor de usuarios del admin.
 */

const formRegistro = document.getElementById("formRegistro");

const campoNombre = document.getElementById("reg-nombre");
const campoCorreoReg = document.getElementById("reg-correo");
const campoCorreoConfirmar = document.getElementById("reg-correo-confirmar");
const campoClaveReg = document.getElementById("reg-clave");
const campoClaveConfirmar = document.getElementById("reg-clave-confirmar");
const campoRegion = document.getElementById("reg-region");
const campoComuna = document.getElementById("reg-comuna");
const campoDireccion = document.getElementById("reg-direccion");

const errorNombre = document.getElementById("error-reg-nombre");
const errorCorreoReg = document.getElementById("error-reg-correo");
const errorCorreoConfirmar = document.getElementById(
  "error-reg-correo-confirmar",
);
const errorClaveReg = document.getElementById("error-reg-clave");
const errorClaveConfirmar = document.getElementById(
  "error-reg-clave-confirmar",
);
const errorRegion = document.getElementById("error-reg-region");
const errorComuna = document.getElementById("error-reg-comuna");
const errorDireccion = document.getElementById("error-reg-direccion");

activarSelectsRegionComuna(campoRegion, campoComuna);

// Validaciones en tiempo real.
campoNombre.addEventListener("input", () => {
  validarTexto(campoNombre, errorNombre, "El nombre", 100);
});

campoCorreoReg.addEventListener("input", () => {
  validarCorreo(campoCorreoReg, errorCorreoReg, 100);
});

campoCorreoConfirmar.addEventListener("input", () => {
  validarConfirmacion(
    campoCorreoConfirmar,
    errorCorreoConfirmar,
    campoCorreoReg.value.trim(),
    "el correo",
  );
});

campoClaveReg.addEventListener("input", () => {
  validarContrasena(campoClaveReg, errorClaveReg);
});

campoClaveConfirmar.addEventListener("input", () => {
  validarConfirmacion(
    campoClaveConfirmar,
    errorClaveConfirmar,
    campoClaveReg.value.trim(),
    "la contraseña",
  );
});

campoDireccion.addEventListener("input", () => {
  validarTexto(campoDireccion, errorDireccion, "La dirección", 300);
});

formRegistro.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombreValido = validarTexto(campoNombre, errorNombre, "El nombre", 100);
  const correoValido = validarCorreo(campoCorreoReg, errorCorreoReg, 100);
  const correoConfirmadoValido = validarConfirmacion(
    campoCorreoConfirmar,
    errorCorreoConfirmar,
    campoCorreoReg.value.trim(),
    "el correo",
  );
  const claveValida = validarContrasena(campoClaveReg, errorClaveReg);
  const claveConfirmadaValida = validarConfirmacion(
    campoClaveConfirmar,
    errorClaveConfirmar,
    campoClaveReg.value.trim(),
    "la contraseña",
  );
  const regionValida = validarSeleccion(campoRegion, errorRegion, "una región");
  const comunaValida = validarSeleccion(campoComuna, errorComuna, "una comuna");
  const direccionValida = validarTexto(
    campoDireccion,
    errorDireccion,
    "La dirección",
    300,
  );

  const formularioValido =
    nombreValido &&
    correoValido &&
    correoConfirmadoValido &&
    claveValida &&
    claveConfirmadaValida &&
    regionValida &&
    comunaValida &&
    direccionValida;

  if (!formularioValido) {
    return;
  }

  const nuevoUsuario = {
    nombre: campoNombre.value.trim(),
    correo: campoCorreoReg.value.trim().toLowerCase(),
    clave: campoClaveReg.value.trim(),
    rol: "cliente",
    region: campoRegion.value,
    comuna: campoComuna.value,
    direccion: campoDireccion.value.trim(),
  };

  const usuariosGuardados = JSON.parse(
    localStorage.getItem("pokestore_usuarios_registrados") || "[]",
  );
  usuariosGuardados.push(nuevoUsuario);
  localStorage.setItem(
    "pokestore_usuarios_registrados",
    JSON.stringify(usuariosGuardados),
  );

  formRegistro.style.display = "none";
  document.getElementById("mensajeExito").classList.add("visible");
});
