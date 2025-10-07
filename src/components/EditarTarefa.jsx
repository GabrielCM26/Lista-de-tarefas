import { useState, useEffect } from 'react'
import { atualizarTarefaAPI } from '@/services/api'

export default function EditarTarefa({ isOpen, onClose, onSuccess, tarefa }) {
  const [formData, setFormData] = useState({
    nome: '',
    status: false
  })

  useEffect(() => {
    if (tarefa) {
      setFormData({
        nome: tarefa.nome || '',
        status: tarefa.status || false
      })
    }
  }, [tarefa])

  function handleChange(e) {
    const { name, type, checked, value } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      await atualizarTarefaAPI(tarefa.id, formData)
      alert('Tarefa atualizada com sucesso!')
      onSuccess()
      onClose()
    } catch (error) {
      alert('Erro ao atualizar tarefa')
    }
  }

  function handleClose() {
    setFormData({ nome: '', status: false })
    onClose()
  }

  if (!isOpen || !tarefa) return null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">✏️ Editar tarefa</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nome" className="block text-sm font-medium text-black mb-2">
              Nome da tarefa
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={tarefa.nome}
            />
          </div>

          <div>
            <label htmlFor="status" className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Tarefa concluída</span>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex-1">
              Atualizar
            </button>

            <button type="button" onClick={handleClose} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex-1">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
