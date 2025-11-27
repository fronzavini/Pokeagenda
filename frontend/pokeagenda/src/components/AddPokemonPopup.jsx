// src/components/AddPokemonPopup.jsx
import { useState } from "react";
import styles from "../styles/Popup.module.css";

export default function AddPokemonPopup({ fechar, onAdd }) {
  const [nome, setNome] = useState("");
  const [img, setImg] = useState("");

  const salvar = () => {
    if (!nome) return;
    onAdd({ id: Date.now(), nome, img });
    fechar();
  };

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <h2>Novo Pokémon</h2>

        <input
          type="text"
          placeholder="Nome do Pokémon"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="text"
          placeholder="URL da imagem"
          value={img}
          onChange={(e) => setImg(e.target.value)}
        />

        <div className={styles.buttons}>
          <button onClick={salvar}>Salvar</button>
          <button onClick={fechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
