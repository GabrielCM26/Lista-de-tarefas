import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdicionarTarefa from '@/components/AdicionarTarefa'
import EditarTarefa from '@/components/EditarTarefa'
import { buscarTarefasAPI, eliminarTarefaAPI } from '@/services/api'

export default function Tarefas() {
  const [tarefas, setTarefas] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [tarefaToEdit, setTarefaToEdit] = useState(null)

  // Buscar tarefas quando a página abre
  useEffect(() => {
    buscarTarefas()
  }, [])

  // Função para buscar tarefas
  async function buscarTarefas() {
    try {
      const data = await buscarTarefasAPI()
      setTarefas(data)
    } catch (error) {
      alert('Erro ao buscar tarefas')
    }
  }

  async function eliminarTarefa(id) {
    if (confirm('Tens a certeza que queres eliminar este tarefa?')) {
      try {
        await eliminarTarefaAPI(id)
        setTarefas(tarefas.filter(p => p.id !== id))
      } catch (error) {
        alert('Erro ao eliminar tarefa')
      }
    }
  }

  function handleEditTarefa(tarefa) {
    setTarefaToEdit(tarefa)
    setShowEditModal(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🧾 Gestão de tarefas</h1>
          <p className="text-gray-600">Gerencie todos as tarefas da sua lista</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-white border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
          ➕ Adicionar tarefa
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">ID</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Tarefa</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Estado</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tarefas.map(tarefa => (
              <tr key={tarefa.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900">{tarefa.id}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">{tarefa.nome}</td>
                <td className="py-3 px-4 text-blue-600 font-bold">{tarefa.checked}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Link href={`/tarefa/${tarefa.id}`} className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Visalizar tarefa
                    </Link>
                    <button onClick={() => handleEditTarefa(tarefa)} className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Editar
                    </button>
                    <button onClick={() => eliminarTarefa(tarefa.id)} className="bg-white border border-blue-600 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-50">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <AdicionarTarefa
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={buscarTarefas}
      />

      <EditarTarefa
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={buscarTarefas}
        tarefa={tarefaToEdit}
      />
    </div>
  )
}
