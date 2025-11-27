import React from "react";
import styles from "../styles/Pokedex.module.css";

export default function Pokedex() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.leftPanel}>
        <div className={styles.topRow}>
          <button className={styles.camera}></button>

          <div className={styles.lights}>
            <span className={styles.light}></span>
            <span className={styles.light}></span>
            <span className={styles.light}></span>
          </div>
        </div>

        <div className={styles.mainScreen}>
          <div className={styles.screenInner}>
            <img
              src="https://m.media-amazon.com/images/I/41Jw-Dom9zL._AC_SY350_.jpg"
              alt="Treinador"
              className={styles.screenImage}
            />
          </div>
        </div>

        <div className={styles.listaWrapped}>
          <button className={styles.listra}></button>
          <button className={styles.listra}></button>
        </div>

        <div className={styles.controlGrid}>
          <button className={styles.smallBtn}></button>
          <button className={styles.rectBtn}></button>
          <button className={styles.dpad}>+</button>
        </div>
      </div>

      <div className={styles.hinge}></div>

      <div className={styles.rightPanel}>
        <div className={styles.topDisplay}></div>

        <div className={styles.keyGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <button key={i} className={styles.keyCell}></button>
          ))}
        </div>

        <div className={styles.secondaryControls}>
          <button className={styles.slider}></button>
          <button className={styles.greenBtn}></button>
        </div>

        <div className={styles.bottomSlots}>
          <button className={styles.slot}></button>
          <button className={styles.slot}></button>
        </div>
      </div>
    </div>
  );
}
