# User Flows & Journeys

## Primary User Personas

### Persona 1: Sarah - The Uncertain Graduate
- **Age**: 18
- **Background**: Just graduated high school, unsure about college
- **Goals**: Figure out if college is right, explore alternatives, understand costs
- **Tech Comfort**: Medium
- **Pain Points**: Overwhelmed by options, worried about student debt

### Persona 2: Marcus - The Career Changer
- **Age**: 24
- **Background**: 2 years in retail, wants skilled trade career
- **Goals**: Find trade school options, understand certification process
- **Tech Comfort**: High
- **Pain Points**: Limited time while working full-time, need financial plan

### Persona 3: Coach Emma - Career Counselor
- **Age**: 35
- **Background**: Non-profit career counselor
- **Goals**: Track client progress, share resources efficiently
- **Tech Comfort**: Medium-High
- **Pain Points**: Too many tools, needs unified dashboard

## User Journey Maps

### Journey 1: New Visitor → Free Resource Access

```
┌─────────────┐
│ Land on     │ Discovery
│ Home Page   │ "What is this site?"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Browse      │ Exploration
│ Resources   │ "What can I learn?"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Read        │ Engagement
│ Article     │ "This is helpful!"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Discover    │ Interest
│ Intake Form │ "I want personalized help"
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Sign Up     │ Conversion
│ for Account │ "Let's do this!"
└─────────────┘
```

### Journey 2: Intake Form Completion

```
ENTRY POINT: User clicks "Get Started"

┌─────────────────────────────────────────────────────┐
│ Step 1: Welcome & Overview                          │
│ - Explain the process (5 steps, ~20 minutes)       │
│ - Can save and resume later                         │
│ - Option to create account or continue as guest     │
└──────────────────┬──────────────────────────────────┘
                   │ [Start Assessment]
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 2: Basic Information                           │
│ - Name, age, location                               │
│ - Education level                                    │
│ - Employment status                                  │
│ - Why are you here? (open text)                     │
│                                                      │
│ [Save & Continue] [Save for Later]                  │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 3: Personality Assessment                      │
│ - 15-20 questions about preferences                 │
│ - Work environment preferences                      │
│ - Interaction style (people vs. data)              │
│ - Structure vs. creativity preferences              │
│                                                      │
│ Progress: ███████░░░░░░░░░ 35%                     │
│ [Back] [Save & Continue]                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 4: Values Assessment                           │
│ - Rank importance of values                         │
│   • Work-life balance                               │
│   • Income potential                                │
│   • Helping others                                  │
│   • Creativity                                      │
│   • Job security                                    │
│   • Independence                                    │
│                                                      │
│ Progress: ██████████████░░ 65%                     │
│ [Back] [Save & Continue]                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 5: Career Aptitude                             │
│ - Skills assessment                                 │
│ - Interest areas (STEM, arts, trades, etc.)        │
│ - Strengths identification                          │
│                                                      │
│ Progress: ████████████████░ 85%                    │
│ [Back] [Save & Continue]                            │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Step 6: Challenges & Constraints                    │
│ - Financial situation assessment                    │
│ - Time availability                                 │
│ - Location constraints                              │
│ - Support system                                    │
│                                                      │
│ Progress: ███████████████████ 95%                  │
│ [Back] [Complete Assessment]                        │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Results & Recommendations                           │
│                                                      │
│ YOUR COMPASS PROFILE                                │
│ ┌─────────────────────────────────────┐            │
│ │ Top Career Paths:                   │            │
│ │ 1. Software Development             │            │
│ │ 2. UX Design                        │            │
│ │ 3. Project Management               │            │
│ │                                     │            │
│ │ Recommended Next Steps:             │            │
│ │ • Explore coding bootcamps          │            │
│ │ • Research UX design courses        │            │
│ │ • Connect with tech mentors         │            │
│ └─────────────────────────────────────┘            │
│                                                      │
│ [Download PDF Report]                               │
│ [Explore Recommended Resources]                     │
│ [Schedule Coaching Session]                         │
└─────────────────────────────────────────────────────┘

EXIT POINTS:
- Save and exit at any step (if logged in)
- Download results
- Browse recommended resources
- Book coaching session
```

### Journey 3: Resource Discovery & Learning

```
ENTRY: User on Dashboard/Resources Page

┌─────────────────────────────────────────────────────┐
│ Resource Library Home                               │
│                                                      │
│ Search: [________________] 🔍                       │
│                                                      │
│ Categories:                                          │
│ [Financial Aid] [Career Paths] [Education]          │
│ [Application Help] [Life Skills] [Tools]            │
│                                                      │
│ Recommended for You: ⭐                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│ │Financial│ │Resume   │ │FAFSA    │               │
│ │Aid 101  │ │Template │ │Guide    │               │
│ └─────────┘ └─────────┘ └─────────┘               │
└──────────────────┬──────────────────────────────────┘
                   │ Click "Financial Aid 101"
                   ▼
┌─────────────────────────────────────────────────────┐
│ Financial Aid 101                                   │
│                                                      │
│ [📚 Article] [15 min read] [Beginner]              │
│                                                      │
│ Table of Contents:                                  │
│ 1. Understanding Student Loans                      │
│ 2. Federal vs. Private Loans                       │
│ 3. FAFSA Application Process                       │
│ 4. Scholarship Opportunities                        │
│ 5. Grant Programs                                   │
│                                                      │
│ [Article Content...]                                │
│                                                      │
│ Actions:                                            │
│ [💾 Save] [📤 Share] [✓ Mark Complete]            │
│                                                      │
│ Related Resources:                                  │
│ • FAFSA Step-by-Step Guide                         │
│ • Scholarship Database                              │
│ • Loan Calculator Tool                              │
└──────────────────┬──────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────┐
│ Resource Saved!                                     │
│ ✓ Added to your Saved Resources                    │
│                                                      │
│ Next Suggested Steps:                               │
│ 1. Complete FAFSA Guide                            │
│ 2. Use Loan Calculator                              │
│ 3. Search Scholarships                              │
│                                                      │
│ [Continue Learning] [View Saved Items]              │
└─────────────────────────────────────────────────────┘
```

### Journey 4: Dashboard Progress Tracking

```
ENTRY: Logged-in user navigates to Dashboard

┌─────────────────────────────────────────────────────┐
│ Welcome back, Sarah! 👋                             │
│                                                      │
│ Your Progress                                        │
│ ════════════════════════════════════════            │
│                                                      │
│ ┌─ Assessment Status ────────────────────┐         │
│ │ ✓ Personality Assessment    Complete    │         │
│ │ ✓ Values Assessment        Complete    │         │
│ │ ⟳ Career Aptitude          In Progress │         │
│ │   Overall Progress:  ██████████░░ 65%  │         │
│ │   [Continue Assessment]                 │         │
│ └────────────────────────────────────────┘         │
│                                                      │
│ ┌─ Your Career Compass ──────────────────┐         │
│ │ Top Matches:                            │         │
│ │ 1. UX Designer        (92% match)       │         │
│ │ 2. Software Engineer  (87% match)       │         │
│ │ 3. Product Manager    (84% match)       │         │
│ │                                         │         │
│ │ [Explore These Careers]                 │         │
│ └────────────────────────────────────────┘         │
│                                                      │
│ ┌─ Saved Resources (8) ──────────────────┐         │
│ │ • Financial Aid 101                     │         │
│ │ • Resume Template                       │         │
│ │ • Tech Bootcamp Guide                   │         │
│ │ [View All Saved Items]                  │         │
│ └────────────────────────────────────────┘         │
│                                                      │
│ ┌─ Recommended Next Steps ───────────────┐         │
│ │ 1. Complete remaining assessment        │         │
│ │ 2. Explore UX design resources          │         │
│ │ 3. Download resume template             │         │
│ │ 4. Schedule a coaching call             │         │
│ └────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────┘
```

## Interaction Flows

### Flow 1: Account Creation

```
Guest User → [Sign Up Button]
  ↓
Email & Password Form
  ↓
Validate Input
  ↓
Create Account (Supabase)
  ↓
Send Verification Email
  ↓
Show "Check Email" Message
  ↓
User Clicks Email Link
  ↓
Verify Email
  ↓
Redirect to Dashboard
  ↓
Show Welcome Tour (optional)
```

### Flow 2: Save Progress & Resume Later

```
User on Step 3 of Intake Form
  ↓
Clicks "Save for Later"
  ↓
Check if Logged In
  ├─ Not Logged In
  │   ↓
  │   Show Sign Up Modal
  │   "Save your progress by creating a free account"
  │   ↓
  │   Quick Sign Up (email only)
  │   ↓
  │   Save Form Data
  │
  └─ Logged In
      ↓
      Save Form Data to Database
      ↓
      Show Confirmation Toast
      ↓
      Redirect to Dashboard

RESUME LATER:
Dashboard → "Continue Assessment" Button
  ↓
Load Saved Data
  ↓
Resume at Last Completed Step
```

### Flow 3: Resource Filtering & Search

```
User on Resources Page
  ↓
Types in Search: "student loans"
  ↓
Debounced Search (300ms)
  ↓
Query Database for Matching Resources
  ↓
Display Results:
  - Exact matches first
  - Related content
  - Suggested topics
  ↓
User Applies Filters:
  ├─ Category: "Financial"
  ├─ Level: "Beginner"
  └─ Type: "Article"
  ↓
Refined Results
  ↓
User Clicks Resource
  ↓
Open Resource Detail Page
  ↓
Track View (Analytics)
```

### Flow 4: Mobile Navigation

```
Mobile User Opens Site
  ↓
Header with Hamburger Menu
  ↓
User Taps Hamburger
  ↓
Slide-out Menu (from left)
  ↓
Navigation Options:
  - Home
  - Get Started
  - Resources
  - Dashboard (if logged in)
  - Login/Sign Up
  ↓
User Selects Option
  ↓
Menu Slides Closed
  ↓
Navigate to Selected Route
```

## Edge Cases & Error Flows

### Edge Case 1: Incomplete Assessment
**Scenario**: User closes browser mid-assessment without saving

**Flow**:
```
User Not Logged In:
  → Data lost, must restart
  → Next time: Show "Create account to save progress"

User Logged In:
  → Auto-save every answer
  → Next visit: "Continue where you left off?"
```

### Edge Case 2: Network Error During Save
**Scenario**: Network drops while submitting form

**Flow**:
```
Submit Form
  ↓
Network Error
  ↓
Show Error Toast
"Unable to save. Retrying..."
  ↓
Store in Local Storage
  ↓
Retry (3 attempts)
  ├─ Success: Clear local storage, show success
  └─ Failure: "Saved locally. Will sync when online."
      ↓
      Background sync when connection returns
```

### Edge Case 3: Expired Session
**Scenario**: User's auth token expires while using app

**Flow**:
```
User Attempts Action
  ↓
Server Returns 401 Unauthorized
  ↓
Show Modal: "Your session has expired"
  ↓
[Refresh Session] [Log In Again]
  ↓
Preserve Current State
  ↓
After Login: Return to Previous State
```

## Conversion Funnels

### Funnel 1: Visitor → User
```
Landing Page (100%)
  ↓ 40%
Browse Resources (40%)
  ↓ 30%
Start Intake Form (12%)
  ↓ 50%
Create Account (6%)
  ↓ 80%
Complete Assessment (4.8%)
  ↓ 40%
Schedule Coaching (1.9%)
```

**Optimization Points**:
- Landing Page: Clear CTA, value proposition
- Resources: Show value before asking for signup
- Intake Form: Progress indicator, save option
- Account Creation: Quick signup, minimal friction
- Assessment: Engaging questions, immediate value

### Funnel 2: Free → Paid User
```
Free Account (100%)
  ↓ 50%
Complete Assessment (50%)
  ↓ 60%
Use Resources 3+ times (30%)
  ↓ 40%
View Coaching Info (12%)
  ↓ 25%
Book Coaching Session (3%)
```

## Accessibility Considerations

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate
- Escape to close modals
- Arrow keys for radio/select groups

### Screen Reader Support
- Descriptive ARIA labels
- Announce progress changes
- Describe form errors clearly
- Label all form fields

### Color Blindness
- Don't rely on color alone
- Use icons + text for status
- High contrast ratios
- Distinct patterns for charts

### Mobile Touch Targets
- Minimum 44x44px touch targets
- Adequate spacing between buttons
- Swipe gestures for navigation
- Pull-to-refresh support
