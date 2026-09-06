/**
 * Lógica de inicio de sesión. Los usuarios de prueba están aquí mismo,
 * ya que el proyecto no tiene un servidor real detrás.
 */

const usuarios = [
  {
    nombre: "Bryan",
    correo: "bryan@duoc.cl",
    clave: "1234",
    rol: "administrador",
  },
  {
    nombre: "Ignacio",
    correo: "ignacio@duoc.cl",
    clave: "1234",
    rol: "administrador",
  },
  {
    nombre: "Felipe",
    correo: "felipe@duoc.cl",
    clave: "1234",
    rol: "administrador",
  },
  {
    nombre: "Valentina",
    correo: "valentina@profesor.duoc.cl",
    clave: "1234",
    rol: "vendedor",
  },
  {
    nombre: "Cliente Demo",
    correo: "cliente@gmail.com",
    clave: "1234",
    rol: "cliente",
  },
];

const formLogin = document.getElementById("formLogin");
const campoCorreo = document.getElementById("input-email");
const campoClave = document.getElementById("input-password");
const errorCorreo = document.getElementById("error-email");
const errorClave = document.getElementById("error-password");
const mensajeCredenciales = document.getElementById("mensajeCredenciales");

// Valida en tiempo real mientras el usuario escribe.
campoCorreo.addEventListener("input", () => {
  validarCorreo(campoCorreo, errorCorreo, 100);
});

campoClave.addEventListener("input", () => {
  validarContrasena(campoClave, errorClave);
});

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();

  mensajeCredenciales.classList.remove("visible");

  const correoValido = validarCorreo(campoCorreo, errorCorreo, 100);
  const claveValida = validarContrasena(campoClave, errorClave);

  if (!correoValido || !claveValida) {
    return;
  }

  const correo = campoCorreo.value.trim().toLowerCase();
  const clave = campoClave.value.trim();

  const usuarioEncontrado = usuarios.find(
    (usuario) => usuario.correo === correo && usuario.clave === clave,
  );

  if (!usuarioEncontrado) {
    mensajeCredenciales.textContent = "Correo o contraseña incorrectos.";
    mensajeCredenciales.classList.add("visible");
    campoClave.value = "";
    campoClave.focus();
    return;
  }

  localStorage.setItem("nombre_usuario", usuarioEncontrado.nombre);
  localStorage.setItem("rol_usuario", usuarioEncontrado.rol);
  localStorage.setItem("email_usuario", usuarioEncontrado.correo);

  if (usuarioEncontrado.rol === "administrador" || usuarioEncontrado.rol === "vendedor") {
    window.location.href = "admin-inicio.html";
  } else {
    window.location.href = "index.html";
  }
});
