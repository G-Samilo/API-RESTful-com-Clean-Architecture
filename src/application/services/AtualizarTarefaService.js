class AtualizarTarefaService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository;
  }

  async executar(id, novosDados) {
    const tarefaExiste = await this.tarefaRepository.buscarPorId(id);
    if (!tarefaExiste) {
      throw new Error('Tarefa não encontrada para atualização.'); // Exigência do documento
    }
    return await this.tarefaRepository.atualizar(id, novosDados);
  }
}

module.exports = AtualizarTarefaService;