class ExcluirTarefaService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository;
  }

  async executar(id) {
    const tarefaExiste = await this.tarefaRepository.buscarPorId(id);
    if (!tarefaExiste) {
      throw new Error('Tarefa não encontrada para exclusão.'); // Exigência do documento
    }
    return await this.tarefaRepository.deletar(id);
  }
}

module.exports = ExcluirTarefaService;