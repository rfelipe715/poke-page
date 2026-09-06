/**
 * Funciones de validación reutilizadas por los formularios de la tienda:
 * login, registro, contacto y los mantenedores del administrador.
 * Todas devuelven true/false o un mensaje de error simple.
 */

const CORREOS_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/**
 * Escribe un mensaje de error debajo de un campo y marca el campo en rojo.
 * "elementoError" es el <span> reservado para el mensaje de ese campo.
 */
function mostrarError(campo, elementoError, mensaje) {
  elementoError.textContent = mensaje;
  elementoError.classList.add("visible");
  campo.classList.add("campo-invalido");
}

/**
 * Limpia el mensaje de error de un campo cuando ya quedó correcto.
 */
function limpiarError(campo, elementoError) {
  elementoError.textContent = "";
  elementoError.classList.remove("visible");
  campo.classList.remove("campo-invalido");
}

/**
 * Valida que un correo no esté vacío, no supere el largo máximo y
 * termine en uno de los dominios permitidos por la tienda.
 */
function validarCorreo(campo, elementoError, maximoCaracteres) {
  const valor = campo.value.trim();

  if (valor === "") {
    mostrarError(campo, elementoError, "El correo es obligatorio.");
    return false;
  }

  if (valor.length > maximoCaracteres) {
    mostrarError(
      campo,
      elementoError,
      `El correo no puede superar los ${maximoCaracteres} caracteres.`,
    );
    return false;
  }

  const tieneDominioPermitido = CORREOS_PERMITIDOS.some((dominio) =>
    valor.toLowerCase().endsWith(dominio),
  );

  if (!tieneDominioPermitido) {
    mostrarError(
      campo,
      elementoError,
      "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.",
    );
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida que un campo de texto no esté vacío y respete un largo máximo
 * (y opcionalmente un largo mínimo).
 */
function validarTexto(campo, elementoError, nombreCampo, maximo, minimo) {
  const valor = campo.value.trim();
  const minimoReal = minimo || 0;

  if (valor === "") {
    mostrarError(campo, elementoError, `${nombreCampo} es obligatorio.`);
    return false;
  }

  if (valor.length < minimoReal) {
    mostrarError(
      campo,
      elementoError,
      `${nombreCampo} debe tener al menos ${minimoReal} caracteres.`,
    );
    return false;
  }

  if (valor.length > maximo) {
    mostrarError(
      campo,
      elementoError,
      `${nombreCampo} no puede superar los ${maximo} caracteres.`,
    );
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida un campo de texto opcional: si está vacío no hay error,
 * pero si tiene contenido debe respetar el largo máximo.
 */
function validarTextoOpcional(campo, elementoError, nombreCampo, maximo) {
  const valor = campo.value.trim();

  if (valor === "") {
    limpiarError(campo, elementoError);
    return true;
  }

  if (valor.length > maximo) {
    mostrarError(
      campo,
      elementoError,
      `${nombreCampo} no puede superar los ${maximo} caracteres.`,
    );
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida que la contraseña tenga entre 4 y 10 caracteres.
 */
function validarContrasena(campo, elementoError) {
  const valor = campo.value.trim();

  if (valor === "") {
    mostrarError(campo, elementoError, "La contraseña es obligatoria.");
    return false;
  }

  if (valor.length < 4 || valor.length > 10) {
    mostrarError(
      campo,
      elementoError,
      "La contraseña debe tener entre 4 y 10 caracteres.",
    );
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida que dos campos (correo/correo o clave/clave) tengan el mismo valor.
 */
function validarConfirmacion(campo, elementoError, valorOriginal, nombreCampo) {
  const valor = campo.value.trim();

  if (valor === "") {
    mostrarError(campo, elementoError, `Debes confirmar ${nombreCampo}.`);
    return false;
  }

  if (valor !== valorOriginal) {
    mostrarError(campo, elementoError, `${nombreCampo} no coincide.`);
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida un número requerido, con mínimo y decimales permitidos (precio).
 */
function validarNumero(campo, elementoError, nombreCampo, minimo) {
  const valor = campo.value.trim();

  if (valor === "") {
    mostrarError(campo, elementoError, `${nombreCampo} es obligatorio.`);
    return false;
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    mostrarError(campo, elementoError, `${nombreCampo} debe ser un número.`);
    return false;
  }

  if (numero < minimo) {
    mostrarError(
      campo,
      elementoError,
      `${nombreCampo} no puede ser menor que ${minimo}.`,
    );
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida un select: que tenga una opción distinta de la vacía.
 */
function validarSeleccion(campo, elementoError, nombreCampo) {
  if (campo.value === "") {
    mostrarError(campo, elementoError, `Selecciona ${nombreCampo}.`);
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}

/**
 * Valida un RUN chileno sin puntos ni guion (ej: 19011022K).
 * Revisa el largo y calcula el dígito verificador (módulo 11).
 */
function validarRun(campo, elementoError) {
  const valor = campo.value.trim().toUpperCase();

  if (valor === "") {
    mostrarError(campo, elementoError, "El RUN es obligatorio.");
    return false;
  }

  if (valor.length < 7 || valor.length > 9) {
    mostrarError(campo, elementoError, "El RUN debe tener entre 7 y 9 caracteres, sin puntos ni guion.");
    return false;
  }

  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1);

  if (!/^\d+$/.test(cuerpo)) {
    mostrarError(campo, elementoError, "El RUN solo debe tener números y el dígito verificador al final.");
    return false;
  }

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += Number(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado = String(resto);

  if (resto === 11) {
    dvEsperado = "0";
  } else if (resto === 10) {
    dvEsperado = "K";
  }

  if (dv !== dvEsperado) {
    mostrarError(campo, elementoError, "El dígito verificador del RUN no es válido.");
    return false;
  }

  limpiarError(campo, elementoError);
  return true;
}
