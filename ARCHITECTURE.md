# Compass Coaching - Architecture Overview

## Mission

Compass Coaching is a career and life guidance platform. It provides resources across two pillars:
- **Career Guidance**: Career exploration, job search, professional development, and financial planning
- **Life Guidance**: Mental wellbeing, interpersonal relationships, and healthy living (framed as a wellbeing tool, not specialized fitness training)

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    React Application                   │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │  │   Routes    │  │  Components  │  │     Data     │  │  │
│  │  │  (Pages)    │◄─┤   (UI)       │◄─┤  (Constants) │  │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘  │  │
│  │         │                 │                  │          │  │
│  │         └─────────────────┼──────────────────┘          │  │
│  │                           │                              │  │
│  │                    ┌──────▼──────┐                      │  │
│  │                    │   Storage   │                      │  │
│  │                    │ (LocalStore)│                      │  │
│  │                    └─────────────┘                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Framework
- **React 19.2**: UI library with hooks and concurrent features
- **TypeScript 5.7**: Type-safe JavaScript with strict mode enabled
- **Vite 7.1**: Fast build tool and dev server

### Routing
- **TanStack Router 1.132**: File-based routing with type safety
- Automatic route generation from file structure
- Type-safe navigation and params

### Styling
- **Tailwind CSS 4.0**: Utility-first CSS framework
- Custom color palette based on lime-500 primary
- Responsive design with mobile-first approach

### State Management
- **Local Component State**: React useState for UI state
- **LocalStorage**: Persistent storage for assessment data
- **Computed State**: useMemo for derived values
- No global state management library (Redux, Zustand, etc.) - intentionally kept simple

### Developer Tools
- **Biome 2.2**: Fast formatter and linter (replaces ESLint + Prettier)
- **TypeScript**: Strict type checking
- **React DevTools**: Component inspection
- **TanStack Router DevTools**: Route debugging

## Data Flow

### Assessment Flow
```
User Input (Form)
    ↓
Validation (Component)
    ↓
LocalStorage (storage.set)
    ↓
Progress Calculation (Header)
    ↓
UI Update (Progress Bar)
```

### Resource Navigation Flow
```
User Search/Click
    ↓
Filter Resources (useMemo)
    ↓
Get Category Path (helper)
    ↓
Navigate (useNavigate)
    ↓
Render Dynamic Page (category data)
```

## File Organization

### Route Structure
```
routes/
├── __root.tsx              # Root layout with Header
├── index.tsx               # Home page
├── contact.tsx             # Contact page
├── intake/                 # Assessment flow
│   ├── basic.tsx          # Step 1: Basic info
│   ├── personality.tsx    # Step 2: Personality
│   ├── values.tsx         # Step 3: Values
│   ├── aptitude.tsx       # Step 4: Career aptitude
│   ├── challenges.tsx     # Step 5: Challenges
│   ├── review.tsx         # Review all answers
│   └── results.tsx        # Assessment results
└── resources/              # Resource library
    ├── index.tsx          # Resource hub
    └── $categorySlug.tsx  # Dynamic category pages
```

### Component Structure
```
components/
├── ui/                     # Base UI primitives
│   ├── button.tsx         # Button component
│   ├── card.tsx           # Card component
│   ├── badge.tsx          # Badge component
│   └── input.tsx          # Input component
├── layout/                 # Layout components
│   └── container.tsx      # Centered container
└── Header.tsx              # Site navigation
```

### Data Structure
```
data/
└── resources.ts            # Resource definitions
    ├── RESOURCE_TYPES      # Type constants
    ├── CATEGORY_NAMES      # Category constants (career + life guidance)
    ├── ALL_RESOURCES       # Master resource list (90 resources)
    ├── RESOURCE_CATEGORIES # Category metadata (15 categories)
    └── Helper functions    # Data access functions
```

## Key Design Decisions

### 1. File-Based Routing
**Decision**: Use TanStack Router with file-based routing
**Rationale**:
- Type-safe routing out of the box
- Clear relationship between URLs and files
- Automatic route generation
- Better than manual route configuration

**Trade-off**: Requires understanding of file naming conventions ($ for params)

### 2. LocalStorage for Persistence
**Decision**: Store assessment data in browser LocalStorage
**Rationale**:
- No backend required
- Instant persistence
- Privacy-friendly (data stays on device)
- Simple implementation

**Trade-off**: Data is not synced across devices

### 3. Centralized Data Management
**Decision**: Single source of truth in `src/data/` directory
**Rationale**:
- Eliminates duplication
- Easy to update content
- Consistent presentation
- Type-safe data access

**Trade-off**: Less flexibility for page-specific customization

### 4. Tailwind CSS Only
**Decision**: No CSS-in-JS, CSS modules, or separate CSS files
**Rationale**:
- Consistent styling approach
- No style conflicts
- Faster development
- Smaller bundle size

**Trade-off**: Long class names in JSX

### 5. No Global State Library
**Decision**: Use local state + LocalStorage instead of Redux/Zustand
**Rationale**:
- App is simple enough
- Avoids unnecessary complexity
- Better performance (no global re-renders)
- Easier to understand

**Trade-off**: May need refactoring if app grows significantly

## Component Patterns

### Page Component Pattern
```typescript
// 1. Route definition
export const Route = createFileRoute('/path')({
  component: PageComponent,
})

// 2. Component definition
function PageComponent() {
  // 3. Hooks (state, params, navigation)
  const params = Route.useParams()
  const navigate = useNavigate()

  // 4. Data fetching/computation
  const data = getData(params)

  // 5. Event handlers
  const handleAction = () => { ... }

  // 6. Render
  return <div>...</div>
}
```

### Reusable Component Pattern
```typescript
// 1. Type definition
interface ComponentProps {
  title: string
  onClick?: () => void
}

// 2. Component with default export
export default function Component({ title, onClick }: ComponentProps) {
  return <div onClick={onClick}>{title}</div>
}
```

## Performance Considerations

### Current Optimizations
1. **useMemo** for filtered/computed data
2. **Lazy loading** for route components (automatic with Vite)
3. **Limited results** in search (max 8 items)
4. **Tailwind purging** removes unused styles

### Future Optimizations
1. React.memo() for expensive components
2. Virtual scrolling for long lists
3. Image optimization
4. Code splitting for heavy dependencies

## Security & Privacy

### Current Approach
- **No backend**: All data stays on client
- **No tracking**: No analytics or third-party scripts
- **No PII collection**: Assessment data is anonymous
- **LocalStorage only**: Data never leaves the browser
- **Wellbeing resources**: Life guidance content is educational and supportive, not clinical. Not a substitute for professional mental health services.

### Future Considerations
- Content Security Policy (CSP) headers
- Subresource Integrity (SRI) for CDN assets
- Regular dependency updates for security patches

## Accessibility (a11y)

### Current Implementation
- Semantic HTML elements
- ARIA labels on icon buttons
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

### Future Improvements
- Screen reader testing
- ARIA live regions for dynamic content
- Skip to content link
- Reduced motion support

## Browser Support

### Target Browsers
- Chrome/Edge: Last 2 versions
- Firefox: Last 2 versions
- Safari: Last 2 versions
- Mobile Safari: iOS 15+
- Chrome Android: Last 2 versions

### Polyfills
None required - modern APIs used have good support

## Development Workflow

### Local Development
```bash
npm run dev          # Start dev server on localhost:3000
npm run format       # Format code with Biome
npm run lint         # Lint code with Biome
npm run check        # Run both format and lint
```

### Build Process
```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality Gates
1. TypeScript compilation must pass
2. Biome checks must pass (format + lint)
3. No console errors in browser
4. Manual testing of changed features

## Deployment

### Build Output
- Static HTML, CSS, JS files
- No server-side rendering (SSR)
- Can be deployed to any static host

### Hosting Options
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any CDN/static host

### Environment Variables
Currently none required - all configuration is hard-coded

## Monitoring & Analytics

### Current State
No analytics or monitoring implemented

### Future Considerations
- Privacy-respecting analytics (e.g., Plausible, Fathom)
- Error tracking (e.g., Sentry)
- Performance monitoring (Web Vitals)

## Future Architecture Considerations

### If the app grows significantly, consider:

1. **Backend API**
   - User accounts and authentication
   - Cross-device sync
   - Personalized recommendations
   - Data analytics

2. **Database**
   - User profiles
   - Assessment history
   - Progress tracking
   - Resource ratings/favorites

3. **State Management**
   - Redux Toolkit or Zustand for complex state
   - React Query for server state
   - URL state for shareable pages

4. **Advanced Features**
   - Real-time collaboration
   - AI-powered recommendations
   - Video/audio resources
   - Community features

5. **Infrastructure**
   - CDN for global performance
   - Edge functions for personalization
   - Background jobs for processing
   - Email notifications

---

**Document Version**: 1.0
**Last Updated**: February 4, 2026
**Author**: Development Team
**Next Review**: March 2026
