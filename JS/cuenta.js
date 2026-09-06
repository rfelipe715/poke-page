/**
 * Controla lo que se ve en el header según si hay un usuario con sesión
 * iniciada o no. Se incluye en todas las páginas públicas de la tienda.
 */

function mostrarEstadoCuenta() {
  const contenedor = document.getElementById("cuentaNav");

  if (!contenedor) {
    return;
  }

  const nombre = localStorage.getItem("nombre_usuario");
  const rol = localStorage.getItem("rol_usuario");

  if (!nombre) {
    contenedor.innerHTML = `
      <a href="login.html">Iniciar sesión</a>
      <a href="registro.html">Registrarse</a>
    `;
    return;
  }

  let enlacePanel = "";

  if (rol === "administrador" || rol === "vendedor") {
    enlacePanel = '<a href="admin-inicio.html">Panel admin</a>';
  }

  contenedor.innerHTML = `
    <span class="saludo-usuario">Hola, ${nombre}</span>
    ${enlacePanel}
    <button type="button" id="navCerrarSesion" class="link-boton">Cerrar sesión</button>
  `;

  const botonCerrarSesion = document.getElementById("navCerrarSesion");

  botonCerrarSesion.addEventListener("click", () => {
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("rol_usuario");
    localStorage.removeItem("email_usuario");
    window.location.href = "index.html";
  });
}

mostrarEstadoCuenta();
