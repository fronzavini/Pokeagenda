import React, { useEffect, useState } from "react";
import styles from "../styles/PokemonCard.module.css";

export default function PokemonInfoModal({
  pokemon,
  onClose,
  onLiberar,
  onRefresh,
}) {
  const [pokeData, setPokeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [evolucao, setEvolucao] = useState("Carregando...");

  useEffect(() => {
    if (!pokemon?.numero_pokedex) return;

    setLoading(true);

    const carregarTudo = async () => {
      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.numero_pokedex}`
        );
        const data = await res.json();
        setPokeData(data);

        const resSpecies = await fetch(data.species.url);
        const species = await resSpecies.json();

        const resChain = await fetch(species.evolution_chain.url);
        const chainData = await resChain.json();

        const encontrarEvolucao = (chain) => {
          if (chain.species.name === species.name) {
            if (chain.evolves_to.length > 0) {
              return chain.evolves_to[0].species.name;
            }
            return null;
          }

          for (const e of chain.evolves_to) {
            const r = encontrarEvolucao(e);
            if (r) return r;
          }
          return null;
        };

        const prox = encontrarEvolucao(chainData.chain);
        setEvolucao(prox ? prox : "Não possui");
        setLoading(false);
      } catch (err) {
        setEvolucao("Não possui");
        setLoading(false);
      }
    };

    carregarTudo();
  }, [pokemon]);

  const trocarLocal = async (pokeId) => {
    if (
      window.confirm("Tem certeza que deseja trocar o local deste Pokémon?")
    ) {
      await fetch(`http://localhost:5000/trocar_loca/${pokeId}`, {
        method: "PUT",
      });

      if (onRefresh) onRefresh();
      onClose();
    }
  };

  if (!pokemon) return null;

  return (
    <div className={styles.overlay} style={{ zIndex: 9999 }} onClick={onClose}>
      <div
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 420 }}
      >
        <div className={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/640px-International_Pok%C3%A9mon_logo.svg.png"
            alt="Pokémon Logo"
            style={{ justifyContent: "flex-start" }}
            className={styles.pokemonLogo}
          />
          <div
            className={styles.buttons}
            style={{ justifyContent: "flex-end" }}
          >
            <button type="button" className={styles.cancel} onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
        <div className={styles.formContent}>
          <div className={styles.trainerDesignColumn}>
            <h3 className={styles.sectionTitle}>Detalhes</h3>

            <div className={styles.designContent}>
              <div className={styles.imgBox}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork${
                    pokemon.shiny ? "/shiny" : ""
                  }/${pokemon.numero_pokedex}.png`}
                  alt={pokemon.apelido || pokemon.nome}
                />
              </div>
            </div>
          </div>

          <div className={styles.infoColumn}>
            <h3 className={styles.sectionTitle}>Info</h3>

            <div className={styles.infoContent}>
              {loading ? (
                <span>Carregando informações...</span>
              ) : pokeData ? (
                <div className={styles.info}>
                  <p>
                    <strong>Apelido:</strong> {pokemon.apelido}
                  </p>
                  <p>
                    <strong>Shiny:</strong> {pokemon.shiny ? "Sim" : "Não"}
                  </p>
                  <p>
                    <strong>Sombroso:</strong>{" "}
                    {pokemon.sombroso ? "Sim" : "Não"}
                  </p>
                  <p>
                    <strong>Nº Pokédex:</strong> {pokeData.id}
                  </p>
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {pokeData.types.map((t) => t.type.name).join(", ")}
                  </p>
                  <p>
                    <strong>Altura:</strong> {(pokeData.height / 10).toFixed(2)}{" "}
                    m
                  </p>
                  <p>
                    <strong>Peso:</strong> {(pokeData.weight / 10).toFixed(2)}{" "}
                    kg
                  </p>
                  <p>
                    <strong>Habilidade:</strong>{" "}
                    {pokeData.abilities[0]?.ability.name}
                  </p>
                  <p>
                    <strong>Evolução:</strong> {evolucao}
                  </p>
                </div>
              ) : (
                <span>Informações não disponíveis.</span>
              )}

              <button
                className={styles.save}
                style={{
                  marginTop: 14,
                  background: "#c1e9b9ff",
                  color: "#13a059ff",
                }}
                onClick={() => trocarLocal(pokemon.id)}
              >
                Trocar Local
              </button>

              <button
                className={styles.save}
                style={{
                  marginTop: 14,
                  background: "#ffd2d2",
                  color: "#a01313",
                }}
                onClick={() => onLiberar && onLiberar(pokemon.id)}
              >
                Liberar Pokémon
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
