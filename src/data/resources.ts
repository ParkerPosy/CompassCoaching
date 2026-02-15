import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Compass,
  GraduationCap,
  Heart,
  Landmark,
  MessageSquare,
  Smile,
  TrendingUp,
  Users,
} from "lucide-react";

// Resource type discriminants
export const RESOURCE_TYPES = {
  VIDEO: "video",
  ARTICLE: "article",
  DOWNLOAD: "download",
  DIRECTORY: "directory",
  TOOL: "tool",
  CHECKLIST: "checklist",
  EXTERNAL: "external",
  COURSE: "course",
} as const;

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

// Base properties shared by all resources
interface BaseResource {
  title: string;
  category: string;
  /** Whether resource content has been created. False = needs product manager action */
  active: boolean;
}

// Video resource (YouTube, Vimeo embeds)
export interface VideoResource extends BaseResource {
  type: typeof RESOURCE_TYPES.VIDEO;
  videoUrl: string;
  duration: string; // "12:34" format
  thumbnail?: string;
  description?: string;
}

// Article content section
export interface ArticleSection {
  heading: string;
  content: string[]; // array of paragraphs
}

// Article (on-site text content)
export interface ArticleResource extends BaseResource {
  type: typeof RESOURCE_TYPES.ARTICLE;
  readTime: string; // "8 min read"
  slug?: string; // for content routing
  description?: string;
  author?: string;
  publishDate?: string; // ISO date string e.g. "2026-01-15"
  keywords?: string[]; // SEO keywords for this article
  sections?: ArticleSection[];
}

// Downloadable file (PDF, templates, worksheets)
export interface DownloadResource extends BaseResource {
  type: typeof RESOURCE_TYPES.DOWNLOAD;
  format: "pdf" | "docx" | "xlsx";
  fileUrl?: string;
}

// Directory of external resources
export interface DirectoryResource extends BaseResource {
  type: typeof RESOURCE_TYPES.DIRECTORY;
  itemCount?: number;
}

// Interactive tool on the platform
export interface ToolResource extends BaseResource {
  type: typeof RESOURCE_TYPES.TOOL;
  toolPath?: string;
  completionTime: string; // "15 min"
}

// Step-by-step checklist with trackable items
export interface ChecklistResource extends BaseResource {
  type: typeof RESOURCE_TYPES.CHECKLIST;
  steps?: number;
  completionTime: string;
}

// Single external link
export interface ExternalResource extends BaseResource {
  type: typeof RESOURCE_TYPES.EXTERNAL;
  url: string;
  source: string; // "Indeed", "LinkedIn", etc.
}

// Structured learning path/course
export interface CourseResource extends BaseResource {
  type: typeof RESOURCE_TYPES.COURSE;
  modules?: number;
  totalTime: string; // "2 hours"
  provider?: string;
}

export type Resource =
  | VideoResource
  | ArticleResource
  | DownloadResource
  | DirectoryResource
  | ToolResource
  | ChecklistResource
  | ExternalResource
  | CourseResource;

// Available category colors
export type CategoryColor =
  | "violet"   // calm, mindfulness
  | "rose"     // warmth, connection
  | "lime"     // growth, development
  | "teal"     // exploration, discovery
  | "emerald"  // health, nature
  | "blue"     // learning, knowledge
  | "cyan"     // professional, clear
  | "amber"    // achievement, success
  | "indigo"   // trust, stability
  | "orange"   // change, energy
  | "pink"     // relationships, social
  | "sky"      // opportunity, openness
  | "slate"    // professional, clean
  | "purple"   // confidence, preparation
  | "yellow";  // value, prosperity

export interface ResourceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  slug: string;
  color: CategoryColor;
}

// Category names
export const CATEGORY_NAMES = {
  CAREER_EXPLORATION: "Career Exploration",
  INTERVIEW_PREPARATION: "Interview Preparation",
  NETWORKING: "Networking",
  EDUCATION_TRAINING: "Education & Training",
  CAREER_TRANSITIONS: "Career Transitions",
  WORKPLACE_SUCCESS: "Workplace Success",
  FINANCIAL_AID: "Financial Aid & Planning",
  MENTAL_WELLBEING: "Mental Wellbeing",
  RELATIONSHIPS: "Relationships & Communication",
  HEALTHY_LIVING: "Healthy Living",
} as const;

// Master list of all resources - ordered by priority for human actualization
// Within each category: Self-awareness → Foundations → Prevention → Practice → Resources
export const ALL_RESOURCES: Resource[] = [
  // Mental Wellbeing (6) - Foundation for everything
  {
    title: "Understanding Yourself: Self-Reflection Prompts",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: false,
  },
  {
    title: "Building Inner Strength & Resilience",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: false,
  },
  {
    title: "Preventing Burnout: Early Warning Signs",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: false,
  },
  {
    title: "Managing Stress & Anxiety",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: false,
  },
  {
    title: "Daily Self-Care Practices",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: false,
  },
  {
    title: "Mental Health Support Directory",
    type: RESOURCE_TYPES.DIRECTORY,
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: false,
  },
  {
    title: "Why You Keep Telling Yourself I'll Do It Tomorrow",
    type: RESOURCE_TYPES.VIDEO,
    videoUrl: "https://www.youtube.com/watch?v=8dRZk74OyMk",
    duration: "2 hr 25 min",
    description: "Dr. K explores the psychology behind procrastination, explaining how it's an emotional regulation problem rather than laziness, and provides practical strategies to break the cycle.",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
    active: true,
  },

  // Relationships & Communication (6) - Social connection
  {
    title: "The Art of Listening",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    slug: "the-art-of-listening",
    description: "Learn how to truly hear what others are saying and transform your relationships through the power of active, empathetic listening.",
    author: "Compass Coaching Team",
    publishDate: "2026-02-01",
    keywords: ["active listening", "empathetic listening", "communication skills", "relationship building", "listening techniques", "interpersonal skills"],
    category: CATEGORY_NAMES.RELATIONSHIPS,
    active: true,
    sections: [
      {
        heading: "The Art of Listening",
        content: [
          "Think about the last time someone really listened to you. Not just waited for their turn to talk, but actually took in what you were saying and responded to the meaning behind it. That experience is rare, and it stays with you. Feeling truly understood by another person is one of the deepest forms of validation we can receive.",
          "Most of us were never taught how to listen. We learned to read, write, and speak, but listening was assumed to come naturally. It doesn't. Listening well is a skill that takes awareness, effort, and practice. The good news is that anyone can get better at it, and the people around you will notice when you do."
        ]
      },
      {
        heading: "Why Listening Matters More Than You Think",
        content: [
          "Most communication breakdowns don't come from saying the wrong thing. They come from failing to hear what the other person was actually telling us. Decades of research in psychology and relationship science point to the same conclusion: people who feel heard are more trusting, more open, and more willing to be vulnerable. In workplaces, the ability to listen is consistently rated as one of the most valued qualities in a leader. In close relationships, feeling genuinely understood by your partner is among the strongest predictors of long-term satisfaction.",
          "And yet, research from the International Listening Association suggests we retain only about 25% of what we hear in a given conversation. The rest is lost to internal noise: planning what we'll say next, making judgments, or simply drifting. There's often a real gap between how well we think we listen and how well we actually do."
        ]
      },
      {
        heading: "The Five Levels of Listening",
        content: [
          "Listening isn't all or nothing. It exists on a spectrum, and being honest with yourself about where you fall in a given moment is the first step toward getting better.",
          "**Level 1: Ignoring.** You're physically present but your mind is somewhere else. Your phone, your to-do list, the thing someone said to you an hour ago. We've all been here. The key is noticing when it's happening.",
          "**Level 2: Pretend Listening.** You're nodding and making eye contact, but you're not really taking anything in. This happens more than most of us would like to admit, especially in conversations that feel routine.",
          "**Level 3: Selective Listening.** You're tuned in, but only to the parts that relate to your own experience or concerns. You're filtering everything through your own perspective instead of trying to understand theirs.",
          "**Level 4: Attentive Listening.** You're genuinely focused on what the other person is saying. You could repeat it back accurately. This is where most thoughtful communicators operate on a good day, and it's a solid foundation.",
          "**Level 5: Empathetic Listening.** You're paying attention not just to the words but to the feelings, context, and meaning behind them. You're working to see the situation from their perspective, not yours. Carl Rogers, the founder of person-centered therapy, considered this kind of listening the foundation of any meaningful helping relationship. But it matters just as much in friendships, partnerships, and everyday conversations."
        ]
      },
      {
        heading: "Practical Techniques for Deeper Listening",
        content: [
          "Getting from Level 4 to Level 5 doesn't happen by accident. It takes deliberate practice, but the techniques themselves are straightforward.",
          "**Put your phone out of sight.** Not face-down on the table. Actually put it away. A 2014 study in Environment and Behavior found that even having a phone visible during a conversation reduced both the quality of the interaction and the empathic connection between people, even when no one touched it. Removing it from the space is a small act, but it sends a clear message: you have my full attention.",
          "**Pause before you respond.** After someone finishes speaking, give yourself a full two seconds before you say anything. It will feel uncomfortable at first, but it does two important things: it makes sure they're actually finished (people will often continue if given the space), and it gives you a moment to process what they said rather than defaulting to whatever was already on the tip of your tongue.",
          "**Reflect their meaning before adding yours.** Before jumping in with your experience or perspective, first try to articulate what you understood them to mean. Something like: \"It sounds like all these changes at work have left you feeling really uncertain about where you stand.\" This isn't about repeating their words back. It's about showing that you grasped the feeling underneath. It also gives them a chance to clarify if you missed something.",
          "**Ask questions that go deeper.** \"What happened next?\" keeps the conversation at the level of events. \"What was that like for you?\" or \"How are you feeling about it now?\" invites something more honest. These kinds of questions tell the other person you're interested in them, not just the story.",
          "**Pay attention to what isn't being said.** Tone of voice, body language, the topics someone keeps returning to or carefully avoiding. A lot of the most important communication happens in the spaces between words. Someone who circles back to the same point three times is telling you something matters more than they've said directly."
        ]
      },
      {
        heading: "Listening Without the Impulse to Fix",
        content: [
          "If you care about someone, your first instinct when they share a problem is probably to try to solve it. That instinct comes from a good place, but it can accidentally send the message that their feelings are a problem to be managed rather than something worth sitting with.",
          "More often than not, what people need most isn't a solution. It's the experience of being heard. One question can help you figure out which one they're looking for: \"Would it be helpful if I just listened, or are you looking for input?\" It's a simple thing to ask, but it respects the other person's needs and keeps you from assuming you know what they want.",
          "When you're not sure, lean toward listening. You can always offer thoughts later if they ask. But once you've jumped in with advice, the tone of the conversation has already changed, and the other person may feel like what they shared didn't fully land."
        ]
      },
      {
        heading: "Sitting with Difficult Emotions",
        content: [
          "Listening is easy when someone is sharing good news or telling you about their day. It gets a lot harder when they're angry, grieving, or in pain. In those moments, our own discomfort tends to take over. We minimize (\"I'm sure it'll work out\"), problem-solve (\"Have you considered...\"), or try to reframe (\"At least you still have...\"). These responses are well-intentioned, but they often leave the other person feeling unheard.",
          "The harder and more meaningful response is simply to stay present. \"That sounds really difficult.\" \"I'm glad you told me.\" \"I'm here.\" These words don't try to change what someone is feeling. They make room for it. That kind of presence is uncomfortable because it asks us to sit with someone's pain without trying to fix it. But it is also one of the most valuable things we can offer another person."
        ]
      },
      {
        heading: "Recognizing Your Own Limits",
        content: [
          "Sometimes you won't be able to listen well, and that's worth being honest about. Fatigue, stress, or your own emotional state can all make it hard to give someone the attention they deserve. In those moments, pretending to listen does more harm than good.",
          "It's better to say something like: \"I really want to hear this, and I want to give it my full attention. I'm not in a good place to do that right now. Can we come back to this tonight?\" That kind of honesty is actually a form of respect. It tells the other person their words matter enough that you don't want to half-listen."
        ]
      },
      {
        heading: "A Four-Week Listening Practice",
        content: [
          "Like any skill, listening improves with structured practice. Here's a simple progression you can follow over four weeks.",
          "**Week 1:** Once a day, put your phone completely out of sight during a conversation and keep steady eye contact. Notice how it changes the dynamic between you and the other person.",
          "**Week 2:** Start using the two-second pause before responding. Pay attention to the impulse to jump in right away, and practice letting that moment pass.",
          "**Week 3:** Before responding to anything meaningful, reflect back what you heard first. \"What I'm hearing is...\" or \"It sounds like you're saying...\" Then wait for them to confirm or correct you.",
          "**Week 4:** In at least one conversation each day, ask a question that invites the other person to share how they felt, not just what happened. Notice what opens up when you do."
        ]
      },
      {
        heading: "The Broader Impact",
        content: [
          "When you listen well, the effects reach beyond that single conversation. People who feel heard by you start to bring that same quality of attention to their own relationships. Trust builds. Conversations go deeper. Relationships become stronger and more resilient when things get hard.",
          "You can't control how others communicate with you. But you can choose how you receive what they share. That choice, made consistently, is one of the most meaningful things you can do for the people in your life.",
          "Start with one conversation today. Put the distractions away. Listen to understand, not to respond. See what changes."
        ]
      }
    ],
  },
  {
    title: "Building Genuine Connections",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.RELATIONSHIPS,
    active: false,
  },
  {
    title: "Boundaries Don't Work - Here's Why",
    type: RESOURCE_TYPES.VIDEO,
    videoUrl: "https://www.youtube.com/watch?v=gqwjBEf3znc",
    duration: "26 min",
    description: "Dr. K explains why setting boundaries often fails and reveals the missing piece: enforcement. Learn how to communicate and maintain boundaries effectively.",
    category: CATEGORY_NAMES.RELATIONSHIPS,
    active: true,
  },
  {
    title: "Creating Your Support Network",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
    active: false,
  },
  {
    title: "Navigating Conflict with Grace",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
    active: false,
  },
  {
    title: "Finding Purpose Through Service",
    type: RESOURCE_TYPES.DIRECTORY,
    category: CATEGORY_NAMES.RELATIONSHIPS,
    active: false,
  },

  // Career Exploration (6) - Direction and purpose
  {
    title: "Discovering Your Calling",
    type: RESOURCE_TYPES.TOOL,
    completionTime: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
    active: false,
  },
  {
    title: "Mapping Your Future: Career Roadmaps",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
    active: false,
  },
  {
    title: "Understanding Career Landscapes",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
    active: false,
  },
  {
    title: "Real Stories: Day in the Life",
    type: RESOURCE_TYPES.VIDEO,
    videoUrl: "",
    duration: "10:00",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
    active: false,
  },
  {
    title: "Learning from Others' Journeys",
    type: RESOURCE_TYPES.VIDEO,
    videoUrl: "",
    duration: "15:00",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
    active: false,
  },
  {
    title: "Hands-On Career Exploration",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
    active: false,
  },

  // Healthy Living (6) - Physical health supports mental health
  {
    title: "Rest & Recovery: Sleep Guide",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
    active: false,
  },
  {
    title: "Movement for Mind & Body",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
    active: false,
  },
  {
    title: "Nourishing Yourself on a Budget",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
    active: false,
  },
  {
    title: "Building Sustainable Habits",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
    active: false,
  },
  {
    title: "Finding Digital Balance",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
    active: false,
  },
  {
    title: "Wellness Tools & Apps",
    type: RESOURCE_TYPES.DIRECTORY,
    category: CATEGORY_NAMES.HEALTHY_LIVING,
    active: false,
  },

  // Education & Training (6) - Foundational learning
  {
    title: "How You Learn Best",
    type: RESOURCE_TYPES.TOOL,
    completionTime: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  {
    title: "Choosing Your Learning Path",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  {
    title: "Free & Affordable Learning Platforms",
    type: RESOURCE_TYPES.DIRECTORY,
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  {
    title: "Credentials That Matter",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  {
    title: "Intensive Programs Comparison",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "xlsx",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  {
    title: "Funding Your Education",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  // Consolidated from Skills Development
  {
    title: "Technical Skills Development",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },
  {
    title: "Showcasing Your Growth: Portfolio Guide",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
    active: false,
  },

  // Workplace Success - Thriving at work
  {
    title: "Understanding Your Workplace Rights",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Communicating with Impact",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Professional Presence",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Succeeding in Your First 90 Days",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Handling Workplace Challenges",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Preparing for Growth Conversations",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  // Consolidated from Professional Development
  {
    title: "Creating Your Growth Plan",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Developing Leadership",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  // Consolidated from Salary & Negotiation
  {
    title: "Understanding Total Compensation",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "xlsx",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },
  {
    title: "Evaluating Counter Offers",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    active: false,
  },

  // Financial Aid & Planning (6) - Security reduces stress
  {
    title: "Planning Your Education Investment",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "xlsx",
    category: CATEGORY_NAMES.FINANCIAL_AID,
    active: false,
  },
  {
    title: "Free Money: Grants & Scholarships",
    type: RESOURCE_TYPES.DIRECTORY,
    category: CATEGORY_NAMES.FINANCIAL_AID,
    active: false,
  },
  {
    title: "Finding Scholarships",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
    active: false,
  },
  {
    title: "Completing Your FAFSA",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
    active: false,
  },
  {
    title: "Employer Education Benefits",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "10 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
    active: false,
  },
  {
    title: "Understanding Student Loans",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
    active: false,
  },

  // Career Transitions (6) - Life changes
  {
    title: "Recognizing Your Transferable Value",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
    active: false,
  },
  {
    title: "Planning Your Career Change",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "35 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
    active: false,
  },
  {
    title: "Inspiration: Career Change Stories",
    type: RESOURCE_TYPES.VIDEO,
    videoUrl: "",
    duration: "20:00",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
    active: false,
  },
  {
    title: "Returning to the Workforce",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
    active: false,
  },
  {
    title: "Transitioning on a Budget",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
    active: false,
  },
  {
    title: "Exploring Alternative Paths",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
    active: false,
  },

  // Networking (6) - Professional connections
  {
    title: "Building Authentic Professional Relationships",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  {
    title: "Telling Your Story",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "docx",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  {
    title: "Leveraging Your Alumni Network",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  {
    title: "Making the Most of Events",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  {
    title: "Strategic LinkedIn Networking",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  {
    title: "Reaching Out to New Contacts",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "docx",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  // Consolidated from Professional Development
  {
    title: "Finding & Being a Mentor",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  // Consolidated from Job Search Strategies
  {
    title: "Where to Find Opportunities",
    type: RESOURCE_TYPES.DIRECTORY,
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },
  {
    title: "Making Your Profile Discoverable",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "25 min",
    category: CATEGORY_NAMES.NETWORKING,
    active: false,
  },

  // Interview Preparation - Tactical skills
  {
    title: "Calming Interview Nerves",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Structuring Your Stories",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "20 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Preparing Your Responses",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Video Interview Best Practices",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Phone Interview Preparation",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "pdf",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Following Up Gracefully",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "docx",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  // Consolidated from Resume & Cover Letters
  {
    title: "Resume Templates",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "docx",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Cover Letter Templates",
    type: RESOURCE_TYPES.DOWNLOAD,
    format: "docx",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  {
    title: "Getting Past Automated Screens",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
  // Consolidated from Salary & Negotiation
  {
    title: "Negotiation Strategies",
    type: RESOURCE_TYPES.ARTICLE,
    readTime: "30 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    active: false,
  },
];

// Category metadata - ordered by priority for overall human wellbeing
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  // Foundation: Mental & Emotional Health
  {
    icon: Smile,
    title: CATEGORY_NAMES.MENTAL_WELLBEING,
    description: "Tools and strategies for a healthier mind",
    path: "/resources/mental-wellbeing",
    slug: "mental-wellbeing",
    color: "violet",
  },
  {
    icon: Heart,
    title: CATEGORY_NAMES.RELATIONSHIPS,
    description: "Strengthen your personal and professional connections",
    path: "/resources/relationships",
    slug: "relationships",
    color: "rose",
  },
  // Growth: Skills & Knowledge
  {
    icon: Compass,
    title: CATEGORY_NAMES.CAREER_EXPLORATION,
    description: "Discover careers that match your interests and skills",
    path: "/resources/career-exploration",
    slug: "career-exploration",
    color: "teal",
  },
  // Physical Health
  {
    icon: Activity,
    title: CATEGORY_NAMES.HEALTHY_LIVING,
    description: "Simple habits to support your overall wellbeing",
    path: "/resources/healthy-living",
    slug: "healthy-living",
    color: "emerald",
  },
  // Continued Learning & Development
  {
    icon: GraduationCap,
    title: CATEGORY_NAMES.EDUCATION_TRAINING,
    description: "Find programs, certifications, and courses",
    path: "/resources/education-training",
    slug: "education-training",
    color: "blue",
  },
  {
    icon: Award,
    title: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    description: "Thrive in your new role from day one",
    path: "/resources/workplace-success",
    slug: "workplace-success",
    color: "amber",
  },
  // Financial Security
  {
    icon: Landmark,
    title: CATEGORY_NAMES.FINANCIAL_AID,
    description: "Navigate scholarships, grants, and education funding",
    path: "/resources/financial-aid",
    slug: "financial-aid",
    color: "indigo",
  },
  // Career Navigation
  {
    icon: TrendingUp,
    title: CATEGORY_NAMES.CAREER_TRANSITIONS,
    description: "Navigate career changes successfully",
    path: "/resources/career-transitions",
    slug: "career-transitions",
    color: "orange",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.NETWORKING,
    description: "Build connections and expand your professional network",
    path: "/resources/networking",
    slug: "networking",
    color: "pink",
  },
  // Job Seeking Tools
  {
    icon: MessageSquare,
    title: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    description: "Practice questions and strategies to ace interviews",
    path: "/resources/interview-prep",
    slug: "interview-prep",
    color: "purple",
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

// Color style mappings for category theming
export const CATEGORY_COLOR_STYLES: Record<CategoryColor, {
  // Hero/header backgrounds
  gradient: string[];
  accent: string;
  // Card styling
  bg: string;
  bgHover: string;
  border: string;
  borderHover: string;
  // Icon styling
  iconBg: string;
  iconBorder: string;
  iconText: string;
  iconHoverText: string;
  // Badge styling
  badgeBg: string;
  badgeText: string;
  // CTA styling
  ctaFrom: string;
  ctaTo: string;
  ctaButtonText: string;
  ctaButtonHover: string;
  ctaButtonFocus: string;
  ctaButtonActive: string;
}> = {
  violet: {
    gradient: ["#f5f3ff", "#ede9fe", "#ddd6fe"],
    accent: "139, 92, 246",
    bg: "bg-violet-50",
    bgHover: "hover:bg-violet-50",
    border: "border-violet-200",
    borderHover: "hover:border-violet-400",
    iconBg: "bg-white",
    iconBorder: "border-violet-200",
    iconText: "text-violet-600",
    iconHoverText: "group-hover:text-violet-600",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    ctaFrom: "from-violet-500",
    ctaTo: "to-purple-600",
    ctaButtonText: "text-violet-700",
    ctaButtonHover: "hover:bg-violet-50",
    ctaButtonFocus: "focus-visible:ring-violet-400",
    ctaButtonActive: "active:bg-violet-100",
  },
  rose: {
    gradient: ["#fff1f2", "#ffe4e6", "#fecdd3"],
    accent: "244, 63, 94",
    bg: "bg-rose-50",
    bgHover: "hover:bg-rose-50",
    border: "border-rose-200",
    borderHover: "hover:border-rose-400",
    iconBg: "bg-white",
    iconBorder: "border-rose-200",
    iconText: "text-rose-600",
    iconHoverText: "group-hover:text-rose-600",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    ctaFrom: "from-rose-500",
    ctaTo: "to-pink-600",
    ctaButtonText: "text-rose-700",
    ctaButtonHover: "hover:bg-rose-50",
    ctaButtonFocus: "focus-visible:ring-rose-400",
    ctaButtonActive: "active:bg-rose-100",
  },
  lime: {
    gradient: ["#ecfccb", "#d9f99d", "#bef264"],
    accent: "163, 230, 53",
    bg: "bg-lime-50",
    bgHover: "hover:bg-lime-50",
    border: "border-lime-200",
    borderHover: "hover:border-lime-400",
    iconBg: "bg-white",
    iconBorder: "border-lime-200",
    iconText: "text-lime-600",
    iconHoverText: "group-hover:text-lime-600",
    badgeBg: "bg-lime-100",
    badgeText: "text-lime-700",
    ctaFrom: "from-lime-500",
    ctaTo: "to-green-600",
    ctaButtonText: "text-lime-700",
    ctaButtonHover: "hover:bg-lime-50",
    ctaButtonFocus: "focus-visible:ring-lime-400",
    ctaButtonActive: "active:bg-lime-100",
  },
  teal: {
    gradient: ["#ccfbf1", "#99f6e4", "#5eead4"],
    accent: "20, 184, 166",
    bg: "bg-teal-50",
    bgHover: "hover:bg-teal-50",
    border: "border-teal-200",
    borderHover: "hover:border-teal-400",
    iconBg: "bg-white",
    iconBorder: "border-teal-200",
    iconText: "text-teal-600",
    iconHoverText: "group-hover:text-teal-600",
    badgeBg: "bg-teal-100",
    badgeText: "text-teal-700",
    ctaFrom: "from-teal-500",
    ctaTo: "to-cyan-600",
    ctaButtonText: "text-teal-700",
    ctaButtonHover: "hover:bg-teal-50",
    ctaButtonFocus: "focus-visible:ring-teal-400",
    ctaButtonActive: "active:bg-teal-100",
  },
  emerald: {
    gradient: ["#d1fae5", "#a7f3d0", "#6ee7b7"],
    accent: "16, 185, 129",
    bg: "bg-emerald-50",
    bgHover: "hover:bg-emerald-50",
    border: "border-emerald-200",
    borderHover: "hover:border-emerald-400",
    iconBg: "bg-white",
    iconBorder: "border-emerald-200",
    iconText: "text-emerald-600",
    iconHoverText: "group-hover:text-emerald-600",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    ctaFrom: "from-emerald-500",
    ctaTo: "to-teal-600",
    ctaButtonText: "text-emerald-700",
    ctaButtonHover: "hover:bg-emerald-50",
    ctaButtonFocus: "focus-visible:ring-emerald-400",
    ctaButtonActive: "active:bg-emerald-100",
  },
  blue: {
    gradient: ["#dbeafe", "#bfdbfe", "#93c5fd"],
    accent: "59, 130, 246",
    bg: "bg-blue-50",
    bgHover: "hover:bg-blue-50",
    border: "border-blue-200",
    borderHover: "hover:border-blue-400",
    iconBg: "bg-white",
    iconBorder: "border-blue-200",
    iconText: "text-blue-600",
    iconHoverText: "group-hover:text-blue-600",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    ctaFrom: "from-blue-500",
    ctaTo: "to-indigo-600",
    ctaButtonText: "text-blue-700",
    ctaButtonHover: "hover:bg-blue-50",
    ctaButtonFocus: "focus-visible:ring-blue-400",
    ctaButtonActive: "active:bg-blue-100",
  },
  cyan: {
    gradient: ["#cffafe", "#a5f3fc", "#67e8f9"],
    accent: "6, 182, 212",
    bg: "bg-cyan-50",
    bgHover: "hover:bg-cyan-50",
    border: "border-cyan-200",
    borderHover: "hover:border-cyan-400",
    iconBg: "bg-white",
    iconBorder: "border-cyan-200",
    iconText: "text-cyan-600",
    iconHoverText: "group-hover:text-cyan-600",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-700",
    ctaFrom: "from-cyan-500",
    ctaTo: "to-blue-600",
    ctaButtonText: "text-cyan-700",
    ctaButtonHover: "hover:bg-cyan-50",
    ctaButtonFocus: "focus-visible:ring-cyan-400",
    ctaButtonActive: "active:bg-cyan-100",
  },
  amber: {
    gradient: ["#fef3c7", "#fde68a", "#fcd34d"],
    accent: "245, 158, 11",
    bg: "bg-amber-50",
    bgHover: "hover:bg-amber-50",
    border: "border-amber-200",
    borderHover: "hover:border-amber-400",
    iconBg: "bg-white",
    iconBorder: "border-amber-200",
    iconText: "text-amber-600",
    iconHoverText: "group-hover:text-amber-600",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    ctaFrom: "from-amber-500",
    ctaTo: "to-orange-600",
    ctaButtonText: "text-amber-700",
    ctaButtonHover: "hover:bg-amber-50",
    ctaButtonFocus: "focus-visible:ring-amber-400",
    ctaButtonActive: "active:bg-amber-100",
  },
  indigo: {
    gradient: ["#e0e7ff", "#c7d2fe", "#a5b4fc"],
    accent: "99, 102, 241",
    bg: "bg-indigo-50",
    bgHover: "hover:bg-indigo-50",
    border: "border-indigo-200",
    borderHover: "hover:border-indigo-400",
    iconBg: "bg-white",
    iconBorder: "border-indigo-200",
    iconText: "text-indigo-600",
    iconHoverText: "group-hover:text-indigo-600",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-700",
    ctaFrom: "from-indigo-500",
    ctaTo: "to-violet-600",
    ctaButtonText: "text-indigo-700",
    ctaButtonHover: "hover:bg-indigo-50",
    ctaButtonFocus: "focus-visible:ring-indigo-400",
    ctaButtonActive: "active:bg-indigo-100",
  },
  orange: {
    gradient: ["#ffedd5", "#fed7aa", "#fdba74"],
    accent: "249, 115, 22",
    bg: "bg-orange-50",
    bgHover: "hover:bg-orange-50",
    border: "border-orange-200",
    borderHover: "hover:border-orange-400",
    iconBg: "bg-white",
    iconBorder: "border-orange-200",
    iconText: "text-orange-600",
    iconHoverText: "group-hover:text-orange-600",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    ctaFrom: "from-orange-500",
    ctaTo: "to-red-600",
    ctaButtonText: "text-orange-700",
    ctaButtonHover: "hover:bg-orange-50",
    ctaButtonFocus: "focus-visible:ring-orange-400",
    ctaButtonActive: "active:bg-orange-100",
  },
  pink: {
    gradient: ["#fce7f3", "#fbcfe8", "#f9a8d4"],
    accent: "236, 72, 153",
    bg: "bg-pink-50",
    bgHover: "hover:bg-pink-50",
    border: "border-pink-200",
    borderHover: "hover:border-pink-400",
    iconBg: "bg-white",
    iconBorder: "border-pink-200",
    iconText: "text-pink-600",
    iconHoverText: "group-hover:text-pink-600",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-700",
    ctaFrom: "from-pink-500",
    ctaTo: "to-rose-600",
    ctaButtonText: "text-pink-700",
    ctaButtonHover: "hover:bg-pink-50",
    ctaButtonFocus: "focus-visible:ring-pink-400",
    ctaButtonActive: "active:bg-pink-100",
  },
  sky: {
    gradient: ["#e0f2fe", "#bae6fd", "#7dd3fc"],
    accent: "14, 165, 233",
    bg: "bg-sky-50",
    bgHover: "hover:bg-sky-50",
    border: "border-sky-200",
    borderHover: "hover:border-sky-400",
    iconBg: "bg-white",
    iconBorder: "border-sky-200",
    iconText: "text-sky-600",
    iconHoverText: "group-hover:text-sky-600",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    ctaFrom: "from-sky-500",
    ctaTo: "to-blue-600",
    ctaButtonText: "text-sky-700",
    ctaButtonHover: "hover:bg-sky-50",
    ctaButtonFocus: "focus-visible:ring-sky-400",
    ctaButtonActive: "active:bg-sky-100",
  },
  slate: {
    gradient: ["#f1f5f9", "#e2e8f0", "#cbd5e1"],
    accent: "100, 116, 139",
    bg: "bg-slate-50",
    bgHover: "hover:bg-slate-50",
    border: "border-slate-200",
    borderHover: "hover:border-slate-400",
    iconBg: "bg-white",
    iconBorder: "border-slate-200",
    iconText: "text-slate-600",
    iconHoverText: "group-hover:text-slate-600",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    ctaFrom: "from-slate-500",
    ctaTo: "to-gray-600",
    ctaButtonText: "text-slate-700",
    ctaButtonHover: "hover:bg-slate-50",
    ctaButtonFocus: "focus-visible:ring-slate-400",
    ctaButtonActive: "active:bg-slate-100",
  },
  purple: {
    gradient: ["#faf5ff", "#f3e8ff", "#e9d5ff"],
    accent: "168, 85, 247",
    bg: "bg-purple-50",
    bgHover: "hover:bg-purple-50",
    border: "border-purple-200",
    borderHover: "hover:border-purple-400",
    iconBg: "bg-white",
    iconBorder: "border-purple-200",
    iconText: "text-purple-600",
    iconHoverText: "group-hover:text-purple-600",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    ctaFrom: "from-purple-500",
    ctaTo: "to-violet-600",
    ctaButtonText: "text-purple-700",
    ctaButtonHover: "hover:bg-purple-50",
    ctaButtonFocus: "focus-visible:ring-purple-400",
    ctaButtonActive: "active:bg-purple-100",
  },
  yellow: {
    gradient: ["#fefce8", "#fef9c3", "#fef08a"],
    accent: "234, 179, 8",
    bg: "bg-yellow-50",
    bgHover: "hover:bg-yellow-50",
    border: "border-yellow-200",
    borderHover: "hover:border-yellow-400",
    iconBg: "bg-white",
    iconBorder: "border-yellow-200",
    iconText: "text-yellow-600",
    iconHoverText: "group-hover:text-yellow-600",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-700",
    ctaFrom: "from-yellow-500",
    ctaTo: "to-amber-600",
    ctaButtonText: "text-yellow-700",
    ctaButtonHover: "hover:bg-yellow-50",
    ctaButtonFocus: "focus-visible:ring-yellow-400",
    ctaButtonActive: "active:bg-yellow-100",
  },
};
