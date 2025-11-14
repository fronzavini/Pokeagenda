import { useEffect, useState } from "react";

export default function ListarPokemon() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carrega os pokémons ao entrar na página
  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await fetch("http://127.0.0.1:5000/listar_pokemon");
        if (!response.ok) {
          throw new Error("Erro ao buscar pokémons");
        }
        const data = await response.json();
        setPokemons(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();
  }, []);

  if (loading) return <p className="text-center mt-4">Carregando...</p>;
  if (error) return <p className="text-red-500 text-center mt-4">Erro: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Lista de Pokémons</h1>

      {pokemons.length === 0 ? (
        <p className="text-center">Nenhum Pokémon cadastrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pokemons.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold">{p.nome}</h2>
              <p><strong>Tipo:</strong> {p.tipo}</p>
              <p><strong>Nível:</strong> {p.nivel}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}