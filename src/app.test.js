const request = require('supertest');
const express = require('express');
const sequelize = require('./infrastructure/database/database');

const TarefaRepository = require('./infrastructure/repositories/TarefaRepository');
const CriarTarefaService = require('./application/services/CriarTarefaService');
const ListarTarefasService = require('./application/services/ListarTarefasService');
const AtualizarTarefaService = require('./application/services/AtualizarTarefaService');
const ExcluirTarefaService = require('./application/services/ExcluirTarefaService');
const IniciarTarefaService = require('./application/services/IniciarTarefaService');

const UserController = require('./interfaces/controllers/UserController');
const TaskController = require('./interfaces/controllers/TaskController');

// Configura o aplicativo Express para os testes
const app = express();
app.use(express.json());

const tarefaRepository = new TarefaRepository();
const userController = new UserController();
const taskController = new TaskController({
  criarTarefaService: new CriarTarefaService(tarefaRepository),
  listarTarefasService: new ListarTarefasService(tarefaRepository),
  atualizarTarefaService: new AtualizarTarefaService(tarefaRepository),
  excluirTarefaService: new ExcluirTarefaService(tarefaRepository),
  iniciarTarefaService: new IniciarTarefaService(tarefaRepository)
});

app.post('/usuarios', (req, res) => userController.criar(req, res));
app.post('/tarefas', (req, res) => taskController.criar(req, res));
app.get('/tarefas', (req, res) => taskController.listar(req, res));
app.put('/tarefas/:id', (req, res) => taskController.atualizar(req, res));
app.delete('/tarefas/:id', (req, res) => taskController.excluir(req, res));
app.post('/tarefas/:id/iniciar', (req, res) => taskController.iniciar(req, res));

beforeAll(async () => {
  // Limpa e sincroniza o banco antes de rodar os testes
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Roteiro de Testes Exigido - Fase 7', () => {
  let userId;
  let taskId;

  // 1. POST: Criação de um usuário válido
  test('1. Deve criar um usuário válido', async () => {
    const res = await request(app)
      .post('/usuarios')
      .send({ nome: 'Aluno Teste', email: 'aluno@teste.com' });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    userId = res.body.id;
  });

  // 2. POST: Criação de tarefas vinculadas a esse usuário
  test('2. Deve criar uma tarefa vinculada ao usuário', async () => {
    const res = await request(app)
      .post('/tarefas')
      .send({ titulo: 'Estudar Clean Arch', descricao: 'Fazer o lab', userId });

    expect(res.status).toBe(201);
    expect(res.body.userId).toBe(userId);
    expect(res.body.status).toBe('PENDENTE');
    taskId = res.body.id;
  });

  // 3. GET: Listagem geral de todas as tarefas
  test('3. Deve listar todas as tarefas cadastradas', async () => {
    const res = await request(app).get('/tarefas');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 4. POST (Regra de Negócio): Mudar status e bloquear na 6ª tarefa
  test('4. Deve iniciar tarefa e bloquear ao tentar iniciar a 6ª', async () => {
    // Inicia a primeira tarefa
    const resInicio = await request(app).post(`/tarefas/${taskId}/iniciar`);
    expect(resInicio.status).toBe(200);
    expect(resInicio.body.status).toBe('EM_ANDAMENTO');

    // Cria mais 4 tarefas e inicia todas (totalizando 5 em andamento)
    for (let i = 2; i <= 5; i++) {
      const t = await request(app)
        .post('/tarefas')
        .send({ titulo: `Tarefa ${i}`, userId });
      await request(app).post(`/tarefas/${t.body.id}/iniciar`);
    }

    // Cria a 6ª tarefa
    const t6 = await request(app)
      .post('/tarefas')
      .send({ titulo: 'Tarefa 6', userId });

    // Tenta iniciar a 6ª -> DEVE SER BARRADO (Status 400)
    const resBloqueio = await request(app).post(`/tarefas/${t6.body.id}/iniciar`);
    expect(resBloqueio.status).toBe(400);
    expect(resBloqueio.body.erro).toContain('Limite atingido');
  });

  // 5. PUT & DELETE: Alterar texto e apagar tarefa
  test('5. Deve alterar texto da tarefa e depois apagar do banco', async () => {
    // PUT: Alterar texto
    const resUpdate = await request(app)
      .put(`/tarefas/${taskId}`)
      .send({ titulo: 'Estudar Clean Arch (Atualizado)' });
    
    expect(resUpdate.status).toBe(200);

    // DELETE: Apagar tarefa
    const resDelete = await request(app).delete(`/tarefas/${taskId}`);
    expect(resDelete.status).toBe(204);
  });
});