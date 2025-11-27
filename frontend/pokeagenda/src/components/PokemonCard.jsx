import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/PokemonCard.module.css";

// Adicionando o 'popupWrapper' de volta
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

  // ... (Restante da lógica de useEffect, buscarPokemon, handleNomeChange, etc. permanece inalterada)
  // ... (O código aqui é o mesmo do meu último bloco de resposta)
  
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
      setPokemon({ imagem: "", numero: "", tipo: "", altura: "", peso: "", habilidade: "" });
      setPokemonFullData(null);
      return;
    }
    try {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${identificador.toLowerCase()}`
      );
      if (!res.ok) {
        setPokemon({ imagem: "", numero: "", tipo: "", altura: "", peso: "", habilidade: "" });
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
        habilidade: data.abilities.length > 0 ? data.abilities[0].ability.name : "N/A", 
      });
      setSugestoes([]);
    } catch (err) {
      console.error("Erro ao buscar Pokémon:", err);
      setPokemon({ imagem: "", numero: "", tipo: "", altura: "", peso: "", habilidade: "" });
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
    setShiny(prev => !prev);
  };

  useEffect(() => {
    updatePokemonImage(pokemonFullData, shiny);
  }, [shiny, pokemonFullData, updatePokemonImage]);

  const handleSave = () => {
    if (!pokemonFullData) {
      alert("Por favor, selecione um Pokémon antes de salvar.");
      return;
    }
    const dadosParaSalvar = {
        nomePokemon: nome,
        apelido: apelido || nome, 
        numero: pokemon.numero,
        tipo: pokemon.tipo,
        altura: pokemon.altura,
        peso: pokemon.peso,
        habilidade: pokemon.habilidade,
        shiny: shiny,
        localizacao: localizacao,
        imagemUrl: pokemon.imagem
    };
    console.log("Dados do Pokémon salvos:", dadosParaSalvar);
    alert(`Pokémon ${dadosParaSalvar.apelido} (${dadosParaSalvar.nomePokemon}) salvo em ${localizacao} com sucesso!`);
  };

  return (
    // 💥 NOVO WRAPPER POPUP 💥
    <div className={styles.popupWrapper} onClick={onClose}>
      {/* O evento de clique é barrado para que feche apenas no wrapper, não no card */}
      <div 
        className={styles.card} 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ❌ BOTÃO DE FECHAR */}
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose}>
              ×
          </button>
        )}

        {/* Imagem */}
        <div className={`${styles.imgBox} ${shiny ? styles.holograma : ""}`}>
          {pokemon.imagem ? (
            <img src={pokemon.imagem} alt="pokemon" />
          ) : (
            <span className={styles.placeholder}>Escolha um Pokémon</span>
          )}
        </div>

        {/* Autocomplete */}
        <div className={styles.fieldWrapper}>
          <label>Nome ou Número</label>
          <input
            type="text"
            value={nome}
            onChange={handleNomeChange}
            onBlur={() => setTimeout(() => setSugestoes([]), 200)} 
            placeholder="Ex: charizard ou 6"
            className={styles.input}
          />

          {sugestoes.length > 0 && (
            <ul className={styles.sugestoes}>
              {sugestoes.map((n) => (
                <li key={n} onClick={() => selecionarNome(n)}>
                  {n}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Campo Apelido */}
        <div className={styles.fieldWrapper}>
          <label>Apelido (Opcional)</label>
          <input
            type="text"
            value={apelido}
            onChange={(e) => setApelido(e.target.value)}
            placeholder={`Ex: O Fogo de ${nome || '...'}`}
            className={styles.input}
          />
        </div>

        {/* Checkbox Shiny */}
        <label className={styles.shinyToggleLabel}>
          <input 
            type="checkbox" 
            checked={shiny} 
            onChange={handleShinyToggle} 
          />
          <span>{shiny ? "🌟 Shiny Ativo" : "Normal"}</span>
        </label>

        {/* Seletor Time/Box */}
        <div className={styles.fieldWrapper}>
          <label>Localização</label>
          <select 
            value={localizacao} 
            onChange={(e) => setLocalizacao(e.target.value)}
            className={styles.select}
          >
            <option value="Time">Time</option>
            <option value="Box">Box</option>
          </select>
        </div>


        {/* Infos */}
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
        
        {/* Botão Salvar */}
        <button 
          className={styles.saveBtn} 
          onClick={handleSave}
          disabled={!pokemonFullData} 
        >
          Salvar Pokémon
        </button>

      </div>
    </div>
  );
}