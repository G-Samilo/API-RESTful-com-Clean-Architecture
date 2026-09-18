class TaskController {
  constructor({
    criarTarefaService,
    listarTarefasService,
    atualizarTarefaService,
    excluirTarefaService,
    iniciarTarefaService
  }) {
    this.criarTarefaService = criarTarefaService;
    this.listarTarefasService = listarTarefasService;
    this.atualizarTarefaService = atualizarTarefaService;
    this.excluirTarefaService = excluirTarefaService;
    this.iniciarTarefaService = iniciarTarefaService;
  }

  async criar(req, res) {
    /* 
      #swagger.tags = ['Tarefas']
      #swagger.description = 'Cria uma nova tarefa.'
      
      #swagger.parameters['body'] = {
          in: 'body',
          description: 'Corpo da requisição contendo os dados da tarefa.',
          required: true,
          schema: {
              titulo: "Implementar documentação",
              descricao: "Usar Swagger e Zod na API",
              usuarioId: 1
          }
      }

      #swagger.responses[201] = { 
          description: 'Tarefa criada com sucesso.' 
      }
      
      #swagger.responses[400] = { 
          description: 'Bad Request devido à falha de validação estrutural ou regra de negócio.' 
      }
    */
    try {
      const tarefa = await this.criarTarefaService.executar(req.body);
      return res.status(201).json(tarefa);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async listar(req, res) {
    /* 
      #swagger.tags = ['Tarefas']
      #swagger.description = 'Lista todas as tarefas cadastradas no sistema.'
    */
    try {
      const tarefas = await this.listarTarefasService.executar();
      return res.status(200).json(tarefas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    /* 
      #swagger.tags = ['Tarefas']
      #swagger.description = 'Atualiza os dados de uma tarefa existente.'
    */
    try {
      const { id } = req.params;
      const tarefa = await this.atualizarTarefaService.executar(id, req.body);
      return res.status(200).json(tarefa);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async excluir(req, res) {
    /* 
      #swagger.tags = ['Tarefas']
      #swagger.description = 'Exclui uma tarefa do banco de dados.'
    */
    try {
      const { id } = req.params;
      await this.excluirTarefaService.executar(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async iniciar(req, res) {
    /* 
      #swagger.tags = ['Tarefas']
      #swagger.description = 'Altera o status de uma tarefa para EM_ANDAMENTO.'
      
      #swagger.responses[200] = {
          description: 'Tarefa iniciada com sucesso.'
      }
      
      #swagger.responses[400] = {
          description: 'Retornado quando o usuário atinge o limite máximo de 5 tarefas com status EM_ANDAMENTO.'
      }
    */
    try {
      const { id } = req.params;
      const tarefa = await this.iniciarTarefaService.executar(id);
      return res.status(200).json(tarefa);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

module.TaskController = TaskController;
module.exports = TaskController;