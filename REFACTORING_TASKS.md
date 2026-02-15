# Codebase Refactoring Tasks

## Overview
This document tracks the refactoring tasks to consolidate the codebase and ensure alignment with best practices.

Compass Coaching is a career and life guidance platform. Resources span career guidance (12 categories) and life guidance (3 categories: mental wellbeing, relationships, healthy living).

**Date**: February 5, 2026
**Status**: In Progress

---

## Completed ✅

### 1. Data Centralization
- [x] Created `src/data/resources.ts` as single source of truth
- [x] Extracted `RESOURCE_TYPES` and `CATEGORY_NAMES` constants
- [x] Created `RESOURCE_CATEGORIES` with metadata
- [x] Removed redundant `path` property from resources
- [x] Added helper functions: `getResourcesByCategory()`, `getCategoryPath()`, etc.

### 2. Navigation Enhancement
- [x] Updated Header component to use centralized resource data
- [x] Added collapsible Resources submenu
- [x] Implemented dynamic icon rendering
- [x] Added proper TypeScript types for AssessmentProgress

### 3. Search Functionality
- [x] Implemented dropdown search across all resources
- [x] Added click-outside handling with useRef
- [x] Limited search results to 8 items for performance
- [x] Dynamic path resolution from category names

### 4. Documentation
- [x] Created `BEST_PRACTICES.md` comprehensive guide
- [x] Documented TypeScript conventions
- [x] Documented React patterns
- [x] Documented styling guidelines
- [x] Created this refactoring task list
- [x] Created `ARCHITECTURE.md` system documentation
- [x] Updated `README.md` with comprehensive project info

### 5. Dynamic Resource Category Pages
- [x] Created dynamic route: `src/routes/resources/$categorySlug.tsx`
- [x] Deleted 12 individual category page files (~1,200 lines)
- [x] Updated routing to use dynamic parameter
- [x] Tested all category pages work correctly
- [x] Verified navigation and search functionality

### 6. Code Quality & Formatting
- [x] Fixed all TypeScript warnings
- [x] Removed unused imports
- [x] Applied Biome formatting to all files
- [x] Organized import statements

### 7. Biome Linting Improvements (Feb 5, 2026)
- [x] Fixed 6 button type warnings in Header.tsx
  - Added `type="button"` to prevent unintended form submissions
- [x] Fixed overlay accessibility issues
  - Added `role="button"`, `tabIndex={0}`, `onKeyDown` handler
  - Added `aria-label` for screen readers
- [x] Replaced array index keys with unique identifiers
  - Used `resource.title`, `stat.label`, `section.title` as keys
  - Prevents React reconciliation issues
- [x] Fixed forEach callback return warning in storage.ts
  - Replaced with `for...of` loop for clarity
- [x] Reduced Biome warnings from 72 to 37
  - All critical accessibility and React best practice issues resolved
  - Remaining warnings are mostly form element IDs (acceptable trade-off)
- [x] Fixed Tailwind CSS class names for v4.0
- [x] Applied Biome formatting to entire codebase
- [x] Verified all code passes `npm run check`

### 7. Create Custom Hooks
- [x] Created `useClickOutside()` hook for dropdown/modal click detection
- [x] Created `useLocalStorage()` hook for type-safe localStorage management
- [x] Created `useAssessmentProgress()` hook for tracking assessment completion
- [x] Updated Header component to use `useAssessmentProgress()`
- [x] Updated resources index to use `useClickOutside()`
- [x] Added JSDoc documentation to all hooks

---

## In Progress 🚧

*No tasks currently in progress*

---

## Recently Completed ✅ (Feb 7, 2026)

### Category Color System
- [x] Added `CategoryColor` type with 15 unique colors
- [x] Added `color` property to `ResourceCategory` interface
- [x] Created `CATEGORY_COLOR_STYLES` with full Tailwind class mappings
- [x] Assigned meaningful colors to all 10 categories
- [x] Updated resource pages to use category colors (hero, cards, CTA)
- [x] Added focus and active state styling for CTA buttons
- [x] Updated navigation panel icons to use category colors
- [x] Added creative styling to resource pages (patterns, waves, floating shapes)

---

## Pending 📋

### 7. Add Resource Descriptions
**Priority**: MEDIUM
**Effort**: Low

The centralized resource data doesn't include descriptions. We should:
- [ ] Add `description` field to Resource interface
- [ ] Populate descriptions for all 74 resources
- [ ] Update dynamic page to display descriptions

### 7. Extract Assessment Data
**Priority**: MEDIUM
**Effort**: Medium

Similar to resources, assessment sections should be centralized:
- [ ] Create `src/data/assessment.ts`
- [ ] Extract section metadata (icons, labels, paths)
- [ ] Update Header component to use centralized data
- [ ] Update assessment routes to use shared types

### 8. Extract Assessment Data
**Priority**: LOW
**Effort**: Low

Ensure UI components follow consistent patterns:
- [ ] Audit all components in `src/components/ui/`
- [ ] Ensure consistent prop naming (variant, size, etc.)
- [ ] Add JSDoc comments to components
- [ ] Create component documentation

### 10. Type Safety Improvements
**Priority**: MEDIUM
**Effort**: Low

Strengthen TypeScript usage:
- [ ] Export all interfaces from dedicated files
- [ ] Add return types to all functions
- [ ] Use discriminated unions for variant props
- [ ] Remove any remaining `any` types

### 11. Performance Optimizations
**Priority**: LOW
**Effort**: Medium

Optimize rendering and data loading:
- [ ] Add React.memo() to expensive components
- [ ] Implement virtual scrolling for long lists (if needed)
- [ ] Add loading states for async operations
- [ ] Profile bundle size and lazy load heavy components

### 12. Accessibility Audit
**Priority**: MEDIUM
**Effort**: Medium

Ensure WCAG 2.1 AA compliance:
- [ ] Run automated accessibility tests (axe, Lighthouse)
- [ ] Add aria-labels to all icon-only buttons
- [ ] Test keyboard navigation flows
- [ ] Verify color contrast ratios
- [ ] Add focus-visible states
- [ ] Test with screen readers

### 13. Error Handling
**Priority**: MEDIUM
**Effort**: Low

Add proper error boundaries and states:
- [ ] Create Error Boundary component
- [ ] Add error states to forms
- [ ] Handle localStorage failures gracefully
- [ ] Add 404 page for invalid routes
- [ ] Log errors for debugging

### 14. Testing Infrastructure
**Priority**: LOW
**Effort**: High

Set up comprehensive testing:
- [ ] Configure Vitest for unit tests
- [ ] Add tests for utility functions
- [ ] Add tests for custom hooks
- [ ] Add component tests with React Testing Library
- [ ] Set up E2E tests (Playwright)
- [ ] Add CI/CD pipeline for tests

### 15. Documentation Improvements
**Priority**: LOW
**Effort**: Low

Enhance developer documentation:
- [ ] Add JSDoc to all exported functions
- [ ] Create component usage examples
- [ ] Document localStorage schema
- [ ] Add contributing guide
- [ ] Create deployment guide

---

## Success Criteria

A refactoring task is complete when:

1. ✅ Code passes `npm run check` (Biome)
2. ✅ Code passes TypeScript type checking
3. ✅ Feature works as expected (manual testing)
4. ✅ No console errors or warnings
5. ✅ Follows patterns in BEST_PRACTICES.md
6. ✅ Reduces code duplication
7. ✅ Improves maintainability

---

## Notes

### Trade-offs

**Dynamic Routing**:
- ✅ Pro: Single source of truth, less duplication
- ❌ Con: Slightly more complex routing logic
- ✅ Decision: Benefits outweigh complexity

**Data-Driven UI**:
- ✅ Pro: Easy to update content, consistent presentation
- ❌ Con: Less flexibility for unique page designs
- ✅ Decision: Consistency is more valuable than customization

### Migration Strategy

1. **Phase 1** (Current): Core refactoring
   - Centralize data
   - Create dynamic routes
   - Update navigation

2. **Phase 2**: Type safety and testing
   - Strengthen types
   - Add unit tests
   - Add E2E tests

3. **Phase 3**: Polish and optimization
   - Performance improvements
   - Accessibility fixes
   - Documentation

### Code Quality Lessons Learned

**Always specify button types**:
- Default button type is `submit`, causing unexpected form submissions
- Use `type="button"` for all non-submit buttons
- Use `type="submit"` explicitly for form submission

**React key prop guidelines**:
- Never use array indices as keys (causes reconciliation bugs)
- Use stable unique identifiers (id, title, or unique content)
- Keys should remain consistent across re-renders

**Keyboard accessibility requirements**:
- Interactive divs need `role`, `tabIndex`, `onKeyDown`, `aria-label`
- Prefer semantic HTML (`<button>`) over styled `<div>` elements
- Support Enter and Space keys for activation

**Iteration patterns**:
- Use `for...of` for side effects (clear intent)
- Use `map` for transformations (returns new array)
- Use `filter` for selecting subset (returns filtered array)
- Avoid `forEach` with callbacks that return values

---

**Last Updated**: February 7, 2026
**Next Review**: Weekly until Phase 1 complete
