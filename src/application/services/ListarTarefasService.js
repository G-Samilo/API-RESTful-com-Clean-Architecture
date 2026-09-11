class ListarTarefasService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository;
  }

  async executar() {
    return await this.tarefaRepository.listarTodas();
  }
}

module.exports = ListarTarefasService;