# Design System - Compass Coaching

## Brand Identity

### Logo & Wordmark
- **Name**: Compass Coaching
- **Symbol**: Compass icon (to be designed)
- **Tagline**: "Navigate Your Future"

### Brand Voice
- **Encouraging**: Supportive and positive
- **Clear**: Simple, jargon-free language
- **Actionable**: Focus on next steps
- **Empowering**: User is in control
- **Honest**: Realistic about challenges and opportunities

## Color Palette

### Primary Colors

```css
--lime-50: #f7fee7;   /* Very light backgrounds */
--lime-100: #ecfccb;  /* Light backgrounds */
--lime-200: #d9f99d;  /* Subtle highlights */
--lime-300: #bef264;  /* Light accents */
--lime-400: #a3e635;  /* PRIMARY - Main brand color */
--lime-500: #84cc16;  /* Hover states */
--lime-600: #65a30d;  /* Active states */
--lime-700: #4d7c0f;  /* Dark accents */
--lime-800: #3f6212;  /* Very dark accents */
--lime-900: #365314;  /* Darkest */
```

### Secondary/Neutral Colors

```css
--stone-50: #fafaf9;   /* Page backgrounds */
--stone-100: #f5f5f4;  /* Card backgrounds */
--stone-200: #e7e5e4;  /* SECONDARY - Borders, dividers */
--stone-300: #d6d3d1;  /* Disabled states */
--stone-400: #a8a29e;  /* Placeholder text */
--stone-500: #78716c;  /* Secondary text */
--stone-600: #57534e;  /* Body text */
--stone-700: #44403c;  /* Headings */
--stone-800: #292524;  /* Dark headings */
--stone-900: #1c1917;  /* Darkest text */
```

### Semantic Colors

```css
/* Success */
--success-50: #f0fdf4;
--success-500: #22c55e;
--success-700: #15803d;

/* Warning */
--warning-50: #fffbeb;
--warning-500: #f59e0b;
--warning-700: #b45309;

/* Error */
--error-50: #fef2f2;
--error-500: #ef4444;
--error-700: #b91c1c;

/* Info */
--info-50: #eff6ff;
--info-500: #3b82f6;
--info-700: #1d4ed8;
```

### Color Usage Guidelines

**IMPORTANT: All color combinations must meet WCAG AA contrast standards (4.5:1 for normal text, 3:1 for large text)**

| Element | Color | Purpose | Contrast Notes |
|---------|-------|---------|----------------|
| Primary CTA | lime-400 bg + stone-900 text | Main actions (Get Started, Submit, Save) | ✅ 8.75:1 ratio |
| Secondary CTA | stone-200 bg + stone-900 text | Secondary actions (Cancel, Back) | ✅ 12.6:1 ratio |
| Text - Primary | stone-900 | Headings, important text | Use on light backgrounds |
| Text - Body | stone-700 | Body copy | ✅ 7.8:1 on white |
| Text - Secondary | stone-500 | Captions, meta info | ✅ 4.6:1 on white |
| Backgrounds | stone-50 | Page background | - |
| Cards | white/stone-100 | Card backgrounds | - |
| Borders | stone-200 | Dividers, card outlines | - |
| Links on Light BG | lime-700 | Hyperlinks on white/light backgrounds | ✅ 4.8:1 on white |
| Links on Dark BG | lime-400 | Hyperlinks on dark backgrounds | ✅ 8.75:1 on stone-900 |
| Link Hover | lime-600 (light) / lime-300 (dark) | Hovered links | Context dependent |
| Icons on Light BG | lime-600 | Decorative icons | ✅ 3.9:1 (acceptable for large/decorative) |
| Success | success-500 | Completed, positive feedback | ✅ 4.5:1 on white |
| Warning | warning-500 | Caution, important notices | ✅ 4.5:1 on white |
| Error | error-500 | Errors, validation | ✅ 4.5:1 on white |
| Disabled | stone-300 | Disabled elements | Exempt from contrast requirements |

### Accessibility Color Rules

**DO:**
- ✅ Use `text-lime-700` or darker for text on white/light backgrounds
- ✅ Use `text-lime-400` or lighter for text on stone-900/dark backgrounds
- ✅ Use `bg-lime-400` with `text-stone-900` for buttons (8.75:1 ratio)
- ✅ Use `text-lime-600` for large decorative icons (≥24px)
- ✅ Test all custom combinations with a contrast checker

**DON'T:**
- ❌ Never use `text-lime-400` on white backgrounds (only 2.3:1 ratio)
- ❌ Avoid `text-lime-500` on white (3.3:1, fails AA for normal text)
- ❌ Don't use lime-600 text on lime backgrounds
- ❌ Avoid text on gradient backgrounds without testing

## Typography

### Font Stack

```css
--font-sans:
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;

--font-mono:
  'SF Mono',
  'Monaco',
  'Inconsolata',
  'Fira Code',
  monospace;
```

**Why System Fonts?**
- Zero load time
- Familiar to users
- Excellent performance
- Great accessibility
- Professional appearance

### Type Scale

```css
--text-xs: 0.75rem;    /* 12px - Meta info */
--text-sm: 0.875rem;   /* 14px - Small body text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Large body text */
--text-xl: 1.25rem;    /* 20px - Small headings */
--text-2xl: 1.5rem;    /* 24px - Section headings */
--text-3xl: 1.875rem;  /* 30px - Page titles */
--text-4xl: 2.25rem;   /* 36px - Hero headings */
--text-5xl: 3rem;      /* 48px - Large hero */
```

### Font Weights

```css
--font-normal: 400;    /* Body text */
--font-medium: 500;    /* Emphasized text */
--font-semibold: 600;  /* Subheadings */
--font-bold: 700;      /* Headings */
```

### Line Heights

```css
--leading-tight: 1.25;   /* Headings */
--leading-snug: 1.375;   /* Short paragraphs */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.625;/* Long-form content */
--leading-loose: 2;      /* Spaced content */
```

### Typography Components

```typescript
// src/components/ui/Typography.tsx

export function Heading1({ children, className, ...props }) {
  return (
    <h1
      className={clsx(
        'text-3xl md:text-4xl font-bold text-stone-900 leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function Heading2({ children, className, ...props }) {
  return (
    <h2
      className={clsx(
        'text-2xl md:text-3xl font-bold text-stone-900 leading-tight',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function Heading3({ children, className, ...props }) {
  return (
    <h3
      className={clsx(
        'text-xl md:text-2xl font-semibold text-stone-900 leading-snug',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
}

export function BodyText({ children, className, ...props }) {
  return (
    <p
      className={clsx(
        'text-base text-stone-700 leading-normal',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function SmallText({ children, className, ...props }) {
  return (
    <span
      className={clsx(
        'text-sm text-stone-500 leading-snug',
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
```

## Spacing System

### Spacing Scale (Tailwind default - using 4px base)

```css
0: 0px
1: 0.25rem   /* 4px */
2: 0.5rem    /* 8px */
3: 0.75rem   /* 12px */
4: 1rem      /* 16px */
5: 1.25rem   /* 20px */
6: 1.5rem    /* 24px */
8: 2rem      /* 32px */
10: 2.5rem   /* 40px */
12: 3rem     /* 48px */
16: 4rem     /* 64px */
20: 5rem     /* 80px */
24: 6rem     /* 96px */
```

### Spacing Guidelines

| Element | Spacing | Usage |
|---------|---------|-------|
| Component padding | 4-6 | Internal spacing |
| Card padding | 6-8 | Card content |
| Section padding | 12-16 | Page sections |
| Stack spacing | 4-6 | Vertical rhythm |
| Grid gap | 4-8 | Grid layouts |
| Button padding X | 4-6 | Horizontal button |
| Button padding Y | 2-3 | Vertical button |
| Input padding | 2-3 | Form inputs |
| Margin between sections | 8-12 | Page flow |

## Component Library

### Button

```typescript
// src/components/ui/Button.tsx

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    disabled,
    className,
    children,
    ...props
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-lg font-medium',
          'transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',

          // Variants
          {
            // Primary
            'bg-lime-400 text-stone-900 hover:bg-lime-500 active:bg-lime-600':
              variant === 'primary',
            'focus:ring-lime-400': variant === 'primary',

            // Secondary
            'bg-stone-200 text-stone-900 hover:bg-stone-300 active:bg-stone-400':
              variant === 'secondary',
            'focus:ring-stone-300': variant === 'secondary',

            // Outline
            'border-2 border-lime-400 text-lime-700 hover:bg-lime-50 active:bg-lime-100':
              variant === 'outline',
            'focus:ring-lime-400': variant === 'outline',

            // Ghost
            'text-stone-700 hover:bg-stone-100 active:bg-stone-200':
              variant === 'ghost',
            'focus:ring-stone-300': variant === 'ghost',

            // Danger
            'bg-red-500 text-white hover:bg-red-600 active:bg-red-700':
              variant === 'danger',
            'focus:ring-red-400': variant === 'danger',
          },

          // Sizes
          {
            'px-3 py-1.5 text-sm gap-1.5': size === 'sm',
            'px-4 py-2 text-base gap-2': size === 'md',
            'px-6 py-3 text-lg gap-2': size === 'lg',
          },

          // Full width
          { 'w-full': fullWidth },

          className
        )}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" size={16} />}
        {children}
      </button>
    )
  }
)
```

### Input

```typescript
// src/components/ui/Input.tsx

export interface InputProps extends ComponentPropsWithoutRef<'input'> {
  label?: string
  error?: string
  helperText?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-stone-700 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'w-full px-3 py-2 rounded-lg',
              'border-2 border-stone-200',
              'bg-white text-stone-900',
              'placeholder:text-stone-400',
              'transition-colors duration-200',
              'focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20',
              'disabled:bg-stone-100 disabled:cursor-not-allowed',
              {
                'border-red-400 focus:border-red-400 focus:ring-red-400/20': error,
                'pl-10': icon,
              },
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-stone-500">{helperText}</p>
        )}
      </div>
    )
  }
)
```

### Card

```typescript
// src/components/ui/Card.tsx

export interface CardProps extends ComponentPropsWithoutRef<'div'> {
  variant?: 'default' | 'outlined' | 'elevated'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function Card({
  variant = 'default',
  padding = 'md',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={clsx(
        'rounded-lg',
        {
          // Variants
          'bg-white': variant === 'default',
          'bg-white border-2 border-stone-200': variant === 'outlined',
          'bg-white shadow-lg': variant === 'elevated',

          // Padding
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('mb-4', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3
      className={clsx('text-xl font-semibold text-stone-900', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardContent({ className, children, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={clsx('text-stone-700', className)} {...props}>
      {children}
    </div>
  )
}
```

### Badge

```typescript
// src/components/ui/Badge.tsx

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md'
}

export function Badge({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        {
          // Variants
          'bg-stone-100 text-stone-700': variant === 'default',
          'bg-green-100 text-green-700': variant === 'success',
          'bg-yellow-100 text-yellow-700': variant === 'warning',
          'bg-red-100 text-red-700': variant === 'error',
          'bg-blue-100 text-blue-700': variant === 'info',

          // Sizes
          'px-2 py-0.5 text-xs': size === 'sm',
          'px-2.5 py-1 text-sm': size === 'md',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
```

### Progress Bar

```typescript
// src/components/ui/Progress.tsx

export interface ProgressProps {
  value: number // 0-100
  max?: number
  label?: string
  showPercentage?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'success'
}

export function Progress({
  value,
  max = 100,
  label,
  showPercentage = true,
  size = 'md',
  variant = 'default',
}: ProgressProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100)

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-stone-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-stone-500">{percentage}%</span>
          )}
        </div>
      )}
      <div className={clsx(
        'w-full bg-stone-200 rounded-full overflow-hidden',
        {
          'h-1': size === 'sm',
          'h-2': size === 'md',
          'h-3': size === 'lg',
        }
      )}>
        <div
          className={clsx(
            'h-full transition-all duration-500 ease-out',
            {
              'bg-lime-400': variant === 'default',
              'bg-green-500': variant === 'success',
            }
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
```

## Layout Components

### Container

```typescript
// src/components/layout/Container.tsx

export function Container({
  size = 'default',
  className,
  children,
  ...props
}: {
  size?: 'sm' | 'default' | 'lg' | 'full'
  className?: string
  children: React.ReactNode
} & ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        'mx-auto px-4 sm:px-6 lg:px-8',
        {
          'max-w-3xl': size === 'sm',
          'max-w-7xl': size === 'default',
          'max-w-350': size === 'lg',
          'max-w-full': size === 'full',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

## Icons

Using **Lucide React** (already installed)

### Common Icons
- `Home` - Homepage
- `Compass` - Navigation, guidance
- `User` - Profile, account
- `BookOpen` - Resources, learning
- `CheckCircle` - Completed, success
- `AlertCircle` - Warning, info
- `XCircle` - Error, cancel
- `ArrowRight` - Next, forward
- `ArrowLeft` - Back, previous
- `Search` - Search functionality
- `Menu` - Mobile menu
- `X` - Close
- `ChevronDown` - Dropdown
- `FileText` - Documents
- `Award` - Achievements
- `Target` - Goals
- `TrendingUp` - Progress
- `Calendar` - Scheduling
- `Clock` - Time
- `DollarSign` - Financial

## Responsive Breakpoints

```css
/* Tailwind defaults */
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (desktops) */
2xl: 1536px /* 2X large devices (large desktops) */
```

### Mobile-First Approach

```typescript
// Example: Stack on mobile, row on desktop
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Content 1</div>
  <div className="w-full md:w-1/2">Content 2</div>
</div>
```

## Animations & Transitions

### Transition Durations

```css
--duration-fast: 150ms;     /* Hover states */
--duration-base: 200ms;     /* Most transitions */
--duration-slow: 300ms;     /* Complex animations */
--duration-slower: 500ms;   /* Large movements */
```

### Common Animations

```typescript
// Fade in
const fadeIn = 'animate-[fadeIn_0.3s_ease-out]'

// Slide up
const slideUp = 'animate-[slideUp_0.3s_ease-out]'

// Skeleton loading
const skeleton = 'animate-pulse bg-stone-200'
```

## Accessibility

### Focus States
All interactive elements must have visible focus states:
```css
focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2
```

### Color Contrast
- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- Use tools like WebAIM Contrast Checker

### ARIA Labels
Always include meaningful ARIA labels for icons and interactive elements:
```typescript
<button aria-label="Close menu">
  <X size={24} />
</button>
```

### Keyboard Navigation
- All interactive elements accessible via Tab
- Logical tab order
- Enter/Space to activate buttons
- Escape to close modals

## Design Tokens (CSS Custom Properties)

```css
:root {
  /* Colors */
  --color-primary: #a3e635;
  --color-secondary: #e7e5e4;
  --color-text-primary: #1c1917;
  --color-text-secondary: #44403c;
  --color-background: #fafaf9;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Border Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

## Dark Mode (Future Consideration)

While not in MVP, structure for dark mode:
```typescript
// Use Tailwind dark: modifier
<div className="bg-white dark:bg-stone-900">
  <p className="text-stone-900 dark:text-stone-100">Content</p>
</div>
```
