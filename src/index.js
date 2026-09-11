const express = require('express');
const sequelize = require('./infrastructure/database/database');

// Importa Repositório
const TarefaRepository = require('./infrastructure/repositories/TarefaRepository');

// Importa Serviços
const CriarTarefaService = require('./application/services/CriarTarefaService');
const ListarTarefasService = require('./application/services/ListarTarefasService');
const AtualizarTarefaService = require('./application/services/AtualizarTarefaService');
const ExcluirTarefaService = require('./application/services/ExcluirTarefaService');
const IniciarTarefaService = require('./application/services/IniciarTarefaService');

// Importa Controladores
const UserController = require('./interfaces/controllers/UserController');
const TaskController = require('./interfaces/controllers/TaskController');

const app = express();
app.use(express.json());

// --- INJEÇÃO DE DEPENDÊNCIAS MANUAL ---
const tarefaRepository = new TarefaRepository();

const criarTarefaService = new CriarTarefaService(tarefaRepository);
const listarTarefasService = new ListarTarefasService(tarefaRepository);
const atualizarTarefaService = new AtualizarTarefaService(tarefaRepository);
const excluirTarefaService = new ExcluirTarefaService(tarefaRepository);
const iniciarTarefaService = new IniciarTarefaService(tarefaRepository);

const userController = new UserController();
const taskController = new TaskController({
  criarTarefaService,
  listarTarefasService,
  atualizarTarefaService,
  excluirTarefaService,
  iniciarTarefaService
});

// --- MAPEAMENTO DE ROTAS ---

// Rotas de Usuário
app.post('/usuarios', (req, res) => userController.criar(req, res));

// Rotas de Tarefas
app.post('/tarefas', (req, res) => taskController.criar(req, res));
app.get('/tarefas', (req, res) => taskController.listar(req, res));
app.put('/tarefas/:id', (req, res) => taskController.atualizar(req, res));
app.delete('/tarefas/:id', (req, res) => taskController.excluir(req, res));
app.post('/tarefas/:id/iniciar', (req, res) => taskController.iniciar(req, res));

const PORT = 3000;

async function bootstrap() {
  try {
    await sequelize.sync();
    console.log('Banco de dados sincronizado com sucesso!');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no banco de dados:', error);
  }
}

bootstrap();