const express = require('express');
const sequelize = require('./infrastructure/database/database');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');

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

//Importa Validações
const { validate, userSchema, taskSchema } = require('./interfaces/middlewares/validations');

const app = express();
app.use(express.json());

// Middleware do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

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
app.post('/usuarios', validate(userSchema), (req, res) => {
  /* 
    #swagger.tags = ['Usuários']
    #swagger.description = 'Rota para a criação de um novo usuário.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Dados necessários para a criação do usuário.',
        required: true,
        schema: { nome: "João da Silva", email: "joao.silva@email.com" }
    }
    #swagger.responses[400] = { description: 'Bad Request.' }
  */
  return userController.criar(req, res);
});

// Rotas de Tarefas
app.post('/tarefas', validate(taskSchema), (req, res) => {
  /* 
    #swagger.tags = ['Tarefas']
    #swagger.description = 'Cria uma nova tarefa.'
    #swagger.parameters['body'] = {
        in: 'body',
        description: 'Corpo da requisição contendo os dados da tarefa.',
        required: true,
        schema: { titulo: "Implementar documentação", descricao: "Usar Swagger e Zod na API", usuarioId: 1 }
    }
    #swagger.responses[400] = { description: 'Bad Request.' }
  */
  return taskController.criar(req, res);
});

app.get('/tarefas', (req, res) => {
  // #swagger.tags = ['Tarefas']
  return taskController.listar(req, res);
});

app.put('/tarefas/:id', (req, res) => {
  // #swagger.tags = ['Tarefas']
  return taskController.atualizar(req, res);
});

app.delete('/tarefas/:id', (req, res) => {
  // #swagger.tags = ['Tarefas']
  return taskController.excluir(req, res);
});

app.post('/tarefas/:id/iniciar', (req, res) => {
  /* 
    #swagger.tags = ['Tarefas']
    #swagger.description = 'Altera o status de uma tarefa para EM_ANDAMENTO.'
    #swagger.responses[200] = { description: 'Tarefa iniciada com sucesso.' }
    #swagger.responses[400] = { description: 'Retornado quando o usuário atinge o limite máximo de 5 tarefas com status EM_ANDAMENTO.' }
  */
  return taskController.iniciar(req, res);
});

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