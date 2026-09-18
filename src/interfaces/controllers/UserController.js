const UserModel = require('../../infrastructure/database/UserModel');

class UserController {
  // Criar um usuário simples para podermos vincular às tarefas
  async criar(req, res) {
    /* 
      #swagger.tags = ['Usuários']
      #swagger.summary = 'Cria um novo usuário'
      #swagger.description = 'Rota para a criação de um novo usuário.'
      
      #swagger.parameters['user'] = {
          in: 'body',
          description: 'Dados necessários para a criação do usuário.',
          required: true,
          schema: {
              type: 'object',
              properties: {
                  nome: { type: 'string', example: 'João da Silva' },
                  email: { type: 'string', example: 'joao.silva@email.com' }
              },
              required: ['nome', 'email']
          }
      }

      #swagger.responses[201] = { 
          description: 'Usuário criado com sucesso.' 
      }
      
      #swagger.responses[400] = { 
          description: 'Bad Request devido à falha de validação estrutural (Zod/Joi) ou erro ao salvar no banco.' 
      }
    */
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