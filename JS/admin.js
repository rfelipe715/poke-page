/**
 * Lógica compartida por todas las páginas del administrador:
 * controla el acceso, muestra el nombre del usuario, marca el ítem
 * activo del menú y esconde "Usuarios" para el rol vendedor.
 */

const nombreUsuarioAdmin = localStorage.getItem("nombre_usuario");
const rolUsuarioAdmin = localStorage.getItem("rol_usuario");

// Solo administradores y vendedores pueden entrar al panel.
if (!nombreUsuarioAdmin || (rolUsuarioAdmin !== "administrador" && rolUsuarioAdmin !== "vendedor")) {
  window.location.href = "login.html";
}

const saludoAdmin = document.getElementById("adminSaludo");
if (saludoAdmin) {
  saludoAdmin.textContent = `${nombreUsuarioAdmin} (${rolUsuarioAdmin})`;
}

// El vendedor solo administra productos, no usuarios.
const enlaceUsuarios = document.querySelector('.admin-menu a[href="admin-usuarios.html"]');
if (enlaceUsuarios && rolUsuarioAdmin === "vendedor") {
  enlaceUsuarios.style.display = "none";
}

// Marca en el menú la página en la que estamos parados.
const paginaActual = window.location.pathname.split("/").pop();
document.querySelectorAll(".admin-menu a").forEach((enlace) => {
  if (enlace.getAttribute("href") === paginaActual) {
    enlace.classList.add("activo");
  }
});

// Cerrar sesión.
const botonCerrarSesionAdmin = document.getElementById("adminCerrarSesion");
if (botonCerrarSesionAdmin) {
  botonCerrarSesionAdmin.addEventListener("click", () => {
    localStorage.removeItem("nombre_usuario");
    localStorage.removeItem("rol_usuario");
    localStorage.removeItem("email_usuario");
    window.location.href = "index.html";
  });
}
