const Task = require('../../domain/entities/Task');

class CriarTarefaService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository;
  }

  async executar(dados) {
    // Passa pela Entidade para validar (ex: se tem título)
    const tarefa = new Task(dados);
    return await this.tarefaRepository.criar(tarefa);
  }
}

module.exports = CriarTarefaService;