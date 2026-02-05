# Compass Coaching - Code Best Practices

This document outlines the coding standards and best practices for the Compass Coaching application.

## Table of Contents

1. [Project Structure](#project-structure)
2. [TypeScript Conventions](#typescript-conventions)
3. [React Patterns](#react-patterns)
4. [Data Management](#data-management)
5. [Styling & UI](#styling--ui)
6. [Routing](#routing)
7. [State Management](#state-management)
8. [Performance](#performance)
9. [Accessibility](#accessibility)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI primitives (Button, Card, etc.)
│   └── layout/         # Layout components (Container, etc.)
├── data/               # Static data and constants
│   └── resources.ts    # Single source of truth for resources
├── lib/                # Utility functions and helpers
│   └── storage.ts      # LocalStorage wrapper
├── routes/             # File-based routing (TanStack Router)
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Home page
│   ├── intake/         # Assessment routes
│   └── resources/      # Resource category routes
├── types/              # Shared TypeScript types
└── styles.css          # Global styles
```

### Rules

- **Single Responsibility**: Each file should have one primary purpose
- **Colocation**: Keep related files together (components, types, utilities)
- **Flat Structure**: Avoid deeply nested directories (max 3 levels)

## TypeScript Conventions

### Type Definitions

```typescript
// ✅ Good: Explicit interfaces in separate types file or at top of file
export interface Resource {
  title: string
  type: string
  duration: string
  category: string
}

// ✅ Good: Use 'as const' for constant objects
export const RESOURCE_TYPES = {
  TOOL: "Tool",
  GUIDE: "Guide",
  ARTICLE: "Article",
} as const

// ❌ Bad: Inline types repeated across files
const resource: { title: string; type: string } = { ... }
```

### Rules

- Always use **explicit types** for function parameters and return values
- Use **interfaces** for object shapes that may be extended
- Use **type** for unions, intersections, and mapped types
- Use **const assertions** (`as const`) for literal constants
- Avoid `any` - use `unknown` or proper types instead
- Export shared types from a central location

## React Patterns

### Component Structure

```typescript
// ✅ Good: Clear component structure
import { useState } from 'react'
import type { ComponentProps } from './types'

export default function MyComponent({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState()

  // 2. Derived values
  const computedValue = useMemo(() => ..., [state])

  // 3. Event handlers
  const handleClick = () => { ... }

  // 4. Render
  return <div>...</div>
}
```

### Naming Conventions

- **Components**: PascalCase (`Header.tsx`, `ResourceCard.tsx`)
- **Hooks**: camelCase with 'use' prefix (`useAssessmentProgress`)
- **Event Handlers**: camelCase with 'handle' prefix (`handleSubmit`, `handleClick`)
- **Boolean Props**: Use 'is', 'has', 'should' prefix (`isOpen`, `hasError`, `shouldShow`)

### Rules

- Use **default exports** for page components
- Use **named exports** for utilities and shared components
- Keep components **small and focused** (< 200 lines)
- Extract complex logic into **custom hooks**
- Use **TypeScript** for all props (no PropTypes)

## Data Management

### Single Source of Truth

```typescript
// ✅ Good: Centralized data with constants
// src/data/resources.ts
export const RESOURCE_TYPES = { ... } as const
export const CATEGORY_NAMES = { ... } as const
export const ALL_RESOURCES: Resource[] = [ ... ]

// Helper functions for data access
export function getResourcesByCategory(category: string): Resource[] {
  return ALL_RESOURCES.filter(r => r.category === category)
}

// ❌ Bad: Duplicated data across files
const resources = [...] // in file 1
const moreResources = [...] // in file 2
```

### Rules

- Create **constants** for repeated values (types, categories, paths)
- Store master data in `src/data/` directory
- Use **helper functions** to compute derived data
- Never hardcode paths - compute them dynamically from data
- Keep data separate from UI logic

## Styling & UI

### Tailwind CSS

```typescript
// ✅ Good: Semantic class composition
<button className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-medium transition-colors">
  Click Me
</button>

// ✅ Good: Conditional classes with template literals
<div className={`flex items-center ${isActive ? 'bg-lime-50 text-lime-700' : 'text-stone-700'}`}>

// ❌ Bad: Inline styles for things Tailwind handles
<button style={{ padding: '8px 16px', backgroundColor: '#84cc16' }}>
```

### Color Palette

- **Primary**: `lime-500` (brand green)
- **Text**: `stone-900` (dark), `stone-600` (medium), `stone-400` (light)
- **Backgrounds**: `stone-50` (light), `stone-100` (subtle)
- **Borders**: `stone-200` (default), `lime-300` (hover)
- **Accents**: `lime-400` (bright), `lime-600` (dark accent)

### Rules

- Use **Tailwind classes** exclusively (no inline styles or CSS files)
- Follow the **existing color palette** - don't introduce new colors
- Use **transition classes** for smooth interactions (`transition-colors`, `transition-all`)
- Use **responsive prefixes** (`md:`, `lg:`) for mobile-first design
- Keep class names in **logical order**: layout → spacing → colors → typography → effects

## Routing

### TanStack Router

```typescript
// ✅ Good: File-based routing with proper exports
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resources/')({
  component: ResourcesPage,
})

function ResourcesPage() {
  return <div>...</div>
}

// ✅ Good: Navigation with type safety
import { useNavigate, Link } from '@tanstack/react-router'

const navigate = useNavigate()
navigate({ to: '/resources/career-exploration' })

<Link to="/resources">Resources</Link>
```

### Rules

- Use **file-based routing** - file structure matches URL structure
- Export `Route` using `createFileRoute`
- Use **Link** for declarative navigation
- Use **useNavigate** for programmatic navigation
- Leverage **activeProps** for active link styling
- Keep route components **focused on layout and data fetching**

## State Management

### Local Storage

```typescript
// ✅ Good: Use storage wrapper
import { storage } from '@/lib/storage'

const data = storage.get('assessment_basic')
storage.set('assessment_basic', formData)

// ❌ Bad: Direct localStorage access
const data = JSON.parse(localStorage.getItem('key') || '{}')
```

### Component State

```typescript
// ✅ Good: Colocated state
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState(initialData)

  // ... component logic
}

// ✅ Good: Computed state with useMemo
const filteredItems = useMemo(() => {
  return items.filter(item => item.active)
}, [items])
```

### Rules

- Use **useState** for simple component state
- Use **useMemo** for expensive computations
- Use **useEffect** for side effects (with proper cleanup)
- Store persistent data in **localStorage** via storage wrapper
- Avoid prop drilling - use **context** for deeply nested shared state

## Performance

### Optimization Patterns

```typescript
// ✅ Good: Memoize expensive calculations
const filteredResources = useMemo(() => {
  return ALL_RESOURCES.filter(r => r.category === selectedCategory)
}, [selectedCategory])

// ✅ Good: Lazy loading for routes (if needed)
const HeavyComponent = lazy(() => import('./HeavyComponent'))

// ✅ Good: Limit results for large lists
const results = searchResults.slice(0, 8)
```

### Rules

- **Memoize** expensive computations with `useMemo`
- **Debounce** search inputs and frequent updates
- **Limit** large lists (pagination or slicing)
- **Lazy load** heavy components or routes if needed
- Profile before optimizing - don't premature optimize

## Accessibility

### Best Practices

```typescript
// ✅ Good: Semantic HTML
<button onClick={handleClick}>Click me</button>

// ✅ Good: ARIA labels for icon-only buttons
<button aria-label="Open menu" onClick={handleMenu}>
  <Menu />
</button>

// ✅ Good: Keyboard navigation
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>

// ❌ Bad: Div as button without accessibility
<div onClick={handleClick}>Click me</div>
```

### Rules

- Use **semantic HTML** (`<button>`, `<nav>`, `<main>`, `<article>`)
- Add **aria-label** for icon-only elements
- Ensure **keyboard navigation** works (Tab, Enter, Escape)
- Provide **focus indicators** (Tailwind's `focus:` classes)
- Test with **keyboard only** navigation
- Use appropriate **color contrast** (AA minimum)

## Code Review Checklist

Before committing code, verify:

- [ ] TypeScript types are explicit (no `any`)
- [ ] Components are under 200 lines
- [ ] Constants are extracted and centralized
- [ ] No duplicate data or logic
- [ ] Tailwind classes follow order convention
- [ ] No inline styles (use Tailwind)
- [ ] Proper semantic HTML elements
- [ ] Aria labels on icon buttons
- [ ] Links use `<Link>` component
- [ ] Navigation uses `useNavigate` hook
- [ ] LocalStorage accessed via storage wrapper
- [ ] Expensive computations are memoized
- [ ] Event handlers have descriptive names
- [ ] File names match content (PascalCase for components)

## Common Patterns

### Dropdown/Collapsible Menu

```typescript
const [isOpen, setIsOpen] = useState(false)

<button onClick={() => setIsOpen(!isOpen)}>
  Toggle
  {isOpen ? <ChevronDown /> : <ChevronRight />}
</button>

{isOpen && (
  <div>Menu content</div>
)}
```

### Dynamic Icon Rendering

```typescript
// When icon is a component reference
const Icon = category.icon
<Icon className="w-5 h-5" />
```

### Progress Tracking

```typescript
const completedCount = items.filter(item => item.completed).length
const percentage = (completedCount / items.length) * 100

<div style={{ width: `${percentage}%` }} className="h-2 bg-lime-500" />
```

## Git Workflow

### Commit Messages

```
feat: add resource search dropdown
fix: correct navigation menu overflow
refactor: extract resource data to constants
docs: update best practices guide
style: format code with Biome
```

### Rules

- Use **conventional commits** format
- Keep commits **focused and atomic**
- Write **descriptive** commit messages
- Format code with `npm run format` before committing
- Run `npm run check` to catch issues

## Tools

- **Formatter**: Biome (`npm run format`)
- **Linter**: Biome (`npm run lint`)
- **Type Checker**: TypeScript (`tsc --noEmit`)
- **Dev Server**: Vite (`npm run dev`)
- **Browser DevTools**: React DevTools, TanStack Router DevTools

---

**Last Updated**: February 4, 2026

**Maintainers**: Keep this document updated as patterns evolve. Review quarterly.
