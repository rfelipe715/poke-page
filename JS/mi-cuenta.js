const inputNombre = document.getElementById('nombre');
const inputEmail = document.getElementById('email');

const botonActualizar = document.getElementById('btn-actualizar');
const botonCerrarSesion = document.getElementById('btn-cerrar-sesion');


// Obtener datos del usuario que inició sesión
const nombreUsuario = localStorage.getItem('nombre_usuario');
const emailUsuario = localStorage.getItem('email_usuario');


// Si no hay usuario iniciado, mandar al login
if (!nombreUsuario) {

    window.location.href = 'login.html';

}


// Mostrar los datos
inputNombre.value = nombreUsuario;
inputEmail.value = emailUsuario;


// Actualizar datos
botonActualizar.addEventListener('click', function() {

    const nuevoNombre = inputNombre.value;
    const nuevoEmail = inputEmail.value;

    if (nuevoNombre === '' || nuevoEmail === '') {

        alert('Completa todos los campos');
        return;

    }

    localStorage.setItem('nombre_usuario', nuevoNombre);
    localStorage.setItem('email_usuario', nuevoEmail);

    alert('Datos actualizados correctamente');

});


// Cerrar sesión
botonCerrarSesion.addEventListener('click', function() {

    localStorage.removeItem('nombre_usuario');
    localStorage.removeItem('email_usuario');
    localStorage.removeItem('rol_usuario');

    window.location.href = 'index.html';

});