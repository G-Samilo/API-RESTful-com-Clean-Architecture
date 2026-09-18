const { z } = require('zod');

// Schema de Usuário: nome mínimo 3 letras e email válido[cite: 1]
const userSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Formato de e-mail inválido")
});

// Schema de Tarefa (título obrigatório)[cite: 1, 2]
const taskSchema = z.object({
  titulo: z.string().min(1, "O título é obrigatório"),
  descricao: z.string().optional(),
  usuarioId: z.number()
});

// Middleware de validação genérico[cite: 1]
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body); // Passa o corpo da requisição pelo validador[cite: 1]
    next(); // Se passar, envia o fluxo ao Controller[cite: 1]
  } catch (error) {
    // Se falhar, retorna 400 Bad Request com os campos inválidos[cite: 1]
    res.status(400).json({ 
        mensagem: "Erro de validação estrutural", 
        erros: error.errors 
    });
  }
};

module.exports = { userSchema, taskSchema, validate };