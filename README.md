# Instruções

Considere as seguintes instruções para executar o projeto

## 📦 Tecnologias

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Knex.js](https://knexjs.org/)
- [Docker](https://www.docker.com/)

## 🚀 Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/BrunoEspindolaDev/websocket-server-ms-workshop.git
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Suba os containers do Docker:
   ```bash
   docker-compose up -d
   ```

4. Acesse o serviço e o inicie com o comando:
   ```bash
   yarn start
   ```
   
## 🛠 Knex

Este projeto utiliza o **Knex.js** para gerenciar as migrations e interagir com o banco de dados.

### Criar uma nova migration

```bash
npx knex migrate:make [nome da migration] --knexfile src/config/knexfile.js
```

### Executar todas as migrations pendentes

```bash
npx knex migrate:latest --knexfile src/config/knexfile.js
```
