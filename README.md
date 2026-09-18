# API Gerenciador de Tarefas - Clean Architecture

DUPLA: Eric Matheus da Silva Temoteo & Gabriel Samilo Pinto de Oliveira

API RESTful para gerenciamento de tarefas e usuários, desenvolvida em **Node.js** com **Express**, **Sequelize** e **SQLite**, aplicando os princípios da **Arquitetura Limpa (Clean Architecture)** e **Regra de Dependência**. 

Nesta segunda fase, a API foi evoluída para incluir **Documentação Interativa (Swagger)** e **Validação de Dados (Zod)**.

---

## Funcionalidades

- **Usuários:**
  - Cadastro de usuários.
- **Tarefas:**
  - Criação de tarefas associadas a um usuário.
  - Listagem geral de tarefas.
  - Atualização do título/conteúdo da tarefa.
  - Remoção de tarefas.
  - Transição de status da tarefa (`PENDENTE` -> `EM_ANDAMENTO` -> `CONCLUIDA`) com regras de domínio.
  - **Regra de Negócio:** Bloqueio automático caso o usuário tente colocar uma 6ª tarefa em status `EM_ANDAMENTO`.
- **Segurança e Padronização:**
  - Validação estrutural de dados de entrada via middlewares utilizando **Zod**.
- **Documentação:**
  - Documentação automatizada e interface gráfica interativa gerada pelo **Swagger UI** (acessível na rota `/api-docs`).

---

## Arquitetura do Projeto

A estrutura segue rigorosamente a separação de responsabilidades e a Regra de Dependência:

```text
src/
├── domain/            # Camada de Domínio: Regras de negócio puras (Entities)
│   └── entities/
├── application/       # Camada de Aplicação: Casos de uso (Services - SRP)
│   └── services/
├── infrastructure/    # Camada de Infraestrutura: Conexão com SQLite e Repositórios
│   ├── database/
│   └── repositories/
└── interfaces/        # Camada de Interfaces: Controllers HTTP e Middlewares
    ├── controllers/
    └── middlewares/   # Interceptadores (ex: Validação do Zod)
