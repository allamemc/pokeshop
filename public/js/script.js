const maxLimit = 151;
let currentOffset = 0;
const limit = 12;

function fetchPokemonData(offset) {
  const adjustedLimit = Math.min(limit, maxLimit - offset);

  fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${adjustedLimit}&offset=${offset}`
  )
    .then((response) => response.json())
    .then((data) => {
      const pokemonData = data.results.map((pokemon) => ({
        name: pokemon.name,
        url: pokemon.url,
      }));

      const fetchPromises = pokemonData.map((pokemon) =>
        fetch(pokemon.url).then((response) => response.json())
      );

      Promise.all(fetchPromises)
        .then((pokemonDetails) => {
          const frontDefaultUrls = pokemonDetails.map(
            (pokemon) => pokemon.sprites.front_default
          );
          const names = pokemonDetails.map((pokemon) => pokemon.name);

          const pokemonsContainerFront = document.getElementById("pokemons");
          pokemonsContainerFront.innerHTML = "";

          frontDefaultUrls.forEach((url, index) => {
            const cardElement = document.createElement("div");
            cardElement.classList.add("card", "w-44", "glass");

            const figureElement = document.createElement("figure");
            const imgElement = document.createElement("img");
            imgElement.src = url;
            imgElement.alt = "Pokemon";

            figureElement.appendChild(imgElement);
            cardElement.appendChild(figureElement);

            const cardBodyElement = document.createElement("div");
            cardBodyElement.classList.add("card-body");

            const titleElement = document.createElement("h2");
            titleElement.classList.add("nombre");
            titleElement.textContent =
              names[index].charAt(0).toUpperCase() + names[index].slice(1);

            const actionsElement = document.createElement("div");
            actionsElement.classList.add("justify-center", "card-actions");

            const buttonElement = document.createElement("button");
            buttonElement.classList.add(
              "btn",
              "btn-primary",
              "compras",
              "color-boton",
              "glass"
            );

            const iconElement = document.createElement("img");
            iconElement.src = "../img/icono.png";
            iconElement.alt = "Icon";
            iconElement.width = "25";
            buttonElement.appendChild(iconElement);

            const price = document.createElement("div");
            price.classList.add("price");
            const randomNumber = Math.floor(Math.random() * 50 + 1) * 10;
            price.textContent = randomNumber;

            buttonElement.appendChild(price);
            cardBodyElement.appendChild(titleElement);
            cardBodyElement.appendChild(actionsElement);
            actionsElement.appendChild(buttonElement);

            cardElement.appendChild(cardBodyElement);

            pokemonsContainerFront.appendChild(cardElement);
          });
        })
        .catch((error) => {
          console.error("Error fetching Pokemon data:", error);
        });
    });
}
document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  let total = 0;

  const updateCartDisplay = () => {
    const cartItemsElement = document.querySelector(".card-body .text-lg");
    const cartTotalElement = document.querySelector(".card-body .text");

    cartItemsElement.textContent = `${cart.length} Pokemons`;
    cartTotalElement.innerHTML = `<img src="../img/icono.png" width="25"> ${total}`;
  };

  // Retrieve cart from session storage
  const storedCart = sessionStorage.getItem("cart");
  if (storedCart) {
    cart = JSON.parse(storedCart);
    total = calculateTotal(cart);
  }

  // Evento al hacer click en el botón de compras
  document.addEventListener("click", (event) => {
    const targetButton = event.target.closest(".btn.compras");
    if (targetButton) {
      // Obtiene el nombre del Pokémon desde el elemento .nombre
      const pokemonPrice = parseInt(
        targetButton.querySelector(".price").textContent
      );

      cart.push({ price: pokemonPrice });
      total += pokemonPrice;

      // Save cart to session storage
      sessionStorage.setItem("cart", JSON.stringify(cart));

      updateCartDisplay();
    }
  });

  updateCartDisplay();
});

function calculateTotal(cart) {
  return cart.reduce((total, item) => total + item.price, 0);
}

document.addEventListener("DOMContentLoaded", () => {
  const previousButton = document.querySelector(
    ".join-item.btn.btn-outline:nth-of-type(1)"
  );
  const nextButton = document.querySelector(
    ".join-item.btn.btn-outline:nth-of-type(2)"
  );

  previousButton.addEventListener("click", () => {
    if (currentOffset - limit >= 0) {
      currentOffset -= limit;
      fetchPokemonData(currentOffset);
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentOffset + limit < maxLimit) {
      currentOffset += limit;
      fetchPokemonData(currentOffset);
    } else {
      currentOffset = 0; // Volver al principio
      fetchPokemonData(currentOffset);
    }
  });

  // Carga los primeros Pokémon al cargar la página
  fetchPokemonData(currentOffset);
});
function esDispositivoMovil() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}
function cargar() {
  if (esDispositivoMovil()) {
    const videoContainer = document.querySelector(".video-container");
    if (videoContainer) {
      videoContainer.remove();
      const fondoPokemon = document.querySelector(".fondo-pokemon");
      fondoPokemon.classList.add("fondo-png");
      const navbar = document.querySelector(".navbar");
      navbar.style.backgroundColor = "#7ACAF9";
      const footer = document.querySelector(".footer");
      footer.style.backgroundColor = "#80AF72";
    } else {
      console.log("No se encontró el elemento con la clase .video-container");
    }
  }
}

// Cambiar el color de fondo de la barra de navegación

// Esperar a que se cargue el DOM
document.addEventListener("DOMContentLoaded", cargar);

function iniciarSesion() {
  const nombre = document.getElementById("nombreInput").value;

  if (nombre.trim() !== "") {
    // Guardar nombre en el almacenamiento local
    sessionStorage.setItem("nombre", nombre);

    // Cambiar el botón a "Cerrar sesión"
    const botonSesion = document.getElementById("botonSesion");
    botonSesion.textContent = "Cerrar sesión";
    botonSesion.onclick = cerrarSesion;

    // Establecer el valor del input con el nombre de sesión
    const inputNombre = document.getElementById("nombreInput");
    inputNombre.classList.add("glass", "bg-blue-400");
    inputNombre.value = "Bienvenido, " + nombre;
    inputNombre.disabled = true;
  }
}

function cerrarSesion() {
  // Remover el nombre del almacenamiento local
  sessionStorage.removeItem("nombre");
  sessionStorage.removeItem("cart");

  // Restaurar el botón a "Entrar"
  const botonSesion = document.getElementById("botonSesion");
  botonSesion.textContent = "Entrar";
  botonSesion.onclick = iniciarSesion;

  // Limpiar el valor del input y habilitarlo
  const inputNombre = document.getElementById("nombreInput");
  inputNombre.value = "";
  inputNombre.disabled = false;
}

// Verificar si hay una sesión almacenada al cargar la página
window.onload = function () {
  const nombreSesion = sessionStorage.getItem("nombre");
  if (nombreSesion) {
    const botonSesion = document.getElementById("botonSesion");
    botonSesion.textContent = "Cerrar sesión";
    botonSesion.onclick = cerrarSesion;

    const inputNombre = document.getElementById("nombreInput");
    inputNombre.value = "Bienvenido, " + nombreSesion;
    inputNombre.classList.add("glass", "bg-blue-400");
    inputNombre.disabled = true;
  }
};
