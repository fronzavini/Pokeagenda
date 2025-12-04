import React, { useEffect, useState } from "react";
import styles from "../styles/PokemonCard.module.css";

export default function PokemonInfoModal({ pokemon, onClose, onLiberar }) {
  const [pokeData, setPokeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pokemon?.numero_pokedex) return;
    setLoading(true);
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.numero_pokedex}`)
      .then(res => res.json())
      .then(data => {
        setPokeData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pokemon]);

  if (!pokemon) return null;

  return (
    <div className={styles.overlay} style={{ zIndex: 9999 }} onClick={onClose}>
      <div
        className={styles.card}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 420 }}
      >
        <div className={styles.buttons} style={{ justifyContent: 'flex-end' }}>
          <button type="button" className={styles.cancel} onClick={onClose}>
            Fechar
          </button>
        </div>

        <div className={styles.formContent}>
          <div className={styles.trainerDesignColumn}>
            <h3 className={styles.sectionTitle}>Detalhes</h3>
            <div className={styles.designContent}>
              <div className={styles.imgBox}>
                <img
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.numero_pokedex}.png`}
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
                  <p><strong>Apelido:</strong> {pokemon.apelido}</p>
                  <p><strong>Nº Pokédex:</strong> {pokeData.id}</p>
                  <p>
                    <strong>Tipo:</strong>{" "}
                    {pokeData.types.map(t => t.type.name).join(", ")}
                  </p>
                  <p>
                    <strong>Altura:</strong>{" "}
                    {(pokeData.height / 10).toFixed(2)} m
                  </p>
                  <p>
                    <strong>Peso:</strong>{" "}
                    {(pokeData.weight / 10).toFixed(2)} kg
                  </p>
                  <p>
                    <strong>Habilidade:</strong>{" "}
                    {pokeData.abilities[0]?.ability.name}
                  </p>
                </div>
              ) : (
                <span>Informações não disponíveis.</span>
              )}
              <button
                className={styles.save}
                style={{ marginTop: 14, background: "#ffd2d2", color: "#a01313" }}
                onClick={() => onLiberar(pokemon.id)}
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