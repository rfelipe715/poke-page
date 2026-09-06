/**
 * Datos que usa el panel de administrador: productos y usuarios.
 * Se guardan en localStorage para que los cambios del admin no se
 * pierdan al recargar la página. La primera vez se llenan con datos
 * de ejemplo.
 */

const PRODUCTOS_ADMIN_KEY = "pokestore_productos_admin";
const USUARIOS_ADMIN_KEY = "pokestore_usuarios_admin";

const usuariosAdminBase = [
  {
    run: "190110222",
    nombre: "Bryan",
    apellidos: "Soto Pérez",
    correo: "bryan@duoc.cl",
    fechaNacimiento: "1999-03-14",
    tipo: "administrador",
    region: "Región Metropolitana",
    comuna: "Santiago",
    direccion: "Av. Siempre Viva 123",
  },
  {
    run: "180234551",
    nombre: "Ignacio",
    apellidos: "Reyes Muñoz",
    correo: "ignacio@duoc.cl",
    fechaNacimiento: "1998-07-02",
    tipo: "administrador",
    region: "Valparaíso",
    comuna: "Viña del Mar",
    direccion: "Calle Los Álamos 456",
  },
  {
    run: "170456785",
    nombre: "Felipe",
    apellidos: "Ríos Pino",
    correo: "felipe@duoc.cl",
    fechaNacimiento: "1997-11-20",
    tipo: "administrador",
    region: "Biobío",
    comuna: "Concepción",
    direccion: "Pasaje Las Rosas 789",
  },
  {
    run: "160789018",
    nombre: "Valentina",
    apellidos: "Fuentes Cea",
    correo: "valentina@profesor.duoc.cl",
    fechaNacimiento: "1996-05-08",
    tipo: "vendedor",
    region: "La Araucanía",
    comuna: "Temuco",
    direccion: "Calle Rahue 234",
  },
  {
    run: "150987652",
    nombre: "Cliente Demo",
    apellidos: "Apellido Demo",
    correo: "cliente@gmail.com",
    fechaNacimiento: "2000-01-30",
    tipo: "cliente",
    region: "Los Lagos",
    comuna: "Puerto Montt",
    direccion: "Camino Costero 55",
  },
];

// ---------- Productos ----------

function obtenerProductosAdmin() {
  const datosGuardados = localStorage.getItem(PRODUCTOS_ADMIN_KEY);

  if (!datosGuardados) {
    const productosConCodigo = productos.map((producto) => {
      const copia = Object.assign({}, producto);
      copia.codigo = "POKE-" + String(producto.id).padStart(3, "0");
      return copia;
    });
    guardarProductosAdmin(productosConCodigo);
    return productosConCodigo;
  }

  return JSON.parse(datosGuardados);
}

function guardarProductosAdmin(lista) {
  localStorage.setItem(PRODUCTOS_ADMIN_KEY, JSON.stringify(lista));
}

function obtenerProductoAdminPorId(id) {
  return obtenerProductosAdmin().find((producto) => producto.id === id);
}

function guardarProductoAdmin(producto) {
  const lista = obtenerProductosAdmin();
  const indice = lista.findIndex((item) => item.id === producto.id);

  if (indice === -1) {
    const idMaximo = lista.reduce((maximo, item) => Math.max(maximo, item.id), 0);
    producto.id = idMaximo + 1;
    lista.push(producto);
  } else {
    lista[indice] = producto;
  }

  guardarProductosAdmin(lista);
}

function eliminarProductoAdmin(id) {
  const lista = obtenerProductosAdmin().filter((item) => item.id !== id);
  guardarProductosAdmin(lista);
}

// ---------- Usuarios ----------

function obtenerUsuariosAdmin() {
  const datosGuardados = localStorage.getItem(USUARIOS_ADMIN_KEY);

  if (!datosGuardados) {
    guardarUsuariosAdmin(usuariosAdminBase);
    return usuariosAdminBase.slice();
  }

  return JSON.parse(datosGuardados);
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(USUARIOS_ADMIN_KEY, JSON.stringify(lista));
}

function obtenerUsuarioAdminPorRun(run) {
  return obtenerUsuariosAdmin().find((usuario) => usuario.run === run);
}

function guardarUsuarioAdmin(usuario, runOriginal) {
  const lista = obtenerUsuariosAdmin();
  const indice = lista.findIndex(
    (item) => item.run === (runOriginal || usuario.run),
  );

  if (indice === -1) {
    lista.push(usuario);
  } else {
    lista[indice] = usuario;
  }

  guardarUsuariosAdmin(lista);
}

function eliminarUsuarioAdmin(run) {
  const lista = obtenerUsuariosAdmin().filter((item) => item.run !== run);
  guardarUsuariosAdmin(lista);
}
