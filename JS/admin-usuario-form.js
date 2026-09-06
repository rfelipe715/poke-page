/**
 * Formulario para crear o editar un usuario.
 * Si la URL trae ?run=19011022K, se carga ese usuario para editarlo.
 */

if (rolUsuarioAdmin === "vendedor") {
  window.location.href = "admin-productos.html";
}

const parametrosUsuario = new URLSearchParams(window.location.search);
const runEditar = parametrosUsuario.get("run");
const usuarioExistente = runEditar ? obtenerUsuarioAdminPorRun(runEditar) : null;

const campoRun = document.getElementById("usr-run");
const campoTipo = document.getElementById("usr-tipo");
const campoNombreUsuario = document.getElementById("usr-nombre");
const campoApellidos = document.getElementById("usr-apellidos");
const campoCorreoUsuario = document.getElementById("usr-correo");
const campoNacimiento = document.getElementById("usr-nacimiento");
const campoRegionUsuario = document.getElementById("usr-region");
const campoComunaUsuario = document.getElementById("usr-comuna");
const campoDireccionUsuario = document.getElementById("usr-direccion");

const errorRun = document.getElementById("error-usr-run");
const errorTipo = document.getElementById("error-usr-tipo");
const errorNombreUsuario = document.getElementById("error-usr-nombre");
const errorApellidos = document.getElementById("error-usr-apellidos");
const errorCorreoUsuario = document.getElementById("error-usr-correo");
const errorRegionUsuario = document.getElementById("error-usr-region");
const errorComunaUsuario = document.getElementById("error-usr-comuna");
const errorDireccionUsuario = document.getElementById("error-usr-direccion");

activarSelectsRegionComuna(campoRegionUsuario, campoComunaUsuario);

if (usuarioExistente) {
  document.getElementById("tituloFormularioUsuario").textContent =
    "Editar usuario";

  campoRun.value = usuarioExistente.run;
  campoRun.readOnly = true;
  campoTipo.value = usuarioExistente.tipo;
  campoNombreUsuario.value = usuarioExistente.nombre;
  campoApellidos.value = usuarioExistente.apellidos;
  campoCorreoUsuario.value = usuarioExistente.correo;
  campoNacimiento.value = usuarioExistente.fechaNacimiento || "";
  campoDireccionUsuario.value = usuarioExistente.direccion;

  campoRegionUsuario.value = usuarioExistente.region;
  llenarSelectComunas(campoRegionUsuario, campoComunaUsuario);
  campoComunaUsuario.value = usuarioExistente.comuna;
}

// Validaciones en tiempo real.
campoRun.addEventListener("input", () => validarRun(campoRun, errorRun));
campoTipo.addEventListener("change", () =>
  validarSeleccion(campoTipo, errorTipo, "un tipo de usuario"),
);
campoNombreUsuario.addEventListener("input", () =>
  validarTexto(campoNombreUsuario, errorNombreUsuario, "El nombre", 50),
);
campoApellidos.addEventListener("input", () =>
  validarTexto(campoApellidos, errorApellidos, "Los apellidos", 100),
);
campoCorreoUsuario.addEventListener("input", () =>
  validarCorreo(campoCorreoUsuario, errorCorreoUsuario, 100),
);
campoRegionUsuario.addEventListener("change", () =>
  validarSeleccion(campoRegionUsuario, errorRegionUsuario, "una región"),
);
campoComunaUsuario.addEventListener("change", () =>
  validarSeleccion(campoComunaUsuario, errorComunaUsuario, "una comuna"),
);
campoDireccionUsuario.addEventListener("input", () =>
  validarTexto(campoDireccionUsuario, errorDireccionUsuario, "La dirección", 300),
);

document.getElementById("formUsuarioAdmin").addEventListener("submit", (evento) => {
  evento.preventDefault();

  const runValido = validarRun(campoRun, errorRun);
  const tipoValido = validarSeleccion(campoTipo, errorTipo, "un tipo de usuario");
  const nombreValido = validarTexto(campoNombreUsuario, errorNombreUsuario, "El nombre", 50);
  const apellidosValidos = validarTexto(campoApellidos, errorApellidos, "Los apellidos", 100);
  const correoValido = validarCorreo(campoCorreoUsuario, errorCorreoUsuario, 100);
  const regionValida = validarSeleccion(campoRegionUsuario, errorRegionUsuario, "una región");
  const comunaValida = validarSeleccion(campoComunaUsuario, errorComunaUsuario, "una comuna");
  const direccionValida = validarTexto(
    campoDireccionUsuario,
    errorDireccionUsuario,
    "La dirección",
    300,
  );

  const formularioValido =
    runValido &&
    tipoValido &&
    nombreValido &&
    apellidosValidos &&
    correoValido &&
    regionValida &&
    comunaValida &&
    direccionValida;

  if (!formularioValido) {
    return;
  }

  const usuario = {
    run: campoRun.value.trim().toUpperCase(),
    tipo: campoTipo.value,
    nombre: campoNombreUsuario.value.trim(),
    apellidos: campoApellidos.value.trim(),
    correo: campoCorreoUsuario.value.trim().toLowerCase(),
    fechaNacimiento: campoNacimiento.value,
    region: campoRegionUsuario.value,
    comuna: campoComunaUsuario.value,
    direccion: campoDireccionUsuario.value.trim(),
  };

  guardarUsuarioAdmin(usuario, usuarioExistente ? usuarioExistente.run : null);
  window.location.href = "admin-usuarios.html";
});
