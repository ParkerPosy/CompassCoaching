# Database Schema

## Database Technology: PostgreSQL (via Supabase)

## Schema Overview

```
users (Supabase Auth)
  ↓ (one-to-many)
profiles
  ↓ (one-to-many)
assessments
  ↓ (one-to-many)
assessment_answers

users
  ↓ (one-to-many)
saved_resources

resources
  ↓ (many-to-many via resource_tags)
tags

users
  ↓ (one-to-many)
action_plans
  ↓ (one-to-many)
action_items
```

## Core Tables

### 1. profiles

Extends Supabase auth.users with additional user data

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  user_role TEXT DEFAULT 'client' CHECK (user_role IN ('client', 'coach', 'admin')),
  date_of_birth DATE,
  location TEXT,
  phone TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Privacy
  profile_visibility TEXT DEFAULT 'private' CHECK (profile_visibility IN ('private', 'coaches', 'public'))
);

-- Indexes
CREATE INDEX idx_profiles_user_role ON profiles(user_role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can view and update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Coaches can view client profiles
CREATE POLICY "Coaches can view client profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE user_role = 'coach'
    )
  );
```

### 2. assessments

Main assessment records (personality, values, aptitude)

```sql
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Assessment Type
  assessment_type TEXT NOT NULL CHECK (
    assessment_type IN ('personality', 'values', 'aptitude', 'full_intake')
  ),

  -- Progress
  status TEXT DEFAULT 'in_progress' CHECK (
    status IN ('not_started', 'in_progress', 'completed')
  ),
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER,
  completion_percentage INTEGER DEFAULT 0,

  -- Results (JSONB for flexibility)
  results JSONB,

  -- Computed Scores
  career_matches JSONB, -- Array of {career: string, score: number}
  recommended_paths JSONB, -- Array of path recommendations

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  ip_address INET,
  user_agent TEXT
);

-- Indexes
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_type ON assessments(assessment_type);
CREATE INDEX idx_assessments_status ON assessments(status);
CREATE INDEX idx_assessments_results_gin ON assessments USING GIN (results);

-- Row Level Security
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments"
  ON assessments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assessments"
  ON assessments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments"
  ON assessments FOR UPDATE
  USING (auth.uid() = user_id);
```

### 3. assessment_answers

Individual answers for each assessment question

```sql
CREATE TABLE assessment_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Question Info
  question_id TEXT NOT NULL, -- e.g., "personality_q1"
  question_category TEXT, -- e.g., "work_style", "interaction_preference"

  -- Answer
  answer_type TEXT CHECK (
    answer_type IN ('single_choice', 'multiple_choice', 'scale', 'text', 'ranking')
  ),
  answer_value JSONB NOT NULL,

  -- Timing
  time_spent_seconds INTEGER,
  answered_at TIMESTAMPTZ DEFAULT NOW(),

  -- Versioning (for question updates)
  question_version INTEGER DEFAULT 1
);

-- Indexes
CREATE INDEX idx_assessment_answers_assessment_id ON assessment_answers(assessment_id);
CREATE INDEX idx_assessment_answers_user_id ON assessment_answers(user_id);
CREATE INDEX idx_assessment_answers_question_id ON assessment_answers(question_id);

-- Row Level Security
ALTER TABLE assessment_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own answers"
  ON assessment_answers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own answers"
  ON assessment_answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
  ON assessment_answers FOR UPDATE
  USING (auth.uid() = user_id);
```

### 4. resources

Knowledge base articles, guides, templates, tools

```sql
CREATE TABLE resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  content TEXT, -- Markdown content
  excerpt TEXT,

  -- Categorization
  resource_type TEXT NOT NULL CHECK (
    resource_type IN (
      'article',
      'guide',
      'template',
      'tool',
      'video',
      'external_link',
      'checklist'
    )
  ),
  category TEXT NOT NULL CHECK (
    category IN (
      'financial',
      'careers',
      'education',
      'applications',
      'life_skills',
      'tools'
    )
  ),
  subcategory TEXT,

  -- Difficulty & Time
  difficulty_level TEXT CHECK (
    difficulty_level IN ('beginner', 'intermediate', 'advanced')
  ),
  estimated_time_minutes INTEGER,

  -- Access Control
  access_level TEXT DEFAULT 'free' CHECK (
    access_level IN ('free', 'registered', 'paid')
  ),

  -- Content
  thumbnail_url TEXT,
  file_url TEXT, -- For downloads (PDFs, templates)
  external_url TEXT, -- For external resources

  -- Metadata
  author_id UUID REFERENCES profiles(id),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  save_count INTEGER DEFAULT 0,

  -- Publishing
  status TEXT DEFAULT 'draft' CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  keywords TEXT[]
);

-- Indexes
CREATE INDEX idx_resources_slug ON resources(slug);
CREATE INDEX idx_resources_type ON resources(resource_type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_status ON resources(status);
CREATE INDEX idx_resources_access_level ON resources(access_level);
CREATE INDEX idx_resources_published_at ON resources(published_at DESC);
CREATE INDEX idx_resources_keywords_gin ON resources USING GIN (keywords);

-- Full-text search
CREATE INDEX idx_resources_search ON resources
  USING GIN (to_tsvector('english', title || ' ' || description || ' ' || content));

-- Row Level Security
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Everyone can view published free resources
CREATE POLICY "Anyone can view free resources"
  ON resources FOR SELECT
  USING (status = 'published' AND access_level = 'free');

-- Registered users can view registered-level resources
CREATE POLICY "Registered users can view registered resources"
  ON resources FOR SELECT
  USING (
    status = 'published'
    AND access_level IN ('free', 'registered')
    AND auth.uid() IS NOT NULL
  );

-- Only admins/coaches can insert/update resources
CREATE POLICY "Admins can manage resources"
  ON resources FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE user_role IN ('admin', 'coach')
    )
  );
```

### 5. tags

Tags for resources (many-to-many relationship)

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT, -- Hex color for UI
  icon TEXT, -- Icon name from Lucide
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE resource_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(resource_id, tag_id)
);

-- Indexes
CREATE INDEX idx_resource_tags_resource_id ON resource_tags(resource_id);
CREATE INDEX idx_resource_tags_tag_id ON resource_tags(tag_id);

-- Row Level Security
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tags"
  ON tags FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view resource_tags"
  ON resource_tags FOR SELECT
  USING (true);
```

### 6. saved_resources

User bookmarks/saved resources

```sql
CREATE TABLE saved_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,

  -- Metadata
  notes TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  saved_at TIMESTAMPTZ DEFAULT NOW(),

  -- Folder organization (future feature)
  folder TEXT,

  UNIQUE(user_id, resource_id)
);

-- Indexes
CREATE INDEX idx_saved_resources_user_id ON saved_resources(user_id);
CREATE INDEX idx_saved_resources_resource_id ON saved_resources(resource_id);

-- Row Level Security
ALTER TABLE saved_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saved resources"
  ON saved_resources FOR ALL
  USING (auth.uid() = user_id);
```

### 7. action_plans

User's personalized action plans

```sql
CREATE TABLE action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Plan Details
  title TEXT NOT NULL,
  description TEXT,
  goal_statement TEXT,
  target_career_path TEXT,

  -- Timeline
  start_date DATE,
  target_completion_date DATE,

  -- Progress
  status TEXT DEFAULT 'active' CHECK (
    status IN ('draft', 'active', 'completed', 'paused', 'archived')
  ),
  completion_percentage INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_action_plans_user_id ON action_plans(user_id);
CREATE INDEX idx_action_plans_status ON action_plans(status);

-- Row Level Security
ALTER TABLE action_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own action plans"
  ON action_plans FOR ALL
  USING (auth.uid() = user_id);
```

### 8. action_items

Individual steps within action plans

```sql
CREATE TABLE action_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_plan_id UUID REFERENCES action_plans(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Item Details
  title TEXT NOT NULL,
  description TEXT,
  item_type TEXT CHECK (
    item_type IN ('milestone', 'task', 'deadline', 'resource_review', 'meeting')
  ),

  -- Ordering
  sort_order INTEGER,

  -- Status
  status TEXT DEFAULT 'not_started' CHECK (
    status IN ('not_started', 'in_progress', 'completed', 'blocked', 'skipped')
  ),

  -- Dates
  due_date DATE,
  completed_at TIMESTAMPTZ,

  -- Associated Resource
  resource_id UUID REFERENCES resources(id),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_action_items_plan_id ON action_items(action_plan_id);
CREATE INDEX idx_action_items_user_id ON action_items(user_id);
CREATE INDEX idx_action_items_status ON action_items(status);
CREATE INDEX idx_action_items_due_date ON action_items(due_date);

-- Row Level Security
ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own action items"
  ON action_items FOR ALL
  USING (auth.uid() = user_id);
```

## Supporting Tables

### 9. resource_views

Track resource views for analytics

```sql
CREATE TABLE resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Session Info
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,

  -- Engagement
  time_spent_seconds INTEGER,
  scroll_percentage INTEGER,

  viewed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_resource_views_resource_id ON resource_views(resource_id);
CREATE INDEX idx_resource_views_user_id ON resource_views(user_id);
CREATE INDEX idx_resource_views_viewed_at ON resource_views(viewed_at DESC);

-- Partitioning by month for performance (future optimization)
-- CREATE TABLE resource_views_2026_02 PARTITION OF resource_views
--   FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### 10. coach_client_relationships

Track coach-client pairings (post-MVP)

```sql
CREATE TABLE coach_client_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE,

  -- Relationship
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'inactive', 'completed')
  ),

  -- Metadata
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  notes TEXT,

  UNIQUE(coach_id, client_id)
);

-- Indexes
CREATE INDEX idx_coach_client_coach_id ON coach_client_relationships(coach_id);
CREATE INDEX idx_coach_client_client_id ON coach_client_relationships(client_id);

-- Row Level Security
ALTER TABLE coach_client_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can view their clients"
  ON coach_client_relationships FOR SELECT
  USING (auth.uid() = coach_id);

CREATE POLICY "Clients can view their coaches"
  ON coach_client_relationships FOR SELECT
  USING (auth.uid() = client_id);
```

## Database Functions

### Auto-update timestamp trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_plans_updated_at
  BEFORE UPDATE ON action_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_action_items_updated_at
  BEFORE UPDATE ON action_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Calculate assessment completion

```sql
CREATE OR REPLACE FUNCTION calculate_assessment_completion(assessment_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  answered_count INTEGER;
  total_count INTEGER;
  percentage INTEGER;
BEGIN
  SELECT COUNT(*) INTO answered_count
  FROM assessment_answers
  WHERE assessment_id = assessment_uuid;

  SELECT total_steps INTO total_count
  FROM assessments
  WHERE id = assessment_uuid;

  IF total_count > 0 THEN
    percentage := (answered_count * 100) / total_count;
  ELSE
    percentage := 0;
  END IF;

  RETURN percentage;
END;
$$ LANGUAGE plpgsql;
```

## Initial Seed Data

### Sample Tags

```sql
INSERT INTO tags (name, slug, color, icon) VALUES
  ('Scholarships', 'scholarships', '#a3e635', 'award'),
  ('Student Loans', 'student-loans', '#f59e0b', 'banknote'),
  ('FAFSA', 'fafsa', '#3b82f6', 'file-text'),
  ('Resume', 'resume', '#8b5cf6', 'file-user'),
  ('Cover Letter', 'cover-letter', '#ec4899', 'mail'),
  ('College', 'college', '#10b981', 'graduation-cap'),
  ('Trade School', 'trade-school', '#f97316', 'wrench'),
  ('Bootcamp', 'bootcamp', '#06b6d4', 'code'),
  ('Time Management', 'time-management', '#6366f1', 'clock'),
  ('Budgeting', 'budgeting', '#14b8a6', 'calculator');
```

## Database Backups & Maintenance

### Backup Strategy
- **Supabase automatic backups**: Daily (included in free tier)
- **Manual backups**: Weekly export via pg_dump
- **Retention**: 30 days on free tier, longer on paid

### Performance Monitoring
- Monitor slow queries via Supabase dashboard
- Set up query performance alerts
- Regular VACUUM and ANALYZE (automatic in Supabase)

### Migration Strategy
- Use Supabase migrations
- Version control all schema changes
- Test migrations in staging first
- Always include rollback scripts
