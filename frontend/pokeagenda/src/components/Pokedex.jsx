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

  const salvarTreinador = (dados) => {
    // envia os dados do treinador para o backend
    try {
      fetch("http://localhost:5000/criar_treinador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      })
        .then((res) => res.json())
        .then((json) => {
          console.log("Resposta do backend (criar_treinador):", json);
          // feedback visual opcional
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

  const handleCameraClick = () => {
    setShowImage((prev) => !prev);
    // Se desligar a câmera, também apaga as listras
    if (showImage) {
      setStripesOn(false);
      setLightsOn(false);
    }
  };

  const handleSmallBtnClick = () => {
    if (showImage) setLightsOn((prev) => !prev);
  };

  const handleRectBtnClick = () => {
    if (showImage) setStripesOn((prev) => !prev);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPanel}>
        <div className={styles.topRow}>
          <button
            data-tutorial="camera"
            className={`${styles.camera} ${
              showImage ? styles.cameraActive : ""
            }`}
            onClick={handleCameraClick}
          ></button>

          <div data-tutorial="lights" className={styles.lights}>
            <span
              className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`}
            ></span>
            <span
              className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`}
            ></span>
            <span
              className={`${styles.light} ${lightsOn ? styles.lightOn : ""}`}
            ></span>
          </div>
        </div>

        <div data-tutorial="screen" className={styles.mainScreen}>
          <div className={styles.screenInner}>
            {showImage && (
              <img
                src="https://m.media-amazon.com/images/I/41Jw-Dom9zL._AC_SY350_.jpg"
                alt="Treinador"
                className={styles.screenImage}
              />
            )}
          </div>
        </div>

        <div className={styles.listaWrapped}>
          <button
            className={`${styles.listra} ${stripesOn ? styles.stripeOn : ""}`}
          ></button>
          <button
            className={`${styles.listra} ${stripesOn ? styles.stripeOn : ""}`}
          ></button>
        </div>

        <div className={styles.controlGrid}>
          <button
            data-tutorial="small-btn"
            className={styles.smallBtn}
            onClick={handleSmallBtnClick}
          ></button>
          <button
            data-tutorial="rect-btn"
            className={styles.rectBtn}
            onClick={handleRectBtnClick}
          ></button>
          <button
            data-tutorial="dpad"
            className={styles.dpad}
            onClick={() => {
              if (showImage) setShowPokemonCard((prev) => !prev);
            }}
            disabled={!showImage} // opcional para desabilitar visualmente
          >
            +
          </button>
        </div>
      </div>

      <div className={styles.hinge}></div>

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
          <button className={styles.keyCell}></button>
          <button className={styles.keyCell}></button>
          <button className={styles.keyCell}></button>
          <button className={styles.keyCell}></button>
          <button className={styles.keyCell}></button>
          <button className={styles.keyCell}></button>
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
          <button className={styles.greenBtn}></button>
        </div>

        <div className={styles.bottomSlots}>
          <button
            data-tutorial="slot-1"
            className={styles.slot}
            onClick={() => {
              if (showImage) setShowTrainerCard(true);
            }}
          ></button>

          <button data-tutorial="slot-2" className={styles.slot}></button>
        </div>
      </div>
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
