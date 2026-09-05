const botonInicioSesion = document.getElementById('btn-inicio-sesion');

const usuarios = [
    {
        nombre: 'Bryan',
        email: 'bryan@tienda.cl',
        password: '1234',
        rol: 'admin',
        pagina: 'index.html'
    },
    {
        nombre: 'Ignacio',
        email: 'ignacio@tienda.cl',
        password: '1234',
        rol: 'admin',
        pagina: 'index.html'
    },
    {
        nombre: 'Felipe',
        email: 'felipe@tienda.cl',
        password: '1234',
        rol: 'admin',
        pagina: 'index.html'
    }
];

botonInicioSesion.addEventListener('click', function () {

    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (email === '' || password === '') {
        alert('Debes ingresar correo y contraseña');
        return;
    }

    const usuarioEncontrado = usuarios.find(function(usuario) {
        return usuario.email === email &&
               usuario.password === password;
    });

    if (usuarioEncontrado) {

        localStorage.setItem('nombre_usuario', usuarioEncontrado.nombre);
        localStorage.setItem('rol_usuario', usuarioEncontrado.rol);
        localStorage.setItem('email_usuario', usuarioEncontrado.email);

        alert('Bienvenido ' + usuarioEncontrado.nombre);

        window.location.href = usuarioEncontrado.pagina;

    } else {

        alert('Correo o contraseña incorrectos');

        inputPassword.value = '';
        inputPassword.focus();
    }

});