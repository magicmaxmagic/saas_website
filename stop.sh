#!/bin/bash
# Script d'arrêt complet

set -e

echo "🛑 Arrêt de l'application SIT Inov..."

# Variables
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Arrêt des processus Node.js
echo "🔧 Arrêt des processus Node.js..."
pkill -f "next" || true
pkill -f "nestjs" || true
pkill -f "npm run dev" || true
pkill -f "npm run start:dev" || true

# Arrêt des services Docker
echo "🐳 Arrêt des services Docker..."
cd "$PROJECT_DIR"
docker-compose down || true

# Nettoyage des ports
echo "🧹 Nettoyage des ports..."
lsof -ti:3000 | xargs kill -9 || true
lsof -ti:3001 | xargs kill -9 || true
lsof -ti:5432 | xargs kill -9 || true
lsof -ti:6379 | xargs kill -9 || true

# Nettoyage des volumes Docker (optionnel)
read -p "Voulez-vous supprimer les volumes Docker ? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗑️ Suppression des volumes Docker..."
    docker-compose down -v || true
    docker system prune -f || true
fi

echo "✅ Application arrêtée avec succès!"
