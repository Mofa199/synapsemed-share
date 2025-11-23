# SynapseMed Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Database Migration](#database-migration)
4. [Deployment Options](#deployment-options)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

### ✅ Required Steps Before Deployment

1. **Environment Variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required environment variables:
     ```env
     DATABASE_URL="postgresql://..."
     NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
     NEXTAUTH_URL="https://yourdomain.com"
     GOOGLE_CLIENT_ID="your-google-client-id"
     GOOGLE_CLIENT_SECRET="your-google-client-secret"
     AI_BACKEND_URL="http://your-ai-backend:8000"
     ```

2. **Database Setup**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed initial data (optional)
   npx prisma db seed
   ```

3. **Build Test**
   ```bash
   # Install dependencies
   npm install
   
   # Run type checking
   npm run type-check
   
   # Build production bundle
   npm run build
   ```

---

## Environment Setup

### Development Environment
```bash
# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma migrate dev

# Run development server
npm run dev
```

### Production Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require"

# Authentication
NEXTAUTH_SECRET="your-super-secret-key-min-32-chars"
NEXTAUTH_URL="https://synapsemed.co.tz"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# AI Backend
AI_BACKEND_URL="https://ai.synapsemed.co.tz"

# Email (if using email features)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

---

## Database Migration

### Using Neon Database (Recommended for Vercel)

1. **Create Neon Project**
   - Visit [https://neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Configure Database URL**
   ```env
   DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/dbname?sslmode=require"
   ```

3. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

### Using Other PostgreSQL Providers

- **Supabase**: Similar to Neon, get connection string from dashboard
- **Railway**: Auto-provisions PostgreSQL, copy from Railway dashboard
- **Self-hosted**: Ensure PostgreSQL 14+ is installed and accessible

---

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides the easiest deployment for Next.js applications.

#### Steps:

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   # First deployment
   vercel
   
   # Production deployment
   vercel --prod
   ```

4. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.local`
   - Redeploy after adding variables

#### Build Configuration:
- Framework: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

---

### Option 2: Railway

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add PostgreSQL**
   ```bash
   railway add postgresql
   ```

4. **Configure Environment**
   - Railway auto-sets `DATABASE_URL`
   - Add other env vars in Railway dashboard

---

### Option 3: Docker Deployment

1. **Create Dockerfile** (Already exists in project):
   ```dockerfile
   FROM node:18-alpine AS base
   
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npx prisma generate
   RUN npm run build
   
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**
   ```bash
   # Build image
   docker build -t synapsemed .
   
   # Run container
   docker run -p 3000:3000 \
     -e DATABASE_URL="..." \
     -e NEXTAUTH_SECRET="..." \
     -e NEXTAUTH_URL="..." \
     synapsemed
   ```

3. **Using Docker Compose**:
   ```yaml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - DATABASE_URL=postgresql://postgres:password@db:5432/synapsemed
         - NEXTAUTH_SECRET=your-secret
         - NEXTAUTH_URL=http://localhost:3000
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=synapsemed
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
     
   volumes:
     postgres_data:
   ```

---

### Option 4: VPS Deployment (DigitalOcean, AWS EC2, etc.)

1. **Server Setup** (Ubuntu 22.04)
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib -y
   
   # Install PM2 for process management
   sudo npm install -g pm2
   ```

2. **Database Setup**
   ```bash
   sudo -u postgres createdb synapsemed
   sudo -u postgres createuser synapsemed_user -P
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/synapsemed.git
   cd synapsemed
   
   # Install dependencies
   npm install
   
   # Setup environment
   cp .env.example .env.local
   # Edit .env.local with your values
   
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Build application
   npm run build
   
   # Start with PM2
   pm2 start npm --name "synapsemed" -- start
   pm2 save
   pm2 startup
   ```

4. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Setup SSL with Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   sudo certbot --nginx -d yourdomain.com
   ```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Check application is running
curl https://yourdomain.com/api/health

# Check database connection
curl https://yourdomain.com/api/db-check
```

### 2. Create Initial Super Admin

```bash
# Using Prisma Studio (locally)
npx prisma studio

# Or using direct database access
psql $DATABASE_URL -c "UPDATE users SET role='SUPER_ADMIN' WHERE email='admin@synapsemed.co.tz';"
```

### 3. Test Key Features

- [ ] User registration
- [ ] User login
- [ ] Google OAuth login
- [ ] Dashboard access
- [ ] Content viewing
- [ ] Video playback
- [ ] Simulation access
- [ ] AI tutor chat
- [ ] Admin panel access

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors
```
Error: Can't reach database server
```
**Solution:**
- Check DATABASE_URL is correct
- Ensure database server is running
- Verify network/firewall rules
- Add `?connection_limit=10` to DATABASE_URL if using serverless

#### 2. Build Failures
```
Error: Type error
```
**Solution:**
```bash
# Clear cache
rm -rf .next
rm -rf node_modules
npm install
npx prisma generate
npm run build
```

#### 3. Authentication Issues
```
Error: [next-auth][error][JWT_SESSION_ERROR]
```
**Solution:**
- Ensure NEXTAUTH_SECRET is set (minimum 32 characters)
- Check NEXTAUTH_URL matches your domain
- Verify callbacks are configured correctly

#### 4. Prisma Client Issues
```
Error: @prisma/client did not initialize yet
```
**Solution:**
```bash
npx prisma generate
# Restart application
```

#### 5. Permission Denied Errors
**Solution:**
- Check file permissions: `chmod -R 755 .next`
- Ensure user has write access to `.next` directory

---

## Performance Optimization

### 1. Enable Caching
```javascript
// next.config.js
module.exports = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
}
```

### 2. Database Connection Pooling
```env
DATABASE_URL="postgresql://...?connection_limit=5&pool_timeout=10"
```

### 3. Enable Production Optimizations
```bash
# Ensure NODE_ENV is set to production
export NODE_ENV=production
npm run build
```

---

## Monitoring and Maintenance

### 1. Setup Logging
```bash
# Using PM2
pm2 logs synapsemed

# Using Docker
docker logs -f container_name
```

### 2. Database Backups
```bash
# Automated daily backups
0 0 * * * pg_dump $DATABASE_URL > /backups/synapsemed_$(date +\%Y\%m\%d).sql
```

### 3. Update Deployment
```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart
pm2 restart synapsemed
```

---

## Security Checklist

- [ ] All environment variables are set and secure
- [ ] HTTPS is enabled (SSL certificate)
- [ ] Database has strong password
- [ ] NEXTAUTH_SECRET is random and secure (32+ characters)
- [ ] CORS is configured properly
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] SQL injection protection (Prisma handles this)
- [ ] XSS protection enabled
- [ ] CSP headers configured

---

## Support and Resources

- **Documentation**: See PROJECT_OVERVIEW.md
- **API Reference**: /api/docs (when implemented)
- **GitHub Issues**: Report bugs and feature requests
- **Email**: support@synapsemed.co.tz

---

## Quick Deploy Commands

### Vercel (Fastest)
```bash
npx vercel --prod
```

### Railway
```bash
railway up
```

### Docker
```bash
docker-compose up -d
```

### VPS
```bash
git pull && npm install && npm run build && pm2 restart synapsemed
```

---

**Last Updated**: 2025-01-14
**Version**: 1.0.0
