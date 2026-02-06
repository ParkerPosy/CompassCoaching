import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Book,
  BookOpen,
  Briefcase,
  DollarSign,
  FileText,
  GraduationCap,
  Heart,
  Landmark,
  Smile,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export interface Resource {
  title: string;
  type: string;
  duration: string;
  category: string;
}

export interface ResourceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  slug: string;
}

// Resource types
export const RESOURCE_TYPES = {
  TOOL: "Tool",
  GUIDE: "Guide",
  ARTICLE: "Article",
  TEMPLATE: "Template",
  WORKSHEET: "Worksheet",
  DIRECTORY: "Directory",
} as const;

// Category names
export const CATEGORY_NAMES = {
  CAREER_EXPLORATION: "Career Exploration",
  RESUME_COVER_LETTERS: "Resume & Cover Letters",
  INTERVIEW_PREPARATION: "Interview Preparation",
  JOB_SEARCH: "Job Search Strategies",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
  NETWORKING: "Networking",
  SALARY_NEGOTIATION: "Salary & Negotiation",
  EDUCATION_TRAINING: "Education & Training",
  CAREER_TRANSITIONS: "Career Transitions",
  WORKPLACE_SUCCESS: "Workplace Success",
  FINANCIAL_AID: "Financial Aid & Planning",
  SKILLS_DEVELOPMENT: "Skills Development",
  MENTAL_WELLBEING: "Mental Wellbeing",
  RELATIONSHIPS: "Relationships & Communication",
  HEALTHY_LIVING: "Healthy Living",
} as const;

// Master list of all resources - single source of truth
export const ALL_RESOURCES: Resource[] = [
  // Career Exploration (6)
  {
    title: "Career Interest Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Industry Overview Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Day in the Life Series",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Career Path Roadmaps",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Job Shadow Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Informational Interview Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },

  // Resume & Cover Letters (6)
  {
    title: "Modern Resume Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Resume Writing Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Cover Letter Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Action Words & Phrases",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Resume Review Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "ATS Optimization Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },

  // Interview Preparation (6)
  {
    title: "Common Interview Questions",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "STAR Method Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Phone Interview Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Video Interview Setup",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Thank You Note Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Interview Anxiety Strategies",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },

  // Job Search Strategies (6)
  {
    title: "Job Search Strategy Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Job Board Directory",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Application Tracker Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "LinkedIn Optimization",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Hidden Job Market Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Job Search Timeline",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },

  // Professional Development (6)
  {
    title: "Professional Development Plan",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "15 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Leadership Skills Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Workplace Technology Skills",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Time Management Strategies",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Mentorship Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Free Professional Certifications",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },

  // Networking (6)
  {
    title: "Networking Fundamentals",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "LinkedIn Networking Strategy",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Elevator Pitch Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Networking Event Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Cold Email Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Alumni Network Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.NETWORKING,
  },

  // Salary & Negotiation (6)
  {
    title: "Salary Negotiation Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Salary Research Tools",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "15 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Negotiation Script Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Benefits Comparison Worksheet",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Counter Offer Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Raise Request Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },

  // Education & Training (6)
  {
    title: "Education Pathways Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Online Learning Platforms",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Certification Roadmaps",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Financial Aid Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Bootcamp Comparison Tool",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Learning Style Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },

  // Career Transitions (6)
  {
    title: "Career Change Roadmap",
    type: RESOURCE_TYPES.GUIDE,
    duration: "35 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Transferable Skills Worksheet",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Industry Switcher Stories",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Career Change on a Budget",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Return to Work Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Side Hustle & Freelance Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },

  // Workplace Success (6)
  {
    title: "First 90 Days Roadmap",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Workplace Communication Skills",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Know Your Rights at Work",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Managing Workplace Conflict",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Performance Review Preparation",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Professional Etiquette Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },

  // Financial Aid & Planning (6)
  {
    title: "FAFSA Application Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Scholarship Search Strategy",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Education Budget Planner",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Student Loan Basics",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Employer Tuition Assistance",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Grant & Aid Directory",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "15 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },

  // Skills Development (6)
  {
    title: "In-Demand Skills Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Technical Skills Roadmap",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Soft Skills Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "15 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Free Learning Resources",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Project Portfolio Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Skill Gap Analysis",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "20 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  // Mental Wellbeing (6)
  {
    title: "Managing Stress & Anxiety",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Building Resilience",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Mindfulness & Self-Care Toolkit",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Burnout Prevention Strategies",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Mental Health Resources Directory",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Journal Prompts for Self-Reflection",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },

  // Relationships & Communication (6)
  {
    title: "Healthy Boundaries Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Active Listening Skills",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Conflict Resolution Strategies",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Building a Support System",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Conversation Starters & Social Skills",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Community & Volunteer Opportunities",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },

  // Healthy Living (6)
  {
    title: "Movement for Mental Clarity",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Sleep & Energy Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Nutrition on a Budget",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Daily Wellness Routine Planner",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Screen Time & Digital Balance",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Free Fitness & Wellness Apps",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
];

// Category metadata - derived from resources
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    icon: GraduationCap,
    title: CATEGORY_NAMES.CAREER_EXPLORATION,
    description: "Discover careers that match your interests and skills",
    path: "/resources/career-exploration",
    slug: "career-exploration",
  },
  {
    icon: FileText,
    title: CATEGORY_NAMES.RESUME_COVER_LETTERS,
    description: "Templates and guides for professional applications",
    path: "/resources/resume-cover-letters",
    slug: "resume-cover-letters",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    description: "Practice questions and strategies to ace interviews",
    path: "/resources/interview-prep",
    slug: "interview-prep",
  },
  {
    icon: Target,
    title: CATEGORY_NAMES.JOB_SEARCH,
    description: "Effective techniques to find and land opportunities",
    path: "/resources/job-search",
    slug: "job-search",
  },
  {
    icon: Briefcase,
    title: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
    description: "Build skills and advance your career",
    path: "/resources/professional-development",
    slug: "professional-development",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.NETWORKING,
    description: "Build connections and expand your professional network",
    path: "/resources/networking",
    slug: "networking",
  },
  {
    icon: DollarSign,
    title: CATEGORY_NAMES.SALARY_NEGOTIATION,
    description: "Know your worth and negotiate with confidence",
    path: "/resources/salary-negotiation",
    slug: "salary-negotiation",
  },
  {
    icon: Book,
    title: CATEGORY_NAMES.EDUCATION_TRAINING,
    description: "Find programs, certifications, and courses",
    path: "/resources/education-training",
    slug: "education-training",
  },
  {
    icon: TrendingUp,
    title: CATEGORY_NAMES.CAREER_TRANSITIONS,
    description: "Navigate career changes successfully",
    path: "/resources/career-transitions",
    slug: "career-transitions",
  },
  {
    icon: Award,
    title: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    description: "Thrive in your new role from day one",
    path: "/resources/workplace-success",
    slug: "workplace-success",
  },
  {
    icon: Landmark,
    title: CATEGORY_NAMES.FINANCIAL_AID,
    description: "Navigate scholarships, grants, and education funding",
    path: "/resources/financial-aid",
    slug: "financial-aid",
  },
  {
    icon: BookOpen,
    title: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
    description: "Resources to build in-demand skills",
    path: "/resources/skills-development",
    slug: "skills-development",
  },
  {
    icon: Smile,
    title: CATEGORY_NAMES.MENTAL_WELLBEING,
    description: "Tools and strategies for a healthier mind",
    path: "/resources/mental-wellbeing",
    slug: "mental-wellbeing",
  },
  {
    icon: Heart,
    title: CATEGORY_NAMES.RELATIONSHIPS,
    description: "Strengthen your personal and professional connections",
    path: "/resources/relationships",
    slug: "relationships",
  },
  {
    icon: Activity,
    title: CATEGORY_NAMES.HEALTHY_LIVING,
    description: "Simple habits to support your overall wellbeing",
    path: "/resources/healthy-living",
    slug: "healthy-living",
  },
];

// Helper function to get path from category name
export function getCategoryPath(categoryName: string): string {
  const category = RESOURCE_CATEGORIES.find(
    (cat) => cat.title === categoryName,
  );
  return category?.path || "/resources";
}

// Helper function to get resources by category
export function getResourcesByCategory(categoryTitle: string): Resource[] {
  return ALL_RESOURCES.filter(
    (resource) => resource.category === categoryTitle,
  );
}

// Helper function to get resource count by category
export function getResourceCountByCategory(categoryTitle: string): number {
  return getResourcesByCategory(categoryTitle).length;
}

// Helper function to get category by path
export function getCategoryByPath(path: string): ResourceCategory | undefined {
  return RESOURCE_CATEGORIES.find((cat) => cat.path === path);
}
