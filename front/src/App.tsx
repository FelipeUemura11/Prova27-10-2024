import React from 'react';
import Home from './components/Home';
import Tarefas from './components/Tarefas';
import {BrowserRouter, Routes, Link, Route} from "react-router-dom"

function App() {
  return (
    <div className="App">
      <h1> Minha Aplicacao Web </h1>
      <BrowserRouter>
      <ul>
        <li><Link to="/"> Pagina Inicial </Link></li>
        <li><Link to="/api/tarefas/cadastrar"> Cadastro Tarefa </Link></li>
      </ul>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/api/tarefas/cadastrar" element={<Tarefas />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
