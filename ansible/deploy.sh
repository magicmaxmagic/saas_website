#!/bin/bash
# Script de déploiement Ansible

set -e

echo "🚀 Déploiement SIT Inov avec Ansible..."

# Variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ANSIBLE_DIR="$SCRIPT_DIR"
PLAYBOOK="deploy.yml"
INVENTORY="inventory.yml"
ENVIRONMENT=${1:-development}

# Vérification des paramètres
if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: $0 <environment>"
    echo "Environments: development, staging, production"
    exit 1
fi

# Vérification des prérequis
if ! command -v ansible-playbook &> /dev/null; then
    echo "❌ Ansible n'est pas installé"
    echo "Installation: pip install ansible"
    exit 1
fi

# Vérification des fichiers
if [ ! -f "$ANSIBLE_DIR/$PLAYBOOK" ]; then
    echo "❌ Playbook non trouvé: $PLAYBOOK"
    exit 1
fi

if [ ! -f "$ANSIBLE_DIR/$INVENTORY" ]; then
    echo "❌ Inventaire non trouvé: $INVENTORY"
    exit 1
fi

# Configuration Ansible
export ANSIBLE_HOST_KEY_CHECKING=False
export ANSIBLE_STDOUT_CALLBACK=yaml
export ANSIBLE_FORCE_COLOR=true

# Fonction de nettoyage
cleanup() {
    echo "🧹 Nettoyage des fichiers temporaires..."
    rm -f "$ANSIBLE_DIR/deploy.retry"
}

# Trap pour le nettoyage
trap cleanup EXIT

# Vérification de la connexion
echo "🔍 Vérification de la connexion aux hôtes..."
ansible-playbook -i "$ANSIBLE_DIR/$INVENTORY" \
    --limit "$ENVIRONMENT" \
    -m ping \
    all

# Affichage des informations
echo "📋 Informations de déploiement:"
echo "- Environnement: $ENVIRONMENT"
echo "- Playbook: $PLAYBOOK"
echo "- Inventaire: $INVENTORY"
echo "- Répertoire: $ANSIBLE_DIR"

# Confirmation
if [ "$ENVIRONMENT" = "production" ]; then
    echo "⚠️  ATTENTION: Déploiement en PRODUCTION"
    read -p "Êtes-vous sûr de vouloir continuer ? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Déploiement annulé"
        exit 1
    fi
fi

# Exécution du playbook
echo "🎯 Déploiement en cours..."
ansible-playbook -i "$ANSIBLE_DIR/$INVENTORY" \
    --limit "$ENVIRONMENT" \
    -v \
    "$ANSIBLE_DIR/$PLAYBOOK"

# Vérification post-déploiement
echo "🔍 Vérification post-déploiement..."
ansible-playbook -i "$ANSIBLE_DIR/$INVENTORY" \
    --limit "$ENVIRONMENT" \
    -m shell \
    -a "systemctl status sit_inov_website-backend sit_inov_website-frontend nginx postgresql redis vault" \
    all

echo "✅ Déploiement terminé avec succès!"
echo ""
echo "🌐 Services disponibles:"
case "$ENVIRONMENT" in
    "production")
        echo "- Frontend: https://app.example.com"
        echo "- API: https://api.example.com"
        echo "- Vault: https://vault.example.com:8200"
        ;;
    "staging")
        echo "- Frontend: https://staging.example.com"
        echo "- API: https://api-staging.example.com"
        echo "- Vault: https://vault-staging.example.com:8200"
        ;;
    "development")
        echo "- Frontend: http://localhost:3000"
        echo "- API: http://localhost:3001"
        echo "- Vault: http://localhost:8200"
        ;;
esac

echo ""
echo "📊 Logs des services:"
echo "- Backend: journalctl -u sit_inov_website-backend -f"
echo "- Frontend: journalctl -u sit_inov_website-frontend -f"
echo "- Nginx: tail -f /var/log/nginx/sit_inov_website_*.log"
echo "- Vault: journalctl -u vault -f"
