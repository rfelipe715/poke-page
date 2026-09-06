/**
 * Tabla del mantenedor de usuarios: lista, permite editar y eliminar.
 * Solo el administrador puede ver esta página (el vendedor no gestiona
 * usuarios).
 */

if (rolUsuarioAdmin === "vendedor") {
  window.location.href = "admin-productos.html";
}

function pintarTablaUsuarios() {
  const cuerpoTabla = document.getElementById("tablaUsuarios");
  const listaUsuarios = obtenerUsuariosAdmin();

  cuerpoTabla.innerHTML = "";

  listaUsuarios.forEach((usuario) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${usuario.run}</td>
      <td>${usuario.nombre} ${usuario.apellidos}</td>
      <td>${usuario.correo}</td>
      <td><span class="etiqueta-rol">${usuario.tipo}</span></td>
      <td>${usuario.comuna}</td>
      <td>
        <a href="admin-usuario-form.html?run=${usuario.run}" class="btn btn-secundario">Editar</a>
        <button type="button" class="link-boton" data-accion="eliminar-usuario" data-run="${usuario.run}">Eliminar</button>
      </td>
    `;

    cuerpoTabla.appendChild(fila);
  });
}

pintarTablaUsuarios();

document.getElementById("tablaUsuarios").addEventListener("click", (evento) => {
  const boton = evento.target.closest('[data-accion="eliminar-usuario"]');
  if (!boton) {
    return;
  }

  const confirmado = confirm("¿Eliminar este usuario?");
  if (!confirmado) {
    return;
  }

  eliminarUsuarioAdmin(boton.dataset.run);
  pintarTablaUsuarios();
});
