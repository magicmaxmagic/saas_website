# SIT Innovation - Déploiement Automatique

## 🚀 Démarrage rapide

```bash
# Démarrage complet (Docker requis)
./launch.sh

# Déploiement personnalisé (choix interactif)
./launch.sh custom

# Déploiement développement (sans Docker)
./launch.sh dev
```

## 📋 Options de déploiement

| Commande | Description | Prérequis |
|----------|-------------|-----------|
| `./launch.sh start` | Démarrage complet avec Docker | Docker + Docker Compose |
| `./launch.sh custom` | Déploiement personnalisé | Docker + Docker Compose |
| `./launch.sh dev` | Développement sans Docker | Node.js + npm |
| `./launch.sh stop` | Arrêt complet | Docker |
| `./launch.sh status` | Statut des services | Docker |
| `./launch.sh logs` | Logs des services | Docker |
| `./launch.sh vault` | Vault uniquement | Docker |

## 🔧 Configuration Docker

### ⚠️ Note importante
Les vérifications Docker sont **désactivées par défaut** dans les playbooks Ansible. 

### Pour activer les vérifications Docker
Décommentez les lignes suivantes dans `ansible/checks.yml` :
```yaml
# Vérification Docker (optionnel - décommentez si nécessaire)
- name: Vérification Docker
  command: docker --version
  register: docker_version
  failed_when: docker_version.rc != 0

- name: Vérification Docker Compose
  command: docker-compose --version
  register: compose_version
  failed_when: compose_version.rc != 0
```

### Compatibilité Docker Compose
Les playbooks supportent automatiquement :
- `docker compose` (Docker Compose v2)
- `docker-compose` (Docker Compose v1)

## 🎯 Déploiement personnalisé

```bash
./launch.sh custom
```

Vous serez invité à choisir :
- **Déployer Vault** : Gestion des secrets
- **Déployer l'infrastructure** : PostgreSQL, Redis, Nginx
- **Déployer les applications** : Backend, Frontend

## 🛠️ Mode développement

```bash
./launch.sh dev
```

**Avantages :**
- Pas besoin de Docker
- Rechargement automatique du code
- Logs en temps réel
- Débogage facilité

**Prérequis :**
- PostgreSQL et Redis déjà démarrés
- Node.js et npm installés

## 🔐 Accès aux services

- **Application principale**: http://localhost
- **Frontend**: http://localhost:3000  
- **Backend API**: http://localhost:4000
- **Vault**: http://localhost:8200 (Token: `myroot`)

## 🛠️ Architecture

### Services déployés
- **PostgreSQL** (5432): Base de données principale
- **Redis** (6379): Cache et sessions
- **Vault** (8200): Gestion des secrets
- **Backend** (4000): API NestJS
- **Frontend** (3000): Interface Next.js
- **Nginx** (80): Proxy et load balancer

### Ansible Playbooks
- `deploy-full.yml`: Déploiement complet
- `stop-full.yml`: Arrêt complet  
- `restart.yml`: Redémarrage
- `status.yml`: Vérification du statut
- `logs.yml`: Affichage des logs
- `vault.yml`: Déploiement Vault

## 🔧 Configuration

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Ansible (`pip install ansible`)

### Variables d'environnement
Les secrets sont gérés automatiquement par Vault :
- Base de données: `secret/database/development`
- Redis: `secret/redis/development`
- JWT: `secret/jwt/development`
- NextAuth: `secret/nextjs/development`

## 🐳 Docker

### Conteneurs créés
- `postgres`: Base de données PostgreSQL
- `redis`: Cache Redis
- `vault`: HashiCorp Vault
- `backend`: API NestJS
- `frontend`: Interface Next.js
- `nginx`: Reverse proxy

### Volumes persistants
- `postgres-data`: Données PostgreSQL
- `vault-data`: Données Vault

## 🔍 Dépannage

### Vérification rapide
```bash
./launch.sh status
```

### Consultation des logs
```bash
./launch.sh logs
```

### Redémarrage en cas de problème
```bash
./launch.sh restart
```

### Arrêt complet
```bash
./launch.sh stop
```

## 📁 Structure du projet

```
sit_inov_website/
├── launch.sh              # Script de démarrage
├── docker-compose.yml     # Configuration Docker
├── nginx.conf             # Configuration Nginx
├── redis.conf             # Configuration Redis
├── ansible/               # Playbooks Ansible
│   ├── deploy-full.yml    # Déploiement complet
│   ├── stop-full.yml      # Arrêt complet
│   ├── restart.yml        # Redémarrage
│   ├── status.yml         # Statut
│   ├── logs.yml           # Logs
│   └── vault.yml          # Vault
├── apps/
│   ├── backend/           # API NestJS
│   └── frontend/          # Interface Next.js
└── vault-ansible/         # Configuration Vault
```

## 🎯 Workflow de développement

1. **Démarrage**: `./launch.sh start`
2. **Développement**: Les applications sont accessibles via les URLs listées
3. **Tests**: Vérification avec `./launch.sh status`
4. **Logs**: Consultation avec `./launch.sh logs`
5. **Arrêt**: `./launch.sh stop`

## 🔒 Sécurité

- Secrets gérés par HashiCorp Vault
- Authentification JWT
- Isolation des services via Docker
- Configuration sécurisée par défaut

## 📊 Monitoring

- Health checks automatiques
- Logs centralisés
- Statut des services en temps réel
- Alertes en cas d'erreur

---

**Prêt à démarrer ?** 🚀

```bash
./launch.sh
```
