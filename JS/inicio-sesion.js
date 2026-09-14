const botonInicioSesion = document.getElementById('btn-inicio-sesion');

const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');

const errorEmail = document.getElementById('error-email');
const errorPassword = document.getElementById('error-password');
const errorLogin = document.getElementById('error-login');

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

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    errorEmail.textContent = '';
    errorPassword.textContent = '';
    errorLogin.textContent = '';

    let hayError = false;

    if (email === '') {
        errorEmail.textContent = 'Debes ingresar tu correo electrónico';
        hayError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorEmail.textContent = 'Ingresa un correo electrónico válido';
        hayError = true;
    }

    if (password === '') {
        errorPassword.textContent = 'Debes ingresar tu contraseña';
        hayError = true;
    }

    if (hayError) {
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

        errorLogin.textContent = 'Correo o contraseña incorrectos';

        inputPassword.value = '';
        inputPassword.focus();
    }

});
