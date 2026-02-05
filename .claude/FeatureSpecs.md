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
**Status**: Not Started
**Dependencies**: User Authentication

#### Description
Multi-step assessment process that guides users through personality, values, career aptitude, and challenges evaluation to provide personalized recommendations.

#### User Stories
- As a user, I want to complete assessments to understand my career options
- As a user, I want to see my progress through the assessment
- As a user, I want to save my progress and resume later
- As a user, I want to review my answers before submitting
- As a user, I want to receive personalized recommendations based on my responses

#### Acceptance Criteria
- [ ] Assessment can be started without account (converted to account later)
- [ ] Progress is saved after each answer (for logged-in users)
- [ ] Clear progress indicator shows completion percentage
- [ ] Users can navigate back to previous questions
- [ ] Users can skip optional questions
- [ ] Users can pause and resume assessment
- [ ] Results are calculated and stored
- [ ] Recommendations are generated based on responses
- [ ] Users can view/download assessment results
- [ ] Assessment can be retaken after 30 days

#### Assessment Sections

**Section 1: Basic Information** (5 questions, 2 minutes)
- Name
- Age range
- Current education level
- Employment status
- Primary reason for seeking guidance (open text)

**Section 2: Personality Assessment** (20 questions, 8 minutes)
Based on simplified MBTI/Big Five concepts:
- Work environment preferences (office, remote, outdoor, etc.)
- Interaction style (people-oriented vs. task-oriented)
- Decision-making approach (logical vs. emotional)
- Structure preferences (routine vs. variety)
- Energy sources (social vs. solitary)

**Section 3: Values Assessment** (15 questions, 6 minutes)
Rank or rate importance of:
- Work-life balance
- Income potential
- Helping others
- Creativity and innovation
- Job security and stability
- Independence and autonomy
- Leadership opportunities
- Learning and growth
- Recognition and status
- Physical activity
- Environmental impact
- Work variety

**Section 4: Career Aptitude** (25 questions, 10 minutes)
Skills and interests in:
- STEM (science, technology, engineering, math)
- Creative arts (visual, performing, design)
- Communication (writing, speaking, teaching)
- Business and finance
- Healthcare and wellness
- Trades and skilled labor
- Social services and counseling
- Law and public policy

**Section 5: Constraints & Challenges** (10 questions, 4 minutes)
- Financial situation
- Time availability
- Location constraints
- Family obligations
- Transportation
- Health considerations
- Education gaps
- Support system

#### Technical Implementation

**Routes**:
```
/intake - Assessment landing/overview
/intake/basic - Section 1
/intake/personality - Section 2
/intake/values - Section 3
/intake/aptitude - Section 4
/intake/challenges - Section 5
/intake/review - Review all answers
/intake/results - View results
```

**Data Structure**:
```typescript
interface AssessmentState {
  id: string
  userId?: string
  status: 'not_started' | 'in_progress' | 'completed'
  currentStep: number
  totalSteps: number
  sections: {
    basic: BasicAnswers
    personality: PersonalityAnswers
    values: ValuesAnswers
    aptitude: AptitudeAnswers
    challenges: ChallengesAnswers
  }
  results?: AssessmentResults
  startedAt: Date
  completedAt?: Date
}

interface AssessmentResults {
  personalityProfile: {
    workStyle: string
    interactionStyle: string
    ...
  }
  topValues: string[]
  careerMatches: Array<{
    career: string
    matchScore: number
    reasons: string[]
  }>
  recommendedPaths: Array<{
    path: 'college' | 'trade' | 'business' | 'arts'
    suitability: number
    considerations: string[]
  }>
  potentialChallenges: string[]
  nextSteps: string[]
}
```

**Components**:
```typescript
// src/components/intake/AssessmentProgress.tsx
- Progress bar
- Current step indicator
- Estimated time remaining

// src/components/intake/QuestionCard.tsx
- Question text
- Answer options (radio, checkbox, scale, text)
- Optional explanation
- Navigation buttons

// src/components/intake/MultiStepForm.tsx
- Section navigation
- Form state management
- Validation
- Auto-save

// src/components/intake/ResultsView.tsx
- Personality profile summary
- Top career matches
- Recommended paths
- Download PDF button
- Next steps suggestions
```

**Scoring Algorithm** (pseudo-code):
```typescript
function calculateCareerMatches(answers: AllAnswers): CareerMatch[] {
  const careers = getCareerDatabase()

  return careers.map(career => {
    let score = 0
    const reasons = []

    // Match personality traits
    if (matchesWorkStyle(career, answers.personality)) {
      score += 25
      reasons.push('Fits your preferred work environment')
    }

    // Match values
    const valueMatch = calculateValueAlignment(career, answers.values)
    score += valueMatch * 30
    if (valueMatch > 0.7) {
      reasons.push('Aligns with your core values')
    }

    // Match aptitudes
    const aptitudeMatch = calculateAptitudeMatch(career, answers.aptitude)
    score += aptitudeMatch * 45
    if (aptitudeMatch > 0.8) {
      reasons.push('Strong match with your skills and interests')
    }

    return {
      career: career.title,
      matchScore: Math.round(score),
      reasons,
      salary: career.medianSalary,
      education: career.typicalEducation,
    }
  }).sort((a, b) => b.matchScore - a.matchScore)
}
```

#### UI/UX Notes
- One question per screen on mobile
- Multiple questions per screen on desktop (if short)
- Large, tappable answer options
- Visual progress indicator always visible
- Ability to skip and return later
- Contextual help text for complex questions
- Encouraging messages throughout
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
