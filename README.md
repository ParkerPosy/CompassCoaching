# Compass Coaching

A free, donation-funded non-profit career and life guidance platform dedicated to helping individuals in Pennsylvania navigate their professional journey and personal wellbeing with confidence—regardless of their circumstances.

## 🎯 Overview

Compass Coaching is a 100% free platform designed to give back to those who need it most. Serving all 67 counties across Pennsylvania, we help you:
- **Discover Your Path**: Get personalized career matches through our comprehensive assessment
- **Know Your Worth**: Access real Pennsylvania wage data for 810+ occupations across all counties
- **Access 90+ Resources**: Free resources across career guidance and life wellbeing
- **Gain Life-Changing Insights**: Understand your personality, values, and unique strengths
- **Build Your Future**: Create actionable plans for career and personal growth
- **Track Your Progress**: Visual indicators showing your journey forward

**Our Mission**: Powered by donations from people who believe everyone deserves a chance to thrive, we provide completely free career and life guidance to help Pennsylvanians find their path forward. We use compelling messaging to reach more people who need our help.

**Service Area**: Pennsylvania (all 67 counties)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Development Commands

```bash
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run format      # Format code with Biome
npm run lint        # Lint code with Biome
npm run check       # Run format + lint checks
npm run test        # Run tests (when implemented)
```

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base primitives (Button, Card, Badge)
│   ├── layout/      # Layout components (Container)
│   └── Header.tsx   # Site navigation
├── data/            # Centralized data and constants
│   ├── resources.ts        # Resource definitions and helpers
│   ├── occupations.json    # 810+ PA occupations with wage data
│   └── pa-wage-data.json   # Raw wage data from PA Dept of Labor
├── lib/             # Utility functions
│   └── storage.ts   # LocalStorage wrapper
├── routes/          # File-based routing
│   ├── index.tsx    # Home page
│   ├── intake/      # Assessment flow
│   └── resources/   # Resource library
├── types/           # Shared TypeScript types
│   ├── assessment.ts # Assessment form types
│   └── wages.ts      # PA wage data types
└── scripts/         # Data processing scripts
    └── parse-wage-data.ts # Convert XLS to JSON
```

## 📚 Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and technical decisions
- **[BEST_PRACTICES.md](./BEST_PRACTICES.md)** - Coding standards and conventions
- **[REFACTORING_TASKS.md](./REFACTORING_TASKS.md)** - Ongoing consolidation work

## 🛠️ Tech Stack

- **Framework**: React 19.2 + TypeScript 5.7
- **Routing**: TanStack Router 1.132 (file-based)
- **Styling**: Tailwind CSS 4.0
- **Build Tool**: Vite 7.1
- **Code Quality**: Biome 2.2 (formatting + linting)
- **Storage**: LocalStorage (browser-based persistence)

## 🎨 Key Features

### 1. Pennsylvania Wage Data
- **810+ occupations** with comprehensive salary information
- **All 67 PA counties** covered (May 2024 data)
- **Real-time salary negotiation insights** based on county and experience level
- Data sourced from Pennsylvania Department of Labor & Industry
- Entry, median, and experienced wage ranges
- Education requirements for each occupation

### 2. Career Assessment
Multi-step assessment covering:
- Basic information
- Personality traits
- Personal values
- Career aptitudes
- Challenges and concerns

### 3. Resource Library
15 categories with 6 resources each:

**Career Guidance:**
- Career Exploration
- Resume & Cover Letters
- Interview Preparation
- Job Search Strategies
- Professional Development
- Networking
- Salary & Negotiation
- Education & Training
- Career Transitions
- Workplace Success
- Financial Aid & Planning
- Skills Development

**Life Guidance:**
- Mental Wellbeing
- Relationships & Communication
- Healthy Living

### 3. Smart Navigation
- Progress tracking for assessments
- "Continue Assessment" button
- Collapsible resource menu
- Search across all resources

## 🔧 Configuration

### Tailwind CSS
Custom configuration in `tailwind.config.ts`:
- Primary color: lime-500
- Custom gradients
- Extended spacing

### TypeScript
Strict mode enabled with:
- No implicit any
- Strict null checks
- No unused locals/parameters

### Biome
Configuration in `biome.json`:
- Line width: 100
- Tab width: 2
- Single quotes preferred

## 🏗️ Building For Production

```bash
npm run build
```

Output will be in the `dist/` directory. Deploy to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🧪 Testing

```bash
npm run test        # Run tests
```

*Note: Test infrastructure is planned but not yet implemented. See [REFACTORING_TASKS.md](./REFACTORING_TASKS.md) for details.*

## 📈 Development Status

### Completed ✅
- Core routing structure
- Assessment flow (5 steps)
- Resource library (90 resources across 15 categories)
- Career guidance resources (12 categories)
- Life guidance resources (3 categories)
- Centralized data management
- Navigation with progress tracking
- Search functionality

### In Progress 🚧
- Dynamic resource category pages
- Data consolidation refactoring

### Planned 📋
- Description field for resources
- Custom hooks extraction
- Accessibility audit
- Comprehensive testing
- Error boundaries

See [REFACTORING_TASKS.md](./REFACTORING_TASKS.md) for complete roadmap.

## 🤝 Contributing

### Code Standards
All code must:
1. Pass TypeScript type checking
2. Pass Biome formatting and linting
3. Follow patterns in [BEST_PRACTICES.md](./BEST_PRACTICES.md)
4. Include proper TypeScript types
5. Use semantic HTML and accessibility features

### Workflow
1. Format code: `npm run format`
2. Check for issues: `npm run check`
3. Test manually in browser
4. Commit with conventional commit messages

## 📝 License

This project is built for a non-profit career and life coaching organization.

## 🙏 Acknowledgments

Built with:
- [React](https://react.dev/)
- [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide Icons](https://lucide.dev/)
- [Biome](https://biomejs.dev/)

---

**Version**: 1.0.0
**Last Updated**: February 4, 2026


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
npm run lint
npm run format
npm run check
```



## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
