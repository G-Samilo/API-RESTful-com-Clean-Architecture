const TaskModel = require('../database/TaskModel');

class TarefaRepository {
  // 1. Criar tarefa
  async criar(dadosTarefa) {
    const novaTarefa = await TaskModel.create(dadosTarefa);
    return novaTarefa.toJSON();
  }

  // 2. Buscar por ID
  async buscarPorId(id) {
    const tarefa = await TaskModel.findByPk(id);
    return tarefa ? tarefa.toJSON() : null;
  }

  // 3. Listar todas as tarefas
  async listarTodas() {
    const tarefas = await TaskModel.findAll();
    return tarefas.map(t => t.toJSON());
  }

  // 4. Atualizar tarefa
  async atualizar(id, novosDados) {
    await TaskModel.update(novosDados, { where: { id } });
    return this.buscarPorId(id);
  }

  // 5. Excluir tarefa
  async deletar(id) {
    return await TaskModel.destroy({ where: { id } });
  }

  // Método específico: contar quantas tarefas "EM_ANDAMENTO" o usuário possui
  async contarEmAndamentoPorUsuario(userId) {
    return await TaskModel.count({
      where: {
        userId: userId,
        status: 'EM_ANDAMENTO'
      }
    });
  }
}

module.exports = TarefaRepository;