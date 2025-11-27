import React, { useState } from "react";
import styles from "../styles/Pokedex.module.css";
import PokemonCard from "./PokemonCard";

export default function Pokedex() {
  const [showImage, setShowImage] = useState(false);
  const [lightsOn, setLightsOn] = useState(false);
  const [stripesOn, setStripesOn] = useState(false);
  const [showPokemonCard, setShowPokemonCard] = useState(false);

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
            className={`${styles.camera} ${
              showImage ? styles.cameraActive : ""
            }`}
            onClick={handleCameraClick}
          ></button>

          <div className={styles.lights}>
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

        <div className={styles.mainScreen}>
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
            className={styles.smallBtn}
            onClick={handleSmallBtnClick}
          ></button>
          <button
            className={styles.rectBtn}
            onClick={handleRectBtnClick}
          ></button>
          <button
            className={styles.dpad}
            onClick={() => setShowPokemonCard((prev) => !prev)}
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
          <button className={styles.slot}></button>
          <button className={styles.slot}></button>
        </div>
      </div>
      {showPokemonCard && (
        <PokemonCard onClose={() => setShowPokemonCard(false)} />
      )}
    </div>
  );
}
