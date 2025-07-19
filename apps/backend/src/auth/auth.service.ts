import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';
import { VaultService } from '../vault/vault.service';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    private vaultService: VaultService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        sites: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Utilisateur non trouvé ou inactif');
    }

    return user;
  }
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private vaultService: VaultService,
    private configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        sites: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true,
          },
        },
      },
    });

    if (user && this.validatePassword(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Récupération des secrets JWT depuis Vault
    const jwtConfig = await this.vaultService.getJWTConfig(
      this.configService.get('NODE_ENV')
    );

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24h
    };

    return {
      access_token: this.jwtService.sign(payload, {
        secret: jwtConfig.secret,
        expiresIn: jwtConfig.expiresIn,
      }),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        sites: user.sites,
      },
    };
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const hashedPassword = await this.hashPassword(userData.password);
    
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: 'USER',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    return this.login(user);
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sites: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Utilisateur non trouvé ou inactif');
    }

    return this.login(user);
  }

  async logout(userId: string) {
    // Invalidation du token (optionnel: blacklist en Redis)
    await this.prisma.user.update({
      where: { id: userId },
      data: { lastLogout: new Date() },
    });

    return { message: 'Déconnexion réussie' };
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = require('bcrypt');
    return bcrypt.hash(password, 12);
  }

  private async validatePassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = require('bcrypt');
    return bcrypt.compare(password, hash);
  }

  async getCurrentUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
        lastLogin: true,
        sites: {
          select: {
            id: true,
            name: true,
            domain: true,
            isActive: true,
            createdAt: true,
            threats: {
              select: {
                id: true,
                type: true,
                severity: true,
                status: true,
                createdAt: true,
              },
              orderBy: { createdAt: 'desc' },
              take: 5,
            },
          },
        },
      },
    });
  }

  async updateProfile(userId: string, updateData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        updatedAt: true,
      },
    });
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !await this.validatePassword(currentPassword, user.password)) {
      throw new UnauthorizedException('Mot de passe actuel incorrect');
    }

    const hashedNewPassword = await this.hashPassword(newPassword);
    
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: 'Mot de passe modifié avec succès' };
  }
}
