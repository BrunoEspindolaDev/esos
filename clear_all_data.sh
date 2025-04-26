#!/bin/bash

set -e  

echo "🛑 Parando e removendo containers..."
docker-compose down -v

echo "🧹 Removendo dados persistentes dos bancos..."
rm -rf ./data/chat/*
rm -rf ./data/moderation/*
rm -rf ./data/keycloak/*
rm -rf ./data/rabbitmq/*  

echo "🚀 Subindo containers novamente..."
docker-compose up -d

echo "✅ Ambiente resetado com sucesso!"