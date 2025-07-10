#!/bin/bash

set -e

# Verificar se o ambiente foi especificado
ENVIRONMENT=${1:-dev}

if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "prod" ]]; then
    echo "❌ Ambiente inválido. Use: dev ou prod"
    echo "Uso: $0 [dev|prod]"
    echo "Exemplo: $0 dev"
    exit 1
fi

COMPOSE_FILE="docker-compose.${ENVIRONMENT}.yml"

echo "🔧 Ambiente selecionado: $ENVIRONMENT"
echo "📁 Arquivo compose: $COMPOSE_FILE"

# Verificar se o arquivo compose existe
if [[ ! -f "$COMPOSE_FILE" ]]; then
    echo "❌ Arquivo $COMPOSE_FILE não encontrado!"
    exit 1
fi

echo "🛑 Parando e removendo containers ($ENVIRONMENT)..."
sudo docker-compose -f "$COMPOSE_FILE" down -v 2>/dev/null || true

echo "🧹 Removendo dados persistentes dos bancos..."
sudo rm -rf ./data/chat/* 2>/dev/null || true
sudo rm -rf ./data/moderation/* 2>/dev/null || true
sudo rm -rf ./data/logs/* 2>/dev/null || true
sudo rm -rf ./data/keycloak/* 2>/dev/null || true
sudo rm -rf ./data/rabbitmq/* 2>/dev/null || true

echo "🧽 Limpando volumes Docker órfãos..."
sudo docker volume prune -f

echo "🗑️ Removendo imagens não utilizadas..."
sudo docker image prune -f

# Perguntar se deseja subir novamente
read -p "�� Deseja subir o ambiente $ENVIRONMENT novamente? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Subindo containers ($ENVIRONMENT)..."
    sudo docker-compose -f "$COMPOSE_FILE" up --build -d
    
    echo "📊 Status dos containers:"
    sudo docker-compose -f "$COMPOSE_FILE" ps
else
    echo "ℹ️ Containers não foram iniciados."
    echo "Para iniciar manualmente: sudo docker-compose -f $COMPOSE_FILE up --build -d"
fi

echo "✅ Limpeza do ambiente $ENVIRONMENT concluída!"
