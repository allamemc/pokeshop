fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
  .then((response) => response.json())
  .then((data) => {
    const pokemonUrls = data.results.map((pokemon) => pokemon.url);
    const fetchPromises = pokemonUrls.map((url) =>
      fetch(url).then((response) => response.json())
    );
    Promise.all(fetchPromises)
      .then((pokemonData) => {
        const frontDefaultUrls = pokemonData.map(
          (pokemon) => pokemon.sprites.front_default
        );
        const backDefaultUrls = pokemonData.map(
          (pokemon) => pokemon.sprites.back_default
        );
        const pokemonsContainerFront = document.getElementById("frente");
        const pokemonsContainerBack = document.getElementById("espalda");
        frontDefaultUrls.forEach((url) => {
          const imgElement = document.createElement("img");
          imgElement.src = url;
          pokemonsContainerFront.appendChild(imgElement);
        });
        backDefaultUrls.forEach((url) => {
          const imgElement = document.createElement("img");
          imgElement.src = url;
          pokemonsContainerBack.appendChild(imgElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
      });
  })
  .catch((error) => {
    console.error("Error fetching API:", error);
  });
