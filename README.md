# Instructions

Consider the following instructions to run the project

## Technologies

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Knex.js](https://knexjs.org/)
- [Docker](https://www.docker.com/)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BrunoEspindolaDev/websocket-server-ms-workshop.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start Docker containers:

   ```bash
   docker-compose -f docker-compose.dev.yml up --build -d
   ```

4. Access the service and start it with the command:
   ```bash
   yarn start
   ```

### Docker

This project uses Docker Compose with separate files for different environments.

#### Development

For development with hot-reload and debug tools:

```bash
# Start complete development environment
docker-compose -f docker-compose.dev.yml up --build

# Start in background
docker-compose -f docker-compose.dev.yml up --build -d

# View logs of a specific service
docker-compose -f docker-compose.dev.yml logs -f chat-service
```

#### Production

For production with optimizations and without development tools:

```bash
# Start complete production environment
docker-compose -f docker-compose.prod.yml up --build -d

# Stop all services
docker-compose -f docker-compose.prod.yml down
```

#### Automated Cleanup Script

To facilitate complete environment cleanup, use the `clear_all_data.sh` script:

```bash
# Complete cleanup of development environment
./clear_all_data.sh dev

# Complete cleanup of production environment
./clear_all_data.sh prod

# The script will:
# 1. Stop and remove all containers
# 2. Remove volumes and persistent data
# 3. Clean unused images
# 4. Ask if you want to restart the environment
```

#### Useful Commands

```bash
# Rebuild only one service
docker-compose -f docker-compose.dev.yml build chat-service

# Execute command inside a container
docker-compose -f docker-compose.dev.yml exec chat-service npm test

# View container status
docker-compose -f docker-compose.dev.yml ps

# Clean volumes and containers
docker-compose -f docker-compose.dev.yml down -v
docker system prune -f

# Infrastructure only (databases, keycloak, rabbitmq)
docker-compose -f docker-compose.dev.yml up chat_db moderation_db logs_db keycloak_db keycloak rabbitmq

# Specific build with custom Dockerfile
docker build -f chat/Dockerfile -t chat-dev ./chat
docker build -f chat/Dockerfile.prod -t chat-prod ./chat

# Check differences between environments
diff docker-compose.dev.yml docker-compose.prod.yml
```

#### File Structure

```
├── clear_all_data.sh           # Automated cleanup script
├── docker-compose.dev.yml      # Complete Development environment
├── docker-compose.prod.yml     # Complete Production environment
├── chat/
│   ├── Dockerfile              # Chat - Container build
│   └── .dockerignore
├── logs/
│   ├── Dockerfile              # Logs - Container build
│   └── .dockerignore
└── moderator/
    ├── Dockerfile              # Moderator - Container build
    └── .dockerignore
```

#### Service Ports

| Service               | Development | Production | Description         |
| --------------------- | ----------- | ---------- | ------------------- |
| Chat Service          | 5000        | 5000       | Chat API            |
| Moderator Service     | 5001        | 5001       | Moderation API      |
| Logs Service          | 5002        | 5002       | Logs API            |
| Keycloak              | 8080        | 8080       | Authentication      |
| RabbitMQ Management   | 15672       | 15672      | RabbitMQ Interface  |
| PostgreSQL Chat       | 5432        | 5432       | Chat Database       |
| PostgreSQL Moderation | 5433        | 5433       | Moderation Database |
| PostgreSQL Logs       | 5434        | 5434       | Logs Database       |
| PostgreSQL Keycloak   | 5435        | 5435       | Keycloak Database   |

### Knex

This project uses **Knex.js** to manage migrations and interact with the database.

### Create a new migration

```bash
npx knex migrate:make [migration name] --knexfile src/config/knexfile.js
```

### Execute all pending migrations

```bash
npx knex migrate:latest --knexfile src/config/knexfile.js
```
