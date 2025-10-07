import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { buscarTarefaPorIdAPI } from '@/services/api'

export default function TarefaDetalhes() {
  const router = useRouter()
  const { id } = router.query
  const [tarefa, setTarefa] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarTarefa = async () => {
      if (!id) return
      
      try {
        const data = await buscarTarefaPorIdAPI(id)
        setTarefa(data)
      } catch (error) {
        console.error(error)
        alert('Erro ao carregar tarefa')
      } finally {
        setLoading(false)
      }
    }
    
    carregarTarefa()
  }, [id])

  if (loading) return <div className="text-center">Carregando...</div>
  if (!tarefa) return <div className="text-center">Tarefa não encontrada</div>

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <Link href="/tarefas" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Voltar as Tarefas
      </Link>

      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{tarefa.nome}</h1>
        <p className="text-3xl font-bold text-blue-600 mb-6">{tarefa.checked}</p>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-700">ID da Tarefa: <span className="font-semibold">{tarefa.id}</span></p>
        </div>
      </div>
    </div>
  )
}
