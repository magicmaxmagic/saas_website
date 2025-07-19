# Prevent - Cybersecurity SaaS Platform

[![Next.js](https://img.shields.io/badge/Next.js-14.1-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E?style=flat-square&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)

Modern cybersecurity SaaS platform designed to protect web applications against cyber attacks in real-time. Built with a full TypeScript architecture and cutting-edge technology stack.

## Architecture Overview

### Frontend Stack - Next.js App Router
- **Next.js 14** with App Router and React Server Components
- **Tailwind CSS + ShadCN/ui** for modern design system
- **NextAuth.js** for authentication
- **React Query** for server state management
- **Framer Motion** for animations
- **Responsive Design** mobile-first approach

### Backend Stack - NestJS Enterprise
- **NestJS 10** with modular architecture
- **Prisma ORM** with PostgreSQL
- **JWT Authentication** with secure guards
- **DTOs with validation** using class-validator
- **Swagger API Documentation** auto-generated
- **Rate Limiting** and advanced security
- **Stripe Integration** complete payment system

## Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Docker and Docker Compose (for databases)
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)

### Installation
```bash
# Clone the repository
git clone <your-repo>
cd sit_inov_website

# Install dependencies
npm run setup
```

### Environment Configuration
```bash
# Copy environment templates
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
cp docker-compose.example.yml docker-compose.yml
cp redis.example.conf redis.conf

# Edit the configuration files with your settings
```

### Database Setup
```bash
# Start PostgreSQL and Redis with Docker
docker compose up -d postgres redis

# Generate Prisma client
npm run db:generate

# Run database migrations
cd apps/backend && npx prisma migrate dev
```

### Development Mode
```bash
# Start both frontend and backend simultaneously
npm run dev
```

### Application URLs
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api/docs
- **Database Health**: http://localhost:4000/api/health

## Project Structure

```
prevent-saas/
├── apps/
│   ├── frontend/                 # Next.js Application
│   │   ├── src/app/             # App Router pages and layouts
│   │   ├── src/components/      # Reusable React components
│   │   ├── src/lib/            # Utilities and stores
│   │   └── src/styles/         # Tailwind CSS and global styles
│   │
│   └── backend/                 # NestJS API
│       ├── src/                # Source code
│       │   ├── auth/           # JWT authentication module
│       │   ├── users/          # User management
│       │   ├── threats/        # Threat detection
│       │   ├── payments/       # Stripe integration
│       │   ├── sites/          # Protected sites management
│       │   └── prisma/         # Database service
│       ├── prisma/             # Database schema and migrations
│       └── test/               # E2E and unit tests
│
├── init-db/                    # Database initialization scripts
├── package.json                # Monorepo scripts and dependencies
└── README.md                   # This documentation
```

## Available Scripts

### Development Commands
```bash
npm run dev                  # Start frontend + backend simultaneously
npm run dev:frontend         # Start Next.js only (port 3000)
npm run dev:backend          # Start NestJS only (port 4000)
```

### Build Commands
```bash
npm run build               # Build complete application
npm run build:frontend      # Build Next.js application
npm run build:backend       # Build NestJS application
```

### Database Commands
```bash
npm run db:generate         # Generate Prisma client
npm run db:migrate          # Run database migrations
npm run db:studio           # Open Prisma Studio interface
```

### Testing and Quality
```bash
npm run test                # Run all tests
npm run lint                # Run ESLint on entire monorepo
npm run format              # Format code with Prettier
```

### Maintenance
```bash
npm run clean               # Clean all build outputs and dependencies
```

## API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/v1/auth/login` | POST | User authentication |
| `/api/v1/auth/register` | POST | User registration |
| `/api/v1/auth/refresh` | POST | Refresh JWT token |

### Threat Management
| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/v1/threats` | GET | List detected threats |
| `/api/v1/threats/{id}` | GET | Get threat details |
| `/api/v1/threats/stats` | GET | Threat statistics |

### Site Management
| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/v1/sites` | GET/POST | List/Create protected sites |
| `/api/v1/sites/{id}` | GET/PUT/DELETE | Manage specific site |
| `/api/v1/sites/{id}/metrics` | GET | Site performance metrics |

### Payment Integration
| Endpoint | Method | Description |
|----------|---------|-------------|
| `/api/v1/payments/checkout` | POST | Create Stripe checkout session |
| `/api/v1/payments/webhook` | POST | Handle Stripe webhooks |
| `/api/v1/payments/invoices` | GET | List customer invoices |

## Features

### Real-time Dashboard
- Live threat monitoring and metrics
- Intelligent push notifications
- Mobile-responsive interface
- WebSocket-powered real-time updates

### Enterprise Security
- JWT authentication with refresh tokens
- Strict DTO validation with TypeScript
- Rate limiting and DDoS protection
- Comprehensive audit logging
- CSP headers and XSS protection

### Payment System
- Secure Stripe integration
- Subscription management
- Invoice generation
- Multiple payment methods support

### Monitoring and Observability
- Structured logging with Winston
- Health check endpoints
- Performance metrics collection
- Error tracking and alerts

## Deployment

### Recommended Hosting
- **Frontend**: Vercel (optimized for Next.js)
- **Backend**: Railway, DigitalOcean, or AWS ECS
- **Database**: Supabase, PlanetScale, or AWS RDS
- **Cache**: Upstash Redis or AWS ElastiCache
- **Monitoring**: Sentry, DataDog, or New Relic

### Production Environment Variables
```bash
# Frontend
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret

# Backend
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-super-secure-jwt-secret-256-bits
STRIPE_SECRET_KEY=sk_live_...
REDIS_URL=redis://user:pass@host:6379
```

### Docker Production Build
```bash
# Build production images
docker build -t prevent-frontend ./apps/frontend
docker build -t prevent-backend ./apps/backend

# Deploy with docker-compose
docker compose -f docker-compose.prod.yml up -d
```

## Development Roadmap

### Phase 1 - Core Platform (Current)
- [x] Modern TypeScript architecture
- [x] Secure JWT authentication
- [x] Real-time dashboard interface
- [x] Complete Stripe integration
- [x] Comprehensive API documentation

### Phase 2 - Advanced Features
- [ ] WebSocket real-time communications
- [ ] Automated E2E testing suite
- [ ] CI/CD pipeline with GitHub Actions
- [ ] Advanced monitoring with Prometheus
- [ ] Distributed Redis caching

### Phase 3 - Enterprise Scale
- [ ] Multi-tenancy support
- [ ] SSO/SAML integration
- [ ] Mobile application (React Native)
- [ ] AI-powered threat detection
- [ ] White-label solutions

## Security Considerations

### Data Protection
- All sensitive data encrypted at rest and in transit
- PII data anonymization for analytics
- GDPR compliance built-in
- Regular security audits and penetration testing

### Infrastructure Security
- Zero-trust network architecture
- Regular dependency updates and vulnerability scanning
- Secure CI/CD pipeline with secret management
- Infrastructure as Code (IaC) best practices

## Contributing

This is a commercial product with restricted access. For authorized contributors:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under a Commercial License. See the [LICENSE](./LICENSE) file for details.

All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited.

## Support

For technical support and licensing inquiries:
- Email: support@prevent-security.com
- Documentation: [Internal Wiki](./docs)
- API Reference: http://localhost:4000/api/docs

---

**Prevent Cybersecurity Platform** - Next-Generation Web Protection
