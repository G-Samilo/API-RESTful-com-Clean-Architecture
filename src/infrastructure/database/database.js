const { Sequelize } = require('sequelize');
const path = require('path');

// Configura o Sequelize para usar SQLite armazenado em um arquivo local
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'database.sqlite'), // Vai criar o arquivo do banco aqui
  logging: false // Desativa o falatório de SQL no terminal
});

module.exports = sequelize;