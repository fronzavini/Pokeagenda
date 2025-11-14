import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Sistema Pokémon</h1>
        <p className="text-lg text-gray-700 mb-6">
          Bem-vindo ao sistema de gerenciamento de Pokémons.
        </p>
        <p className="text-gray-600">
          Utilize o menu para acessar as funções de cadastro, edição, listagem e remoção.
        </p>
      </div>
    </main>
  );
}

export default App
