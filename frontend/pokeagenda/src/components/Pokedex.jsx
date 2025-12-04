import React, { useState } from "react";
import styles from "../styles/Pokedex.module.css";
import PokemonCard from "./PokemonCard";
import TrainerCard from "./TrainerCard";

export default function Pokedex() {
  const [showImage, setShowImage] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [stripesOn, setStripesOn] = useState(false);
  const [showPokemonCard, setShowPokemonCard] = useState(false);
  const [showTrainerCard, setShowTrainerCard] = useState(false);
  const [showBox, setShowBox] = useState(false);

  const salvarTreinador = (dados) => {
    try {
      fetch("http://localhost:5000/criar_treinador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("Resposta do backend (criar_treinador):", json);
          if (json && json.message) alert(json.message);
        })
        .catch((err) => {
          console.error("Erro ao salvar treinador:", err);
          alert("Erro ao salvar treinador. Veja o console para detalhes.");
        });
    } catch (err) {
      console.error(err);
    }
  };

  const treinador = {
    id: 1,
    nome: "Ash Ketchum",
    email: "ash@pokemon.com",
    cpf: "12345678900",
    foto: "https://i.imgur.com/7wQ9Z3F.png",
    cidade: "Pallet Town",
  };

  // --- Lista de pokémons base (para os grids e box) ---
  const baseList = [
    {
      nome: "Steelix",
      img: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/208_f2.png",
    },
    {
      nome: "Geodude",
      img: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/074.png",
    },
    {
      nome: "Crobat",
      img: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/169.png",
    },
    {
      nome: "Sudowoodo",
      img: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/185.png",
    },
    {
      nome: "Chansey",
      img: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/113.png",
    },
    {
      nome: "Comfey",
      img: "https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full/764.png",
    },
  ];

  // Cria lista longa (simula infinitos pokémons)
  const boxPokemons = Array.from({ length: 60 }, (_, i) => {
    const p = baseList[i % baseList.length];
    return { ...p, nome: `${p.nome} #${i + 1}` };
  });

  // --- Botões e interações ---
  const handleCameraClick = () => {
    const next = !showImage;
    setShowImage(next);
    setStripesOn(next);
    if (!next) setLightsOn(false);
  };

  const handleSmallBtnClick = () => {
    if (showImage) setLightsOn((prev) => !prev);
  };

  const handleRectBtnClick = () => {
    if (showImage) setShowTrainerCard(true);
    else alert("Ative a câmera primeiro!");
  };

  return (
    <div className={styles.wrapper}>
      {/* ====== ESQUERDA ====== */}
      <div className={styles.leftPanel}>
        <div className={styles.topRow}>
          <button
            data-tutorial="camera"
            className={`${styles.camera} ${
              showImage ? styles.cameraActive : ""
            }`}
            onClick={handleCameraClick}
          />
          <div data-tutorial="lights" className={styles.lights}>
            <span
              className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`}
            />
            <span
              className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`}
            />
            <span
              className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`}
            />
          </div>
        </div>

        <div data-tutorial="screen" className={styles.mainScreen}>
          <div className={styles.topLeds}>
            <span className={styles.ledTiny}></span>
            <span className={styles.ledTiny}></span>
          </div>

          <div className={styles.frameVents}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={styles.screenInner}>
            {showImage && (
              <img
                src="https://m.media-amazon.com/images/I/41Jw-Dom9zL._AC_SY350_.jpg"
                alt="Treinador"
                className={styles.screenImage}
              />
            )}
            <span className={styles.scanlines} aria-hidden="true"></span>
            <span
              className={`${styles.statusLed} ${
                showImage ? styles.statusOn : ""
              }`}
              aria-hidden="true"
            ></span>
          </div>
        </div>

        <div className={styles.listaWrapped}>
          <button
            className={`${styles.listra} ${stripesOn ? styles.stripeOn : ""}`}
          />
          <button
            className={`${styles.listra} ${stripesOn ? styles.stripeOn : ""}`}
          />
        </div>

        <div className={styles.controlGrid}>
          <button
            data-tutorial="small-btn"
            className={styles.smallBtn}
            onClick={handleSmallBtnClick}
          />
          <button
            data-tutorial="rect-btn"
            className={styles.rectBtn}
            onClick={handleRectBtnClick}
          />
          <button
            data-tutorial="dpad"
            className={styles.dpad}
            onClick={() => showImage && setShowPokemonCard((prev) => !prev)}
            disabled={!showImage}
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.hinge}></div>

      {/* ====== DIREITA ====== */}
      <div className={styles.rightPanel}>
        <div className={styles.topDisplay}>
          <span
            className={`${styles.fade} ${showImage ? styles.show : ""} ${
              styles.time
            }`}
          >
            TIME
          </span>
        </div>

        <div className={styles.keyGrid}>
          {baseList.map((p, i) => (
            <div
              key={i}
              className={`${styles.pokeCell} ${
                !showImage ? styles.pokeCellOff : ""
              }`}
              onClick={() => {
                if (showImage) setShowPokemonCard(true);
              }}
            >
              {showImage ? (
                <>
                  <img src={p.img} alt={p.nome} className={styles.pokeImg} />
                  <span className={styles.pokeName}>{p.nome}</span>
                </>
              ) : (
                <div className={styles.pokePlaceholder}></div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.secondaryControls}>
          <div className={styles.slider}>
            <span
              className={`${styles.fade} ${showImage ? styles.show : ""} ${
                styles.box
              }`}
            >
              BOX
            </span>
          </div>
          <button
            className={styles.greenBtn}
            onClick={() => setShowBox(true)} // 🔥 abre o BOX
          ></button>
        </div>
      </div>

      {/* ====== POPUP DO BOX ====== */}
      {showBox && (
        <div className={styles.modalOverlay} onClick={() => setShowBox(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <span className={styles.modalTitle}>BOX</span>
              <button
                className={styles.modalClose}
                onClick={() => setShowBox(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.boxGrid}>
              {boxPokemons.map((p, i) => (
                <div
                  key={i}
                  className={styles.pokeCell}
                  onClick={() => {
                    setShowBox(false);
                    setShowPokemonCard(true);
                  }}
                >
                  <img src={p.img} alt={p.nome} className={styles.pokeImg} />
                  <span className={styles.pokeName}>{p.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ====== CARDS ====== */}
      {showPokemonCard && (
        <PokemonCard onClose={() => setShowPokemonCard(false)} />
      )}
      {showTrainerCard && (
        <TrainerCard
          treinador={treinador}
          fechar={() => setShowTrainerCard(false)}
          salvar={salvarTreinador}
        />
      )}
    </div>
  );
}
