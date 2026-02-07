# Occupational Data Infrastructure

This document describes the infrastructure for displaying and managing Pennsylvania occupational wage data using TanStack Table and TanStack Query with server-side pagination.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React App (Client)                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  QueryClientProvider (React Query)                    │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  CareersPage (/careers route)                   │  │  │
│  │  │  ├─ Loader (prefetches server data)             │  │  │
│  │  │  └─ OccupationsTable Component                  │  │  │
│  │  │     ├─ useQuery hook → Server Functions         │  │  │
│  │  │     ├─ TanStack Table (UI)                       │  │  │
│  │  │     └─ Pagination, Sorting, Filtering           │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓ (API calls via TanStack Start)
┌─────────────────────────────────────────────────────────────┐
│                   Server (TanStack Start)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Server Functions (occupationService.ts)             │  │
│  │  ├─ fetchPaginatedOccupations (POST)                 │  │
│  │  ├─ getEducationLevelOptions (GET)                   │  │
│  │  └─ getSalaryRangeBoundaries (GET)                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
         ↓                                    ↓
┌─────────────────────┐           ┌──────────────────────┐
│   wages.ts          │←──────────│  occupations.json    │
│ (Data utilities)    │           │  (810+ records)      │
└─────────────────────┘           └──────────────────────┘
```

## 📁 File Structure

```
src/
├── routes/
│   ├── __root.tsx                    # QueryClientProvider setup
│   └── careers.tsx                    # Main careers page route
├── components/
│   ├── OccupationsTable.tsx           # TanStack Table component
│   └── ui/
│       ├── button.tsx                 # Button component (updated)
│       └── input.tsx                  # Search input
├── lib/
│   ├── occupationService.ts           # TanStack Start server functions
│   ├── wages.ts                       # Wage data utilities
│   └── seo.ts                         # SEO constants
├── types/
│   └── wages.ts                       # TypeScript types
└── data/
    └── occupations.json               # 810+ PA occupations
```

## 🔧 Components

### 1. QueryClientProvider Setup

**Location**: `src/routes/__root.tsx`

Sets up TanStack Query with sensible defaults:
- 5-minute stale time
- 10-minute garbage collection
- No auto-refetch on window focus
- React Query DevTools included

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 2. Server Functions (Occupation Service)

**Location**: `src/lib/occupationService.ts`

**Technology**: TanStack Start Server Functions

Provides real server-side data fetching using TanStack Start's `createServerFn()` API. These functions run exclusively on the server and are called via API endpoints automatically generated by TanStack Start.

```typescript
interface OccupationQueryParams {
  page: number;              // Current page (1-indexed)
  pageSize: number;          // Items per page
  sortBy?: keyof Occupation; // Sort column
  sortOrder?: 'asc' | 'desc';
  search?: string;           // Search term
  educationLevel?: string[]; // Filter by education
  minSalary?: number;        // Minimum salary filter
  maxSalary?: number;        // Maximum salary filter
}

interface PaginatedOccupations {
  data: Occupation[];
  meta: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
```

**Server Functions**:
- `fetchPaginatedOccupations(params)` - POST endpoint for paginated data
- `getEducationLevelOptions()` - GET endpoint for filter options
- `getSalaryRangeBoundaries()` - GET endpoint for salary ranges

**How It Works**:
```typescript
// Define a server function
export const fetchPaginatedOccupations = createServerFn('POST', async (params) => {
  // This code ONLY runs on the server
  const data = getAllOccupations();
  // ... filtering, sorting, pagination logic
  return paginatedResult;
});

// Call from client component
const { data } = useQuery({
  queryKey: ['occupations', params],
  queryFn: () => fetchPaginatedOccupations(params), // Automatic API call
});
```

**Benefits**:
- True server-side execution (data never sent to client until filtered)
- Automatic API endpoint generation
- Type-safe client-server communication
- No artificial delays - real network performance
- Ready to connect to database or external APIs

### 3. OccupationsTable Component

**Location**: `src/components/OccupationsTable.tsx`

Full-featured data table with:
- **Pagination**: Navigate between pages, adjust page size
- **Sorting**: Click column headers to sort
- **Search**: Filter by occupation title or SOC code
- **Loading states**: Skeleton UI while fetching
- **Error handling**: Displays error messages
- **Empty states**: Friendly message when no results

**Columns**:
1. SOC Code (e.g., "11-1011")
2. Occupation Title (sortable)
3. Education Level
4. Median Salary - PA (sortable)
5. Salary Range (entry to experienced)
6. Counties Available

**Props**:
```typescript
interface OccupationsTableProps {
  initialPageSize?: number; // Default: 20
}
```

### 4. Careers Page

**Location**: `src/routes/careers.tsx`

Full page featuring:
- **Server-side loader**: Prefetches initial page data for instant rendering
- Hero section with key features
- OccupationsTable component
- Usage instructions
- Next steps (CTA to assessment)
- Data source disclaimer

**Server-Side Rendering**:
```typescript
export const Route = createFileRoute('/careers')({
  loader: async ({ context }) => {
    // Prefetch data on the server before rendering
    await context.queryClient.ensureQueryData({
      queryKey: ['occupations', { pageIndex: 0, pageSize: 20 }, [], ''],
      queryFn: async () => await fetchPaginatedOccupations({ /* ... */ }),
    });
  },
  component: CareersPage,
});
```

**SEO Optimized**:
- Dynamic meta tags from `SALARY_SEO`
- Structured content for search engines
- Fast initial page load with server-rendered data

## 🎨 UI/UX Features

### Pagination
- **Previous/Next buttons**: Navigate pages
- **Page numbers**: Quick jump to specific page
- **Smart pagination**: Shows 5 pages at a time, adjusts based on current page
- **Page size selector**: 10, 20, 50, 100 items per page

### Search
- **Real-time search**: Updates as you type
- **Debounced queries**: Reduces API calls (React Query handles caching)
- **Searches**: Occupation title and SOC code

### Sorting
- **Click headers**: Toggle sort direction
- **Visual indicators**: Arrow icons show sort state
- **Multi-column**: Can sort by title or salary

### Loading States
- **Skeleton loader**: Centered spinner with message
- **Placeholder data**: Keeps previous data visible while fetching new
- **Smooth transitions**: No jarring UI shifts

## 🔌 Extending Server Functions

The current implementation uses TanStack Start server functions with in-memory data. To connect to a database:

### Connect to a Database

```typescript
// src/lib/occupationService.ts
import { createServerFn } from '@tanstack/react-start';
import { db } from './db'; // Your database client (Prisma, Drizzle, etc.)

export const fetchPaginatedOccupations = createServerFn('POST', async (
  params: OccupationQueryParams
): Promise<PaginatedOccupations> => {
  // Query your database
  const [data, totalCount] = await Promise.all([
    db.occupations.findMany({
      where: {
        title: { contains: params.search, mode: 'insensitive' },
        educationLevel: { in: params.educationLevel },
        // ... other filters
      },
      orderBy: { [params.sortBy]: params.sortOrder },
      skip: (params.page - 1) * params.pageSize,
      take: params.pageSize,
    }),
    db.occupations.count({ where: { /* same filters */ } }),
  ]);

  return {
    data,
    meta: {
      page: params.page,
      pageSize: params.pageSize,
      totalCount,
      totalPages: Math.ceil(totalCount / params.pageSize),
      hasNextPage: params.page < Math.ceil(totalCount / params.pageSize),
      hasPreviousPage: params.page > 1,
    },
  };
});
```

### Add Caching Layer

```typescript
import { createServerFn } from '@tanstack/react-start';
import { redis } from './cache';

export const fetchPaginatedOccupations = createServerFn('POST', async (params) => {
  const cacheKey = `occupations:${JSON.stringify(params)}`;

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const result = await db.occupations.findMany(/* ... */);

  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(result));

  return result;
});
```

### Add Authentication

```typescript
import { createServerFn } from '@tanstack/react-start';

export const fetchPaginatedOccupations = createServerFn('POST', async (
  params: OccupationQueryParams,
  { request } // Access the Request object
): Promise<PaginatedOccupations> => {
  // Check authentication
  const session = await getSession(request);
  if (!session) {
    throw new Error('Unauthorized');
  }

  // Proceed with query
  // ...
});

## 📊 Data Flow

```
┌──────────────────── CLIENT ────────────────────┐
│                                                 │
│  User Action (search/sort/paginate)            │
│           ↓                                     │
│  State Update (React)                          │
│           ↓                                     │
│  Query Key Change                              │
│           ↓                                     │
│  React Query (useQuery)                        │
│           ↓                                     │
└─────────────────────┼───────────────────────────┘
                      │
                      │ HTTP POST Request
                      │ (JSON payload)
                      ↓
┌──────────────────── SERVER ────────────────────┐
│                                                 │
│  TanStack Start Server Function                │
│  fetchPaginatedOccupations()                   │
│           ↓                                     │
│  Load Data (occupations.json or DB)            │
│           ↓                                     │
│  Apply Filters (search, education, salary)     │
│           ↓                                     │
│  Sort Data                                      │
│           ↓                                     │
│  Paginate Results                              │
│           ↓                                     │
│  Return PaginatedOccupations                   │
│                                                 │
└─────────────────────┼───────────────────────────┘
                      │
                      │ HTTP Response
                      │ (JSON)
                      ↓
┌──────────────────── CLIENT ────────────────────┐
│                                                 │
│  React Query Cache                             │
│           ↓                                     │
│  Component Re-render                           │
│           ↓                                     │
│  Table Display Updates                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 🧪 Testing Scenarios

### Test Cases
1. **Load page**: Should display first 20 occupations
2. **Search**: Type "nurse" → Should filter results
3. **Sort by title**: Click header → Should sort A-Z
4. **Sort by salary**: Click header → Should sort low to high
5. **Change page size**: Select 50 → Should show 50 items
6. **Navigate pages**: Click next → Should load page 2
7. **No results**: Search "xyz123" → Should show empty state
8. **Fast actions**: Rapidly change filters → Should debounce properly

## 🚀 Performance Optimizations

### Current
- **React Query caching**: 5-minute stale time prevents unnecessary fetches
- **Placeholder data**: Smooth transition between pages
- **Lazy loading**: Only loads visible data (20 items at a time)
- **Memoized columns**: Prevents unnecessary re-renders

### Future Optimizations
- **Virtual scrolling**: For very large datasets (use @tanstack/react-virtual)
- **Index-based pagination**: Cursor-based pagination for real-time data
- **Web Workers**: Move filtering/sorting to background thread
- **Server-side rendering**: Pre-render first page for SEO

## 🎯 Adding Filters

To add new filters (e.g., salary range slider):

### 1. Update Service Interface

```typescript
export interface OccupationQueryParams {
  // ... existing params
  minSalary?: number;
  maxSalary?: number;
}
```

### 2. Add Filter Logic

```typescript
// In fetchPaginatedOccupations
if (params.minSalary || params.maxSalary) {
  allOccupations = allOccupations.filter(occ => {
    const median = occ.wages.statewide.annual.median;
    if (!median) return false;
    if (params.minSalary && median < params.minSalary) return false;
    if (params.maxSalary && median > params.maxSalary) return false;
    return true;
  });
}
```

### 3. Add UI Component

```tsx
// In OccupationsTable
const [salaryRange, setSalaryRange] = useState([20000, 200000]);

<div className="flex gap-4">
  <input
    type="range"
    min={20000}
    max={200000}
    value={salaryRange[0]}
    onChange={(e) => setSalaryRange([Number(e.target.value), salaryRange[1]])}
  />
  {/* Add to query key for React Query */}
</div>
```

### 4. Update Query Key

```typescript
const { data } = useQuery({
  queryKey: ['occupations', pagination, sorting, search, salaryRange],
  //                                                      ^^^^^^^^^^^
  queryFn: () =>
    fetchPaginatedOccupations({
      // ... other params
      minSalary: salaryRange[0],
      maxSalary: salaryRange[1],
    }),
});
```

## 🔗 Related Documentation

- [TanStack Table Docs](https://tanstack.com/table/latest)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Wage Data Types](../types/wages.ts)
- [SEO Best Practices](../../SEO_BEST_PRACTICES.md)

## 📝 Future Enhancements

### Phase 1: Basic Filters ✅ (Current)
- [x] Search by occupation title
- [x] Sort by title and salary
- [x] Pagination with page size control

### Phase 2: Advanced Filters
- [ ] Education level multi-select
- [ ] Salary range slider
- [ ] County filter dropdown
- [ ] Export to CSV

### Phase 3: Detail Pages
- [ ] Individual occupation pages (`/careers/:socCode`)
- [ ] County comparison charts
- [ ] Related occupations suggestions
- [ ] Career path visualizations

### Phase 4: Advanced Features
- [ ] Save favorite occupations
- [ ] Compare multiple occupations side-by-side
- [ ] Salary calculator based on experience
- [ ] Integration with assessment results

## 💡 Tips & Best Practices

1. **Query Keys**: Always include all filter parameters in query keys
2. **Optimistic Updates**: Use React Query's optimistic updates for instant feedback
3. **Error Boundaries**: Wrap table component in error boundary
4. **Accessibility**: Ensure keyboard navigation works for all controls
5. **Mobile**: Table is responsive, but consider card view for mobile
6. **Loading States**: Always provide feedback during data fetching
7. **Empty States**: Guide users when no results are found

## 🐛 Troubleshooting

### Issue: Data not updating
**Solution**: Check query key includes all dependencies

### Issue: Slow performance
**Solution**: Reduce page size or implement virtual scrolling

### Issue: Search doesn't work
**Solution**: Verify search term is in query key

### Issue: Pagination buttons stuck
**Solution**: Check `manualPagination: true` is set in table config

---

**Last Updated**: February 6, 2026
**Maintainer**: Development Team
