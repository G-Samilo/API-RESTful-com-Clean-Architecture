const Task = require('../../domain/entities/Task');

class IniciarTarefaService {
  constructor(tarefaRepository) {
    this.tarefaRepository = tarefaRepository;
  }

  async executar(id) {
    // 1. Busca a tarefa
    const dadosTarefa = await this.tarefaRepository.buscarPorId(id);
    if (!dadosTarefa) {
      throw new Error('Tarefa não encontrada.');
    }

    // 2. Regra das 5 tarefas: Conta quantas já estão em andamento
    const quantidadeEmAndamento = await this.tarefaRepository.contarEmAndamentoPorUsuario(dadosTarefa.userId);
    
    if (quantidadeEmAndamento >= 5) {
      throw new Error('Limite atingido: O usuário já possui 5 tarefas EM_ANDAMENTO.'); // Exigência de bloqueio
    }

    // 3. Invoca o método da entidade para alterar o status
    const tarefa = new Task(dadosTarefa);
    tarefa.iniciar(); // Muda o status para EM_ANDAMENTO com segurança

    // 4. Manda o repositório salvar o novo status
    return await this.tarefaRepository.atualizar(id, { status: tarefa.status });
  }
}

module.exports = IniciarTarefaService;