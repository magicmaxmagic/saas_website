import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as vault from 'node-vault';

export interface VaultConfig {
  endpoint: string;
  token?: string;
  roleId?: string;
  secretId?: string;
  namespace?: string;
}

@Injectable()
export class VaultService implements OnModuleInit {
  private readonly logger = new Logger(VaultService.name);
  private vaultClient: vault.client;
  private isInitialized = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.initializeVault();
  }

  private async initializeVault() {
    try {
      const config: VaultConfig = {
        endpoint: this.configService.get('VAULT_ADDR', 'http://localhost:8200'),
        token: this.configService.get('VAULT_TOKEN'),
        roleId: this.configService.get('VAULT_ROLE_ID'),
        secretId: this.configService.get('VAULT_SECRET_ID'),
        namespace: this.configService.get('VAULT_NAMESPACE'),
      };

      this.vaultClient = vault({
        endpoint: config.endpoint,
        token: config.token,
        namespace: config.namespace,
      });

      // Authentification par AppRole si configurée
      if (config.roleId && config.secretId) {
        await this.authenticateWithAppRole(config.roleId, config.secretId);
      }

      // Vérification de la connexion
      await this.vaultClient.status();
      this.isInitialized = true;
      
      this.logger.log('Vault service initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Vault service', error);
      // En développement, on peut continuer sans Vault
      if (this.configService.get('NODE_ENV') !== 'development') {
        throw error;
      }
    }
  }

  private async authenticateWithAppRole(roleId: string, secretId: string) {
    try {
      const response = await this.vaultClient.approleLogin({
        role_id: roleId,
        secret_id: secretId,
      });

      this.vaultClient.token = response.auth.client_token;
      this.logger.log('AppRole authentication successful');
    } catch (error) {
      this.logger.error('AppRole authentication failed', error);
      throw error;
    }
  }

  async getSecret(path: string): Promise<any> {
    if (!this.isInitialized) {
      this.logger.warn('Vault not initialized, returning empty object');
      return {};
    }

    try {
      const response = await this.vaultClient.read(path);
      return response.data.data || response.data;
    } catch (error) {
      this.logger.error(`Failed to read secret at path ${path}`, error);
      throw error;
    }
  }

  async getDatabaseConfig(environment: string = 'development') {
    const secrets = await this.getSecret(`secret/database/${environment}`);
    return {
      host: secrets.host || 'localhost',
      port: parseInt(secrets.port) || 5432,
      database: secrets.database || 'sit_inov_dev',
      username: secrets.username || 'postgres',
      password: secrets.password || 'password',
    };
  }

  async getRedisConfig(environment: string = 'development') {
    const secrets = await this.getSecret(`secret/redis/${environment}`);
    return {
      host: secrets.host || 'localhost',
      port: parseInt(secrets.port) || 6379,
      password: secrets.password || '',
    };
  }

  async getJWTConfig(environment: string = 'development') {
    const secrets = await this.getSecret(`secret/jwt/${environment}`);
    return {
      secret: secrets.secret || 'fallback-secret-key',
      expiresIn: secrets.expires_in || '24h',
    };
  }

  async getStripeConfig(environment: string = 'development') {
    const secrets = await this.getSecret(`secret/stripe/${environment}`);
    return {
      publicKey: secrets.public_key || '',
      secretKey: secrets.secret_key || '',
      webhookSecret: secrets.webhook_secret || '',
    };
  }

  async getEmailConfig(environment: string = 'development') {
    const secrets = await this.getSecret(`secret/email/${environment}`);
    return {
      host: secrets.smtp_host || 'localhost',
      port: parseInt(secrets.smtp_port) || 587,
      user: secrets.smtp_user || '',
      password: secrets.smtp_pass || '',
    };
  }

  async getApiConfig(environment: string = 'development') {
    const secrets = await this.getSecret(`secret/api/${environment}`);
    return {
      google: {
        clientId: secrets.google_client_id || '',
        clientSecret: secrets.google_client_secret || '',
      },
      github: {
        clientId: secrets.github_client_id || '',
        clientSecret: secrets.github_client_secret || '',
      },
    };
  }

  async healthCheck() {
    try {
      const status = await this.vaultClient.status();
      return {
        status: 'healthy',
        sealed: status.sealed,
        initialized: this.isInitialized,
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        sealed: true,
        initialized: false,
        error: error.message,
      };
    }
  }
}
