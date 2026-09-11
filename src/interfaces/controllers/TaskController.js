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
    try {
      const tarefa = await this.criarTarefaService.executar(req.body);
      return res.status(201).json(tarefa);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async listar(req, res) {
    try {
      const tarefas = await this.listarTarefasService.executar();
      return res.status(200).json(tarefas);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const tarefa = await this.atualizarTarefaService.executar(id, req.body);
      return res.status(200).json(tarefa);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;
      await this.excluirTarefaService.executar(id);
      return res.status(204).send();
    } catch (error) {
      return res.status(404).json({ erro: error.message });
    }
  }

  async iniciar(req, res) {
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