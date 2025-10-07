// Importação das dependências necessárias
const express = require('express');     // Framework web para Node.js - cria o servidor HTTP
const next = require('next');          // Framework React - para renderização e roteamento
const cors = require('cors');          // Middleware para permitir requisições de diferentes origens
const fs = require('fs');             // Sistema de ficheiros do Node.js - para ler/escrever arquivos

// Configuração do Next.js
const dev = process.env.NODE_ENV !== 'production';  // Verifica se está em modo desenvolvimento
const nextApp = next({ dev });                      // Cria instância do Next.js
const handle = nextApp.getRequestHandler();         // Handler para processar rotas do Next.js

// Criação da aplicação Express
const app = express();

// Configuração dos middlewares
app.use(cors());           // Permite requisições de qualquer origem (frontend pode aceder à API)
app.use(express.json());   // Permite processar JSON no body das requisições POST/PUT

// ===== BASE DE DADOS LOCAL =====
// Ficheiro JSON que funciona como base de dados simples
const DB_FILE = './db.json';

// Função para ler tarefas do ficheiro JSON
function carregarTarefas() {
  if (!fs.existsSync(DB_FILE)) return [];                    // Se ficheiro não existe, retorna array vazio
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); // Lê e converte JSON para objeto
  return data.tarefas || [];                                 // Retorna array de tarefas ou array vazio
}

// Função para guardar tarefas no ficheiro JSON
function guardarTarefas(tarefas) {
  const data = { tarefas };                                   // Cria objeto com array de tarefas
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));   // Escreve no ficheiro com formatação (2 espaços)
}

// ===== ROTAS DA API REST =====

// GET /api/tarefas - Buscar todos os tarefas
app.get('/api/tarefas', (req, res) => {
  res.json(carregarTarefas());  // Retorna todos os tarefas em formato JSON
});

// GET /api/tarefas/:id - Buscar tarefa específico por ID
app.get('/api/tarefa/:id', (req, res) => {
  const tarefas = carregarTarefas();                               // Carrega todos os tarefas
  const tarefa = tarefas.find(p => p.id === parseInt(req.params.id)); // Procura tarefa pelo ID
  if (!tarefa) return res.status(404).json({ erro: 'Tarefa não encontrada' }); // Se não encontrar, retorna erro 404
  res.json(tarefa);  // Retorna o tarefa encontrado
});

// POST /api/tarefas - Criar nova tarefa
app.post('/api/tarefas', (req, res) => {
  const tarefas = carregarTarefas();                        // Carrega tarefas existentes
  const { nome } = req.body;        // Extrai dados do body da requisição
  
  // Cria nov tarefa com ID auto-incrementado
  const novoTarefa = {
    id: tarefas.length ? tarefas[tarefas.length - 1].id + 1 : 1,  // ID = último ID + 1, ou 1 se for o primeiro
    nome,
    checked: false,      // Converte string para número decimal
  };
  
  tarefas.push(novoTarefa);      // Adiciona ao array
  guardarTarefas(tarefas);       // Guarda no ficheiro
  res.status(201).json(novoTarefa); // Retorna tarefa criado com status 201 (Created)
});

// PUT /api/tarefas/:id - Atualizar tarefa existente
app.put('/api/tarefa/:id', (req, res) => {
  const tarefas = carregarTarefas();                                    // Carrega todos os tarefas
  const index = tarefas.findIndex(p => p.id === parseInt(req.params.id)); // Encontra índice do tarefa
  if (index === -1) return res.status(404).json({ erro: 'Tarefa não encontrado' }); // Se não encontrar, erro 404
  
  // Atualiza tarefa mantendo dados originais + dados novos (spread operator)
  tarefas[index] = { ...tarefas[index], ...req.body };
  
  guardarTarefas(tarefas);       // Guarda alterações no ficheiro
  res.json(tarefas[index]);       // Retorna tarefa atualizado
});

// DELETE /api/tarefas/:id - Eliminar tarefa
app.delete('/api/tarefa/:id', (req, res) => {
  let tarefas = carregarTarefas();                                      // Carrega todos os tarefas
  const index = tarefas.findIndex(p => p.id === parseInt(req.params.id)); // Encontra índice do tarefa
  if (index === -1) return res.status(404).json({ erro: 'Tarefa não encontrada' }); // Se não encontrar, erro 404
  
  tarefas.splice(index, 1);         // Remove tarefa do array (splice remove 1 elemento no índice)
  guardarTarefas(tarefas);         // Guarda array atualizado no ficheiro
  res.json({ mensagem: 'Tarefa eliminado com sucesso' }); // Confirma eliminação
});

// ===== INTEGRAÇÃO NEXT.JS + EXPRESS =====

// Middleware que passa todas as rotas não-API para o Next.js
// Qualquer rota que não seja /api/* será processada pelo Next.js (páginas React)
app.use((req, res) => {
  return handle(req, res);  // Next.js processa a rota e renderiza a página correspondente
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====

const PORT = process.env.PORT || 3000;  // Usa porta do ambiente ou 3000 por defeito

// Prepara o Next.js e depois inicia o servidor Express
nextApp.prepare().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor Next.js + Express a correr em http://localhost:${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}/api/tarefas`);
  });
});