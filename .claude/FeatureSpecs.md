# Feature Specifications - MVP

## Phase 1: Core Features (MVP)

### Feature 1: User Authentication

**Priority**: HIGH
**Status**: Not Started
**Dependencies**: Supabase setup

#### Description
Allow users to create accounts, log in, and manage their sessions. Enable guest access for free resources.

#### User Stories
- As a visitor, I want to browse free resources without signing up
- As a user, I want to create an account to save my progress
- As a user, I want to log in with email and password
- As a user, I want to reset my password if I forget it
- As a user, I want to stay logged in across sessions

#### Acceptance Criteria
- [ ] Users can sign up with email and password
- [ ] Email validation is performed
- [ ] Password must meet security requirements (min 8 chars, etc.)
- [ ] Users receive verification email
- [ ] Users can log in with credentials
- [ ] Users can log out
- [ ] Users can reset password via email
- [ ] Session persists across page refreshes
- [ ] Protected routes redirect to login
- [ ] Auth state is available throughout app

#### Technical Implementation

**Routes**:
- `/auth/login` - Login page
- `/auth/signup` - Registration page
- `/auth/reset-password` - Password reset request
- `/auth/verify-email` - Email verification landing

**Components**:
```typescript
// src/components/auth/LoginForm.tsx
- Email input
- Password input
- Remember me checkbox
- Submit button
- Forgot password link
- Sign up link

// src/components/auth/SignupForm.tsx
- Full name input
- Email input
- Password input
- Confirm password input
- Terms acceptance checkbox
- Submit button
- Login link

// src/components/auth/ResetPasswordForm.tsx
- Email input
- Submit button
- Back to login link
```

**Auth Utilities**:
```typescript
// src/lib/auth.ts
- getUser() - Get current user
- requireAuth() - Protect routes
- signUp(email, password, metadata) - Register user
- signIn(email, password) - Login
- signOut() - Logout
- resetPassword(email) - Send reset email
- updatePassword(newPassword) - Update password
```

#### UI/UX Notes
- Clean, simple forms
- Clear error messages
- Loading states during submission
- Success confirmation messages
- Auto-focus first input field
- Show password toggle
- Password strength indicator on signup

---

### Feature 2: Intake Assessment System

**Priority**: HIGH
**Status**: ✅ COMPLETED (MVP Version)
**Dependencies**: None (localStorage implementation), User Authentication (future)

#### Description
Multi-step assessment process that guides users through basic information, personality, values, career aptitude, and challenges evaluation to provide personalized career recommendations. Currently uses localStorage for persistence with abstracted storage layer ready for API migration.

#### User Stories
- ✅ As a user, I want to complete assessments to understand my career options
- ✅ As a user, I want to see my progress through the assessment
- ✅ As a user, I want to save my progress and resume later (via localStorage)
- ✅ As a user, I want to review my answers before submitting
- ✅ As a user, I want to receive personalized recommendations based on my responses
- 🔜 As a user, I want to create an account to permanently save my results

#### Acceptance Criteria
- ✅ Assessment can be started without account
- ✅ Progress is saved after each section completion
- ✅ Clear progress indicator shows current step
- ✅ Users can navigate back to previous sections
- ✅ Users can review all answers before submission
- ✅ Results are calculated using career scoring algorithm
- ✅ Recommendations are generated based on responses
- ✅ Users can view/download assessment results
- ✅ Assessment data persists in browser storage
- 🔜 Assessment can be retaken after 30 days (pending account system)

#### Implementation Status

**Completed Routes** (7 pages):
- ✅ `/intake/` - Assessment landing page with overview
- ✅ `/intake/basic` - Basic information (5 questions)
- ✅ `/intake/personality` - Work style assessment (8 questions)
- ✅ `/intake/values` - Values rating (12 values, 1-5 scale)
- ✅ `/intake/aptitude` - Career interests (32 items across 8 categories)
- ✅ `/intake/challenges` - Constraints & challenges (9 fields)
- ✅ `/intake/review` - Summary of all sections with edit links
- ✅ `/intake/results` - Comprehensive results with analysis

**Assessment Flow**:
```
Landing Page (Overview)
    ↓
Basic Info (5 questions, ~2 min)
    ↓
Personality (8 questions, ~4 min)
    ↓
Values (12 ratings, ~5 min)
    ↓
Aptitude (32 ratings, ~8 min)
    ↓
Challenges (9 fields, ~3 min)
    ↓
Review (Summary + Submit)
    ↓
Results (Analysis + Recommendations)

Total: 66 questions, ~20-25 minutes
```

#### Assessment Sections (As Implemented)

**Section 1: Basic Information** (5 questions, ~2 minutes)
- ✅ Full name
- ✅ Age
- ✅ Current education level
- ✅ Employment status
- ✅ Primary reason for seeking guidance

**Section 2: Personality Assessment** (8 questions, ~4 minutes)
Work style preferences:
- ✅ Work environment preference
- ✅ Interaction preference
- ✅ Task approach
- ✅ Decision-making style
- ✅ Change adaptability
- ✅ Stress management
- ✅ Learning style
- ✅ Work pace

**Section 3: Values Assessment** (12 values, ~5 minutes)
Rate 1-5 scale:
- ✅ Helping others
- ✅ Financial security
- ✅ Work-life balance
- ✅ Creativity
- ✅ Leadership
- ✅ Job security
- ✅ Independence
- ✅ Learning & growth
- ✅ Social impact
- ✅ Recognition
- ✅ Flexibility
- ✅ Teamwork

**Section 4: Career Aptitude** (32 items across 8 categories, ~8 minutes)
Rate interest level 1-5 for activities in:
- ✅ STEM (4 items) - Math, science, programming, research
- ✅ Arts (4 items) - Visual art, music, writing, design
- ✅ Communication (4 items) - Teaching, public speaking, networking, writing
- ✅ Business (4 items) - Management, marketing, finance, entrepreneurship
- ✅ Healthcare (4 items) - Patient care, medical, wellness, therapy
- ✅ Trades (4 items) - Hands-on work, construction, repair, technical
- ✅ Social Services (4 items) - Counseling, community work, advocacy, child/elder care
- ✅ Law & Government (4 items) - Legal, policy, public service, compliance

**Section 5: Constraints & Challenges** (9 fields, ~3 minutes)
- ✅ Financial constraints
- ✅ Time availability
- ✅ Location limitations
- ✅ Family obligations
- ✅ Transportation access
- ✅ Health considerations
- ✅ Education gaps
- ✅ Support system
- ✅ Additional notes

#### Technical Implementation (Completed)

**Storage Layer** (`src/lib/storage.ts`):
```typescript
// ✅ Implemented abstraction layer
interface IStorage {
  get<T>(key: string): T | null
  save<T>(key: string, value: T): void
  remove(key: string): void
  clearAll(): void
}

class LocalStorageAdapter implements IStorage { /* ... */ }
class StorageService {
  compileResults(): AssessmentResults
  getResults(): AssessmentResults | null
  isComplete(section: string): boolean
  getProgress(): { completed: string[], total: number }
}

// Storage keys:
// - assessment_basic
// - assessment_personality
// - assessment_values
// - assessment_aptitude
// - assessment_challenges
// - assessment_results
```

**Analysis Engine** (`src/lib/analyzer.ts`):
```typescript
// ✅ Implemented career matching algorithm
function analyzeAssessment(results: AssessmentResults): AssessmentAnalysis {
  // Career field scoring - averages ratings across 8 categories
  const careerFields = analyzeAptitudes(results.aptitude)
  // Returns top 5 fields with 0-100 scores

  // Values ranking - sorts by rating
  const topValues = analyzeValues(results.values)
  // Returns top 5 values

  // Personality insights - interprets work style answers
  const personalityInsights = analyzePersonality(results.personality)

  // Recommendations - based on all factors
  const recommendations = generateRecommendations(/* ... */)

  // Next steps - considers challenges + top fields
  const nextSteps = generateNextSteps(/* ... */)

  return { careerFields, topValues, personalityInsights, recommendations, nextSteps }
}
```

**Type System** (`src/types/assessment.ts`):
```typescript
// ✅ Complete TypeScript interfaces
interface BasicInfo { name, age, education, employment, reason }
interface PersonalityAnswers { workEnvironment, interaction, ... }
interface ValueRatings { helpingOthers: 1-5, financialSecurity: 1-5, ... }
interface AptitudeData {
  stem: number[], arts: number[], communication: number[],
  business: number[], healthcare: number[], trades: number[],
  socialServices: number[], lawGovernment: number[]
}
interface ChallengesData { financial, time, location, ... }
interface AssessmentResults { basic, personality, values, aptitude, challenges }
interface AssessmentAnalysis {
  careerFields: { name, score, description }[],
  topValues: { value, rating }[],
  personalityInsights: string[],
  recommendations: string[],
  nextSteps: string[]
}
```

**Implemented Components**:
```typescript
// ✅ All assessment page components
// - intake/index.tsx - Landing page with overview cards
// - intake/basic.tsx - Text inputs, selects, textarea
// - intake/personality.tsx - Radio button groups (8 questions)
// - intake/values.tsx - 1-5 scale sliders (12 values)
// - intake/aptitude.tsx - 1-5 scale ratings (32 items, 8 categories)
// - intake/challenges.tsx - Mixed inputs (text, textarea, checkboxes)
// - intake/review.tsx - Summary cards with edit links
// - intake/results.tsx - Analysis display with charts, lists, actions

// ✅ UI components
// - components/ui/button.tsx - Variants & sizes
// - components/ui/card.tsx - Card compositions
// - components/ui/badge.tsx - Status badges
// - components/layout/container.tsx - Responsive container
```

**Scoring Algorithm** (as implemented):
```typescript
function analyzeAptitudes(aptitudeData: AptitudeData) {
  const categories = [
    { name: 'STEM', items: aptitudeData.stem },
    { name: 'Arts & Creativity', items: aptitudeData.arts },
    { name: 'Communication', items: aptitudeData.communication },
    { name: 'Business & Entrepreneurship', items: aptitudeData.business },
    { name: 'Healthcare', items: aptitudeData.healthcare },
    { name: 'Trades & Technical Skills', items: aptitudeData.trades },
    { name: 'Social Services', items: aptitudeData.socialServices },
    { name: 'Law & Public Policy', items: aptitudeData.lawGovernment }
  ]

  return categories.map(cat => {
    const average = cat.items.reduce((a, b) => a + b, 0) / cat.items.length
    const score = Math.round((average / 5) * 100) // Convert 1-5 to 0-100
    return {
      name: cat.name,
      score,
      description: getFieldDescription(cat.name)
    }
  }).sort((a, b) => b.score - a.score).slice(0, 5)
}
```

#### UI/UX Notes (Implemented)
- ✅ Clean, focused layout with one section per page
- ✅ Large, clear form controls (radio buttons, sliders)
- ✅ Persistent navigation header
- ✅ Back/Next navigation buttons on all assessment pages
- ✅ Progress indication via section titles
- ✅ Review page with expandable sections and edit links
- ✅ Results page with visual progress bars for career scores
- ✅ Download/print functionality for results
- ✅ Responsive design for mobile and desktop
- ✅ Accessible form labels and ARIA attributes
- ✅ Clear visual hierarchy with Compass branding

#### Future Enhancements
- 🔜 User authentication integration (replace localStorage with API)
- 🔜 Progress indicator showing percentage completion
- 🔜 Ability to save partial progress across devices
- 🔜 Assessment retake after 30 days
- 🔜 More sophisticated scoring algorithm with weighted factors
- 🔜 Comparison with previous assessment results
- 🔜 PDF export with detailed breakdown
- 🔜 Email delivery of results

---
- Celebration animation on completion
- Mobile-optimized for on-the-go completion

---

### Feature 3: Resource Library

**Priority**: HIGH
**Status**: Not Started
**Dependencies**: None (can be developed in parallel)

#### Description
Comprehensive, searchable library of career and educational resources including articles, guides, templates, and tools.

#### User Stories
- As a visitor, I want to browse free resources without creating an account
- As a user, I want to search for specific topics
- As a user, I want to filter resources by category and type
- As a user, I want to save resources for later
- As a user, I want to mark resources as completed
- As a user, I want to see personalized resource recommendations

#### Acceptance Criteria
- [ ] Resources are organized by category
- [ ] Full-text search works across title, description, and content
- [ ] Filters work (category, type, difficulty, time)
- [ ] Resources display correctly on all devices
- [ ] Logged-in users can save resources
- [ ] Logged-in users can mark resources complete
- [ ] View count is tracked
- [ ] Related resources are suggested
- [ ] Resources can include downloadable files
- [ ] External links open in new tab

#### Resource Categories

**Financial Resources**
- Understanding Student Loans
- FAFSA Step-by-Step Guide
- Scholarship Search Guide
- Grant Application Tips
- Loan Calculator Tool
- Budget Planning Template
- Cost of College Comparison Tool
- Financial Aid Timeline
- Work-Study Programs Explained

**Career Exploration**
- Career Path Overviews (by field)
- Day in the Life articles
- Salary Expectations Guide
- Job Market Trends
- Interview Preparation
- Networking Strategies
- Career Change Guide
- Industry Certifications Guide

**Education Options**
- College vs. Trade School
- Community College Benefits
- Online Degree Programs
- Bootcamp Selection Guide
- Gap Year Planning
- Study Abroad Options
- Transfer Student Guide
- Adult Learner Resources

**Application Help**
- Resume Templates (multiple formats)
- Cover Letter Templates
- Personal Statement Guide
- Scholarship Essay Tips
- Interview Preparation Checklist
- Reference Request Templates
- Thank You Note Templates
- Application Timeline Planner

**Life Skills**
- Time Management Strategies
- Goal Setting Framework
- Productivity Tips
- Stress Management
- Building a Support Network
- Communication Skills
- Conflict Resolution
- Self-Advocacy

**Tools & Templates**
- Career Assessment Quiz
- Budget Calculator
- Timeline Builder
- Goal Tracker
- Application Tracker
- Decision Matrix Template
- Pro/Con List Template
- Vision Board Guide

#### Technical Implementation

**Routes**:
```
/resources - Main library page
/resources/[category] - Category view
/resources/[slug] - Individual resource
/resources/search?q=query - Search results
/resources/saved - Saved resources (auth required)
```

**Data Structure**:
```typescript
interface Resource {
  id: string
  title: string
  slug: string
  description: string
  content: string // Markdown
  excerpt: string
  resourceType: 'article' | 'guide' | 'template' | 'tool' | 'video' | 'external_link'
  category: 'financial' | 'careers' | 'education' | 'applications' | 'life_skills' | 'tools'
  subcategory?: string
  tags: string[]
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  estimatedTimeMinutes: number
  accessLevel: 'free' | 'registered' | 'paid'
  thumbnailUrl?: string
  fileUrl?: string
  externalUrl?: string
  authorId: string
  viewCount: number
  likeCount: number
  saveCount: number
  status: 'published' | 'draft' | 'archived'
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}
```

**Components**:
```typescript
// src/components/resources/ResourceGrid.tsx
- Grid layout
- Resource cards
- Loading states
- Empty states

// src/components/resources/ResourceCard.tsx
- Thumbnail
- Title
- Category badge
- Time estimate
- Difficulty badge
- Save button
- Quick actions

// src/components/resources/ResourceFilters.tsx
- Category filter
- Type filter
- Difficulty filter
- Time filter
- Clear filters

// src/components/resources/ResourceSearch.tsx
- Search input
- Search suggestions
- Recent searches
- Popular searches

// src/components/resources/ResourceDetail.tsx
- Full content view
- Table of contents (for long articles)
- Related resources
- Actions (save, share, download)
- Progress tracking

// src/components/resources/SavedResources.tsx
- List of saved items
- Folder organization (future)
- Completion status
- Personal notes
```

**Search Implementation**:
```typescript
// Use Supabase full-text search
async function searchResources(query: string, filters: Filters) {
  const { data } = await supabase
    .from('resources')
    .select('*')
    .textSearch('search_vector', query)
    .eq('status', 'published')
    .filter('category', 'in', filters.categories)
    .filter('resource_type', 'in', filters.types)
    .order('rank', { ascending: false })
    .limit(20)

  return data
}
```

#### UI/UX Notes
- Card-based grid layout
- Large, tappable cards on mobile
- Preview on hover (desktop)
- Skeleton loading states
- Infinite scroll or pagination
- Breadcrumb navigation
- Filter chips that are easy to remove
- Sort options (relevance, newest, popular, time)
- Reading progress indicator for long content
- Estimated read time
- Print-friendly view
- Share buttons

---

### Feature 4: User Dashboard

**Priority**: MEDIUM
**Status**: Not Started
**Dependencies**: Authentication, Assessments, Resources

#### Description
Personalized dashboard showing user progress, saved resources, recommendations, and next steps.

#### User Stories
- As a user, I want to see my assessment progress at a glance
- As a user, I want quick access to my saved resources
- As a user, I want to see recommended next steps
- As a user, I want to view my career match results
- As a user, I want to track my completed resources

#### Acceptance Criteria
- [ ] Dashboard displays immediately after login
- [ ] Assessment progress is prominently displayed
- [ ] Quick access to continue assessment
- [ ] Top career matches are visible
- [ ] Saved resources are listed
- [ ] Recommended resources are shown
- [ ] Next steps are actionable
- [ ] Empty states guide new users
- [ ] Mobile-responsive layout

#### Dashboard Sections

**Welcome Header**
- Personalized greeting
- Progress overview
- Quick stats (resources saved, completed, etc.)

**Assessment Status**
- Completion percentage
- Continue button (if incomplete)
- View results button (if complete)
- Retake option (if > 30 days)

**Your Career Compass**
- Top 3 career matches with scores
- View full results link
- Explore careers button

**Saved Resources**
- Recent saves (5-10)
- View all button
- Quick complete/uncomplete toggle

**Recommended Next Steps**
- Personalized action items
- Based on assessment results
- Priority indicators

**Activity Timeline** (future)
- Recent activity
- Milestones achieved
- Upcoming deadlines

#### Technical Implementation

**Route**: `/dashboard`

**Components**:
```typescript
// src/components/dashboard/DashboardLayout.tsx
- Grid layout
- Responsive sections
- Loading states

// src/components/dashboard/AssessmentStatusCard.tsx
- Progress bar
- Status indicator
- Action buttons

// src/components/dashboard/CareerMatchesCard.tsx
- Top matches list
- Match scores
- Quick view details

// src/components/dashboard/SavedResourcesList.tsx
- Resource list
- Completion checkboxes
- Quick actions

// src/components/dashboard/RecommendedSteps.tsx
- Checklist of next actions
- Links to relevant resources
- Priority indicators

// src/components/dashboard/WelcomeSection.tsx
- Greeting
- Stats
- Quick actions
```

#### UI/UX Notes
- Clean, uncluttered layout
- Card-based sections
- Visual hierarchy (most important at top)
- Quick actions prominently displayed
- Celebration for milestones
- Empty state guidance for new users
- Mobile: Stack sections vertically
- Desktop: Multi-column grid

---

## Phase 2: Enhanced Features (Post-MVP)

### Feature 5: Action Plan Builder

Create and track personalized action plans with milestones and deadlines.

### Feature 6: Coach Dashboard

Dashboard for coaches to manage clients, track progress, and share resources.

### Feature 7: Job Shadowing Connection Platform

Connect users with professionals for job shadowing opportunities.

### Feature 8: Application Workshop

Interactive tools for building resumes, cover letters, and applications.

### Feature 9: Community Forum

User community for peer support and advice sharing.

### Feature 10: Mobile App

Native mobile apps for iOS and Android.

---

## Feature Development Checklist Template

For each feature:
- [ ] Specifications written
- [ ] UI mockups created
- [ ] Database schema defined
- [ ] API endpoints designed
- [ ] Components scaffolded
- [ ] Core functionality implemented
- [ ] Validation added
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Mobile responsive
- [ ] Accessibility review
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] Manual testing complete
- [ ] Performance optimized
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] User acceptance testing
- [ ] Deployed to production
