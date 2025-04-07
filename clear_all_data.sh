#!/bin/bash

set -e  # Encerra o script se qualquer comando falhar

echo "🛑 Parando e removendo containers..."
docker-compose down -v

echo "🧹 Removendo volume do PostgreSQL (pgdata)..."
docker volume rm my_postgres_pgdata || echo "Volume já removido ou não encontrado."

echo "🚀 Subindo containers novamente..."
docker-compose up -d

echo "✅ Ambiente resetado com sucesso!"
