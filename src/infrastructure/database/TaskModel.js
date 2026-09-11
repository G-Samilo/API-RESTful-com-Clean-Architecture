const { DataTypes } = require('sequelize');
const sequelize = require('./database');
const UserModel = require('./UserModel');

const TaskModel = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'),
    defaultValue: 'PENDENTE' // Exigência: status padrão PENDENTE
  }
});

// Relacionamento: Um Usuário tem muitas Tarefas, e a Tarefa pertence a um Usuário
UserModel.hasMany(TaskModel, { foreignKey: 'userId' });
TaskModel.belongsTo(UserModel, { foreignKey: 'userId' }); // Exigência: Chave estrangeira para usuário

module.exports = TaskModel;