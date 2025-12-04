import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/PokemonCard.module.css";

// NÃO ALTEREI LÓGICA, HOOKS, FUNÇÕES OU FETCHES — só reorganizei o JSX/estrutura e classes para seguir o estilo do TrainerCard.

export default function PokemonCard({ onClose }) {
  const [listaNomes, setListaNomes] = useState([]);
  const [nome, setNome] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [shiny, setShiny] = useState(false);

  const [apelido, setApelido] = useState("");
  const [localizacao, setLocalizacao] = useState("Time");

  const [pokemon, setPokemon] = useState({
    imagem: "",
    numero: "",
    tipo: "",
    altura: "",
    peso: "",
    habilidade: "",
  });

  const [pokemonFullData, setPokemonFullData] = useState(null);

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
        console.error("Erro ao carregar a lista de Pokémons:", error);
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
        habilidade: "",
      });
      setPokemonFullData(null);
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
          habilidade: "",
        });
        setPokemonFullData(null);
        return;
      }
      const data = await res.json();
      setPokemonFullData(data);
      setPokemon({
        imagem: "",
        numero: data.id,
        tipo: data.types.map((t) => t.type.name).join(", "),
        altura: data.height / 10 + " m",
        peso: data.weight / 10 + " kg",
        habilidade:
          data.abilities.length > 0 ? data.abilities[0].ability.name : "N/A",
      });
      setSugestoes([]);
    } catch (err) {
      console.error("Erro ao buscar Pokémon:", err);
      setPokemon({
        imagem: "",
        numero: "",
        tipo: "",
        altura: "",
        peso: "",
        habilidade: "",
      });
      setPokemonFullData(null);
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

  const handleShinyToggle = () => {
    setShiny((prev) => !prev);
  };

  useEffect(() => {
    updatePokemonImage(pokemonFullData, shiny);
  }, [shiny, pokemonFullData, updatePokemonImage]);

  const handleSave = async () => {
    if (!pokemonFullData) {
      alert("Por favor, selecione um Pokémon antes de salvar.");
      return;
    }

    const payload = {
      nome: nome,
      shiny: !!shiny,
      apelido: apelido || nome,
      numero_pokedex: pokemon.numero,
      tipo: pokemon.tipo,
      imagem_url: pokemon.imagem,
      altura: pokemon.altura,
      peso: pokemon.peso,
      habilidade: pokemon.habilidade,
    };

    try {
      const res = await fetch("http://localhost:5000/criar_pokemon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      console.log("Resposta do backend (criar_pokemon):", json);
      if (json && json.message) {
        alert(json.message);
      } else {
        alert(`Pokémon ${payload.apelido} salvo com sucesso!`);
      }
    } catch (err) {
      console.error("Erro ao salvar Pokémon:", err);
      alert("Erro ao salvar Pokémon. Veja o console para detalhes.");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/640px-International_Pok%C3%A9mon_logo.svg.png"
        alt="Pokémon Logo"
        className={styles.pokemonLogo}
      />
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        {/* Header: close + buttons (mesmo posicionamento do TrainerCard) */}
        <div className={styles.header}>
          <div /> {/* espaço para equilibrar o header como no outro card */}
          <div className={styles.buttons}>
            {onClose && (
              <button className={styles.cancel} onClick={onClose}>
                Fechar
              </button>
            )}
            <button
              type="button"
              className={styles.save}
              onClick={handleSave}
              disabled={!pokemonFullData}
            >
              Salvar
            </button>
          </div>
        </div>

        {/* Conteúdo em 2 colunas: esquerda = imagem, direita = inputs + infos */}
        <div className={styles.formContent}>
          {/* Coluna esquerda: imagem do Pokémon */}
          <div className={styles.trainerDesignColumn}>
            <h3 className={styles.sectionTitle}>Pokémon</h3>

            <div className={styles.designContent}>
              <div
                className={`${styles.imgBox} ${shiny ? styles.holograma : ""}`}
              >
                <img src={pokemon.imagem || ""} />
              </div>
            </div>
          </div>

          {/* Coluna direita: inputs e informações */}
          <div className={styles.infoColumn}>
            <h3 className={styles.sectionTitle}>Info</h3>

            <div className={styles.infoContent}>
              {/* Nome (autocomplete) */}
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

              {/* Apelido */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Apelido (Opcional):</span>
                <input
                  type="text"
                  value={apelido}
                  onChange={(e) => setApelido(e.target.value)}
                  placeholder={`Ex: O Fogo de ${nome || "..."}`}
                  className={styles.inputField}
                />
              </label>

              {/* Shiny toggle */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Shiny:</span>
                <div className={styles.shinyRow}>
                  <input
                    type="checkbox"
                    checked={shiny}
                    onChange={handleShinyToggle}
                    id="shinyToggle"
                  />
                </div>
              </label>

              {/* Localização */}
              <label className={styles.infoRow}>
                <span className={styles.label}>Localização:</span>
                <select
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  className={styles.inputField}
                >
                  <option value="Time">Time</option>
                  <option value="Box">Box</option>
                </select>
              </label>

              {/* Informações do Pokémon */}
              <div className={styles.info}>
                <p>
                  <strong>Nº Pokédex:</strong> {pokemon.numero}
                </p>
                <p>
                  <strong>Tipo:</strong> {pokemon.tipo}
                </p>
                <p>
                  <strong>Altura:</strong> {pokemon.altura}
                </p>
                <p>
                  <strong>Peso:</strong> {pokemon.peso}
                </p>
                <p>
                  <strong>Habilidade:</strong> {pokemon.habilidade}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
