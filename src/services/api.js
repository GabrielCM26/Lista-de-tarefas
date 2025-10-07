// Buscar todos os tarefas
export async function buscarTarefasAPI() {
  try {
    const response = await fetch('/api/tarefas')
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao carregar tarefas')
    }
    
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Erro ao carregar tarefas:', error)
    throw error
  }
}

// Buscar tarefa por ID
export async function buscarTarefaPorIdAPI(id) {
  try {
    const response = await fetch(`/api/tarefas/${id}`)
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao carregar tarefa')
    }
    
    const data = await response.json()
    return data

  } catch (error) {
    console.error('Erro ao carregar tarefa:', error)
    throw error
  }
}

// Adicionar novo tarefa
export async function adicionarTarefaAPI(dadosTarefa) {
  try {
    const response = await fetch('/api/tarefas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosTarefa)
    })

    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao adicionar tarefa')
    }
    
    const resultado = await response.json()
    return resultado

  } catch (error) {
    console.error('Erro ao adicionar tarefa:', error)
    throw error
  }
}

// Atualizar tarefa existente
export async function atualizarTarefaAPI(id, dadosTarefa) {
  try {
    const response = await fetch(`/api/tarefas/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosTarefa)
    })

    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao atualizar tarefa')
    }
    
    const resultado = await response.json()
    return resultado

  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error)
    throw error
  }
}

// Eliminar tarefa
export async function eliminarTarefaAPI(id) {
  try {
    const response = await fetch(`/api/tarefa/${id}`, { 
      method: 'DELETE' 
    })
    
    if (!response.ok) {
      console.error('Erro na resposta:', response.status, response.statusText)
      throw new Error('Erro ao eliminar tarefa')
    }

    return true

  } catch (error) {
    console.error('Erro ao eliminar tarefa:', error)
    throw error
  }
}
