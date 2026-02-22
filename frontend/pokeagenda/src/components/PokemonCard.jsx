import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/PokemonCard.module.css";

export default function PokemonCard({ onClose, treinadorId, onSave, time }) {
  const [listaNomes, setListaNomes] = useState([]);
  const [listaNumeros, setListaNumeros] = useState([]);
  const [nome, setNome] = useState("");
  const [sugestoes, setSugestoes] = useState([]);
  const [shiny, setShiny] = useState(false);
  const [sombroso, setSombroso] = useState(false);

  const [apelido, setApelido] = useState("");
  const [localizacao, setLocalizacao] = useState("box");

  const [pokemon, setPokemon] = useState({
    imagem: "",
    numero: "",
    tipo: "",
    altura: "",
    peso: "",
    habilidade: "",
  });

  const [pokemonFullData, setPokemonFullData] = useState(null);

  const [habilidade, setHabilidade] = useState("");
  const [habilidadesDisponiveis, setHabilidadesDisponiveis] = useState([]);

  // estado para evolução
  const [evolucao, setEvolucao] = useState("Não possui");

  const updatePokemonImage = useCallback((data, isShiny) => {
    if (
      data &&
      data.sprites &&
      data.sprites.other &&
      data.sprites.other["official-artwork"]
    ) {
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
        // Monta lista de objetos { id, name }
        const lista = data.results.map((p, idx) => ({
          id: idx + 1,
          name: p.name,
        }));
        setListaNomes(lista.map((p) => p.name));
        setListaNumeros(lista);
      } catch (error) {
        console.error("Erro ao carregar lista:", error);
      }
    };
    fetchList();
  }, []);

  // buscar evolução (próxima evolução simples — retorna o nome da próxima forma ou null)
  const buscarEvolucao = useCallback(async (idPokemon) => {
    try {
      if (!idPokemon && idPokemon !== 0) {
        setEvolucao("Não possui");
        return;
      }

      // 1) buscar species para obter evolution_chain.url
      const speciesRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${idPokemon}`
      );
      if (!speciesRes.ok) {
        setEvolucao("Não possui");
        return;
      }
      const speciesData = await speciesRes.json();

      if (!speciesData.evolution_chain || !speciesData.evolution_chain.url) {
        setEvolucao("Não possui");
        return;
      }

      // 2) buscar chain de evolução
      const evoRes = await fetch(speciesData.evolution_chain.url);
      if (!evoRes.ok) {
        setEvolucao("Não possui");
        return;
      }
      const evoData = await evoRes.json();

      // função recursiva que encontra a próxima evolução para o nome atual
      const encontrarProximaEvolucao = (chainNode, atualName) => {
        if (!chainNode) return null;
        if (chainNode.species && chainNode.species.name === atualName) {
          // se há evolves_to, pega a primeira espécie (pode ter branching; escolhemos a primeira)
          if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
            return chainNode.evolves_to[0].species.name;
          }
          return null;
        }
        if (chainNode.evolves_to && chainNode.evolves_to.length > 0) {
          for (const next of chainNode.evolves_to) {
            const result = encontrarProximaEvolucao(next, atualName);
            if (result) return result;
          }
        }
        return null;
      };

      const atualName = speciesData.name;
      const proxima = encontrarProximaEvolucao(evoData.chain, atualName);

      setEvolucao(proxima ? proxima : "Não possui");
    } catch (e) {
      console.error("Erro ao buscar evolução:", e);
      setEvolucao("Não possui");
    }
  }, []);

  const buscarPokemon = useCallback(
    async (identificador) => {
      // normaliza identificador para string (evita erro com números)
      if (!identificador && identificador !== 0) {
        setPokemon({
          imagem: "",
          numero: "",
          tipo: "",
          altura: "",
          peso: "",
          habilidade: "",
        });
        setPokemonFullData(null);
        setHabilidadesDisponiveis([]);
        setHabilidade("");
        setEvolucao("Não possui");
        return;
      }

      const idStr = String(identificador);

      try {
        const res = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${idStr.toLowerCase()}`
        );

        if (!res.ok) {
          // não encontrou
          setPokemon({
            imagem: "",
            numero: "",
            tipo: "",
            altura: "",
            peso: "",
            habilidade: "",
          });
          setPokemonFullData(null);
          setHabilidadesDisponiveis([]);
          setHabilidade("");
          setEvolucao("Não possui");
          return;
        }

        const data = await res.json();
        setPokemonFullData(data);

        const abilities = (data.abilities || []).map((a) => a.ability.name);
        setHabilidadesDisponiveis(abilities);
        const primeiraHab = abilities[0] || "";
        setHabilidade(primeiraHab);

        setPokemon({
          imagem: "",
          numero: data.id,
          tipo: (data.types || []).map((t) => t.type.name).join(", "),
          altura: data.height / 10 + " m",
          peso: data.weight / 10 + " kg",
          habilidade: primeiraHab,
        });

        // atualiza imagem imediatamente (não depender só do useEffect)
        updatePokemonImage(data, shiny);

        // busca evolução usando species -> chain
        buscarEvolucao(data.id);

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
        setHabilidadesDisponiveis([]);
        setHabilidade("");
        setEvolucao("Não possui");
      }
    },
    [shiny, updatePokemonImage, buscarEvolucao]
  );

  const handleNomeChange = (e) => {
    const texto = e.target.value;
    setNome(texto);

    // Se apagou tudo
    if (texto.length === 0) {
      setSugestoes([]);
      buscarPokemon("");
      return;
    }

    // Se for número → mostrar pokémons cujo id começa com o texto
    if (/^\d+$/.test(texto)) {
      const filtrados = listaNumeros.filter((n) =>
        n.id.toString().startsWith(texto)
      );
      setSugestoes(filtrados.slice(0, 10));
    } else {
      // Se for nome → mostrar por nome (usa listaNumeros para manter formato {id,name})
      const filtrados = listaNumeros
        .filter((p) => p.name.startsWith(texto.toLowerCase()))
        .slice(0, 10);

      setSugestoes(filtrados);
    }
  };

  const selecionarNome = (p) => {
    if (!p) return;
    setNome(p.name); // escreve o nome no input
    buscarPokemon(p.id); // busca pelo id
    setSugestoes([]);
  };

  const handleShinyToggle = () => {
    setShiny((prev) => {
      const novo = !prev;
      // se já temos dados completos, atualiza imagem de imediato
      if (pokemonFullData) updatePokemonImage(pokemonFullData, novo);
      return novo;
    });
  };
  const handleSombrosoToggle = () => setSombroso((prev) => !prev);

  // atualiza imagem quando muda shiny ou se os dados completos mudarem (backup)
  useEffect(() => {
    if (pokemonFullData) updatePokemonImage(pokemonFullData, shiny);
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
      habilidade,
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
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.card} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/International_Pok%C3%A9mon_logo.svg/640px-International_Pok%C3%A9mon_logo.svg.png"
            alt="Pokémon Logo"
            className={styles.pokemonLogo}
          />
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
                    {sugestoes.map((p) => (
                      <li
                        key={p.id}
                        onClick={() => selecionarNome(p)}
                        className={styles.sugestaoItem}
                      >
                        #{p.id} - {p.name}
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
                  <option value="box">Box</option>
                  <option value="time">Time</option>
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
                      habilidade: e.target.value,
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
                <p>
                  <strong>Evolução:</strong> {evolucao}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
