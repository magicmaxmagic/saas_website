#!/bin/bash
# Script de démarrage complet

set -e

echo "🚀 Démarrage de l'application SIT Inov..."

# Variables
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$PROJECT_DIR/apps/frontend"
BACKEND_DIR="$PROJECT_DIR/apps/backend"

# Fonction de nettoyage
cleanup() {
    echo "🧹 Nettoyage des processus..."
    pkill -f "next" || true
    pkill -f "nestjs" || true
    pkill -f "npm" || true
    docker-compose down || true
}

# Trap pour le nettoyage
trap cleanup EXIT

# Vérification des dépendances
echo "📦 Vérification des dépendances..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Installation des dépendances
echo "📥 Installation des dépendances..."
npm install

# Démarrage des services Docker
echo "🐳 Démarrage des services Docker..."
docker-compose up -d postgres redis

# Attente des services
echo "⏳ Attente des services..."
sleep 10

# Migration de la base de données
echo "🗄️ Migration de la base de données..."
cd "$BACKEND_DIR"
npm run prisma:generate
npm run prisma:deploy

# Démarrage du backend
echo "🔧 Démarrage du backend..."
npm run start:dev &
BACKEND_PID=$!

# Attente du backend
echo "⏳ Attente du backend..."
sleep 10

# Démarrage du frontend
echo "🎨 Démarrage du frontend..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# Attente du frontend
echo "⏳ Attente du frontend..."
sleep 10

echo "✅ Application démarrée avec succès!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:3001"
echo "🗄️ Base de données: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo ""
echo "📊 Monitoring des processus..."
echo "Frontend PID: $FRONTEND_PID"
echo "Backend PID: $BACKEND_PID"
echo ""
echo "Appuyez sur Ctrl+C pour arrêter tous les services..."

# Attente indéfinie
wait
