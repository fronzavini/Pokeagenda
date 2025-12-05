import React, { useState, useEffect } from "react";
import styles from "../styles/Pokedex.module.css";
import PokemonCard from "./PokemonCard";
import TrainerCard from "./TrainerCard";
import PokemonInfoModal from "./PokemonInfoModal"; // Novo componente para detalhes

export default function Pokedex() {
  const [showImage, setShowImage] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [stripesOn, setStripesOn] = useState(false);
  const [showPokemonCard, setShowPokemonCard] = useState(false);
  const [showTrainerCard, setShowTrainerCard] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [boxSearch, setBoxSearch] = useState("");

  const [treinador, setTreinador] = useState(null);
  const [treinadores, setTreinadores] = useState([]);
  const [selectedTreinadorId, setSelectedTreinadorId] = useState(null);
  const [trainerModalMode, setTrainerModalMode] = useState("edit");

  const [time, setTime] = useState([]);
  const [box, setBox] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null); // para mostrar modal de detalhes

  const carregarTreinadores = async () => {
    try {
      const res = await fetch("http://localhost:5000/listar_treinadores");
      const listaT = await res.json();
      setTreinadores(listaT || []);
      if ((!selectedTreinadorId || !listaT.some(t => t.id === selectedTreinadorId)) && listaT.length > 0) {
        setSelectedTreinadorId(listaT[0].id);
      }
    } catch (err) {
      setTreinadores([]);
    }
  };

  const carregarDados = async (forcaId = null) => {
    try {
      const usedId = forcaId || selectedTreinadorId;
      if (!usedId) return;
      const resT = await fetch(`http://localhost:5000/treinador/${usedId}`);
      const trainerData = await resT.json();
      setTreinador(trainerData && trainerData.id ? trainerData : null);

      const resP = await fetch(`http://localhost:5000/listar_pokemons_por_treinador/${usedId}`);
      const lista = await resP.json();
      const arrayPokemons = Array.isArray(lista) ? lista : [];
      const timeList = arrayPokemons.filter((p) => ((p.loca || p.local) || "").toLowerCase() === "time");
      const boxList = arrayPokemons.filter((p) => ((p.loca || p.local) || "").toLowerCase() === "box");
      setTime(timeList);
      setBox(boxList);
    } catch (err) {
      setTreinador(null);
      setTime([]);
      setBox([]);
    }
  };

  useEffect(() => {
    carregarTreinadores();
  }, []);

  useEffect(() => {
    if (selectedTreinadorId) {
      carregarDados(selectedTreinadorId);
    }
  }, [selectedTreinadorId]);

  const salvarTreinador = (dados) => {
    fetch(`http://localhost:5000/editar_treinador/${dados.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((res) => res.json())
      .then(() => {
        carregarTreinadores();
        carregarDados(dados.id);
      });
  };

  const cadastrarNovoTreinador = (dados) => {
    fetch(`http://localhost:5000/criar_treinador`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    })
      .then((res) => res.json())
      .then(() =>
        carregarTreinadores().then(() => {
          setTimeout(() => {
            if (treinadores.length > 0) {
              setSelectedTreinadorId(
                treinadores[treinadores.length - 1].id
              );
            }
          }, 450);
        })
      );
  };

  const handleCameraClick = () => {
    const next = !showImage;
    setShowImage(next);
    setStripesOn(next);
    if (!next) setLightsOn(false);
  };

  const handleSmallBtnClick = () => {
    if (showImage) setLightsOn((prev) => !prev);
  };

  const liberarPokemon = async (pokeId) => {
    if (window.confirm("Tem certeza que deseja liberar este Pokémon? Isso não poderá ser desfeito.")) {
      await fetch(`http://localhost:5000/deletar_pokemon/${pokeId}`, { method: "DELETE" });
      setSelectedPokemon(null);
      carregarDados();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          position: "absolute",
          top: 25,
          left: 40,
          zIndex: 5,
          background: "#fff",
          borderRadius: "8px",
          padding: "2px 10px 2px 18px",
          fontSize: 11,
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          display: "flex",
          alignItems: "center"
        }}
        data-tutorial="trainer-select"
      >
        Treinador:&nbsp;
        <select
          value={selectedTreinadorId || ""}
          onChange={e => setSelectedTreinadorId(Number(e.target.value))}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: 10,
            border: "1px solid #bbb",
            borderRadius: 4,
            background: "#f5f5f5",
            padding: "3px 8px"
          }}
        >
          {treinadores.map((t) => (
            <option value={t.id} key={t.id}>
              {t.nome}
            </option>
          ))}
        </select>
        <button
          style={{
            marginLeft: 10,
            padding: "2px 8px",
            fontSize: 12,
            background: "#ffeb3b",
            border: "1px solid #bca800",
            borderRadius: "5px",
            fontFamily: '"Press Start 2P", monospace',
            cursor: "pointer"
          }}
          onClick={() => {
            setTrainerModalMode("create");
            setShowTrainerCard(true);
          }}
        >
          + Novo Treinador
        </button>
      </div>
      <div className={styles.leftPanel}>
        <div className={styles.topRow}>
          <button
            className={`${styles.camera} ${showImage ? styles.cameraActive : ""}`}
            onClick={handleCameraClick}
            data-tutorial="camera"
          />
          <div className={styles.lights} data-tutorial="lights">
            <span className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`} />
            <span className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`} />
            <span className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`} />
          </div>
        </div>
        <div className={styles.mainScreen}>
          <div className={styles.topLeds}>
            <span className={styles.ledTiny}></span>
            <span className={styles.ledTiny}></span>
          </div>
          <div className={styles.frameVents}>
            <span></span><span></span><span></span>
          </div>
          <div className={styles.screenInner} data-tutorial="screen">
            {showImage && treinador?.foto && (
              <img src={treinador.foto} className={styles.screenImage} alt="foto treinador"/>
            )}
            <span className={styles.scanlines} />
            <span className={`${styles.statusLed} ${showImage ? styles.statusOn : ""}`} />
          </div>
        </div>
        <div className={styles.listaWrapped}>
          <button className={`${styles.listra} ${stripesOn ? styles.stripeOn : ""}`} data-tutorial="rect-btn" />
          <button className={`${styles.listra} ${stripesOn ? styles.stripeOn : ""}`} />
        </div>
        <div className={styles.controlGrid}>
          <button className={styles.smallBtn} onClick={handleSmallBtnClick} data-tutorial="small-btn" />
          <button
            className={styles.rectBtn}
            onClick={() => {
              setTrainerModalMode("edit");
              setShowTrainerCard(true);
            }}
            data-tutorial="edit-trainer-btn"
          />
          <button
            className={styles.dpad}
            onClick={() => showImage && setShowPokemonCard(true)}
            disabled={!showImage}
            data-tutorial="dpad"
          >
            +
          </button>
        </div>
      </div>
      <div className={styles.hinge}></div>
      <div className={styles.rightPanel}>
        <div className={styles.topDisplay}>
          <span className={`${styles.fade} ${showImage ? styles.show : ""} ${styles.time}`}>
            TIME
          </span>
        </div>
        <div className={styles.keyGrid} data-tutorial="key-grid">
          {Array.from({ length: 6 }).map((_, i) => {
            const p = showImage ? time[i] : null;
            return (
              <div
                key={i}
                className={styles.pokeCell}
                onClick={() => p && setSelectedPokemon(p)}
                style={{ cursor: p ? "pointer" : "default" }}
              >
                {p && p.numero_pokedex && (
                  <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.numero_pokedex}.png`}
                    className={styles.pokeImg}
                    alt={p.apelido || p.nome || ""}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.secondaryControls}>
          <div className={styles.slider}>
            <span className={`${styles.fade} ${showImage ? styles.show : ""} ${styles.box}`}>
              BOX
            </span>
          </div>
          <button className={styles.greenBtn} onClick={() => setShowBox(true)} data-tutorial="box-btn" />
        </div>
      </div>

      {showBox && (
        <div className={styles.modalOverlay} onClick={() => setShowBox(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            
            {/* Cabeçalho */}
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>BOX</span>
              <button className={styles.modalClose} onClick={() => setShowBox(false)}>
                ×
              </button>
            </div>

            {/* 🔎 Campo de busca */}
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              className={styles.searchInput}
              value={boxSearch || ""}
              onChange={(e) => setBoxSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px"
              }}
            />

            {/* Lista do BOX */}
            <div className={styles.boxGrid}>
              {box
                .filter((p) => {
                  if (!boxSearch) return true;
                  const termo = boxSearch.toLowerCase();
                  return (
                    p.nome?.toLowerCase().includes(termo) ||
                    p.apelido?.toLowerCase().includes(termo) ||
                    String(p.numero_pokedex).includes(termo)
                  );
                })
                .length === 0 ? (
                <p className={styles.empty}>Nenhum Pokémon encontrado</p>
              ) : (
                box
                  .filter((p) => {
                    if (!boxSearch) return true;
                    const termo = boxSearch.toLowerCase();
                    return (
                      p.nome?.toLowerCase().includes(termo) ||
                      p.apelido?.toLowerCase().includes(termo) ||
                      String(p.numero_pokedex).includes(termo)
                    );
                  })
                  .map((p) => (
                    <div
                      key={p.id}
                      className={styles.pokeCell}
                      onClick={() => setSelectedPokemon(p)}
                      style={{ cursor: "pointer" }}
                    >
                      {p.numero_pokedex && (
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.numero_pokedex}.png`}
                          className={styles.pokeImg}
                          alt={p.apelido || p.nome}
                        />
                      )}
                      <span className={styles.pokeName}>{p.nome || p.apelido}</span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}


      {showPokemonCard && (
        <PokemonCard
          onClose={() => setShowPokemonCard(false)}
          treinadorId={treinador?.id}
          time={time}
          onSave={carregarDados}
        />
      )}
      {showTrainerCard && (
        <TrainerCard
          trainerMode={trainerModalMode}
          treinador={trainerModalMode === "edit" ? treinador : null}
          fechar={() => setShowTrainerCard(false)}
          salvar={trainerModalMode === "edit" ? salvarTreinador : cadastrarNovoTreinador}
        />
      )}

      {/* Modal dos detalhes do Pokémon + botão liberar */}
      {selectedPokemon && (
        <PokemonInfoModal
          pokemon={selectedPokemon}
          onLiberar={liberarPokemon}
          onClose={() => setSelectedPokemon(null)}
          onRefresh={carregarDados}
        />
      )}
    </div>
  );
}