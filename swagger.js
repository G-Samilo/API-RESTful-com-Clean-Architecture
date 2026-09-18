const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: "API de Gerenciamento de Tarefas",
    description: "Documentação automatizada da API de Tarefas",
    version: "1.0.0"
  },
  host: "localhost:3000",
  schemes: ['http']
};

const outputFile = './swagger-output.json';

const endpointsFiles = ['./src/index.js']; 

swaggerAutogen(outputFile, endpointsFiles, doc);