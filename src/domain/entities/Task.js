class Task {
  constructor({ id, titulo, descricao, status, userId }) {
    // Validação obrigatória: título não pode ser vazio ou nulo
    if (!titulo || titulo.trim() === '') {
      throw new Error('O título da tarefa é obrigatório.');
    }

    this.id = id;
    this.titulo = titulo;
    this.descricao = descricao;
    this.status = status || 'PENDENTE'; // Status inicial padrão: PENDENTE
    this.userId = userId;
  }

  // Método para iniciar a tarefa
  iniciar() {
    if (this.status !== 'PENDENTE') {
      throw new Error(`Não é possível iniciar uma tarefa que está com status: ${this.status}`);
    }
    this.status = 'EM_ANDAMENTO';
  }

  // Método para concluir a tarefa
  concluir() {
    if (this.status !== 'EM_ANDAMENTO') {
      throw new Error(`Não é possível concluir uma tarefa que está com status: ${this.status}`);
    }
    this.status = 'CONCLUIDA';
  }
}

module.exports = Task;