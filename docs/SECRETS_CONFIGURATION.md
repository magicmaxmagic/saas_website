# Configuration des Secrets avec HashiCorp Vault

Ce document décrit la configuration complète des secrets pour l'application SIT Inov en utilisant HashiCorp Vault.

## 🔐 Structure des Secrets

### Base de Données
```
secret/database/
├── development/
│   ├── host: localhost
│   ├── port: 5432
│   ├── database: sit_inov_dev
│   ├── username: dev_user
│   └── password: dev_password_123
├── staging/
│   ├── host: staging-db.example.com
│   ├── port: 5432
│   ├── database: sit_inov_staging
│   ├── username: staging_user
│   └── password: staging_password_456
└── production/
    ├── host: prod-db.example.com
    ├── port: 5432
    ├── database: sit_inov_prod
    ├── username: prod_user
    └── password: prod_password_789
```

### Redis
```
secret/redis/
├── development/
│   ├── host: localhost
│   ├── port: 6379
│   └── password: redis_dev_pass
├── staging/
│   ├── host: staging-redis.example.com
│   ├── port: 6379
│   └── password: redis_staging_pass
└── production/
    ├── host: prod-redis.example.com
    ├── port: 6379
    └── password: redis_prod_pass
```

### JWT
```
secret/jwt/
├── development/
│   ├── secret: dev_jwt_secret_key_very_long_and_secure
│   └── expires_in: 24h
├── staging/
│   ├── secret: staging_jwt_secret_key_very_long_and_secure
│   └── expires_in: 12h
└── production/
    ├── secret: prod_jwt_secret_key_very_long_and_secure
    └── expires_in: 8h
```

### Stripe
```
secret/stripe/
├── development/
│   ├── public_key: pk_test_dev_key
│   ├── secret_key: sk_test_dev_key
│   └── webhook_secret: whsec_dev_webhook
├── staging/
│   ├── public_key: pk_test_staging_key
│   ├── secret_key: sk_test_staging_key
│   └── webhook_secret: whsec_staging_webhook
└── production/
    ├── public_key: pk_live_prod_key
    ├── secret_key: sk_live_prod_key
    └── webhook_secret: whsec_prod_webhook
```

### Next.js
```
secret/nextjs/
├── development/
│   ├── nextauth_secret: dev_nextauth_secret
│   └── nextauth_url: http://localhost:3000
├── staging/
│   ├── nextauth_secret: staging_nextauth_secret
│   └── nextauth_url: https://staging.example.com
└── production/
    ├── nextauth_secret: prod_nextauth_secret
    └── nextauth_url: https://app.example.com
```

### Email
```
secret/email/
├── development/
│   ├── smtp_host: localhost
│   ├── smtp_port: 587
│   ├── smtp_user: dev@example.com
│   └── smtp_pass: dev_email_pass
├── staging/
│   ├── smtp_host: smtp.example.com
│   ├── smtp_port: 587
│   ├── smtp_user: staging@example.com
│   └── smtp_pass: staging_email_pass
└── production/
    ├── smtp_host: smtp.example.com
    ├── smtp_port: 587
    ├── smtp_user: no-reply@example.com
    └── smtp_pass: prod_email_pass
```

### API Externes
```
secret/api/
├── development/
│   ├── google_client_id: dev_google_client_id
│   ├── google_client_secret: dev_google_client_secret
│   ├── github_client_id: dev_github_client_id
│   └── github_client_secret: dev_github_client_secret
├── staging/
│   ├── google_client_id: staging_google_client_id
│   ├── google_client_secret: staging_google_client_secret
│   ├── github_client_id: staging_github_client_id
│   └── github_client_secret: staging_github_client_secret
└── production/
    ├── google_client_id: prod_google_client_id
    ├── google_client_secret: prod_google_client_secret
    ├── github_client_id: prod_github_client_id
    └── github_client_secret: prod_github_client_secret
```

## 🚀 Déploiement

### 1. Démarrage de Vault
```bash
cd vault-ansible
chmod +x deploy-vault.sh
./deploy-vault.sh
```

### 2. Création des secrets
```bash
chmod +x create-all-secrets.sh
./create-all-secrets.sh
```

### 3. Vérification
```bash
# Vérifier que Vault est opérationnel
curl -s http://localhost:8200/v1/sys/health | jq

# Lister les secrets
export VAULT_ADDR="http://localhost:8200"
export VAULT_TOKEN="myroot"
vault kv list secret/
```

## 🔧 Utilisation dans l'Application

### NestJS Backend
```typescript
import { VaultService } from './vault.service';

// Récupération des secrets de base de données
const dbConfig = await vaultService.getDatabaseConfig('production');

// Récupération des secrets JWT
const jwtConfig = await vaultService.getJWTConfig('production');

// Récupération des secrets Stripe
const stripeConfig = await vaultService.getStripeConfig('production');
```

### Configuration Prisma
```typescript
import { VaultService } from './vault.service';

const vaultService = new VaultService(vaultConfig);
const dbConfig = await vaultService.getDatabaseConfig(process.env.NODE_ENV);

export const prismaConfig = {
  datasources: {
    db: {
      url: `postgresql://${dbConfig.username}:${dbConfig.password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`
    }
  }
};
```

## 🔒 Sécurité

### Authentification AppRole
```bash
# Créer un rôle
vault auth enable approle
vault write auth/approle/role/sit-inov-role \
    secret_id_ttl=10m \
    token_num_uses=10 \
    token_ttl=20m \
    token_max_ttl=30m \
    secret_id_num_uses=40 \
    policies="sit-inov-policy"

# Récupérer le RoleID
vault read auth/approle/role/sit-inov-role/role-id

# Générer un SecretID
vault write -f auth/approle/role/sit-inov-role/secret-id
```

### Politique de Sécurité
```hcl
# Politique pour l'application
path "secret/data/*" {
  capabilities = ["read"]
}

path "secret/metadata/*" {
  capabilities = ["list"]
}
```

## 🛠️ Maintenance

### Rotation des Secrets
```bash
# Exemple de rotation du secret JWT
vault kv put secret/jwt/production \
    secret="nouveau_secret_jwt_très_sécurisé" \
    expires_in="8h"
```

### Sauvegarde
```bash
# Sauvegarde des secrets
vault operator generate-root -init
vault operator generate-root -pgp-key=<key>
```

### Monitoring
```bash
# Vérifier la santé
vault status

# Audit des accès
vault audit enable file file_path=/var/log/vault/audit.log
```

## 📋 Checklist de Déploiement

- [ ] Vault déployé et initialisé
- [ ] Tous les secrets créés
- [ ] Politique de sécurité configurée
- [ ] AppRole configuré
- [ ] Application configurée pour utiliser Vault
- [ ] Monitoring et alertes configurés
- [ ] Sauvegarde des clés de dé-scellement
- [ ] Documentation mise à jour
- [ ] Tests de récupération des secrets
- [ ] Rotation des secrets testée

## 🔍 Dépannage

### Problèmes Courants
1. **Vault scellé** : `vault operator unseal`
2. **Token expiré** : Régénérer avec AppRole
3. **Permissions insuffisantes** : Vérifier les politiques
4. **Connexion refusée** : Vérifier l'URL et le port

### Logs
```bash
# Logs Docker
docker logs vault

# Logs d'audit
tail -f /var/log/vault/audit.log
```

## 📞 Support

Pour toute question ou problème :
1. Consulter la documentation officielle Vault
2. Vérifier les logs d'audit
3. Contacter l'équipe DevOps
