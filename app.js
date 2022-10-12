const pokeAPIBaseUrl = "https://pokeapi.co/api/v2/pokemon/";
const game = document.getElementById("game");

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
            return `
			<div class="card">
            <div class="front"></div>
            <div className="back">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" />
			    <h2>${pokemon.name}</h2>
            </div>
			</div>
		`;
        })
        .join("");
    game.innerHTML = pokemonsHTML;
};

const resetGame = async () => {
    const pokemons = await loadPokemons();
    // attach a copy of the original array, to match in the game
    displayPokemons([...pokemons, ...pokemons]);
};

resetGame();
