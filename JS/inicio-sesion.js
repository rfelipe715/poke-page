

const botonInicioSesion = document.getElementById('btn-inicio-sesion')


botonInicioSesion.addEventListener('click', function() {
  
    const inputEmail = document.getElementById('input-email')
    
    const inputPassword = document.getElementById('input-password')

    // Aquí se supone que tenemos validar el correo y la contraseña

    // Obtenemos el correo (el valor del input de correo)
    const email = inputEmail.value

    if (email === 'admin@tienda.cl') {
        localStorage.setItem('rol_usuario', 'admin')
        window.location = 'index.html'
    } else if (email === 'vendedor@tienda.cl') {
        localStorage.setItem('rol_usuario', 'vendedor')
        window.location = 'index.html'
    } else {
        alert("Credenciales incorrectas")
    }
})