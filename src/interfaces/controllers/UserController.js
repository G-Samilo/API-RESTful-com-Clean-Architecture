const UserModel = require('../../infrastructure/database/UserModel');

class UserController {
  // Criar um usuário simples para podermos vincular às tarefas
  async criar(req, res) {
    try {
      const { nome, email } = req.body;
      const usuario = await UserModel.create({ nome, email });
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(400).json({ erro: error.message });
    }
  }
}

module.exports = UserController;