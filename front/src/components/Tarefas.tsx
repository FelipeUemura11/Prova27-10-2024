import React, { useState, useEffect } from "react";
import axios from "axios";

const Tarefas: React.FC = () => {
  const [tarefas, setTarefas] = useState<TarefasForm[]>([]);
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [CategoriaId, setCategoriaId] = useState<string>("");  
  const [Status, setStatus] = useState<string>("");
  const [editandoId, setEditandoId] = useState<number | null>(null);


  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      const response = await axios.get<TarefasForm[]>("http://localhost:3000/api/tarefas/listar");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
    try {
      const response = await axios.get<TarefasForm[]>("http://localhost:3000/api/tarefas/naoconcluidas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
    try {
      const response = await axios.get<TarefasForm[]>("http://localhost:5000/api/tarefas/concluidas");
      setTarefas(response.data);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editandoId !== null) {
        await axios.put(`http://localhost:5000/api/tarefas/alterar/${editandoId}`, { titulo, descricao, CategoriaId, Status });
      } else {
        await axios.post("http://localhost:5000/api/tarefas/cadastra", { titulo, descricao, CategoriaId, Status });
      }

      carregarTarefas();
      setTitulo("");
      setDescricao("");
      setCategoriaId("");
      setStatus("");
      setEditandoId(null);
    } catch (error) {
      console.error("Erro ao salvar Tarefa:", error);
    }
  };

  const handleEdit = (id: number) => {
    const tarefa = tarefas.find((func) => func.id === id);
    if (tarefa) {
      setTitulo(tarefa.titulo);
      setDescricao(tarefa.descricao);
      setCategoriaId(tarefa.CategoriaId);
      setStatus(tarefa.Status);
      setEditandoId(id);
    }
  };

  return (
    <div>
      <h1> // TAREFAS // </h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Titulo:
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Descricao:
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            CategoriaId:
            <input
              type="text"
              value={CategoriaId}
              onChange={(e) => setCategoriaId((e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input
              type="text"
              value={Status}
              onChange={(e) => setStatus(e.target.value)}
              required
            />
          </label>
        </div>
        <button type="submit">{editandoId !== null ? "Editar" : "Adicionar"}</button>
        {editandoId !== null && (
          <button type="button" onClick={() => setEditandoId(null)}>
            Cancelar
          </button>
        )}
      </form>

      <h2>Lista de Tarefas</h2>
      {tarefas.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>titulo</th>
              <th>descricao</th>
              <th>CategoriaId</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map((t) => (
              <tr key={t.id}>
                <td>{t.titulo}</td>
                <td>{t.descricao}</td>
                <td>{t.CategoriaId}</td>
                <td>{t.Status}</td>
                <td>
                  <button onClick={() => handleEdit(t.id)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p> // Nenhuma Tarefa cadastrada. //</p>
      )}
    </div>
  );
};

export default Tarefas;
