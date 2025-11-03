"use client";
import React, { useState, useEffect } from "react";
import { TemplateMain } from "@/app/components/Template";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  importCsv,
  exportCsv,
  getUserByEmail,
  User,
} from "@/resources/users/users.service";

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"ATIVO" | "INATIVO">("ATIVO");
  const [file, setFile] = useState<File | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailBusca, setEmailBusca] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<User | null>(null);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    const lista = await getAllUsers();
    setUsers(lista);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ nome, email, status });
      alert("Usuário cadastrado com sucesso!");
      setNome("");
      setEmail("");
      carregarUsuarios();
    } catch (err) {
      alert("Erro ao cadastrar usuário.");
      console.error(err);
    }
  };

  const handleBuscarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBusca) {
      alert("Por favor, insira um email para buscar.");
      return;
    }
    try {
      const usuario = await getUserByEmail(emailBusca);
      if (usuario) {
        setUsuarioEncontrado(usuario);
        alert("Usuário encontrado!");
      } else {
        alert("Usuário não encontrado.");
      }
    } catch (err) {
      alert("Erro ao buscar usuário.");
      console.error(err);
    }
  };

  const handleDelete = async (email: string) => {
    if (confirm("Deseja realmente excluir este usuário?")) {
      await deleteUser(email);
      carregarUsuarios();
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingUser) {
      try {
        await updateUser(editingUser.email, {
          nome: editingUser.nome,
          email: editingUser.email,
          status: editingUser.status,
        });
        alert("Usuário atualizado com sucesso!");
        setIsModalOpen(false);
        setEditingUser(null);
        carregarUsuarios();
      } catch (err) {
        alert("Erro ao atualizar usuário.");
        console.error(err);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleImport = async () => {
    if (!file) {
      alert("Selecione um arquivo CSV primeiro!");
      return;
    }
    await importCsv(file);
    alert("Usuários importados com sucesso!");
    carregarUsuarios();
  };

  const handleExport = async () => {
    await exportCsv();
  };

  return (
    <TemplateMain>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Cadastros
        </h1>

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-700">Cadastrar Novo Usuário</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className=" mt-1 block w-full border text-gray-700 border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" mt-1 block w-full border text-gray-700 border-gray-300 rounded-md shadow-sm p-2"
                placeholder="email@exemplo.com"
                required
              />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "ATIVO" | "INATIVO")}
              className="border p-2 rounded bg-green-400 text-white"
            >
              <option value="ATIVO">ATIVO</option>
              <option value="INATIVO">INATIVO</option>
            </select>

            <button
              type="submit"
              className="bg-linear-to-r font-bold from-emerald-900 via-teal-600 to-green-400 text-white px-6 py-2 rounded"
            >
              Cadastrar Usuário
            </button>
          </div>

          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="mt-4 text-gray-500"
          />
          <button
            onClick={handleImport}
            type="button"
            className="ml-4 font-bold bg-linear-to-r from-emerald-900 via-teal-600 to-green-400 text-white px-6 py-2 rounded"
          >
            Importar Usuarios
          </button>
        </form>

        <form onSubmit={handleBuscarUsuario} className="space-y-4 mb-6">
          <div className=" bg-white rounded-lg shadow-md px-3 py-2 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label htmlFor="emailBusca" className="block text-sm font-medium text-gray-700">
                <h2 className="text-lg font-bold">Buscar por Email</h2>
              </label>
              <input
                type="email"
                id="emailBusca"
                value={emailBusca}
                onChange={(e) => setEmailBusca(e.target.value)}
                className=" mt-1 block w-full border text-gray-700 border-gray-300 rounded-md shadow-sm p-2"
                placeholder="Digite o email do usuário"
              />
            </div>

            <button
              type="submit"
              className="bg-linear-to-r from-emerald-900 via-teal-600 to-green-400 text-white font-bold py-2 px-4 rounded-md shadow-sm transition-colors"
            >
              Procurar Usuário
            </button>
            <button
              type="button"
              onClick={() => {
                setUsuarioEncontrado(null);
                carregarUsuarios();
              }}
              className="bg-linear-to-r from-emerald-900 via-teal-600 to-green-400 text-white font-bold py-2 px-4 rounded-md shadow-sm transition-colors"
            >
              Mostrar Todos
            </button>
          </div>
        </form>
        <h2 className="text-lg font-bold  shadow-md mb-4 text-gray-800">Lista de Usuários</h2>
        <div className="max-h-96 overflow-y-auto border rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="sticky top-0 z-30 bg-linear-to-r from-emerald-900 via-teal-600 to-green-400 text-white">
              <tr>
                <th className=" px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                <th className=" px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                <th className=" px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className=" px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data Criação</th>
                <th className=" px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {(usuarioEncontrado ? [usuarioEncontrado] : users).map((user) => (
                <tr key={user.email}>
                  <td className="px-6 py-4">{user.nome}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.status}</td>
                  <td className="px-6 py-4">
                    {user.dataCriacao ? new Date(user.dataCriacao).toLocaleDateString("pt-BR") : "N/A"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.email)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-4">
          <button
            onClick={handleExport}
            className="bg-linear-to-r from-emerald-900 via-teal-600 to-green-400 text-white px-6 py-2 rounded"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Usuário</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={editingUser.nome}
                  onChange={(e) => setEditingUser({ ...editingUser, nome: e.target.value })}
                  className="border p-2 rounded w-full text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="border p-2 rounded w-full text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value as "ATIVO" | "INATIVO",
                    })
                  }
                  className="border p-2 rounded w-full bg-green-400 text-white"
                >
                  <option value="ATIVO">ATIVO</option>
                  <option value="INATIVO">INATIVO</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </TemplateMain>
  );
}
