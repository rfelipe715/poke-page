/**
 * Formulario de newsletter del footer. No manda el correo a ningún lado,
 * solo valida que tenga formato de correo y muestra un mensaje de éxito.
 */

const formNewsletter = document.getElementById("formNewsletter");

if (formNewsletter) {
  formNewsletter.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const inputCorreo = document.getElementById("inputNewsletter");
    const mensaje = document.getElementById("mensajeNewsletter");
    const correo = inputCorreo.value.trim();

    const tieneFormatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!tieneFormatoValido) {
      mensaje.textContent = "Ingresa un correo válido.";
      mensaje.style.color = "#ffb4b0";
      return;
    }

    mensaje.textContent = "¡Listo! Te avisaremos de nuevas cartas y ofertas.";
    mensaje.style.color = "#a9e6bc";
    formNewsletter.reset();
  });
}
