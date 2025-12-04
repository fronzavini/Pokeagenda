import React, { useState } from "react";
import Pokedex from "./components/Pokedex";
import Botao from "./components/Botao";
import Tutorial from "./components/Tutorial";
import "./App.css";


function App() {
 
  const [tutorialActive, setTutorialActive] = useState(false);

  const steps = [
    {
      id: "tutorial-btn",
      selector: '[data-tutorial="tutorial-btn"]',
      text: "Clique para reabrir este tutorial.",
    },
    {
      id: "trainer-select",
      selector: '[data-tutorial="trainer-select"]',
      text: 'Selecione quem está usando a Pokédex. Use "+ Novo Treinador" para cadastrar um novo.',
    },

    {
      id: "camera",
      selector: '[data-tutorial="camera"]',
      text: "Liga/desliga a Pokédex, mostrando os Pokémon do time.",
    },
    {
      id: "lights",
      selector: '[data-tutorial="lights"]',
      text: "Luzes mudam com a Pokédex ligada e o botão de efeito.",
    },
    {
      id: "screen",
      selector: '[data-tutorial="screen"]',
      text: "Mostra a foto do treinador selecionado.",
    },
    {
      id: "small-btn",
      selector: '[data-tutorial="small-btn"]',
      text: "Botão pequeno: altera as luzes quando ligada.",
    },
    {
      id: "rect-btn",
      selector: '[data-tutorial="rect-btn"]',
      text: "Botão das listras: ativa efeitos visuais no visor.",
    },
    {
      id: "edit-trainer-btn",
      selector: '[data-tutorial="edit-trainer-btn"]',
      text: "Botão de editar treinador: abre os dados do treinador atual para visualizar e editar.",
    },
    {
      id: "dpad",
      selector: '[data-tutorial="dpad"]',
      text: "D-Pad: abre o cadastro de Pokémon para o treinador atual.",
    },
    {
      id: "key-grid",
      selector: '[data-tutorial="key-grid"]',
      text: "Aqui aparecem os 6 Pokémon do TIME quando a Pokédex está ligada.",
    },
    {
      id: "box-btn",
      selector: '[data-tutorial="box-btn"]',
      text: "Botão BOX: abre a Box com todos os Pokémons do treinador.",
    },
  ];

  return (
    <div className="app">
      <div className="left-button" data-tutorial="tutorial-btn">
        <Botao onClick={() => setTutorialActive((s) => !s)} />
      </div>
      <div className="app">
        <h1 className="titulo">Bem-vindo à Pokédex!</h1>
      </div>
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