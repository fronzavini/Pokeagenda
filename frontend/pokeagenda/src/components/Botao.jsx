import React from "react";
import styles from "../styles/Botao.module.css";

export default function Botao({ onClick }) {
  return (
    <button className={styles.balao} onClick={onClick}>
      <span>TUTORIAL</span>
      <div className={styles.seta}></div>
    </button>
  );
}
