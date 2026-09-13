/**
 * Arreglo de productos
 *
 * Usado por la página de detalle de producto (producto.html) para mostrar
 * el nombre, precio, descripción y productos relacionados de la carta en
 * la que se hizo clic desde index.html o cartas.html.
 */

const NOMBRE_TIPO = {
  fuego: "🔥 Fuego",
  agua: "💧 Agua",
  planta: "🌿 Planta",
  electrico: "⚡ Eléctrico",
  psiquico: "🔮 Psíquico",
  normal: "⚪ Normal",
  lucha: "🥊 Lucha",
};

function crearDescripcion(nombre, tipo) {
  const tipoLegible = NOMBRE_TIPO[tipo]?.replace(/^\S+\s/, "") ?? tipo;
  return `Carta coleccionable de ${nombre}, Pokémon de tipo ${tipoLegible}. Ideal para coleccionistas que buscan completar su set.`;
}

const productos = [
  { id: "pikachu", nombre: "Pikachu", precio: 15000, tipo: "electrico", imagen: "https://images.pokemontcg.io/base1/58.png", stock: 20 },
  { id: "charizard", nombre: "Charizard", precio: 50000, tipo: "fuego", imagen: "https://images.pokemontcg.io/base1/4.png", stock: 6 },
  { id: "blastoise", nombre: "Blastoise", precio: 35000, tipo: "agua", imagen: "https://images.pokemontcg.io/base1/2.png", stock: 8 },
  { id: "venusaur", nombre: "Venusaur", precio: 30000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/15.png", stock: 9 },
  { id: "bulbasaur", nombre: "Bulbasaur", precio: 8000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/44.png", stock: 25 },
  { id: "charmander", nombre: "Charmander", precio: 9000, tipo: "fuego", imagen: "https://images.pokemontcg.io/base1/46.png", stock: 22 },
  { id: "squirtle", nombre: "Squirtle", precio: 8000, tipo: "agua", imagen: "https://images.pokemontcg.io/base1/63.png", stock: 24 },
  { id: "caterpie", nombre: "Caterpie", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/45.png", stock: 35 },
  { id: "metapod", nombre: "Metapod", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/54.png", stock: 30 },
  { id: "butterfree", nombre: "Butterfree", precio: 10000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/33.png", stock: 18 },
  { id: "weedle", nombre: "Weedle", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/69.png", stock: 32 },
  { id: "kakuna", nombre: "Kakuna", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/33.png", stock: 28 },
  { id: "beedrill", nombre: "Beedrill", precio: 9000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/17.png", stock: 16 },
  { id: "pidgey", nombre: "Pidgey", precio: 4000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/57.png", stock: 30 },
  { id: "pidgeotto", nombre: "Pidgeotto", precio: 6000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/22.png", stock: 20 },
  { id: "rattata", nombre: "Rattata", precio: 4000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/61.png", stock: 33 },
  { id: "spearow", nombre: "Spearow", precio: 4000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/62.png", stock: 27 },
  { id: "ekans", nombre: "Ekans", precio: 5000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/46.png", stock: 26 },
  { id: "raichu", nombre: "Raichu", precio: 18000, tipo: "electrico", imagen: "https://images.pokemontcg.io/base1/14.png", stock: 12 },
  { id: "sandshrew", nombre: "Sandshrew", precio: 5000, tipo: "lucha", imagen: "https://images.pokemontcg.io/base1/64.png", stock: 24 },
  { id: "nidoran", nombre: "Nidoran", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/55.png", stock: 29 },
  { id: "nidorino", nombre: "Nidorino", precio: 5000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/37.png", stock: 21 },
  { id: "clefairy", nombre: "Clefairy", precio: 9000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/5.png", stock: 17 },
  { id: "vulpix", nombre: "Vulpix", precio: 5000, tipo: "fuego", imagen: "https://images.pokemontcg.io/base1/68.png", stock: 23 },
  { id: "jigglypuff", nombre: "Jigglypuff", precio: 5000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/54.png", stock: 25 },
  { id: "zubat", nombre: "Zubat", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/57.png", stock: 31 },
  { id: "oddish", nombre: "Oddish", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/63.png", stock: 28 },
  { id: "paras", nombre: "Paras", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/59.png", stock: 26 },
  { id: "venonat", nombre: "Venonat", precio: 4000, tipo: "planta", imagen: "https://images.pokemontcg.io/base1/63.png", stock: 24 },
  { id: "diglett", nombre: "Diglett", precio: 4000, tipo: "lucha", imagen: "https://images.pokemontcg.io/base1/47.png", stock: 30 },
  { id: "meowth", nombre: "Meowth", precio: 6000, tipo: "normal", imagen: "https://images.pokemontcg.io/base1/56.png", stock: 19 },
  { id: "psyduck", nombre: "Psyduck", precio: 6000, tipo: "agua", imagen: "https://images.pokemontcg.io/base1/53.png", stock: 20 },
  { id: "mankey", nombre: "Mankey", precio: 5000, tipo: "lucha", imagen: "https://images.pokemontcg.io/base1/55.png", stock: 22 },
  { id: "growlithe", nombre: "Growlithe", precio: 7000, tipo: "fuego", imagen: "https://images.pokemontcg.io/base1/28.png", stock: 18 },
  { id: "poliwag", nombre: "Poliwag", precio: 5000, tipo: "agua", imagen: "https://images.pokemontcg.io/base1/59.png", stock: 25 },
  { id: "abra", nombre: "Abra", precio: 6000, tipo: "psiquico", imagen: "https://images.pokemontcg.io/base1/43.png", stock: 20 },
  { id: "machop", nombre: "Machop", precio: 5000, tipo: "lucha", imagen: "https://images.pokemontcg.io/base1/52.png", stock: 21 },
  { id: "magnemite", nombre: "Magnemite", precio: 5000, tipo: "electrico", imagen: "https://images.pokemontcg.io/base1/53.png", stock: 23 },
  { id: "gastly", nombre: "Gastly", precio: 6000, tipo: "psiquico", imagen: "https://images.pokemontcg.io/base1/33.png", stock: 19 },
  { id: "mewtwo", nombre: "Mewtwo", precio: 30000, tipo: "psiquico", imagen: "https://images.pokemontcg.io/base1/10.png", stock: 7 },
  { id: "dragonite", nombre: "Dragonite", precio: 56091, tipo: "normal", imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2qd-LVsziDa-_FbQpZEJ0B1Ez1lSlRmmbX3BPHohdiQ&s", stock: 5 },
].map((producto) => ({
  ...producto,
  descripcion: crearDescripcion(producto.nombre, producto.tipo),
}));
