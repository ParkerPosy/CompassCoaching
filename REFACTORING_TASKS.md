# Codebase Refactoring Tasks

## Overview
This document tracks the refactoring tasks to consolidate the codebase and ensure alignment with best practices.

**Date**: February 4, 2026
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

---

## In Progress 🚧

### 5. Dynamic Resource Category Pages
**Priority**: HIGH
**Effort**: Medium

Currently, we have 12 separate files for resource categories, each with duplicated code and hardcoded data:
- `career-exploration.tsx`
- `resume-cover-letters.tsx`
- `interview-prep.tsx`
- etc.

**Action Items**:
- [x] Create dynamic route: `src/routes/resources/$categorySlug.tsx`
- [ ] Delete 12 individual category page files
- [ ] Update routing to use dynamic parameter
- [ ] Test all category pages work correctly
- [ ] Verify navigation and search still work

**Benefits**:
- Reduces ~1,200 lines of duplicated code
- Single source of truth for category pages
- Automatic updates when data changes
- Easier to maintain and extend

**Files to Delete** (after testing):
```
src/routes/resources/career-exploration.tsx
src/routes/resources/resume-cover-letters.tsx
src/routes/resources/interview-prep.tsx
src/routes/resources/job-search.tsx
src/routes/resources/professional-development.tsx
src/routes/resources/networking.tsx
src/routes/resources/salary-negotiation.tsx
src/routes/resources/education-training.tsx
src/routes/resources/career-transitions.tsx
src/routes/resources/industry-insights.tsx
src/routes/resources/tools-templates.tsx
src/routes/resources/skills-development.tsx
```

---

## Pending 📋

### 6. Add Resource Descriptions
**Priority**: MEDIUM
**Effort**: Low

The centralized resource data doesn't include descriptions. We should:
- [ ] Add `description` field to Resource interface
- [ ] Populate descriptions for all 72 resources
- [ ] Update dynamic page to display descriptions

### 7. Extract Assessment Data
**Priority**: MEDIUM
**Effort**: Medium

Similar to resources, assessment sections should be centralized:
- [ ] Create `src/data/assessment.ts`
- [ ] Extract section metadata (icons, labels, paths)
- [ ] Update Header component to use centralized data
- [ ] Update assessment routes to use shared types

### 8. Create Custom Hooks
**Priority**: LOW
**Effort**: Medium

Extract repeated logic into custom hooks:
- [ ] `useAssessmentProgress()` - Track assessment completion
- [ ] `useLocalStorage()` - Type-safe localStorage wrapper
- [ ] `useClickOutside()` - Click outside detection for dropdowns

### 9. Component Library Consolidation
**Priority**: LOW
**Effort**: Low

Ensure UI components follow consistent patterns:
- [ ] Audit all components in `src/components/ui/`
- [ ] Ensure consistent prop naming (variant, size, etc.)
- [ ] Add JSDoc comments to components
- [ ] Create Storybook or component documentation

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

---

**Last Updated**: February 4, 2026
**Next Review**: Weekly until Phase 1 complete
