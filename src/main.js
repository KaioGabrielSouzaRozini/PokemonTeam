//HTML a ser mostrado ao usuario
const pokemonName = document.querySelector(".pokemon_name");
const pokemonNumber = document.querySelector(".pokemon_number");
const pokemonType = document.querySelector(".pokemon_type");
const pokemonImage = document.querySelector(".pokemon_image");
const pokemonTeam1 = document.querySelector(".pokemon_Team1");
const pokemonTeam2 = document.querySelector(".pokemon_Team2");
const pokemonTeam3 = document.querySelector(".pokemon_Team3");
const pokemonTeam4 = document.querySelector(".pokemon_Team4");
const pokemonTeam5 = document.querySelector(".pokemon_Team5");
const pokemonFilters = document.querySelector(".pokemon_filter");
const pokemonEvolve1 = document.querySelector(".pokemon_image_evolve1");
const pokemonEvolve2 = document.querySelector(".pokemon_image_evolve2");
const divPokemonEvolve1 = document.querySelector(".evolve1");
const divPokemonEvolve2 = document.querySelector(".evolve2");

//Botoes e inputs a serem manipulados
const form = document.querySelector(".form");
const input = document.querySelector(".input__search");
const buttonPrev = document.querySelector(".btn-prev");
const buttonNext = document.querySelector(".btn-next");
const button1 = document.querySelector(".btn-1");
const button2 = document.querySelector(".btn-2");
const button3 = document.querySelector(".btn-3");
const button4 = document.querySelector(".btn-4");
const button5 = document.querySelector(".btn-5");
const select = document.querySelector(".select");

const typeColors = {
  normal: "#A0522D",
  fighting: "#A0522D",
  flying: "#FFDEAD",
  poison: "#A020F0",
  ground: "#B8860B",
  rock: "#BC8F8F",
  bug: "#9ACD32",
  ghost: "#7B68EE",
  fire: "#FF6347",
  water: "#00FFFF",
  grass: "#00FF00",
  electric: "#CCCC00",
  psychic: "#FFA500",
  ice: "#DCDCDC",
  dragon: "#DC143C",
  dark: "#4F4F4F",
  fairy: "#FF00FF",
  steel: "#708090",
};

let pokemonFilter = "";
let searchPokemon = 1;
let searchPokemonType = 0;
let dataEvolution2;
let dataEvolution1;

const fetchpokemon = async (pokemon) => {
  const APIResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon}`
  );

  if (APIResponse.status == 200) {
    const data = await APIResponse.json();

    return data;
  }
};

const fetchtype = async (type) => {
  const APIPokemonType = await fetch(`https://pokeapi.co/api/v2/type/${type}`);

  const data = await APIPokemonType.json();

  const pokemon = data.pokemon[searchPokemonType].pokemon.name;

  renderPokemon(pokemon);
};

const fetchEvolution = async (pokemon) => {
  const APIResponseEvolution = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`
  );

  const data = await APIResponseEvolution.json();
  const APIResponseEvolutionPokemon = await fetch(
    data["evolution_chain"]["url"]
  );
  const evolution = await APIResponseEvolutionPokemon.json();

  let evolution1;
  let evolution2;

  if (evolution["chain"]["evolves_to"][0] != undefined) {
    evolution1 = evolution["chain"]["evolves_to"][0]["species"]["name"];

    if (evolution1 == "basculegion") {
      evolution1 = "basculegion-male";
    }
    dataEvolution1 = await fetchpokemon(evolution1);

    if (evolution["chain"]["evolves_to"][0]["evolves_to"][0] != undefined) {
      evolution2 =
        evolution["chain"]["evolves_to"][0]["evolves_to"][0]["species"]["name"];

      dataEvolution2 = await fetchpokemon(evolution2);
    }
  }

  if (evolution["chain"]["evolves_to"][0] != undefined) {
    hasImageCheck(dataEvolution1, pokemonEvolve1);
    if (evolution["chain"]["evolves_to"][0]["evolves_to"][0] != undefined) {
      hasImageCheck(dataEvolution2, pokemonEvolve2);
    } else {
      pokemonEvolve2.src = "";
    }
  } else {
    pokemonEvolve1.src = "";
    pokemonEvolve2.src = "";
  }
};

const hasImageCheck = (data, pokemonEvolve) => {
  if (
    data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
      "front_default"
    ] != null
  ) {
    pokemonEvolve.src =
      data["sprites"]["versions"]["generation-v"]["black-white"]["animated"][
        "front_default"
      ];
  } else if (
    data["sprites"]["versions"]["generation-v"]["black-white"][
      "front_default"
    ] != null
  ) {
    pokemonEvolve.src =
      data["sprites"]["versions"]["generation-v"]["black-white"][
        "front_default"
      ];
  } else {
    pokemonEvolve.src = data["sprites"]["front_default"];
  }
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = "Carregando";

  const data = await fetchpokemon(pokemon);

  if (data) {
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;

    if (data.types[1]) {
      pokemonType.innerHTML =
        data.types[0].type.name + "|" + data.types[1].type.name;
    } else {
      pokemonType.innerHTML = data.types[0].type.name;
    }
    hasImageCheck(data, pokemonImage);

    input.value = "";
    searchPokemon = data.id;
  } else {
    pokemonName.innerHTML = "Pokemon não encontrado ";
    pokemonNumber.innerHTML = "";
    input.value = "";
  }
  fetchEvolution(pokemon);
};

//ControlsBlue
buttonPrev.addEventListener("click", () => {
  if (searchPokemon > 1) {
    if (pokemonFilter == "") {
      searchPokemon -= 1;
      renderPokemon(searchPokemon);
    } else {
      if (searchPokemonType > 0) {
        searchPokemonType -= 1;
        fetchtype(pokemonFilter);
      }
    }
    searchPokemon -= 1;
  }
});

select.addEventListener("change", () => {
  var value = select.options[select.selectedIndex].value;

  pokemonFilter = value;

  pokemonFilters.style.backgroundColor = typeColors[value];

  searchPokemonType = 0;
  fetchtype(pokemonFilter);
  if (pokemonFilter != "") {
    pokemonFilters.innerHTML = value;
  }
});

pokemonFilters.addEventListener("click", () => {
  if (pokemonFilter != "") {
    pokemonFilter = "";
    pokemonFilters.innerHTML = ``;
    searchPokemonType = 0;
    pokemonFilters.style.backgroundColor = "white";
  }
});

//ControlsRed
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  renderPokemon(input.value.toLowerCase());
});
buttonNext.addEventListener("click", () => {
  if (searchPokemon < 1011) {
    searchPokemon += 1;

    if (pokemonFilter == "") {
      renderPokemon(searchPokemon);
    } else {
      searchPokemonType += 1;
      fetchtype(pokemonFilter);
    }
  }
});

button1.addEventListener("click", () => {
  pokemonTeam1.src = pokemonImage.src;

  renderPokemon(searchPokemon);
});
button2.addEventListener("click", () => {
  pokemonTeam2.src = pokemonImage.src;

  renderPokemon(searchPokemon);
});
button3.addEventListener("click", () => {
  pokemonTeam3.src = pokemonImage.src;

  renderPokemon(searchPokemon);
});
button4.addEventListener("click", () => {
  pokemonTeam4.src = pokemonImage.src;

  renderPokemon(searchPokemon);
});
button5.addEventListener("click", () => {
  pokemonTeam5.src = pokemonImage.src;

  renderPokemon(searchPokemon);
});

divPokemonEvolve1.addEventListener("click", () => {
  renderPokemon(dataEvolution1["name"]);
});
divPokemonEvolve2.addEventListener("click", () => {
  console.log();
  renderPokemon(dataEvolution2["name"]);
});

renderPokemon(searchPokemon);
