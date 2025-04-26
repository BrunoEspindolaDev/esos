#!/bin/bash

set -e  # Encerra o script se qualquer comando falhar

echo "🛑 Parando e removendo containers..."
docker-compose down -v

echo "🧹 Removendo dados persistentes dos bancos..."
rm -rf ./data/chat/*
rm -rf ./data/moderation/*
rm -rf ./data/keycloak/*

echo "🚀 Subindo containers novamente..."
docker-compose up -d

echo "✅ Ambiente resetado com sucesso!"
