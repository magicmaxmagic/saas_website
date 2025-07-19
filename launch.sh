#!/bin/bash

# Script de démarrage automatique SIT Innovation
# Usage: ./launch.sh [commande]

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_DIR"

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions d'affichage
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Vérification Ansible
check_ansible() {
    if ! command -v ansible-playbook &> /dev/null; then
        error "Ansible n'est pas installé. Installez avec: pip install ansible"
    fi
}

# Vérification et configuration Docker
setup_docker() {
    # Ajout du PATH Docker si nécessaire
    if ! command -v docker &> /dev/null; then
        if [ -d "/Applications/Docker.app/Contents/Resources/bin" ]; then
            export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"
            info "Docker ajouté au PATH"
        else
            error "Docker n'est pas installé ou introuvable"
        fi
    fi
    
    # Vérification que Docker est démarré
    if ! docker info &> /dev/null; then
        info "Démarrage de Docker..."
        open -a Docker
        info "Attente du démarrage de Docker (30s)..."
        sleep 30
        
        # Vérification après attente
        if ! docker info &> /dev/null; then
            error "Docker n'a pas pu être démarré"
        fi
    fi
    
    success "Docker est prêt"
}

# Fonction d'aide
show_help() {
    echo -e "${BLUE}🚀 SIT Innovation - Système de déploiement automatisé${NC}"
    echo ""
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  start          - Démarrage automatique complet"
    echo "  stop           - Arrêt automatique (préserve les données)"
    echo "  restart        - Redémarrage automatique"
    echo "  status         - Affichage du statut"
    echo "  logs           - Affichage des logs"
    echo "  stop-apps      - Arrêt des applications seulement"
    echo "  stop-full      - Arrêt complet avec suppression des données"
    echo "  install        - Installation des dépendances"
    echo "  build          - Build des applications"
    echo "  help           - Affichage de cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 start       # Démarrage automatique complet"
    echo "  $0 stop        # Arrêt sécurisé"
    echo "  $0 restart     # Redémarrage"
    echo "  $0 status      # Vérification du statut"
}

# Fonction de démarrage automatique
start_system() {
    info "🚀 Démarrage automatique du système SIT Innovation..."
    check_ansible
    setup_docker
    ansible-playbook -i ansible/inventory.yml ansible/start.yml
}

# Fonction d'arrêt automatique
stop_system() {
    info "🛑 Arrêt automatique du système SIT Innovation..."
    check_ansible
    ansible-playbook -i ansible/inventory.yml ansible/auto-stop.yml
}

# Fonction de redémarrage
restart_system() {
    info "🔄 Redémarrage du système SIT Innovation..."
    stop_system
    sleep 3
    start_system
}

# Fonction de statut
show_status() {
    info "📊 Vérification du statut du système..."
    check_ansible
    ansible-playbook -i ansible/inventory.yml ansible/status.yml
}

# Fonction d'affichage des logs
show_logs() {
    info "📋 Logs disponibles:"
    echo ""
    if [ -f logs/backend.log ]; then
        echo -e "${BLUE}=== Backend Log (dernières 20 lignes) ===${NC}"
        tail -n 20 logs/backend.log
        echo ""
    fi
    if [ -f logs/frontend.log ]; then
        echo -e "${BLUE}=== Frontend Log (dernières 20 lignes) ===${NC}"
        tail -n 20 logs/frontend.log
        echo ""
    fi
}

# Fonction d'arrêt des applications seulement
stop_apps() {
    info "🛑 Arrêt des applications seulement..."
    check_ansible
    ansible-playbook -i ansible/inventory.yml ansible/stop-apps.yml
}

# Fonction d'arrêt complet avec suppression
stop_full() {
    warning "⚠️  ATTENTION : Cette action va supprimer toutes les données !"
    warning "Utilisez 'stop' pour un arrêt sécurisé sans perte de données."
    echo ""
    read -p "Tapez 'SUPPRIMER' pour confirmer la suppression des données : " confirmation
    if [ "$confirmation" = "SUPPRIMER" ]; then
        check_ansible
        ansible-playbook -i ansible/inventory.yml ansible/stop-full.yml
    else
        info "Opération annulée."
    fi
}

# Fonction d'installation
install_deps() {
    info "📦 Installation des dépendances..."
    check_ansible
    ansible-playbook -i ansible/inventory.yml ansible/install.yml
}

# Fonction de build
build_apps() {
    info "🔨 Build des applications..."
    check_ansible
    ansible-playbook -i ansible/inventory.yml ansible/auto-start.yml --tags build
}

# Vérification des arguments
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# Traitement des commandes
case "$1" in
    start)
        start_system
        ;;
    stop)
        stop_system
        ;;
    restart)
        restart_system
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    stop-apps)
        stop_apps
        ;;
    stop-full)
        stop_full
        ;;
    install)
        install_deps
        ;;
    build)
        build_apps
        ;;
    help)
        show_help
        ;;
    *)
        error "Commande inconnue: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
            error "Docker n'est pas installé. Installez Docker Desktop depuis https://www.docker.com/products/docker-desktop/"
        fi
    fi
    
    # Vérification que Docker est démarré
    if ! docker ps &> /dev/null; then
        warning "Docker n'est pas démarré. Démarrage de Docker Desktop..."
        open -a Docker
        info "Attente du démarrage de Docker (30 secondes)..."
        sleep 30
        
        # Vérification après attente
        if ! docker ps &> /dev/null; then
            error "Docker n'est toujours pas démarré. Démarrez manuellement Docker Desktop et réessayez."
        fi
    fi
    
    success "Docker est prêt"
}

# Affichage de l'aide
show_help() {
    echo "🚀 SIT Innovation - Déploiement automatique"
    echo ""
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  start     Démarrage complet (par défaut)"
    echo "  custom    Déploiement personnalisé (choix interactif)"
    echo "  dev       Déploiement développement (sans Docker)"
    echo "  stop      Arrêt sécurisé (préserve les données)"
    echo "  stop-apps Arrêt des applications seulement"
    echo "  destroy   Arrêt complet avec suppression des données"
    echo "  restart   Redémarrage"
    echo "  status    Statut des services"
    echo "  logs      Affichage des logs"
    echo "  vault     Déploiement Vault uniquement"
    echo "  recreate  Recréation complète (⚠️ EFFACE TOUTES LES DONNÉES)"
    echo "  help      Affichage de cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0              # Démarrage complet"
    echo "  $0 start        # Démarrage complet"
    echo "  $0 custom       # Déploiement personnalisé"
    echo "  $0 dev          # Déploiement développement"
    echo "  $0 stop         # Arrêt complet"
    echo "  $0 status       # Vérification du statut"
    echo ""
    echo "🔒 Sécurité des données:"
    echo "  - 'stop' met en pause les conteneurs (données préservées)"
    echo "  - 'destroy' supprime tout (utiliser avec précaution)"
    echo "  - Les conteneurs existants sont préservés au démarrage"
    echo "  - Utilisez 'recreate' uniquement pour repartir de zéro"
    echo ""
    echo "Options de déploiement personnalisé:"
    echo "  - Choisir de déployer Vault ou non"
    echo "  - Choisir de déployer l'infrastructure (PostgreSQL, Redis, Nginx)"
    echo "  - Choisir de déployer les applications (Backend, Frontend)"
}

# Fonction principale
main() {
    local command="${1:-start}"
    
    case "$command" in
        start)
            info "Démarrage complet de SIT Innovation..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/deploy-full.yml
            success "Démarrage terminé ! 🎉"
            echo ""
            info "URLs disponibles:"
            echo "  - Application: http://localhost"
            echo "  - Vault: http://localhost:8200"
            echo "  - Backend: http://localhost:4000"
            echo "  - Frontend: http://localhost:3000"
            ;;
        custom)
            info "Déploiement personnalisé de SIT Innovation..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/deploy-custom.yml
            success "Déploiement personnalisé terminé ! 🎉"
            echo ""
            info "Vérifiez les URLs affichées dans le résumé ci-dessus"
            ;;
        dev)
            info "Déploiement développement (sans Docker)..."
            check_ansible
            # Pas besoin de Docker pour le mode dev
            ansible-playbook -i ansible/inventory.yml ansible/deploy-dev.yml
            success "Déploiement développement terminé ! 🎉"
            echo ""
            info "Applications démarrées en mode développement"
            ;;
        stop)
            info "Arrêt sécurisé de SIT Innovation (données préservées)..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/stop-safe.yml
            success "Arrêt sécurisé terminé ! �"
            ;;
        stop-apps)
            info "Arrêt des applications (préservation des services Docker)..."
            check_ansible
            ansible-playbook -i ansible/inventory.yml ansible/stop-apps.yml
            success "Applications arrêtées ! 🔧"
            ;;
        destroy)
            info "Arrêt complet avec suppression des données..."
            warning "ATTENTION : Cette opération va supprimer TOUTES les données !"
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/stop-full.yml
            success "Arrêt complet terminé ! 🛑"
            ;;
        restart)
            info "Redémarrage de SIT Innovation..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/restart.yml
            success "Redémarrage terminé ! 🔄"
            ;;
        status)
            info "Vérification du statut..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/status.yml
            ;;
        logs)
            info "Affichage des logs..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/logs.yml
            ;;
        vault)
            info "Déploiement Vault uniquement..."
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/deploy-vault.yml
            success "Vault déployé ! 🔐"
            ;;
        recreate)
            info "Recréation complète des services..."
            warning "ATTENTION : Cette opération va supprimer TOUTES les données !"
            check_ansible
            setup_docker
            ansible-playbook -i ansible/inventory.yml ansible/recreate.yml
            exit_code=$?
            if [ $exit_code -eq 0 ]; then
                success "Services recréés ! Toutes les données ont été effacées. 🔄"
            else
                error "Erreur lors de la recréation"
                exit $exit_code
            fi
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            error "Commande inconnue: $command"
            show_help
            ;;
    esac
}

# Exécution
main "$@"
