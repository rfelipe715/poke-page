/**
 * Atributos HTML
 */

const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const cartDrawer = document.getElementById("drawer");

// FILTRO POR CATEGORIAS
const botonesCategorias = document.querySelectorAll(".lista-categorias button");
const cartas = document.querySelectorAll(".card");

botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", () => {
    const categoriaSeleccionada = boton.dataset.categoria;

    cartas.forEach((carta) => {
      const tipoCarta = carta.dataset.tipo;

      if (
        categoriaSeleccionada === "todos" ||
        tipoCarta === categoriaSeleccionada
      ) {
        carta.style.display = "";
      } else {
        carta.style.display = "none";
      }
    });
  });
});

// BUSCADOR
const inputBuscar = document.getElementById("buscarCarta");
const botonBuscar = document.querySelector(".buscador button");

function buscarCarta() {
  const texto = inputBuscar.value.toLowerCase().trim();

  cartas.forEach((carta) => {
    const nombre = carta.querySelector(".card-title").textContent.toLowerCase();

    if (nombre.includes(texto)) {
      carta.style.display = "";
    } else {
      carta.style.display = "none";
    }
  });
}

// ABRIR Y CERRAR CARRITO
openCartBtn.addEventListener("click", () => {
  cartDrawer.classList.toggle("open");
});

closeCartBtn.addEventListener("click", () => {
  cartDrawer.classList.remove("open");
});

// EVENTOS DEL BUSCADOR
botonBuscar.addEventListener("click", buscarCarta);

inputBuscar.addEventListener("input", buscarCarta);

//Filtro para inicio
const parametrosURL = new URLSearchParams(window.location.search);

const tipoURL = parametrosURL.get("tipo");

if (tipoURL) {
  cartas.forEach((carta) => {
    const tipoCarta = carta.dataset.tipo;

    if (tipoCarta === tipoURL) {
      carta.style.display = "";
    } else {
      carta.style.display = "none";
    }
  });
}

const usuarioHeader = document.getElementById('usuario-header');
const nombreHeader = document.getElementById('nombre-header');

const nombreUsuario = localStorage.getItem('nombre_usuario');

if (nombreUsuario) {

    nombreHeader.textContent = nombreUsuario;

    // Si ya inició sesión, el monito manda a la cuenta
    usuarioHeader.href = 'mi-cuenta.html';

} else {

    // Si no inició sesión, manda al login
    usuarioHeader.href = 'login.html';

}