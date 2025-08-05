import { useState } from "react";
import "./App.css"; // Vamos criar este arquivo

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Popup da Extensão</h1>
        <p>Você clicou {count} vezes</p>
        <button onClick={() => setCount((count) => count + 1)}>
          Clique aqui
        </button>
      </header>
    </div>
  );
}

export default App;
