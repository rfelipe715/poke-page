/**
 * Lógica del formulario de contacto. No hay servidor: solo valida los
 * datos y muestra un mensaje de éxito.
 */

const formContacto = document.getElementById("formContacto");
const campoNombreContacto = document.getElementById("contacto-nombre");
const campoCorreoContacto = document.getElementById("contacto-correo");
const campoComentario = document.getElementById("contacto-comentario");

const errorNombreContacto = document.getElementById("error-contacto-nombre");
const errorCorreoContacto = document.getElementById("error-contacto-correo");
const errorComentario = document.getElementById("error-contacto-comentario");

campoNombreContacto.addEventListener("input", () => {
  validarTexto(campoNombreContacto, errorNombreContacto, "El nombre", 100);
});

campoCorreoContacto.addEventListener("input", () => {
  validarCorreo(campoCorreoContacto, errorCorreoContacto, 100);
});

campoComentario.addEventListener("input", () => {
  validarTexto(campoComentario, errorComentario, "El comentario", 500);
});

formContacto.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nombreValido = validarTexto(
    campoNombreContacto,
    errorNombreContacto,
    "El nombre",
    100,
  );
  const correoValido = validarCorreo(campoCorreoContacto, errorCorreoContacto, 100);
  const comentarioValido = validarTexto(
    campoComentario,
    errorComentario,
    "El comentario",
    500,
  );

  if (!nombreValido || !correoValido || !comentarioValido) {
    return;
  }

  formContacto.reset();
  formContacto.style.display = "none";
  document.getElementById("mensajeExitoContacto").classList.add("visible");
});
