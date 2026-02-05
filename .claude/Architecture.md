# Application Architecture

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Application                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌───────────────┐  │  │
│  │  │   Routes   │  │ Components │  │  State Mgmt   │  │  │
│  │  └────────────┘  └────────────┘  └───────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/WebSocket
┌───────────────────────▼─────────────────────────────────────┐
│                  TanStack Start Server                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Nitro Server Runtime                        │  │
│  │  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │  │
│  │  │   API      │  │   Server   │  │  SSR Engine  │  │  │
│  │  │   Routes   │  │  Functions │  │              │  │  │
│  │  └────────────┘  └────────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ API Calls
┌───────────────────────▼─────────────────────────────────────┐
│                    Supabase Backend                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  PostgreSQL  │  │     Auth     │  │  File Storage    │ │
│  │   Database   │  │   Service    │  │                  │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
non-profit/
├── .claude/                      # AI Assistant context & documentation
│   ├── OrganizationMissionProcess.md
│   ├── ProjectOverview.md
│   ├── TechStack.md
│   ├── Architecture.md
│   ├── UserFlows.md
│   ├── DatabaseSchema.md
│   ├── DesignSystem.md
│   ├── FeatureSpecs.md
│   └── DevelopmentRoadmap.md
│
├── public/                       # Static assets
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt
│   └── images/                  # Static images
│
├── src/
│   ├── routes/                  # File-based routing
│   │   ├── __root.tsx          # Root layout
│   │   ├── index.tsx           # Home page
│   │   ├── intake/             # Intake form routes
│   │   │   ├── index.tsx       # Intake overview
│   │   │   ├── personality.tsx
│   │   │   ├── values.tsx
│   │   │   ├── aptitude.tsx
│   │   │   └── summary.tsx
│   │   ├── resources/          # Resource library
│   │   │   ├── index.tsx       # Resource hub
│   │   │   ├── financial/      # Financial resources
│   │   │   ├── careers/        # Career guides
│   │   │   ├── education/      # College/trade info
│   │   │   └── tools/          # Templates & tools
│   │   ├── dashboard/          # User dashboard
│   │   │   ├── index.tsx
│   │   │   ├── progress.tsx
│   │   │   └── saved.tsx
│   │   ├── auth/               # Auth pages
│   │   │   ├── login.tsx
│   │   │   ├── signup.tsx
│   │   │   └── reset-password.tsx
│   │   └── api/                # API routes
│   │       ├── assessments/
│   │       └── resources/
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   ├── Radio.tsx
│   │   │   ├── Progress.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── layout/             # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Container.tsx
│   │   ├── forms/              # Form components
│   │   │   ├── AssessmentForm.tsx
│   │   │   ├── MultiStepForm.tsx
│   │   │   ├── FormProgress.tsx
│   │   │   └── QuestionCard.tsx
│   │   └── features/           # Feature-specific
│   │       ├── intake/
│   │       │   ├── PersonalityQuiz.tsx
│   │       │   ├── ValuesSelector.tsx
│   │       │   └── AptitudeTest.tsx
│   │       ├── resources/
│   │       │   ├── ResourceCard.tsx
│   │       │   ├── ResourceFilter.tsx
│   │       │   └── ResourceSearch.tsx
│   │       └── dashboard/
│   │           ├── ProgressChart.tsx
│   │           ├── SavedItems.tsx
│   │           └── RecommendedActions.tsx
│   │
│   ├── lib/                     # Utilities & clients
│   │   ├── supabase.ts         # Supabase client
│   │   ├── auth.ts             # Auth helpers
│   │   ├── api.ts              # API utilities
│   │   ├── utils.ts            # General utilities
│   │   ├── constants.ts        # App constants
│   │   └── validation.ts       # Zod schemas
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useUser.ts          # User data hook
│   │   ├── useAssessment.ts    # Assessment state
│   │   ├── useResources.ts     # Resources fetching
│   │   └── useLocalStorage.ts  # Local storage hook
│   │
│   ├── types/                   # TypeScript types
│   │   ├── database.ts         # Database types
│   │   ├── user.ts             # User types
│   │   ├── assessment.ts       # Assessment types
│   │   ├── resource.ts         # Resource types
│   │   └── api.ts              # API types
│   │
│   ├── server/                  # Server functions
│   │   ├── auth/               # Auth logic
│   │   ├── assessments/        # Assessment handlers
│   │   ├── resources/          # Resource handlers
│   │   └── users/              # User management
│   │
│   ├── styles/                  # Global styles
│   │   ├── styles.css          # Main stylesheet
│   │   └── themes.css          # Theme variables
│   │
│   ├── router.tsx               # Router configuration
│   └── routeTree.gen.ts         # Generated route tree
│
├── .env                         # Environment variables (gitignored)
├── .env.example                 # Env template
├── package.json
├── tsconfig.json
├── vite.config.ts
├── biome.json
└── README.md
```

## Data Flow Patterns

### 1. Server Function Pattern (Preferred)

```typescript
// src/server/assessments/save.ts
import { createServerFn } from '@tanstack/react-start'
import { supabase } from '~/lib/supabase'

export const saveAssessment = createServerFn('POST', async (data: AssessmentData) => {
  // Server-side logic
  const { data: result, error } = await supabase
    .from('assessments')
    .insert(data)

  if (error) throw error
  return result
})

// src/components/Assessment.tsx
import { saveAssessment } from '~/server/assessments/save'

function Assessment() {
  const handleSubmit = async (data) => {
    const result = await saveAssessment(data)
    // Handle result
  }
}
```

**Benefits:**
- Type-safe client-server communication
- Automatic code splitting
- Server code never sent to client
- Simple, RPC-style API

### 2. API Route Pattern (For External Access)

```typescript
// src/routes/api/webhooks/stripe.ts
import { createAPIHandler } from '@tanstack/react-start'

export const POST = createAPIHandler(async ({ request }) => {
  const body = await request.json()
  // Handle webhook
  return new Response(JSON.stringify({ success: true }))
})
```

### 3. Client-Side State Pattern

```typescript
// src/hooks/useAssessment.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAssessment = create(
  persist(
    (set) => ({
      currentStep: 0,
      answers: {},
      setAnswer: (question, answer) =>
        set((state) => ({
          answers: { ...state.answers, [question]: answer }
        })),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
    }),
    { name: 'assessment-storage' }
  )
)
```

## Authentication Flow

```
┌──────────────┐
│   Browser    │
└──────┬───────┘
       │ 1. User visits protected route
       ▼
┌──────────────────┐
│  Route Loader    │ Check auth status
└──────┬───────────┘
       │ 2. No auth token
       ▼
┌──────────────────┐
│  Redirect to     │
│  Login Page      │
└──────┬───────────┘
       │ 3. User submits credentials
       ▼
┌──────────────────┐
│  Supabase Auth   │ Validate credentials
└──────┬───────────┘
       │ 4. Return JWT token
       ▼
┌──────────────────┐
│  Store in        │
│  Cookie/Session  │
└──────┬───────────┘
       │ 5. Redirect to dashboard
       ▼
┌──────────────────┐
│  Protected Route │ Load user data
└──────────────────┘
```

### Auth Implementation

```typescript
// src/lib/auth.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw redirect({ to: '/auth/login' })
  }
  return user
}

// src/routes/dashboard/index.tsx
export const Route = createFileRoute('/dashboard/')({
  beforeLoad: async () => {
    return { user: await requireAuth() }
  },
  component: Dashboard,
})
```

## Component Architecture

### Atomic Design Principles

1. **Atoms** - Basic UI elements (`Button`, `Input`, `Label`)
2. **Molecules** - Simple component combinations (`FormField`, `SearchBar`)
3. **Organisms** - Complex components (`AssessmentCard`, `ResourceGrid`)
4. **Templates** - Page layouts (`DashboardLayout`, `FormLayout`)
5. **Pages** - Route components (in `src/routes/`)

### Component Example

```typescript
// src/components/ui/Button.tsx
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'rounded-lg font-medium transition-colors',
          {
            'bg-lime-400 text-stone-900 hover:bg-lime-500': variant === 'primary',
            'bg-stone-200 text-stone-900 hover:bg-stone-300': variant === 'secondary',
            'border-2 border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-stone-900': variant === 'outline',
          },
          {
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-4 py-2 text-base': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      />
    )
  }
)
```

## Error Handling Strategy

### 1. Client-Side Errors

```typescript
// Error Boundary for React errors
// src/components/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
```

### 2. Server Function Errors

```typescript
// src/server/assessments/save.ts
import { createServerFn } from '@tanstack/react-start'

export const saveAssessment = createServerFn('POST', async (data) => {
  try {
    // Validate input
    const validated = AssessmentSchema.parse(data)

    // Save to database
    const result = await supabase
      .from('assessments')
      .insert(validated)

    if (result.error) {
      throw new Error(result.error.message)
    }

    return { success: true, data: result.data }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: 'Validation failed', details: error.errors }
    }
    return { success: false, error: 'Failed to save assessment' }
  }
})
```

### 3. Route-Level Error Handling

```typescript
// src/routes/dashboard/index.tsx
export const Route = createFileRoute('/dashboard/')({
  errorComponent: ({ error }) => (
    <div className="p-8 text-center">
      <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
      <p className="text-stone-600">{error.message}</p>
      <Button onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  ),
})
```

## Performance Optimization

### 1. Code Splitting
- Automatic route-based splitting via TanStack Router
- Dynamic imports for heavy components

### 2. Image Optimization
```typescript
// Use optimized image component
function OptimizedImage({ src, alt, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...props}
    />
  )
}
```

### 3. Caching Strategy
- Supabase queries cached via TanStack Query
- Static resources cached by CDN
- User data cached in local storage

### 4. Database Query Optimization
- Select only needed columns
- Use indexes for frequent queries
- Implement pagination for lists
- Use Supabase RLS for security + performance

## Security Architecture

### 1. Environment Variables
```bash
# .env (never commit this!)
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key # Server-only
```

### 2. Row Level Security (RLS)
```sql
-- Users can only read their own data
CREATE POLICY "Users can view own assessments"
ON assessments FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "Users can insert own assessments"
ON assessments FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### 3. Input Validation
- Client-side: React Hook Form + Zod
- Server-side: Zod schemas (always validate server-side)

## Testing Strategy

### Unit Tests
```typescript
// src/components/ui/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from './Button'

test('renders button with text', () => {
  render(<Button>Click me</Button>)
  expect(screen.getByText('Click me')).toBeInTheDocument()
})
```

### Integration Tests
- Test user flows (intake → resources → dashboard)
- Test form submissions
- Test authentication flows

### E2E Tests (Future)
- Playwright for critical paths
- Test full user journeys

## Deployment Architecture

### Vercel Deployment
```
┌─────────────────┐
│   Git Push      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Vercel Build   │ Build & optimize
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Edge Network   │ Deploy to CDN
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Live Site      │ https://compass-coaching.vercel.app
└─────────────────┘
```

### Environment Setup
- **Development**: Local + Supabase dev project
- **Staging**: Vercel preview + Supabase staging
- **Production**: Vercel production + Supabase production

## Monitoring & Analytics

### Error Tracking (Future)
- Sentry for error monitoring
- Custom error logging

### Analytics (Future)
- Plausible or Umami (privacy-focused)
- Track user progression through intake
- Resource access patterns
- Conversion metrics

### Performance Monitoring
- Web Vitals tracking (already installed)
- Vercel Analytics
- Lighthouse CI in pipeline
