import React, { useState } from "react";
import Pokedex from "./components/pokedex";
import Botao from "./components/Botao";
import Tutorial from "./components/Tutorial";
import "./App.css";

function App() {
  const nome = "Manuela";
  const [tutorialActive, setTutorialActive] = useState(false);

  const steps = [
    { id: "camera", selector: '[data-tutorial="camera"]', text: "Câmera: liga/desliga a pokedex." },
    { id: "lights", selector: '[data-tutorial="lights"]', text: "Luzes: alterna as luzes coloridas quando a câmera está ligada." },
    { id: "screen", selector: '[data-tutorial="screen"]', text: "Tela: mostra a foto do treinador." },
    { id: "small-btn", selector: '[data-tutorial="small-btn"]', text: "Botão pequeno: altera o efeito de luz quando a câmera está ligada." },
    { id: "rect-btn", selector: '[data-tutorial="rect-btn"]', text: "Botão retangular: alterna as listras na tela." },
    { id: "dpad", selector: '[data-tutorial="dpad"]', text: "D-Pad: abre o cadastro do Pokémon quando a câmera está ligada." },
    { id: "slot-1", selector: '[data-tutorial="slot-1"]', text: "Slot: abre o cadastro do treinador ao clicar neste slot." },
    { id: "key-grid", selector: '[data-tutorial="key-grid"]', text: "Teclas: representam atalhos (adicione funcionalidades se desejar)." },
  ];

  return (
    <div className="app">
      <div className="left-button">
        <Botao onClick={() => setTutorialActive((s) => !s)} />
      </div>
      <h1 className="titulo">Bem-vindo à Pokédex, {nome}!</h1>

      <Pokedex />

      <Tutorial
        steps={steps}
        active={tutorialActive}
        onClose={() => setTutorialActive(false)}
      />
    </div>
  );
}

export default App;
