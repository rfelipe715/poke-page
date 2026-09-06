/**
 * Regiones y comunas de Chile usadas en los formularios de registro
 * y en el mantenedor de usuarios del administrador.
 * Es una lista simplificada, no las 16 regiones completas.
 */

const regiones = [
  {
    nombre: "Región Metropolitana",
    comunas: ["Santiago", "Providencia", "Maipú", "Puente Alto", "Ñuñoa"],
  },
  {
    nombre: "Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "San Antonio"],
  },
  {
    nombre: "Biobío",
    comunas: ["Concepción", "Talcahuano", "Chillán", "Los Ángeles"],
  },
  {
    nombre: "La Araucanía",
    comunas: ["Temuco", "Villarrica", "Angol", "Pucón"],
  },
  {
    nombre: "Los Lagos",
    comunas: ["Puerto Montt", "Osorno", "Castro", "Ancud"],
  },
  {
    nombre: "Antofagasta",
    comunas: ["Antofagasta", "Calama", "Tocopilla"],
  },
];

/**
 * Llena un <select> con el nombre de todas las regiones.
 */
function llenarSelectRegiones(selectRegion) {
  selectRegion.innerHTML = '<option value="">Selecciona una región</option>';

  regiones.forEach((region) => {
    const opcion = document.createElement("option");
    opcion.value = region.nombre;
    opcion.textContent = region.nombre;
    selectRegion.appendChild(opcion);
  });
}

/**
 * Llena el <select> de comunas según la región elegida.
 * Se usa cada vez que cambia el select de región.
 */
function llenarSelectComunas(selectRegion, selectComuna) {
  const nombreRegion = selectRegion.value;
  const region = regiones.find((item) => item.nombre === nombreRegion);

  selectComuna.innerHTML = '<option value="">Selecciona una comuna</option>';

  if (!region) {
    return;
  }

  region.comunas.forEach((comuna) => {
    const opcion = document.createElement("option");
    opcion.value = comuna;
    opcion.textContent = comuna;
    selectComuna.appendChild(opcion);
  });
}

/**
 * Conecta un select de región con uno de comuna: los llena al cargar
 * la página y actualiza las comunas cada vez que cambia la región.
 */
function activarSelectsRegionComuna(selectRegion, selectComuna) {
  llenarSelectRegiones(selectRegion);

  selectRegion.addEventListener("change", () => {
    llenarSelectComunas(selectRegion, selectComuna);
  });
}
