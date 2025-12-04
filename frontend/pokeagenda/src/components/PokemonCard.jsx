import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/PokemonCard.module.css";

export default function PokemonCard({ onClose, treinadorId, onSave, time }) {
  const [listaNomes, setListaNomes] = useState([]);
  const [nome, setNome] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [shiny, setShiny] = useState(false);
  const [sombroso, setSombroso] = useState(false);

  const [apelido, setApelido] = useState("");
  const [localizacao, setLocalizacao] = useState("time");

  const [pokemon, setPokemon] = useState({
    imagem: "",
    numero: "",
    tipo: "",
    altura: "",
    peso: "",
    habilidade: ""
  });

  const [pokemonFullData, setPokemonFullData] = useState(null);

  const [habilidade, setHabilidade] = useState("");
  const [habilidadesDisponiveis, setHabilidadesDisponiveis] = useState([]);

  const updatePokemonImage = useCallback((data, isShiny) => {
    if (data) {
      setPokemon((prev) => ({
        ...prev,
        imagem: isShiny
          ? data.sprites.other["official-artwork"].front_shiny
          : data.sprites.other["official-artwork"].front_default,
      }));
    }
  }, []);

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1025");
        const data = await res.json();
        const nomes = data.results.map((p) => p.name);
        setListaNomes(nomes);
      } catch (error) {
        console.error("Erro ao carregar lista:", error);
      }
    };
    fetchList();
  }, []);

  const buscarPokemon = useCallback(async (identificador) => {
    if (!identificador) {
      setPokemon({
        imagem: "",
        numero: "",
        tipo: "",
        altura: "",
        peso: "",
        habilidade: ""
      });
      setPokemonFullData(null);
      setHabilidadesDisponiveis([]);
      return;
    }

    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${identificador.toLowerCase()}`
      );

      if (!res.ok) {
        setPokemon({
          imagem: "",
          numero: "",
          tipo: "",
          altura: "",
          peso: "",
          habilidade: ""
        });
        setPokemonFullData(null);
        setHabilidadesDisponiveis([]);
        return;
      }

      const data = await res.json();
      setPokemonFullData(data);

      const abilities = data.abilities.map((a) => a.ability.name);
      setHabilidadesDisponiveis(abilities);
      const primeiraHab = abilities[0] || "";
      setHabilidade(primeiraHab);

      setPokemon({
        imagem: "",
        numero: data.id,
        tipo: data.types.map((t) => t.type.name).join(", "),
        altura: (data.height / 10) + " m",
        peso: (data.weight / 10) + " kg",
        habilidade: primeiraHab
      });

      setSugestoes([]);
    } catch (err) {
      setPokemon({
        imagem: "",
        numero: "",
        tipo: "",
        altura: "",
        peso: "",
        habilidade: ""
      });
      setPokemonFullData(null);
      setHabilidadesDisponiveis([]);
    }
  }, []);

  const handleNomeChange = (e) => {
    const texto = e.target.value;
    setNome(texto);

    if (texto.length === 0) {
      setSugestoes([]);
      buscarPokemon("");
      return;
    }

    const filtrados = listaNomes.filter((n) =>
      n.startsWith(texto.toLowerCase())
    );

    setSugestoes(filtrados.slice(0, 10));
  };

  const selecionarNome = (n) => {
    setNome(n);
    buscarPokemon(n);
  };

  const handleShinyToggle = () => setShiny((prev) => !prev);
  const handleSombrosoToggle = () => setSombroso((prev) => !prev);

  useEffect(() => {
    updatePokemonImage(pokemonFullData, shiny);
  }, [shiny, pokemonFullData, updatePokemonImage]);

  const handleSave = async () => {
    if (!pokemonFullData) {
      alert("Selecione um Pokémon antes de salvar.");
      return;
    }

    if (!treinadorId) {
      alert("Erro: nenhum treinador selecionado!");
      return;
    }

    // Limitar time a no máximo 6 pokémons
    if (localizacao === "time" && time && time.length >= 6) {
      alert("Seu time já tem 6 Pokémon! Libere espaço ou escolha Box.");
      return;
    }

    const payload = {
      shiny,
      apelido: apelido || nome,
      numero_pokedex: pokemon.numero,
      sombroso,
      id_treinador: treinadorId,
      loca: localizacao,
      habilidade
    };

    try {
      const res = await fetch("http://localhost:5000/criar_pokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      alert(json.message || "Pokémon salvo com sucesso!");
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      alert("Erro ao salvar Pokémon.");
    }
  };

  return (
    <div className={styles.card} onClick={(e) => e.stopPropagation()}>
      <div className={styles.buttons}>
        {onClose && (
          <button type="button" className={styles.cancel} onClick={onClose}>
            Fechar
          </button>
        )}
        <button type="button" className={styles.save} onClick={handleSave}>
          Salvar
        </button>
      </div>
      <div className={styles.formContent}>
        <div className={styles.trainerDesignColumn}>
          <h3 className={styles.sectionTitle}>Pokémon</h3>
          <div className={styles.designContent}>
            <div
              className={`${styles.imgBox} ${shiny ? styles.holograma : ""}`}
            >
              <img src={pokemon.imagem || ""} alt="pokemon" />
            </div>
          </div>
        </div>
        <div className={styles.infoColumn}>
          <h3 className={styles.sectionTitle}>Info</h3>
          <div className={styles.infoContent}>
            <div className={styles.infoRow}>
              <span className={styles.label}>Nome:</span>
              <input
                type="text"
                value={nome}
                onChange={handleNomeChange}
                onBlur={() => setTimeout(() => setSugestoes([]), 200)}
                placeholder="Ex: charizard"
                className={styles.inputField}
              />
              {sugestoes.length > 0 && (
                <ul className={styles.sugestoes}>
                  {sugestoes.map((n) => (
                    <li
                      key={n}
                      onClick={() => selecionarNome(n)}
                      className={styles.sugestaoItem}
                    >
                      {n}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label className={styles.infoRow}>
              <span className={styles.label}>Apelido (Opcional):</span>
              <input
                type="text"
                value={apelido}
                onChange={(e) => setApelido(e.target.value)}
                className={styles.inputField}
              />
            </label>
            <label className={styles.infoRow}>
              <span className={styles.label}>Shiny:</span>
              <input
                type="checkbox"
                checked={shiny}
                onChange={handleShinyToggle}
              />
            </label>
            <label className={styles.infoRow}>
              <span className={styles.label}>Sombroso:</span>
              <input
                type="checkbox"
                checked={sombroso}
                onChange={handleSombrosoToggle}
              />
            </label>
            <label className={styles.infoRow}>
              <span className={styles.label}>Localização:</span>
              <select
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                className={styles.inputField}
              >
                <option value="time">Time</option>
                <option value="box">Box</option>
              </select>
            </label>
            <label className={styles.infoRow}>
              <span className={styles.label}>Habilidade:</span>
              <select
                value={habilidade}
                onChange={(e) => {
                  setHabilidade(e.target.value);
                  setPokemon((prev) => ({
                    ...prev,
                    habilidade: e.target.value
                  }));
                }}
                className={styles.inputField}
              >
                {habilidadesDisponiveis.map((hab) => (
                  <option key={hab} value={hab}>
                    {hab}
                  </option>
                ))}
              </select>
            </label>
            <div className={styles.info}>
              <p><strong>Nº Pokédex:</strong> {pokemon.numero}</p>
              <p><strong>Tipo:</strong> {pokemon.tipo}</p>
              <p><strong>Altura:</strong> {pokemon.altura}</p>
              <p><strong>Peso:</strong> {pokemon.peso}</p>
              <p><strong>Habilidade:</strong> {pokemon.habilidade}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}