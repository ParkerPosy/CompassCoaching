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
│   │   ├── __root.tsx          # Root layout with Header
│   │   ├── index.tsx           # Home page
│   │   ├── intake/             # Assessment flow (complete)
│   │   │   ├── index.tsx       # Landing page (/intake/)
│   │   │   ├── basic.tsx       # Basic info (5 questions)
│   │   │   ├── personality.tsx # Work style (8 questions)
│   │   │   ├── values.tsx      # Values rating (12 items)
│   │   │   ├── aptitude.tsx    # Career interests (32 items, 8 categories)
│   │   │   ├── challenges.tsx  # Constraints (9 fields)
│   │   │   ├── review.tsx      # Summary & submission
│   │   │   └── results.tsx     # Analysis & recommendations
│   │   ├── resources.tsx       # Resource library (basic)
│   │   ├── dashboard/          # User dashboard (planned)
│   │   │   ├── index.tsx
│   │   │   ├── progress.tsx
│   │   │   └── saved.tsx
│   │   ├── auth/               # Auth pages (planned)
│   │   │   ├── login.tsx
│   │   │   ├── signup.tsx
│   │   │   └── reset-password.tsx
│   │   └── api/                # API routes (planned)
│   │       ├── assessments/
│   │       └── resources/
│   │
│   ├── components/              # React components
│   │   ├── ui/                 # Base UI components (complete)
│   │   │   ├── button.tsx      # Button with variants & sizes
│   │   │   ├── card.tsx        # Card, CardHeader, CardTitle, CardContent
│   │   │   └── badge.tsx       # Badge with variants
│   │   ├── layout/             # Layout components (complete)
│   │   │   ├── Header.tsx      # Navigation header with menu
│   │   │   └── container.tsx   # Responsive container
│   │   ├── forms/              # Form components (planned)
│   │   │   ├── AssessmentForm.tsx
│   │   │   ├── MultiStepForm.tsx
│   │   │   ├── FormProgress.tsx
│   │   │   └── QuestionCard.tsx
│   │   └── features/           # Feature-specific (planned)
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
│   ├── lib/                     # Utilities & core logic (complete)
│   │   ├── storage.ts          # Storage abstraction layer
│   │   │                       # - IStorage interface
│   │   │                       # - LocalStorageAdapter (implemented)
│   │   │                       # - StorageService with CRUD methods
│   │   ├── analyzer.ts         # Assessment analysis engine
│   │   │                       # - Career field scoring algorithm
│   │   │                       # - Values ranking
│   │   │                       # - Personality insights generation
│   │   │                       # - Recommendations & next steps
│   │   ├── supabase.ts         # Supabase client (planned)
│   │   ├── auth.ts             # Auth helpers (planned)
│   │   ├── api.ts              # API utilities (planned)
│   │   ├── utils.ts            # General utilities (planned)
│   │   ├── constants.ts        # App constants (planned)
│   │   └── validation.ts       # Zod schemas (planned)
│   │
│   ├── hooks/                   # Custom React hooks (planned)
│   │   ├── useAuth.ts          # Authentication hook
│   │   ├── useUser.ts          # User data hook
│   │   ├── useAssessment.ts    # Assessment state
│   │   ├── useResources.ts     # Resources fetching
│   │   └── useLocalStorage.ts  # Local storage hook
│   │
│   ├── types/                   # TypeScript types (complete)
│   │   └── assessment.ts       # Complete assessment type system
│   │                           # - BasicInfo, PersonalityAnswers
│   │                           # - ValueRatings, AptitudeData
│   │                           # - ChallengesData, AssessmentResults
│   │                           # - AssessmentAnalysis with scoring
│   │
│   ├── server/                  # Server functions (planned)
│   │   ├── auth/               # Auth logic
│   │   ├── assessments/        # Assessment handlers
│   │   ├── resources/          # Resource handlers
│   │   └── users/              # User management
│   │
│   ├── styles/                  # Global styles
│   │   └── styles.css          # Tailwind imports & custom styles
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

### Current Implementation: Client-Side Storage with Abstraction Layer

The application currently uses a storage abstraction layer for maximum flexibility:

```typescript
// src/lib/storage.ts - Storage Abstraction
export interface IStorage {
  get<T>(key: string): T | null
  save<T>(key: string, value: T): void
  remove(key: string): void
  clearAll(): void
}

export class LocalStorageAdapter implements IStorage {
  get<T>(key: string): T | null {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  save<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value))
  }

  remove(key: string): void {
    localStorage.removeItem(key)
  }

  clearAll(): void {
    // Clear only assessment keys
    const keysToRemove = Object.keys(localStorage).filter(
      key => key.startsWith('assessment_')
    )
    keysToRemove.forEach(key => localStorage.removeItem(key))
  }
}

// StorageService provides high-level CRUD operations
export class StorageService {
  constructor(private adapter: IStorage) {}

  // Section-specific methods
  get<T>(key: StorageKey): T | null
  save<T>(key: StorageKey, value: T): void

  // Assessment flow methods
  compileResults(): AssessmentResults
  getResults(): AssessmentResults | null
  isComplete(section: string): boolean
  getProgress(): { completed: string[], total: number }
}
```

**Data Flow Through Assessment:**

```
User Input → Form State → StorageService.save()
→ LocalStorageAdapter → localStorage
→ Review Page (StorageService.get())
→ StorageService.compileResults()
→ Analyzer.analyzeAssessment()
→ Results Page Display
```

**Storage Keys:**
- `assessment_basic` - BasicInfo (5 fields)
- `assessment_personality` - PersonalityAnswers (8 questions)
- `assessment_values` - ValueRatings (12 values, 1-5 scale)
- `assessment_aptitude` - AptitudeData (32 items across 8 categories)
- `assessment_challenges` - ChallengesData (9 constraint fields)
- `assessment_results` - AssessmentResults (compiled with analysis)

### Assessment Analysis Engine

```typescript
// src/lib/analyzer.ts
export function analyzeAssessment(results: AssessmentResults): AssessmentAnalysis {
  // 1. Analyze aptitudes - calculate field scores
  const aptitudeAnalysis = analyzeAptitudes(results.aptitude)
  // Returns: { fieldName: score 0-100 }[] sorted by score

  // 2. Rank values - top 5 most important
  const valuesAnalysis = analyzeValues(results.values)
  // Returns: { value: string, rating: number }[] top 5

  // 3. Generate personality insights
  const personalityInsights = analyzePersonality(results.personality)
  // Returns: string[] of interpretive statements

  // 4. Create recommendations based on all factors
  const recommendations = generateRecommendations(/* all analyses */)
  // Returns: string[] personalized to user's profile

  // 5. Generate actionable next steps
  const nextSteps = generateNextSteps(/* challenges + top fields */)
  // Returns: string[] prioritized actions

  return {
    careerFields: aptitudeAnalysis,
    topValues: valuesAnalysis,
    personalityInsights,
    recommendations,
    nextSteps,
    completedAt: new Date().toISOString()
  }
}
```

**Career Scoring Algorithm:**
- Groups 32 aptitude items into 8 career categories
- Calculates average rating per category
- Converts to 0-100 scale (rating 1-5 → 0-100)
- Sorts fields by score, returns top 5 matches

### Future: Server Function Pattern (Planned)

When backend API is ready, replace LocalStorageAdapter with APIStorageAdapter:

```typescript
// src/lib/storage.ts - Future API Adapter
export class APIStorageAdapter implements IStorage {
  async get<T>(key: string): Promise<T | null> {
    const response = await fetch(`/api/storage/${key}`)
    return response.ok ? response.json() : null
  }

  async save<T>(key: string, value: T): Promise<void> {
    await fetch(`/api/storage/${key}`, {
      method: 'POST',
      body: JSON.stringify(value)
    })
  }
  // ... other methods
}

// Switch adapters via environment variable
const adapter = process.env.USE_API_STORAGE
  ? new APIStorageAdapter()
  : new LocalStorageAdapter()

export const storage = new StorageService(adapter)
```

For future features that require server-side processing:

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

### 2. API Route Pattern (For External Access)

For webhooks and external integrations:

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
