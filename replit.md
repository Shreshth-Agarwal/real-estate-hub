# Hub4Estate - Real Estate Platform

## Overview

Hub4Estate is a comprehensive real estate platform built with Next.js 15, designed to connect consumers (home builders/renovators) with verified providers (suppliers, contractors, professionals). The platform features a dual-sided marketplace with KYC verification, RFQ systems, project management tools, AI-powered knowledge assistance, and community features.

**Core Purpose**: Eliminate fragmented communication (scattered WhatsApp contacts) and create a unified, transparent marketplace for real estate materials, services, and professional connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: Next.js 15 (App Router) with React 19
- **UI Library**: Radix UI components with shadcn/ui design system
- **Styling**: Tailwind CSS 4 with custom "Royal Theme" (beige/black/gold color scheme)
- **Typography**: Playfair Display (headings) + Inter (body)
- **Animations**: Framer Motion for interactions and page transitions
- **Icons**: Lucide React

**Key Design Patterns**:
- App Router with route groups for organized layouts
- Client-side state management via React hooks
- Visual editing system with custom Babel loader for component tagging
- Form validation using React Hook Form + Zod resolvers
- Responsive mobile-first design with Tailwind breakpoints

**Route Structure**:
- `/` - Public landing page with marketing content
- `/(app)/*` - Authenticated app routes (dashboard, projects, community)
- `/sign-in`, `/sign-up` - Authentication flows
- `/onboarding` - Multi-step user onboarding
- `/admin` - Administrative interface
- `/knowledge` - AI-powered knowledge hub
- `/catalogs` - Product catalog browsing
- `/pricing` - Subscription plans

### Authentication & Authorization

**Auth System**: Better Auth v1.2.7
- Email/password authentication
- Session-based with JWT tokens stored in localStorage
- Cookie configuration for cross-subdomain authentication
- Role-based access control (consumer/provider/admin)
- KYC verification workflow for providers

**Session Management**:
- Custom `useSession` hook wrapping Better Auth client
- Bearer token authentication for API requests
- Automatic session refresh and refetch capabilities
- Redirect logic based on user roles

**User Roles**:
- **Consumer**: Browse catalogs, request quotes, manage projects
- **Provider**: List products/services, respond to RFQs, build reputation
- **Admin**: Platform oversight, KYC verification, analytics

### Database & Data Layer

**ORM**: Drizzle ORM with PostgreSQL dialect
- Schema defined in `src/db/schema.ts`
- Migration tracking via Drizzle Kit
- Connection pooling using node-postgres (pg)

**Core Data Models**:
- **Users**: Extended profile with user type (consumer/provider/admin), business details, verification status
- **Sessions**: Session tokens with IP/user agent tracking
- **Accounts**: OAuth and credential providers
- **Provider Profiles**: Shop details, KYC status, trust scores, categories, brands
- **Catalogs**: Product listings with pricing, stock status, location
- **RFQs**: Request for quotations with quote responses
- **Projects**: User project workspaces
- **Social**: Posts, comments, likes for community features
- **Notifications**: Real-time user notifications
- **Verification Docs**: KYC document uploads

**Note**: Current configuration shows PostgreSQL setup, but the application may use alternative databases (e.g., Turso/LibSQL) based on deployment environment.

### Multi-Platform Architecture (Planned)

Infrastructure setup indicates a **split architecture** with separate subdomains:
- `users.hub4estate.com` - Consumer platform
- `business.hub4estate.com` - Provider/business platform  
- `www.hub4estate.com` - Public marketing site

**Monorepo Structure** (in progress):
- `/apps/user` - Consumer-facing application
- `/apps/business` - Provider-facing application
- `/packages/ui` - Shared UI components
- `/packages/auth` - Shared authentication utilities
- `/packages/types` - Shared TypeScript types (Zod schemas)
- `/packages/api-client` - Shared API client
- `/packages/config` - Shared Tailwind/ESLint/TypeScript configs

**Package Manager**: pnpm with workspace protocol
**Build System**: Turbo for monorepo orchestration

### API Architecture

**API Routes** (Next.js App Router API):
- RESTful endpoints in `/api/*` directories
- Bearer token authentication via request headers
- Platform identification via `X-Platform` header
- Error handling with standardized responses

**Key API Endpoints**:
- `/api/auth/*` - Authentication flows
- `/api/users` - User CRUD operations
- `/api/catalogs` - Product catalog management
- `/api/rfqs` - RFQ creation and quote management
- `/api/social-posts` - Community feed
- `/api/notifications` - Real-time notifications
- `/api/verification-docs` - KYC document handling

### AI & Knowledge Features

**AI Assistant**: Multi-mode conversational interface
- **General Mode**: General real estate queries
- **Knowledge Mode**: Policy, laws, RERA regulations
- **Procurement Mode**: Material recommendations
- **Expert Mode**: Professional network connections
- **Dispute Mode**: Conflict resolution guidance

**Implementation**:
- Client-side chat interface with mode switching
- Message history with sources and disclaimers
- Integration points for LLM backends (implementation pending)

### Real-Time & Interactive Features

**Community System**:
- Social feed with posts, likes, comments
- User profiles with verification badges
- Trending content and engagement metrics

**Project Management**:
- Workspace for tracking tasks, budgets, timelines
- Collaborative tools for team members
- Document and media uploads

**Notification System**:
- Real-time notification center
- Polling mechanism (30s intervals)
- Read/unread status tracking

### Middleware & Request Processing

**Middleware Logic** (`middleware.ts`):
- Session validation for protected routes
- Role-based redirect logic (consumer/provider/admin)
- Public route patterns for unauthenticated access
- Cookie-based authentication flow

**Protected Routes**:
- `/dashboard` - Authenticated users only
- `/provider/*` - Provider-specific routes
- `/admin` - Admin access only
- `/projects` - Authenticated users

## External Dependencies

### Core Infrastructure

**Hosting Platform**: Vercel (recommended) or AWS/Custom
- DNS configuration for multi-subdomain setup
- SSL/TLS certificates (auto-provisioned or Let's Encrypt)
- Environment variable management
- Deployment pipelines via Turbo

**Database**: PostgreSQL (or compatible LibSQL/Turso)
- Connection string via `DATABASE_URL` environment variable
- Migration management via Drizzle Kit
- Connection pooling for production

### Third-Party Services

**Authentication**: Better Auth
- Session management and JWT handling
- OAuth provider integrations (Google, etc.)
- Password hashing and security

**UI Components**: Radix UI Primitives
- Headless accessible components
- Dialog, Dropdown, Popover, Tabs, etc.
- Full keyboard navigation support

**Animation**: Framer Motion
- Page transitions and micro-interactions
- Scroll-based animations
- Gesture handling

**Image Handling**: Next.js Image Optimization
- Remote pattern allowlist (all domains)
- Automatic WebP conversion
- Responsive image sizing

**Form Management**: React Hook Form + Zod
- Type-safe form validation
- Resolver pattern for schema integration
- Field-level and form-level errors

### Development Tools

**TypeScript**: Strict mode enabled
- Path aliases (`@/*` for `src/*`)
- Incremental compilation
- JSX preservation for Next.js

**Linting & Formatting**: ESLint + Prettier
- Next.js ESLint config
- Shared rules via monorepo packages
- Auto-formatting on save

**Build Tools**:
- Turbo for parallel builds
- Webpack customization for visual editing loader
- Output file tracing for optimized deployments

### Environment Variables Required

```
DATABASE_URL - PostgreSQL connection string
COOKIE_DOMAIN - Cross-subdomain cookie domain (.hub4estate.com)
JWT_AUD_USER - JWT audience for user platform
JWT_AUD_BIZ - JWT audience for business platform
NEXT_PUBLIC_SITE_URL - Public site URL for auth callbacks
```

### Visual Editing System

Custom Babel-based component tagging system for visual editing:
- Loader in `src/visual-edits/component-tagger-loader.js`
- Messenger for parent-child iframe communication
- Element hover, focus, and inline style preview
- Blacklist for Three.js and React Three Fiber elements