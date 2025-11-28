import React from "react";
import Pokedex from "./components/pokedex";
import Botao from "./components/Botao";
import "./App.css";

function App() {
  const nome = "Manuela";

  return (
    <div className="app">
      <div className="left-button">
        <Botao />
      </div>
      <h1 className="titulo">Bem-vindo à Pokédex, {nome}!</h1>

      <Pokedex />
    </div>
  );
}

export default App;
