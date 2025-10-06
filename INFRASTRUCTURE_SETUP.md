# Hub4Estate Split Architecture - Infrastructure Setup Guide

## Phase 0: Infrastructure Prerequisites

This document outlines the **external infrastructure requirements** that must be configured before the split architecture can be deployed. These cannot be done through code alone and require manual setup.

---

## 1. DNS Configuration

### Required Subdomains
You need to configure three subdomains pointing to your hosting platform:

```
users.hub4estate.com     → User/Consumer platform
business.hub4estate.com  → Business/Provider platform
www.hub4estate.com       → Public marketing site (optional)
```

### DNS Records Setup
**If using Vercel:**
1. Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
2. Add CNAME records:
   ```
   CNAME users.hub4estate.com    → cname.vercel-dns.com
   CNAME business.hub4estate.com → cname.vercel-dns.com
   CNAME www.hub4estate.com      → cname.vercel-dns.com
   ```

**If using AWS/Cloudfront:**
1. Create CloudFront distributions for each subdomain
2. Add CNAME records pointing to CloudFront domains
3. Configure SSL certificates via ACM

**If using Nginx/Custom:**
1. Configure reverse proxy rules for each subdomain
2. Set up SSL certificates (Let's Encrypt or commercial)
3. Configure load balancer if needed

### SSL/TLS Certificates
- Use managed certificates from hosting provider (Vercel auto-provisions)
- OR use Let's Encrypt for custom hosting
- Ensure all subdomains have valid HTTPS certificates

---

## 2. Hosting Platform Configuration

### Vercel Setup (Recommended)
1. **Create Two Projects:**
   - `hub4estate-user` → deploys from `/apps/user`
   - `hub4estate-business` → deploys from `/apps/business`

2. **Domain Configuration:**
   - In Vercel dashboard for `hub4estate-user`:
     - Add domain: `users.hub4estate.com`
   - In Vercel dashboard for `hub4estate-business`:
     - Add domain: `business.hub4estate.com`

3. **Build Settings:**
   ```
   # For /apps/user
   Build Command: cd ../.. && pnpm turbo build --filter=user
   Output Directory: apps/user/.next
   Install Command: pnpm install
   
   # For /apps/business
   Build Command: cd ../.. && pnpm turbo build --filter=business
   Output Directory: apps/business/.next
   Install Command: pnpm install
   ```

4. **Environment Variables:**
   - Set per-project environment variables (see section 3 below)
   - Configure preview/production environments

### Alternative: AWS Amplify / Netlify
Similar setup with two separate projects pointing to monorepo subfolders.

---

## 3. Environment Variables Setup

### Shared Variables (Both Apps)
```bash
# Database (Turso)
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-token

# Better Auth
BETTER_AUTH_SECRET=generate-new-secret-per-env
BETTER_AUTH_URL=https://users.hub4estate.com  # OR business.hub4estate.com

# Shared Services
OPENAI_API_KEY=sk-...
SENDGRID_API_KEY=SG...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### User App Specific (`/apps/user`)
```bash
# Google OAuth - User Platform
GOOGLE_CLIENT_ID_USER=123456-user.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET_USER=GOCSPX-user-secret

# Auth Config
JWT_AUD_USER=hub4estate-user
COOKIE_NAME_USER=hub4_user_sess
COOKIE_DOMAIN=.hub4estate.com

# App Identity
NEXT_PUBLIC_APP_NAME=Hub4Estate Users
NEXT_PUBLIC_APP_URL=https://users.hub4estate.com
```

### Business App Specific (`/apps/business`)
```bash
# Google OAuth - Business Platform
GOOGLE_CLIENT_ID_BIZ=123456-biz.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET_BIZ=GOCSPX-biz-secret

# Auth Config
JWT_AUD_BIZ=hub4estate-business
COOKIE_NAME_BIZ=hub4_biz_sess
COOKIE_DOMAIN=.hub4estate.com

# App Identity
NEXT_PUBLIC_APP_NAME=Hub4Estate Business
NEXT_PUBLIC_APP_URL=https://business.hub4estate.com
```

### How to Generate Secrets
```bash
# Generate BETTER_AUTH_SECRET (different for each app)
openssl rand -base64 32

# Generate JWT_AUD (unique identifier)
# Use format: hub4estate-{user|business}-{env}
# Example: hub4estate-user-prod, hub4estate-business-staging
```

---

## 4. Google OAuth Configuration

You need to create **TWO separate Google OAuth clients** (one per platform).

### User Platform OAuth Client
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new OAuth 2.0 Client ID (or use existing)
3. **Authorized redirect URIs:**
   ```
   https://users.hub4estate.com/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google  # dev
   ```
4. Copy `Client ID` and `Client Secret` → use as `GOOGLE_CLIENT_ID_USER`, `GOOGLE_CLIENT_SECRET_USER`

### Business Platform OAuth Client
1. Create another OAuth 2.0 Client ID
2. **Authorized redirect URIs:**
   ```
   https://business.hub4estate.com/api/auth/callback/google
   http://localhost:3002/api/auth/callback/google  # dev
   ```
3. Copy credentials → use as `GOOGLE_CLIENT_ID_BIZ`, `GOOGLE_CLIENT_SECRET_BIZ`

### Why Two Clients?
- Separate consent screens for different user types
- Different redirect URIs per subdomain
- Audience isolation (user tokens can't work on business platform)

---

## 5. Database Configuration

### Current Setup (Single Database)
You'll continue using the same Turso database but with **separate schemas**:
- `user_app` schema → accessed by `/apps/user`
- `biz_app` schema → accessed by `/apps/business`
- `common` schema → shared read-only data

### Schema Isolation Strategy
```sql
-- Create schemas
CREATE SCHEMA IF NOT EXISTS user_app;
CREATE SCHEMA IF NOT EXISTS biz_app;
CREATE SCHEMA IF NOT EXISTS common;

-- Example table placement
-- user_app.users → consumer-specific data
-- biz_app.providers → business-specific data
-- common.categories → shared reference data
```

### Migration Strategy
1. Existing tables remain in default schema initially
2. Phase 3 will migrate tables to appropriate schemas
3. Use Drizzle migrations with schema prefixes

---

## 6. CI/CD Pipeline Setup (GitHub Actions)

### Repository Secrets to Add
Go to GitHub repo → Settings → Secrets and Variables → Actions

**Add these secrets:**
```
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
VERCEL_TOKEN  # From Vercel account settings

# User App
VERCEL_ORG_ID_USER
VERCEL_PROJECT_ID_USER
GOOGLE_CLIENT_ID_USER
GOOGLE_CLIENT_SECRET_USER

# Business App
VERCEL_ORG_ID_BIZ
VERCEL_PROJECT_ID_BIZ
GOOGLE_CLIENT_ID_BIZ
GOOGLE_CLIENT_SECRET_BIZ

# Shared
BETTER_AUTH_SECRET_STAGING
BETTER_AUTH_SECRET_PROD
OPENAI_API_KEY
SENDGRID_API_KEY
```

### How to Get Vercel IDs
```bash
# Install Vercel CLI
npm i -g vercel

# Link projects
cd apps/user
vercel link  # Follow prompts, copy ORG_ID and PROJECT_ID

cd ../business
vercel link  # Repeat for business app
```

---

## 7. Observability Setup (Optional - Phase 5)

### Sentry
1. Create two Sentry projects:
   - `hub4estate-user`
   - `hub4estate-business`
2. Get DSN for each → add to env vars

### OpenTelemetry (Future)
- Configure exporters for traces/metrics
- Set up Grafana/Datadog/New Relic
- Add correlation IDs

---

## 8. Pre-Deployment Checklist

Before deploying the split architecture:

**DNS & Hosting:**
- [ ] Subdomains configured and pointing to hosting
- [ ] SSL certificates active and valid
- [ ] Two separate hosting projects created

**Authentication:**
- [ ] Two Google OAuth clients created
- [ ] Redirect URIs configured correctly
- [ ] Secrets generated and stored securely

**Environment Variables:**
- [ ] All shared variables configured in both apps
- [ ] App-specific variables set correctly
- [ ] Cookie domain set to `.hub4estate.com`
- [ ] No secrets committed to Git

**Database:**
- [ ] Schema separation plan documented
- [ ] Migration strategy confirmed
- [ ] Backup created before migration

**CI/CD:**
- [ ] GitHub secrets configured
- [ ] Pipeline files created and tested
- [ ] Deploy keys/tokens valid

---

## 9. Development Environment Setup

### Local Development Ports
```
/apps/user     → http://localhost:3001
/apps/business → http://localhost:3002
Public site    → http://localhost:3000 (optional)
```

### Local Environment Files
```
/apps/user/.env.local
/apps/business/.env.local
```

### Running Locally
```bash
# Install dependencies
pnpm install

# Run both apps in parallel
pnpm dev

# Run specific app
pnpm dev --filter=user
pnpm dev --filter=business
```

---

## 10. Rollout Strategy

### Phase Rollout
1. **Week 1:** Infrastructure setup + monorepo structure
2. **Week 2:** Auth split + database schema migration
3. **Week 3:** Feature migration + testing
4. **Week 4:** Staging deployment + QA
5. **Week 5:** Production cutover with feature flags

### Feature Flags
Use environment variables to control rollout:
```bash
SPLIT_ARCH_ENABLED=true  # Enable subdomain redirects
ADMIN_SSO_ENABLED=true   # Enable admin cross-platform SSO
```

### Rollback Plan
1. Keep old architecture in separate branch
2. DNS can revert to single app instantly
3. Database changes are backwards compatible
4. Feature flags allow instant disable

---

## 11. Cost Considerations

**Hosting (Vercel Pro):**
- 2 projects × $20/month = $40/month
- OR use open-source plan initially

**Database (Turso):**
- Same database, no additional cost
- Consider upgrading plan for multiple schemas

**Google OAuth:**
- Free for standard usage
- Monitor quota limits

**Domains & SSL:**
- Domain: ~$12/year
- SSL: Free (Let's Encrypt or Vercel)

**Total Estimated:** $40-60/month (plus domain renewal)

---

## Next Steps

1. **Complete this infrastructure setup** (DNS, hosting, OAuth clients)
2. **Notify development team** when infrastructure is ready
3. **Proceed to Phase 1** (Turborepo monorepo setup)
4. **Test in staging environment** before production cutover

---

## Questions or Issues?

Document any blockers or questions:
- DNS propagation issues? (Can take 24-48 hours)
- OAuth callback errors? (Check redirect URIs exactly match)
- Deployment failures? (Check build commands and env vars)

---

**Last Updated:** 2025-10-06
**Phase:** 0 - Infrastructure Prerequisites
**Status:** Documentation Complete → Ready for Phase 1