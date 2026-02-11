# Assessment

## Purpose
The assessment is a multi-step intake flow that collects user inputs, stores them locally, compiles results, and generates career matches with transparent reasons. This document is the authoritative reference for how the assessment works and how to safely extend it.

## System Map
Key files and responsibilities:
- Types: src/types/assessment.ts
- Store and persistence: src/stores/assessmentStore.ts
- Intake routes: src/routes/intake/*
- Analysis (insights, recommendations): src/lib/analyzer.ts
- Career match scoring: src/lib/occupationService.ts
- Results UI: src/routes/intake/results.tsx
- Review UI: src/routes/intake/review.tsx

## Flow Overview
1) User completes intake steps (basic -> personality -> values -> aptitude -> challenges)
2) Data is saved in the assessment store with persistence
3) Review compiles results and submits
4) Results render analysis and career matches
5) Results can be marked outdated when the assessment version changes

## Routes
Assessment routes live in src/routes/intake/:
- index.tsx: landing
- basic.tsx: basic profile + degrees
- personality.tsx: work style preferences
- values.tsx: values ratings
- aptitude.tsx: aptitude ratings
- challenges.tsx: constraints and notes
- review.tsx: summary and submit
- results.tsx: insights, matches, and resources

## Data Model

All types are defined in src/types/assessment.ts. The store holds each section as a nullable field; `compileResults()` merges them into an `AssessmentResults` object on submission.

### BasicInfo
| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| name | string | yes | free text |
| ageRange | string | yes | `under-18`, `18-24`, `25-34`, `35-44`, `45-54`, `55-plus` |
| educationLevel | string | yes | `high-school`, `hs-graduate`, `some-college`, `associates`, `bachelors`, `masters`, `trade-cert` |
| employmentStatus | string | yes | `student`, `employed-ft`, `employed-pt`, `unemployed`, `self-employed`, `retired`, `other` |
| primaryReason | string | no | free text (textarea) |
| degrees | Degree[] | conditional | required when educationLevel is `some-college`, `associates`, `bachelors`, `masters`, or `trade-cert` |

### Degree
| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| level | string | yes (first row) | `certificate`, `associate`, `bachelor`, `master`, `doctorate` |
| name | string | yes (first row) | free text (major or program name) |
| gpa | string | no | numeric only, up to 2 decimal places (regex: `/^\d*\.?\d{0,2}$/`) |

### PersonalityAnswers
`Record<string, number>` — 11 questions, each answered 1-4.

| Key | Question Topic |
|-----|---------------|
| work_environment | Office vs remote vs outdoor vs mixed |
| interaction_style | Solo vs small team vs large team vs public |
| decision_making | Data-driven vs intuitive vs collaborative vs experience-based |
| structure | Highly structured → constantly changing |
| energy_source | Independent → networking |
| problem_solving | Research → jump in → brainstorm → best practices |
| communication | Written vs verbal vs group vs visual |
| pace | Steady vs bursts vs slow build vs fast-paced |
| schedule | Standard hours vs flexible vs shifts vs on-call |
| travel | No travel → extensive travel |
| physical_demands | Sedentary → heavy physical |

### ValueRatings
`Record<string, number>` — 12 values, each rated 1-5.

| Key | Label |
|-----|-------|
| work_life_balance | Work-Life Balance |
| income_potential | High Income Potential |
| helping_others | Helping Others |
| creativity | Creativity & Innovation |
| job_security | Job Security & Stability |
| independence | Independence & Autonomy |
| leadership | Leadership Opportunities |
| learning_growth | Learning & Growth |
| recognition | Recognition & Status |
| physical_activity | Physical Activity |
| environmental_impact | Environmental Impact |
| variety | Work Variety |

### AptitudeData
8 career clusters, each an array of 4 self-ratings (1-5 scale). Each cluster has 4 aptitude items that users rate.

| Key | Cluster |
|-----|---------|
| stem | Science, Technology, Engineering, Math |
| arts | Arts & Creative Fields |
| communication | Communication & Media |
| business | Business & Finance |
| healthcare | Healthcare & Medicine |
| trades | Skilled Trades |
| socialServices | Social Services & Education |
| law | Law & Public Service |

### ChallengesData
| Field | Type | Required | Allowed Values |
|-------|------|----------|----------------|
| financial | string | yes | `no-constraints`, `some-savings`, `need-financial-aid`, `limited-funds`, `working-while-learning` |
| timeAvailability | string | yes | `full-time`, `part-time`, `evenings-weekends`, `very-limited`, `flexible` |
| locationFlexibility | string | yes | `yes-anywhere`, `same-region`, `local-only`, `remote-preferred` |
| familyObligations | string | no | `none`, `childcare`, `elder-care`, `both`, `other` |
| transportation | string | no | `own-vehicle`, `public-transit`, `limited`, `none` |
| healthConsiderations | string | no | `none`, `physical`, `mental-health`, `chronic-condition`, `prefer-not-say` |
| educationGaps | string[] | no | free text array |
| supportSystem | string | yes | `strong`, `some`, `limited`, `independent` |
| additionalNotes | string | no | free text (textarea) |

### AssessmentResults
Compiled from all sections on review submission.

| Field | Type | Description |
|-------|------|-------------|
| basic | BasicInfo | User's basic profile |
| personality | PersonalityAnswers | Work style preferences |
| values | ValueRatings | Value importance ratings |
| aptitude | AptitudeData | Aptitude self-ratings |
| challenges | ChallengesData | Constraints and context |
| completedAt | string | ISO 8601 timestamp |
| id | string | Unique ID (`assessment_${Date.now()}`) |
| version | number? | `CURRENT_ASSESSMENT_VERSION` at time of submission |

### AssessmentAnalysis
Generated by src/lib/analyzer.ts from `AssessmentResults`. Not persisted — computed on the results page.

| Field | Type | Description |
|-------|------|-------------|
| topCareerFields | `Array<{ field, score, description }>` | Top aptitude clusters ranked by average |
| topValues | `Array<{ value, score }>` | Values rated 4-5 |
| personalityInsights | string[] | Work style narrative summaries |
| recommendations | string[] | Actionable next steps |
| nextSteps | string[] | Suggested actions |

## Store + Persistence
Store logic lives in src/stores/assessmentStore.ts:
- updateBasic/updatePersonality/updateValues/updateAptitude/updateChallenges
- compileResults() sets version and timestamp
- **Centralized section completion checkers** (single source of truth):
  - `isBasicComplete()` — checks core fields + conditional degree requirement
  - `isPersonalityComplete()` — checks 11 answered questions
  - `isValuesComplete()` — checks 12 rated values
  - `isAptitudeComplete()` — checks all 8 clusters × 4 items > 0
  - `isChallengesComplete()` — checks 4 required fields
- `useSectionCompletion()` — returns `{ sectionCompletion, completedSections, allComplete, overallProgress }`
- `useAssessmentProgress()` — returns per-section booleans, nextSection, percentComplete (uses the same field-level checkers)
- useHasHydrated() for SSR-safe hydration
- useIsResultsOutdated() checks results version

Storage rules:
- Use the store (Zustand) for all assessment updates
- Do not access localStorage directly in UI components
- Results are versioned to allow migrations
- **All completion checks must go through the store's exported functions** — never duplicate `is*Complete()` logic in UI components

## Versioning
CURRENT_ASSESSMENT_VERSION is the authoritative schema version.
- Bump when fields or scoring logic changes in a way that invalidates prior results
- Results without a version are considered outdated
- Results page shows the retake banner when outdated

## Basic Info - Degrees UX
Degrees render only when education level is one of: some-college, associates, bachelors, masters, trade-cert.

This condition (`isCollegeEducation`) must match in two places: basic.tsx (UI rendering) and `isBasicComplete()` in assessmentStore.ts (the `COLLEGE_EDUCATION_LEVELS` constant).

Degree row layout (single row grid: `sm:grid-cols-[160px_1fr_120px]`):
1) Degree level (select, size="sm")
2) Major or program (text input)
3) GPA (text input, numeric-only, optional)

Visual styling:
- Required field placeholders (first row level + name) use `text-stone-700` to match regular text
- Optional field placeholder (GPA) uses default `text-stone-400` (light gray)
- Icon: Award (lucide-react) — neutral for degrees, trade certs, and certifications

Degree rules:
- First row is required if a qualifying education level is selected
- Required fields: degree level + degree name
- GPA is optional, accepts numeric values only (regex: `/^\d*\.?\d{0,2}$/`), and must not block progress or submission
- New rows are auto-added only after required fields on the last row are filled
- Rows use stable keys via `useRef` counter (not array index or content) to prevent remount and input focus loss on typing

Degree level options:
- certificate
- associate
- bachelor
- master
- doctorate

## Validation + Progress
Basic info required fields:
- name
- ageRange
- educationLevel
- employmentStatus
- plus degree requirement if qualifying education level is selected

Progress rules:
- Progress is computed from required fields only
- Optional inputs (primaryReason, GPA, extra degree rows) do not advance progress
- Degree level and degree name count as two separate fields in progress calculation

## AssessmentFooter
File: src/components/assessment/AssessmentFooter.tsx

The footer is a **presentation-only** component. It imports `useSectionCompletion()` from the store — all completion logic lives centrally in assessmentStore.ts. It does **not** contain its own completion check functions.

Progress display:
- `sectionProgress` (from form) drives the "X% complete" text when provided
- `overallProgress` (from `useSectionCompletion()`) drives the light progress bar
- The dark overlay shows within-step field progress

## Dashboard
File: src/routes/dashboard.tsx

The dashboard also uses `useSectionCompletion()` from the store for its "X/5 Sections" progress display and "all complete" check icon.

## Review Page Requirements
Review page must display:
- Basic info fields
- Degrees with level label + name, plus GPA when present
- All assessment sections with human-readable labels

## Results Page Requirements
Results page must show:
- Summary card with education and employment
- Degrees summary with level label + name, plus GPA when present
- Outdated results banner when version is behind
- Matches table with match reasons

## Analysis Engine (Insights)
src/lib/analyzer.ts generates:
- topCareerFields from aptitudes
- topValues from values
- personalityInsights from personality
- recommendations and next steps

Rules:
- If a new field affects insights, update analysis output
- Do not hardcode UI strings in routes when they belong in analysis

## Career Matching Engine
src/lib/occupationService.ts calculates match scores and reasons.

### Scoring Buckets
| # | Bucket | Max Points | Source Data |
|---|--------|------------|-------------|
| 1 | Career cluster match | 40 | aptitude averages vs occupation metadata.careerCluster |
| 2 | Work style match | 25 | personality: work_environment, interaction_style, structure, pace, energy_source |
| 3 | Schedule/travel/physical | 15 | personality: schedule, travel, physical_demands + values: physical_activity |
| 4 | Values alignment | 15 | values ratings vs occupation metadata.values |
| 5 | Skills bonus | 5 | personality: decision_making vs occupation metadata.skills |
| 6 | Text match bonus | 10 | primaryReason, additionalNotes, degree names vs occupation title/description/keywords/certifications |

Max theoretical score: ~110 points, converted to percentage.

### Unused Data in Scoring (Improvement Opportunities)
These are collected but NOT currently used in `calculateMatchScore`:
- **personality.communication** — not matched against any occupation metadata
- **personality.problem_solving** — not matched (only decision_making maps to skills)
- **basic.educationLevel** — not used for match scoring (only used in browse page filtering and analyzer recommendations)
- **basic.employmentStatus** — only used in analyzer next steps text
- **basic.ageRange** — only used for age-appropriate insights on results page
- **challenges.familyObligations** — only used in path forward insights
- **challenges.transportation** — only used in path forward insights
- **challenges.healthConsiderations** — only used in path forward insights
- **challenges.educationGaps** — only used in path forward insights

### Text Match Details
- Tokenization: lowercase, strip non-alphanumeric, min 4 chars, filter stopwords
- Sources: primaryReason + additionalNotes + degree names
- Targets: occupation title + description + keywords + certifications
- Scoring: 1 match = 4pts, 2 matches = 7pts, 3+ matches = 10pts

### Calibration Notes
- Cluster match (40pts) dominates by design — aptitude self-assessment is the strongest signal
- Work style (25pts) is second because environment fit predicts job satisfaction
- Values and environment share third priority (15pts each)
- Skills and text match are bonus buckets that differentiate close matches
- When changing weights, verify the top-10 match distribution across diverse test profiles

## Results Page Insight System
The results page (src/routes/intake/results.tsx) generates its own insight content separately from src/lib/analyzer.ts. Both contribute to the final results display.

### From analyzer.ts
- `topCareerFields` — aptitude cluster rankings
- `topValues` — values rated 4-5
- `personalityInsights` — narrative work style descriptions
- `recommendations` — education/financial/field-specific suggestions
- `nextSteps` — generic action items

### From results.tsx (computed in-page)
- `workStyleProfile` — formatted personality answers as a profile card
- `topAptitudes` — top 3 clusters with averages
- `topValues` (local) — top 5 values with isTop flag
- `degreeSummary` — formatted degree list
- `pathForwardInsights` — actionable guidance from challenges data (financial, time, location, family, transportation, support, education gaps, health)
- `valueTensions` — detects conflicting high-priority values (e.g., income vs work-life balance) and provides reconciliation insight (currently 4 tension pairs)
- `ageInsights` — age-appropriate encouragement and context
- `reasonMessage` — echoes the user's primaryReason with a personalized follow-up
- `recommendedResources` — links to resource pages based on challenges and status

When adding a new question, determine whether its insights belong in analyzer.ts (reusable, data-driven) or results.tsx (presentation-layer, contextual).

## Accessibility and UX Rules
- Use UI components from src/components/ui
- Ensure required fields are visually indicated
- Maintain consistent form spacing and input sizes
- Avoid introducing inputs that break keyboard navigation

## Testing Checklist
Manual flow:
- Intake completion with no degrees (non-college education)
- Intake completion with degree rows (college education)
- Intake completion with degree rows (trade-cert education)
- Review shows degree level/name/GPA
- Results show degree summary and match reasons
- Retake banner appears when version is bumped

Edge cases:
- Switching education level clears degree rows
- Switching from college to trade-cert preserves degree requirement behavior
- Empty last degree row does not count as complete
- Multiple degree rows render properly
- Typing in degree name input does not lose focus (stable keys)
- GPA field rejects non-numeric input
- Footer progress stays accurate when toggling education levels

## Update Checklist (Field Changes)
- Update types in src/types/assessment.ts
- Update defaults and merge logic in src/stores/assessmentStore.ts
- Update form UI and validation in the relevant intake step
- Update the relevant `is*Complete()` function in assessmentStore.ts if the field is required
- Update review page display
- Update results page display
- Update analyzer or matching logic if the field affects scoring
- Bump CURRENT_ASSESSMENT_VERSION when prior results should be invalidated
- Verify progress calculations include new required fields
- Run manual walkthrough: intake -> review -> results

## Adding a New Question (Recipe)

This is a step-by-step recipe for adding a question to an existing section. Follow in order.

### 1. Design the question
- What insight does this produce? (If you can't articulate how it affects results, don't add it.)
- Is it a select (fixed options, 1-of-N), rating (1-5 Likert scale), multi-select (checkboxes), or free text?
- Is it required or optional? Required fields affect progress and completion.

### 2. Update types
In src/types/assessment.ts, add the field to the appropriate section interface.
```typescript
// Example: adding 'learningStyle' to PersonalityAnswers
// PersonalityAnswers is Record<string, number>, so no type change needed — just document the key.

// Example: adding a new field to ChallengesData
export interface ChallengesData {
  // ...existing fields...
  newField: string;  // or string[] for multi-select
}
```

### 3. Update the store
In src/stores/assessmentStore.ts:
- Add the field's default value to the relevant `update*` function's fallback object
- If adding a whole new section, also update `compileResults()`, `isComplete()`, and `getProgress()`

### 4. Update the intake form
In the relevant src/routes/intake/*.tsx:
- Add the question UI (select, rating buttons, or input)
- Wire it to the store via the section's `handleChange` or equivalent
- If required: add to `requiredFields` array, update `isValid`, update `sectionProgress`

### 5. Update the store's completion checker (if required field)
In src/stores/assessmentStore.ts:
- Update the relevant `is*Complete()` function to check the new field
- This is the single source of truth — the footer, dashboard, header, and intake landing page all consume it
- If adding a new constant (e.g., question count), add it alongside `PERSONALITY_QUESTIONS` and `VALUES_COUNT`

### 6. Update the review page
In src/routes/intake/review.tsx:
- Add a label map entry if the field uses coded values
- Add display markup in the appropriate section's review block

### 7. Update the results page
In src/routes/intake/results.tsx:
- If the field produces insight: add a useMemo block or extend an existing one
- If display-only: add to the appropriate profile card

### 8. Update scoring (if applicable)
In src/lib/occupationService.ts:
- Map the new answer to occupation metadata fields
- Add or adjust a scoring bucket
- Add a match reason string
- Verify total max score and percentage calibration

In src/lib/analyzer.ts:
- Add insight generation logic if the field produces narrative output
- Update `generateRecommendations()` if the field changes guidance

### 9. Bump version and test
- Bump `CURRENT_ASSESSMENT_VERSION` in the store
- Update this document (Assessment.md) — data model, scoring table, and testing checklist
- Run full manual walkthrough

## Question Design Principles

1. **Every question must produce insight.** If the answer doesn't change results, scoring, recommendations, or display — it shouldn't be asked. Users' time is the scarcest resource.

2. **Prefer fixed options over free text.** Fixed options are scorable, comparable, and don't require NLP. Free text is only appropriate for open-ended context (primaryReason, additionalNotes).

3. **Avoid redundancy.** Before adding a question, check if existing data already captures the signal. Example: don't add a "Do you like working with people?" question when interaction_style already covers it.

4. **Use consistent scales.** Personality = 1-4 (forced choice, no neutral). Values = 1-5 (Likert with neutral midpoint). Aptitude = 1-5 (self-assessment). Don't mix scales within a section.

5. **Keep sections balanced.** Each section should take roughly the same time (~2-3 minutes). Adding many questions to one section creates fatigue and abandonment.

6. **Write options as complete thoughts.** "Working independently on focused tasks" not "Independent work". Users should be able to read the option and immediately know if it fits.

7. **Make every option a valid, non-judgmental choice.** No option should feel like the "wrong" answer. This is guidance, not a test.

## Future Question Roadmap

Candidate questions organized by the insight gap they fill. Each entry includes the question concept, which section it belongs to, what scoring/insight it enables, and implementation priority.

### High Priority — Fill Scoring Gaps

**1. Learning Style Preference** (Personality section)
- Question: "How do you learn best?"
- Options: Hands-on practice / Reading & research / Video & demonstration / Classroom with instructor
- Insight: Directly improves education pathway recommendations. Currently we recommend education paths (certificates, degrees, apprenticeships) without knowing how the user actually learns. This would let results say "Based on your hands-on learning style, apprenticeships and trade programs may be more effective than lecture-based degrees."
- Scoring: Map to occupation metadata training requirements (OJT vs formal education)

**2. Prior Work Experience** (Basic section or new Experience section)
- Question: "Which of these have you done in a work or volunteer setting?" (multi-select)
- Options: Managed people / Handled money or budgets / Used specialized software / Worked with customers / Built or repaired things / Taught or trained others / Wrote reports or documents / Analyzed data
- Insight: Creates a transferable skills inventory. Huge gap — currently we score aptitude (what you think you'd like) but not experience (what you've actually done). This lets results highlight "You already have customer service and budget experience, which directly transfers to these careers."
- Scoring: Map to occupation metadata.skills (analytical, creative, social, technical)

**3. Salary Expectations** (Basic section or Challenges section)
- Question: "What's the minimum annual salary you need to meet your financial obligations?"
- Options: Under $25K / $25-40K / $40-60K / $60-80K / $80K+
- Insight: Currently we have the `income_potential` value (how much they *want*) but not what they *need*. This enables filtering out careers that can't realistically meet their floor, and highlighting when a top match exceeds expectations. Results could say "Your top matches all have median PA salaries above your $40K target."
- Scoring: Filter or penalize occupations where the PA median wage falls below the user's stated minimum

### Medium Priority — Deepen Insights

**4. Stress & Pressure Tolerance** (Personality section)
- Question: "How do you handle high-pressure situations?"
- Options: I thrive under pressure / I manage but prefer less / I avoid high-stress environments / Depends on the type of stress
- Insight: Some career clusters (healthcare, law, trades) have inherent pressure. This prevents matching someone who avoids stress to emergency medicine or litigation. Results insight: "Your preference for lower-stress environments aligns well with these methodical, planning-oriented roles."
- Scoring: Map to occupation metadata — occupations with high-stress indicators get penalized for stress-averse users

**5. Technology Comfort Level** (Personality or Aptitude section)
- Question: "How comfortable are you with technology?"
- Options: I love learning new tools / Comfortable with common apps / I struggle with technology / Prefer minimal screen time
- Insight: Tech literacy affects viability of many careers across all clusters, not just STEM. An admin role requires different tech than a carpenter. Currently STEM aptitude is a proxy, but a non-STEM person might still be highly tech-literate. Results insight: "Your strong tech comfort opens doors in [non-STEM field] roles that increasingly rely on digital tools."
- Scoring: Bonus for tech-heavy occupations, or penalty for tech-resistant users matched to digital roles

**6. Conflict Resolution Style** (Personality section)
- Question: "When workplace disagreements arise, you typically:"
- Options: Address it directly and assertively / Seek compromise and common ground / Defer to authority or process / Avoid confrontation when possible
- Insight: Predicts fit for management, customer-facing, and team roles. Differentiates why two people with the same aptitude score succeed in different sub-roles. Results insight: "Your direct communication style is valued in [management/advocacy/sales] roles."
- Scoring: Map to occupation metadata.workStyle.peopleInteraction and leadership requirements

**7. Motivation Driver** (Values section or new question)
- Question: "What motivates you most to do good work?"
- Options: Seeing measurable results / Positive feedback from others / Personal mastery and growth / Making a difference for someone / Financial rewards
- Insight: Motivational fit predicts long-term satisfaction better than skill fit. This enables a "sustainability" dimension to scoring — not just "can you do this job" but "will you stay engaged." Results insight: "Careers where you see direct impact on people score highest for your motivation profile."
- Scoring: New scoring bucket or bonus within values alignment

### Lower Priority — Enrich Context

**8. Geographic Specificity** (Challenges section)
- Question: "What PA county or region are you in?"
- Options: Pre-populated county list (already available via `getAvailableCounties()`)
- Insight: We already have PA wage data by county. Collecting this in the assessment (rather than just the results filter) would let us pre-filter matches and give localized insights: "In your county, Healthcare roles have 15% higher wages than the state average."
- Implementation: Wire the existing county selector into the assessment store

**9. Timeline Urgency** (Challenges section)
- Question: "When do you need to be in a new role or career path?"
- Options: Immediately / Within 3 months / Within a year / No rush — exploring long-term
- Insight: Urgency changes which recommendations are practical. Someone who needs a job next month shouldn't be told to get a 4-year degree. Results insight: "Given your timeline, these shorter-path careers offer the fastest entry while matching your profile."
- Scoring: Weight training-length requirements against user timeline

**10. Expand Value Tensions** (Results page, no new questions)
- Not a new question — extend the `valueTensions` logic in results.tsx
- Currently only 4 tension pairs are detected
- Add: creativity vs structure, independence vs job_security, environmental_impact vs income_potential, physical_activity vs recognition
- Each tension provides a reconciliation insight that shows the user they don't have to choose

### Implementation Notes
- Add questions incrementally (1-2 per release) to avoid overwhelming the UI
- Each new question must pass the "insight test" — articulate the specific results sentence it enables before coding
- Personality section is at 11 questions (hitting the comfort limit); new personality questions should replace or combine existing ones rather than extend
- Values section at 12 ratings is appropriately sized; avoid growing it
- Challenges section has room for 1-2 more selects
- Basic section should stay minimal; consider a new "Experience" section if multiple experience questions are added
