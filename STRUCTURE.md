# Structure du Projet SIT Inov

## 📁 Architecture Générale

```
sit_inov_website/
├── 📄 Configuration
│   ├── .gitignore                 # Exclusions Git
│   ├── package.json               # Dépendances racine
│   ├── package-lock.json          # Verrous des dépendances
│   ├── docker-compose.yml         # Services Docker
│   ├── nginx.conf                 # Configuration Nginx
│   └── redis.example.conf         # Configuration Redis
│
├── 📚 Documentation
│   ├── README.md                  # Guide principal
│   ├── SETUP.md                   # Installation et configuration
│   ├── DEPLOYMENT.md              # Guide de déploiement
│   ├── SECURITY.md                # Sécurité
│   ├── LICENSE                    # Licence
│   └── STRUCTURE.md               # Ce fichier
│
├── 🏗️ Applications
│   ├── backend/                   # API NestJS
│   │   ├── src/                   # Code source
│   │   ├── prisma/               # Base de données
│   │   ├── package.json          # Dépendances backend
│   │   └── nest-cli.json         # Configuration NestJS
│   │
│   └── frontend/                  # Interface Next.js
│       ├── src/                   # Code source
│       ├── public/               # Assets statiques
│       ├── package.json          # Dépendances frontend
│       └── next.config.js        # Configuration Next.js
│
├── 🔐 Infrastructure
│   ├── vault-ansible/            # Système Vault
│   │   ├── deploy-vault.sh       # Déploiement Vault
│   │   ├── create-all-secrets.sh # Création des secrets
│   │   ├── deploy.yml            # Playbook Ansible
│   │   └── nestjs-vault-integration.example.ts
│   │
│   ├── config/                   # Configuration
│   │   ├── .env.example          # Template développement
│   │   └── .env.production.example # Template production
│   │
│   └── scripts/                  # Scripts utilitaires
│       ├── install.sh            # Installation
│       ├── dev.sh                # Mode développement
│       └── build.sh              # Build production
│
├── 🗄️ Base de Données
│   └── init-db/                  # Initialisation DB
│       └── 01-init.sh            # Script d'initialisation
│
├── 📊 Documentation Technique
│   └── docs/                     # Documentation détaillée
│       └── SECRETS_CONFIGURATION.md # Configuration des secrets
│
├── 🚀 Scripts de Gestion
│   ├── start.sh                  # Démarrage complet
│   └── stop.sh                   # Arrêt complet
│
└── 🌐 Assets Publics
    └── public/                   # Fichiers statiques
```

## 🔧 Backend (NestJS)

### Structure du Code
```
apps/backend/src/
├── 📦 Modules Principaux
│   ├── app.module.ts             # Module racine
│   ├── main.ts                   # Point d'entrée
│   │
│   ├── auth/                     # Authentification
│   │   ├── auth.module.ts
│   │   └── dto/
│   │       └── auth.dto.ts
│   │
│   ├── users/                    # Gestion utilisateurs
│   │   └── users.module.ts
│   │
│   ├── sites/                    # Gestion des sites
│   │   └── sites.module.ts
│   │
│   ├── threats/                  # Gestion des menaces
│   │   └── threats.module.ts
│   │
│   └── payments/                 # Paiements Stripe
│       ├── payments.module.ts
│       └── stripe.service.ts
│
├── 🔌 Services Infrastructure
│   ├── prisma/                   # Base de données
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   │
│   └── redis/                    # Cache Redis
│       ├── redis.module.ts
│       └── redis.service.ts
│
├── 🛡️ Sécurité et Middleware
│   ├── middleware/
│   │   └── logger.middleware.ts
│   │
│   └── health/                   # Santé de l'application
│       ├── health.controller.ts
│       └── health.module.ts
│
└── 🗄️ Base de Données
    └── prisma/
        └── schema.prisma         # Schéma Prisma
```

### Technologies Backend
- **Framework**: NestJS 10.3+
- **Base de données**: PostgreSQL + Prisma ORM
- **Cache**: Redis
- **Paiements**: Stripe
- **Sécurité**: JWT, Passport
- **Validation**: class-validator
- **Documentation**: Swagger

## 🎨 Frontend (Next.js)

### Structure du Code
```
apps/frontend/src/
├── 📱 Application
│   └── app/                      # App Router Next.js 13+
│       ├── layout.tsx            # Layout principal
│       └── page.tsx              # Page d'accueil
│
├── 🧩 Composants
│   └── components/
│       ├── auth-provider.tsx     # Authentification
│       ├── query-provider.tsx    # React Query
│       ├── theme-provider.tsx    # Gestion du thème
│       │
│       └── ui/                   # Composants UI
│           └── toaster.tsx       # Notifications
│
└── 🎨 Styles
    └── styles/
        └── globals.css           # Styles globaux
```

### Technologies Frontend
- **Framework**: Next.js 15.3+
- **Styling**: Tailwind CSS 3.4+
- **Authentification**: NextAuth.js
- **État**: React Query
- **Composants**: shadcn/ui
- **TypeScript**: 5.3+

## 🔐 Infrastructure et Sécurité

### Vault (Secrets Management)
```
vault-ansible/
├── 🚀 Déploiement
│   ├── deploy-vault.sh           # Installation Vault
│   ├── create-all-secrets.sh     # Création des secrets
│   └── deploy.yml                # Playbook Ansible
│
├── 🔧 Configuration
│   ├── .env.vault.example        # Template Vault
│   └── nestjs-vault-integration.example.ts # Service NestJS
│
└── 📋 Secrets Structure
    ├── secret/database/          # Base de données
    ├── secret/redis/             # Cache Redis
    ├── secret/jwt/               # Authentification
    ├── secret/stripe/            # Paiements
    ├── secret/email/             # Email
    └── secret/api/               # APIs externes
```

### Configuration
```
config/
├── .env.example                  # Développement
└── .env.production.example       # Production
```

## 🛠️ Scripts et Outils

### Scripts Principaux
- **`start.sh`**: Démarrage complet (Docker + Apps)
- **`stop.sh`**: Arrêt complet avec nettoyage
- **`scripts/install.sh`**: Installation automatique
- **`scripts/dev.sh`**: Mode développement
- **`scripts/build.sh`**: Build de production

### Outils de Développement
- **Docker**: Conteneurisation
- **Docker Compose**: Orchestration
- **Ansible**: Déploiement automatisé
- **Nginx**: Reverse proxy
- **Redis**: Cache et sessions
- **PostgreSQL**: Base de données

## 📋 Environnements

### Développement
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Base de données**: localhost:5432
- **Redis**: localhost:6379
- **Vault**: http://localhost:8200

### Staging
- **Frontend**: https://staging.example.com
- **Backend**: https://api-staging.example.com
- **Base de données**: staging-db.example.com
- **Redis**: staging-redis.example.com
- **Vault**: https://vault-staging.example.com

### Production
- **Frontend**: https://app.example.com
- **Backend**: https://api.example.com
- **Base de données**: prod-db.example.com
- **Redis**: prod-redis.example.com
- **Vault**: https://vault.example.com

## 🔄 Workflows

### Développement
1. Installation: `scripts/install.sh`
2. Démarrage: `scripts/dev.sh`
3. Tests et développement
4. Commit et push

### Déploiement
1. Build: `scripts/build.sh`
2. Tests automatisés
3. Déploiement Ansible
4. Validation et monitoring

### Maintenance
1. Mise à jour des dépendances
2. Rotation des secrets Vault
3. Sauvegardes
4. Monitoring et alertes

## 📊 Monitoring et Logs

### Logs
- **Application**: Logs centralisés
- **Nginx**: Logs d'accès et erreurs
- **Docker**: Logs des conteneurs
- **Vault**: Logs d'audit

### Monitoring
- **Santé**: Endpoints `/health`
- **Métriques**: Prometheus (optionnel)
- **Alertes**: Configuration selon environnement

## 🔧 Maintenance

### Mise à jour
1. Dépendances npm
2. Images Docker
3. Configuration Vault
4. Certificats SSL

### Sauvegarde
1. Base de données PostgreSQL
2. Secrets Vault
3. Configuration Redis
4. Logs et métriques

## 📚 Documentation

### Fichiers de Documentation
- **README.md**: Guide principal
- **SETUP.md**: Installation détaillée
- **DEPLOYMENT.md**: Guide de déploiement
- **SECURITY.md**: Sécurité
- **STRUCTURE.md**: Architecture (ce fichier)
- **docs/SECRETS_CONFIGURATION.md**: Configuration des secrets

### Ressources Externes
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [HashiCorp Vault Documentation](https://www.vaultproject.io/docs)
- [Docker Documentation](https://docs.docker.com/)

## 🎯 Prochaines Étapes

### Version 1.0
- [ ] Authentification complète
- [ ] Gestion des sites
- [ ] Paiements Stripe
- [ ] Interface utilisateur

### Version 2.0
- [ ] Monitoring avancé
- [ ] Tests automatisés
- [ ] CI/CD complet
- [ ] Optimisations performances

### Infrastructure
- [ ] Kubernetes (optionnel)
- [ ] CDN
- [ ] Load balancing
- [ ] Haute disponibilité
