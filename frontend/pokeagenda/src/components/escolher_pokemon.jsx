import { useState, useEffect } from "react";

export default function EscolherPokemon() {
  const [pokemonNome, setPokemonNome] = useState("");
  const [pokemons, setPokemons] = useState([]);
  const [pokemonEscolhido, setPokemonEscolhido] = useState(null);
  const [habilidades, setHabilidades] = useState([]);
  const [erro, setErro] = useState("");

  // Função para buscar Pokémons com base no nome digitado
  useEffect(() => {
    if (pokemonNome.length > 2) {
      const fetchPokemons = async () => {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=0`);
          const data = await res.json();
          const filteredPokemons = data.results.filter((pokemon) =>
            pokemon.name.includes(pokemonNome.toLowerCase())
          );
          setPokemons(filteredPokemons);
        } catch (err) {
          setErro("Erro ao carregar os Pokémons.");
        }
      };
      fetchPokemons();
    } else {
      setPokemons([]);
    }
  }, [pokemonNome]);

  // Função para buscar as habilidades do Pokémon escolhido
  const buscarHabilidades = async (pokemon) => {
    try {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      setHabilidades(data.abilities);
      setPokemonEscolhido(data);
    } catch (err) {
      setErro("Erro ao carregar as habilidades do Pokémon.");
    }
  };

  // Quando o Pokémon for escolhido, atualiza os dados do Pokémon
  const handlePokemonEscolhido = (pokemon) => {
    buscarHabilidades(pokemon);
    setPokemonNome(pokemon.name); // Atualiza o campo de busca com o nome do Pokémon
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Escolher Pokémon</h1>

      {/* Campo de pesquisa */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Digite o nome do Pokémon"
          className="p-2 border border-gray-300 rounded w-full"
          value={pokemonNome}
          onChange={(e) => setPokemonNome(e.target.value)}
        />
      </div>

      {/* Exibição de Pokémons encontrados */}
      <div className="mb-4">
        {erro && <p className="text-red-500">{erro}</p>}
        {pokemons.length === 0 && pokemonNome.length > 2 && (
          <p className="text-center">Nenhum Pokémon encontrado.</p>
        )}
        <ul className="list-disc pl-5">
          {pokemons.map((pokemon) => (
            <li
              key={pokemon.name}
              className="cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => handlePokemonEscolhido(pokemon)}
            >
              {pokemon.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Exibição de detalhes do Pokémon escolhido */}
      {pokemonEscolhido && (
        <div className="bg-white shadow-md rounded-xl p-6 border mt-6">
          <h2 className="text-xl font-semibold">{pokemonEscolhido.name}</h2>
          <p><strong>Altura:</strong> {pokemonEscolhido.height}</p>
          <p><strong>Peso:</strong> {pokemonEscolhido.weight}</p>

          {/* Campo de habilidades */}
          <div className="mt-4">
            <label className="block mb-2">Escolha uma Habilidade:</label>
            <select
              className="p-2 border border-gray-300 rounded w-full"
              onChange={(e) => setPokemonEscolhido({
                ...pokemonEscolhido,
                ability: e.target.value,
              })}
            >
              <option value="">Selecione uma habilidade</option>
              {habilidades.map((habilidade, index) => (
                <option key={index} value={habilidade.ability.name}>
                  {habilidade.ability.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
