const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const game = document.getElementById("game");

let isPaused = false;
let firstPick;
let matches = 0;
const colors = {
    fire: "#FDDFDF",
    grass: "#DEFDE0",
    electric: "#FCF7DE",
    water: "#DEF3FD",
    ground: "#f4e7da",
    rock: "#d5d5d4",
    fairy: "#fceaff",
    poison: "#98d7a5",
    bug: "#f8d5a3",
    dragon: "#97b3e6",
    psychic: "#eaeda1",
    flying: "#F5F5F5",
    fighting: "#E6E0D4",
    normal: "#F5F5F5",
};
const loadPokemons = async () => {
    // Set() only store unique values
    const randomIds = new Set();
    // Call random pokemons every time you play, but only 8 at the time
    while (randomIds.size < 8) {
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }

    // Create an array from the pokeApi promises.
    const pokePromises = [...randomIds].map((id) => fetch(pokeAPIBaseUrl + id));
    // Extract the responses
    const responses = await Promise.all(pokePromises);
    // Convert to json and return
    return await Promise.all(responses.map((res) => res.json()));
};

const displayPokemons = (pokemons) => {
    // Simulate a random sorting
    pokemons.sort((_) => Math.random() - 0.5);
    const pokemonsHTML = pokemons
        .map((pokemon) => {
            const type = pokemon.types[0]?.type?.name || "normal";
            const color = colors[type];
            return `
			<div class="card" style="background-color:${color}" onclick="clickCard(event)" data-pokename="${pokemon.name}">
            <div class="front"></div>
            <div class="back rotated" style="background-color:${color}">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
			    <h2>${pokemon.name}</h2>
            </div>
			</div>
		`;
        })
        .join("");
    game.innerHTML = pokemonsHTML;
};

const clickCard = (event) => {
    const pokemonCard = event.currentTarget;
    const [back, front] = getFrontAndBackFromCard(pokemonCard);

    // Retain user from clickin on the same card or other cards.
    if (front.classList.contains("rotated") || isPaused) return;
    // Not allow to click in any other card
    isPaused = true;

    // Rotate card
    rotateElements([front, back]);

    if (!firstPick) {
        firstPick = pokemonCard;
        // Allow clicking in cards
        isPaused = false;
    } else {
        const firsPokemonName = firstPick.dataset.pokename;
        const secondPokemonName = pokemonCard.dataset.pokename;
        if (firsPokemonName !== secondPokemonName) {
            const [firstPickFront, firstPickBack] = getFrontAndBackFromCard(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstPickFront, firstPickBack]);
                firstPick = null;
                isPaused = false;
            }, 1000);
        } else {
            matches++;
            if (matches === 8) {
                console.log("Winner");
            }
            firstPick = null;
            isPaused = false;
        }
    }
};

const rotateElements = (elements) => {
    if (typeof elements !== "object" || !elements.length) return;
    elements.forEach((element) => element.classList.toggle("rotated"));
};

const getFrontAndBackFromCard = (card) => {
    const back = card.querySelector(".back");
    const front = card.querySelector(".front");
    return [back, front];
};

const resetGame = async () => {
    game.innerHTML = "";
    isPaused = true;
    matches = 0;
    firstPick = null;
    setTimeout(async () => {
        const pokemons = await loadPokemons();
        // attach a copy of the original array, to matches in the game
        displayPokemons([...pokemons, ...pokemons]);
        isPaused = false;
    }, 200);
};

resetGame();
