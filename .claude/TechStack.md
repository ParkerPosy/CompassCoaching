# Tech Stack & Architecture Decisions

## Core Framework: TanStack Start

**Why TanStack Start?**
- Full-stack React with file-based routing
- Built-in SSR, streaming, and progressive enhancement
- Server functions for type-safe client-server communication
- Excellent TypeScript support
- Deploy anywhere (Vercel, Netlify, Node.js, Cloudflare Workers)
- Modern, performant, and actively maintained

## Frontend Stack

### UI Framework
- **React 19** - Latest stable release with new features
- **TypeScript 5.7** - Type safety across the entire codebase
- **TanStack Router** - File-based routing with type-safe navigation

### Styling
- **Tailwind CSS 4.0** - Utility-first CSS with excellent DX
- **Custom CSS Variables** - For theme consistency
- **Responsive Design** - Mobile-first approach

### UI Components & Icons
- **Lucide React** (already installed) - Beautiful, consistent icon set
- **Custom Component Library** - Built on top of Tailwind
- Consider adding: **Radix UI** or **Headless UI** for complex components (modals, dropdowns, etc.)

### State Management
- **TanStack Query** (via react-router-ssr-query) - Server state management
- **React Context** - For global UI state (theme, user session)
- **URL State** - For shareable, bookmarkable state
- **Storage Abstraction Layer** - Type-safe CRUD with pluggable adapters
  - `IStorage` interface for adapter pattern
  - `LocalStorageAdapter` for client-side persistence (currently implemented)
  - `APIStorageAdapter` for server-side persistence (planned)
  - Supports assessment data, user preferences, and session state

### Form Handling
- **React Hook Form** - Performant form handling with validation (to be added)
- **Zod** - Schema validation that works client and server-side (to be added)
- **Custom Form Components** - Built with controlled inputs and TypeScript types

### Data Processing & Analysis
- **Assessment Analyzer** - Custom career matching algorithm
  - Calculates field scores from aptitude ratings
  - Ranks values and generates personality insights
  - Creates personalized recommendations
  - Generates actionable next steps
- **Type System** - Complete TypeScript interfaces for all assessment data

### Data Visualization
- **Custom Progress Bars** - Built with Tailwind for score displays
- **Recharts** or **Chart.js** (future) - For advanced progress tracking

## Backend Stack

### Server Runtime
- **Nitro** (already configured) - Universal JavaScript server
- Supports multiple deployment targets
- Built-in API routes

### Database Options

**Recommended: PostgreSQL with Prisma ORM**

**Why PostgreSQL?**
- Robust, reliable, and scalable
- Excellent TypeScript support via Prisma
- Free tier available on many platforms (Neon, Supabase, Railway)
- Great for relational data (users, assessments, resources)
- JSONB support for flexible schema evolution

**Prisma Benefits:**
- Type-safe database queries
- Automatic migrations
- Excellent DX with auto-completion
- Works with TanStack Start server functions

**Alternative Options:**
1. **Supabase** (PostgreSQL + Auth + Storage)
   - Built-in authentication
   - Real-time subscriptions
   - Storage for files
   - Generous free tier

2. **MongoDB with Mongoose**
   - Flexible schema
   - Good for rapid prototyping
   - Free tier on MongoDB Atlas

3. **SQLite with Turso** (for smaller scale)
   - Edge-compatible
   - Very simple setup
   - Good for MVP

**Recommendation**: Start with **Supabase** for MVP
- Gets us database + auth + storage in one
- Generous free tier
- Easy to scale
- Can still use Prisma client with it

### Authentication

**Recommended: Supabase Auth**
- Email/password authentication
- OAuth providers (Google, GitHub)
- Magic link emails
- Row Level Security (RLS) for data protection
- JWT-based sessions

**Alternative: Auth.js (formerly NextAuth.js)**
- Framework agnostic
- Multiple providers
- More control but more setup

### File Storage
- **Supabase Storage** - For user uploads, resources, documents
- **Cloudinary** (alternative) - For image optimization

### API Layer
- **TanStack Start Server Functions** - Type-safe RPC-style APIs
- **API Routes** - For webhooks, external integrations
- **tRPC** (future consideration) - For even stronger typing

## Development Tools

### Testing
- **Vitest** (already installed) - Fast unit testing
- **Testing Library** (already installed) - Component testing
- **Playwright** (add later) - E2E testing

### Code Quality
- **Biome** (already installed) - Linting and formatting
- **TypeScript strict mode** - Maximum type safety
- **Husky** (consider adding) - Git hooks for pre-commit checks

### Development Experience
- **TanStack Router Devtools** (installed) - Route debugging
- **TanStack Query Devtools** - Data fetching debugging
- **React Devtools** (installed) - Component debugging

## Deployment Options

### Recommended: Vercel
**Pros:**
- Zero-config deployment for TanStack Start
- Automatic SSL and CDN
- Preview deployments for PRs
- Generous free tier
- Excellent DX

**Cons:**
- Vendor lock-in (mitigated by TanStack Start portability)

### Alternatives:

1. **Netlify**
   - Similar to Vercel
   - Good free tier
   - Form handling features

2. **Cloudflare Pages + Workers**
   - Edge deployment
   - Very fast
   - Cost-effective at scale

3. **Railway / Render**
   - Full Node.js server
   - More control
   - Good for database hosting too

4. **Self-hosted VPS** (DigitalOcean, Linode)
   - Maximum control
   - Fixed costs
   - More maintenance

## Package Dependencies

### Current Dependencies
```json
{
  "@tanstack/react-router": "File-based routing",
  "@tanstack/react-start": "Full-stack framework",
  "react": "UI library",
  "tailwindcss": "Styling",
  "lucide-react": "Icons",
  "vite": "Build tool"
}
```

### Recommended Additions

**Phase 1 (MVP):**
```bash
npm install @supabase/supabase-js    # Database & Auth
npm install react-hook-form zod      # Forms
npm install @hookform/resolvers      # Form validation
npm install clsx tailwind-merge      # Class name utilities
npm install date-fns                 # Date handling
```

**Phase 2 (Enhanced Features):**
```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu  # UI primitives
npm install recharts                 # Data visualization
npm install react-markdown           # Markdown rendering
npm install @tanstack/react-query    # Advanced data fetching
```

**Optional Nice-to-Haves:**
```bash
npm install framer-motion            # Animations
npm install react-hot-toast          # Toast notifications
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   └── intake/         # Assessment flow
│       ├── index.tsx   # Landing page (/intake/)
│       ├── basic.tsx   # Basic info (5 questions)
│       ├── personality.tsx  # Work style (8 questions)
│       ├── values.tsx  # Values rating (12 items)
│       ├── aptitude.tsx    # Career interests (32 items)
│       ├── challenges.tsx  # Constraints (9 fields)
│       ├── review.tsx      # Summary & submission
│       └── results.tsx     # Analysis & recommendations
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components
│   │   ├── button.tsx  # Button with variants
│   │   ├── card.tsx    # Card components
│   │   └── badge.tsx   # Badge component
│   ├── layout/         # Layout components
│   │   └── container.tsx  # Responsive container
│   ├── forms/          # Form components (planned)
│   └── features/       # Feature-specific components (planned)
├── lib/                # Utilities and core logic
│   ├── storage.ts      # Storage abstraction layer
│   │                   # - IStorage interface
│   │                   # - LocalStorageAdapter
│   │                   # - StorageService class
│   ├── analyzer.ts     # Assessment analysis engine
│   │                   # - Career field scoring
│   │                   # - Values ranking
│   │                   # - Personality insights
│   │                   # - Recommendations generation
│   ├── supabase.ts     # Database client (planned)
│   ├── auth.ts         # Auth utilities (planned)
│   └── utils.ts        # General utilities
├── types/              # TypeScript types
│   └── assessment.ts   # Complete assessment type system
├── hooks/              # Custom React hooks (planned)
├── server/             # Server functions (planned)
└── styles/             # Global styles
    └── styles.css      # Tailwind importnents
│   └── features/       # Feature-specific components
├── lib/                # Utilities and helpers
│   ├── supabase.ts    # Database client
│   ├── auth.ts        # Auth utilities
│   └── utils.ts       # General utilities
├── types/              # TypeScript types
├── hooks/              # Custom React hooks
├── server/             # Server functions
└── styles/             # Global styles
```

### Design Patterns

1. **Component Composition** - Build complex UIs from simple components
2. **Custom Hooks** - Reusable logic extraction
3. **Server Functions** - Type-safe backend calls
4. **Optimistic Updates** - Better UX with instant feedback
5. **Progressive Enhancement** - Works without JS, better with JS

### Code Organization Principles

- **Colocation** - Keep related code close
- **Single Responsibility** - One component, one job
- **DRY** - Don't repeat yourself, but don't over-abstract
- **KISS** - Keep it simple, stupid
- **Type Safety** - If it compiles, it (mostly) works

## Performance Considerations

1. **Code Splitting** - Automatic with TanStack Router
2. **Image Optimization** - Use Next/Image patterns with Vite
3. **Lazy Loading** - Load components on demand
4. **Caching** - Leverage TanStack Query cache
5. **SSR** - Server render for fast initial load
6. **Streaming** - Stream long-running operations

## Security Best Practices

1. **Environment Variables** - Never commit secrets
2. **Input Validation** - Validate on client AND server
3. **SQL Injection Prevention** - Use Prisma/Supabase parameterized queries
4. **XSS Prevention** - React's built-in escaping + CSP headers
5. **CSRF Protection** - Use proper auth tokens
6. **Rate Limiting** - Prevent abuse (Upstash, Vercel limits)
7. **Row Level Security** - Database-level access control (Supabase RLS)

## Accessibility Standards

- **WCAG 2.1 AA Compliance** - Minimum target
- **Semantic HTML** - Proper heading hierarchy, landmarks
- **Keyboard Navigation** - All features accessible via keyboard
- **Screen Reader Support** - ARIA labels where needed
- **Color Contrast** - Meets AA standards (4.5:1 for text)
- **Focus Indicators** - Visible focus states

## Browser Support

- **Modern Evergreen Browsers** (last 2 versions)
  - Chrome, Firefox, Safari, Edge
- **Mobile Browsers**
  - Safari iOS, Chrome Android
- **No IE11 Support** - Modern JS features used

## Next Steps

1. Set up Supabase project
2. Install recommended dependencies
3. Configure authentication
4. Set up database schema
5. Create reusable UI components
