📋 Job Application Tracker - Implementation Plan 🎯 Core Value Proposition A
smart tracking system that not only organizes applications but helps you:

Spot patterns in successful applications

Compare offers effectively

Prepare for interviews with context

Track relationships with employers

📊 Enhanced Data Models typescript // types.ts

type UserProfile = { id: string name: string email: string rawBio: string //
Career history, experience, skills parsedData?: { skills: string[]
workExperience: WorkExperience[] education: Education[] achievements: string[] }
defaultCVId?: string // Your go-to CV template jobSearchPreferences?: {
preferredRoles: string[] preferredLocations: string[] minSalary?: number
maxSalary?: number remotePreference: 'Remote' | 'Hybrid' | 'On-site' | 'Any' }
createdAt: Date updatedAt: Date }

type CV = { id: string name: string // e.g., "General Purpose", "Tech Lead Role"
version: number userId: string isDefault: boolean targetRole?: string // For
specialized CVs baseOnProfileId: string content: string // Generated CV text
pdfUrl?: string markdownContent?: string // For editing atsKeywords?: string[]
// Keywords this CV targets successRate?: number // % of applications that
progressed metadata: { createdAt: Date updatedAt: Date usedCount: number // How
many times used interviewRate?: number // % that led to interviews } }

type Company = { id: string name: string website?: string industry?: string
notes?: string contacts: Contact[] // Recruiters, hiring managers createdAt:
Date }

type Contact = { id: string companyId: string name: string role: string email?:
string linkedin?: string notes?: string lastInteraction?: Date interactions:
Interaction[] }

type Interaction = { id: string contactId: string type: 'Email' | 'Call' |
'LinkedIn' | 'Interview' | 'Follow-up' date: Date notes: string followUpDate?:
Date followUpCompleted: boolean }

type JobApplication = { id: string userId: string companyId: string company?:
string // Denormalized for quick view position: string jobDescription: string //
Full JD text jobUrl?: string location: string flexibility: 'Remote' | 'On-site'
| 'Hybrid' minSalary?: number maxSalary?: number salaryCurrency?: string //
Default: USD benefits?: string[] // Health, 401k, etc.

// Tracking status: 'Wishlist' | 'Applied' | 'Pending Review' | 'Interviewing' |
'Offer' | 'Rejected' | 'Withdrawn' appliedDate: Date source: string // LinkedIn,
Company site, Referral, etc. sourceBoard?: string // Specific job board

// Linked documents cvId: string // CV used cvSnapshot?: string // CV content at
time of application coverLetterId?: string coverLetterSnapshot?: string

// Analysis matchScore?: number // AI-calculated match with your profile notes?:
string tags?: string[] // e.g., "Dream job", "Backup", "Startup"

// Timelines lastUpdated: Date nextFollowUp?: Date responseTime?: number // Days
until first response

// Relationships interviews: Interview[] contacts: Contact[] // People met
during process offers?: JobOffer[] // If multiple offers from same company }

type Interview = { id: string jobApplicationId: string type: 'Phone Screen' |
'Technical' | 'HR' | 'Hiring Manager' | 'Panel' | 'Final' | 'Take-home' round:
number // 1st, 2nd, 3rd interview date: Date duration?: number // Minutes
interviewerIds?: string[] // Link to contacts interviewerNames?: string[] //
Quick entry format: 'Video' | 'Phone' | 'In-person' | 'Take-home'

// Preparation preparationNotes?: string questionsAsked?: string[]
yourQuestions?: string[]

// Results feedback?: string rating?: 1 | 2 | 3 | 4 | 5 // How well you think it
went nextSteps?: string followUpSent?: boolean followUpDate?: Date

// STAR method prep starStories?: { situation: string task: string action:
string result: string }[]

notes: string }

type JobOffer = { id: string jobApplicationId: string status: 'Pending' |
'Accepted' | 'Declined' | 'Negotiating' | 'Expired' extendedDate: Date
expiryDate?: Date responseDate?: Date

// Compensation baseSalary: number baseSalaryCurrency: string equity?: string
bonus?: string signingBonus?: number relocationPackage?: string

// Benefits benefits: string[] vacationDays?: number remotePolicy?: string

// Comparison pros: string[] cons: string[] comparisonScore?: number // Your
personal scoring

// Negotiation initialOffer?: string // Notes on initial offer counterOffer?:
string // What you asked for finalOffer?: string // What they came back with
negotiationNotes?: string

decision?: string // Why you accepted/declined }

type CoverLetter = { id: string jobApplicationId: string cvId: string content:
string pdfUrl?: string createdAt: Date tone?: 'Professional' | 'Enthusiastic' |
'Technical' | 'Creative' keyPoints: string[] // Main selling points highlighted
}

// Analytics type ApplicationAnalytics = { totalApplications: number
responseRate: number // % that got responses interviewRate: number // % that led
to interviews offerRate: number // % that led to offers

bySource: { [source: string]: { count: number interviewRate: number offerRate:
number } }

byRole: { [role: string]: { count: number interviewRate: number } }

bySalary: { range: string count: number offerCount: number }

timelineStats: { avgResponseDays: number avgInterviewProcessDays: number
avgOfferDecisionDays: number }

topKeywords: string[] // Keywords leading to interviews bestPerformingCVs:
string[] // CV IDs with highest success } 📁 Application Pages Structure text
app/ ├── dashboard/ │ ├── page.tsx # Analytics overview with charts │ ├──
layout.tsx # Sidebar with tabs │ │ │ ├── me/ │ │ ├── page.tsx # Profile + raw
bio editor │ │ ├── parse/ │ │ │ └── route.ts # AI parsing endpoint │ │ ├──
analytics/ │ │ │ └── page.tsx # Personal stats (response rates, etc.) │ │ └──
contacts/ │ │ └── page.tsx # Network of recruiters/hiring managers │ │ │ ├──
cvs/ │ │ ├── page.tsx # Grid/list of all CVs with performance │ │ ├── new/ │ │ │
├── page.tsx # Step-by-step CV creation │ │ │ └── routes/ │ │ │ ├──
generate/route.ts # AI generation │ │ │ └── analyze/route.ts # ATS keyword
analysis │ │ ├── [id]/ │ │ │ ├── page.tsx # CV editor with version history │ │ │
├── pdf/ │ │ │ │ └── route.ts # PDF generation │ │ │ └── performance/ │ │ │ └──
page.tsx # How this CV performed │ │ └── compare/ │ │ └── page.tsx # Compare
multiple CVs │ │ │ ├── jobs/ │ │ ├── page.tsx # Kanban board (like Huntr) │ │
├── new/ │ │ │ ├── page.tsx # Add job with Chrome extension style │ │ │ ├──
manual/ │ │ │ │ └── page.tsx # Manual entry │ │ │ └── auto/ │ │ │ └── route.ts #
Auto-capture from URL │ │ ├── [id]/ │ │ │ ├── page.tsx # Job details + timeline
│ │ │ ├── interviews/ │ │ │ │ ├── page.tsx # Interview prep │ │ │ │ └── new/ │ │
│ │ └── page.tsx # Add interview with STAR prep │ │ │ ├── contacts/ │ │ │ │ └──
page.tsx # People at this company │ │ │ ├── offers/ │ │ │ │ ├── page.tsx #
View/compare offers │ │ │ │ └── new/ │ │ │ │ └── page.tsx # Add offer with
negotiation tracking │ │ │ └── analytics/ │ │ │ └── page.tsx # This job's stats
│ │ └── board/ │ │ ├── page.tsx # Kanban view with drag-drop │ │ └── api/ │ │
└── move/route.ts # Update status │ │ │ ├── companies/ │ │ ├── page.tsx # All
companies with interactions │ │ ├── [id]/ │ │ │ ├── page.tsx # Company profile +
history │ │ │ └── contacts/ │ │ │ └── page.tsx # All contacts at this company │
│ └── new/ │ │ └── page.tsx # Add company │ │ │ ├── analytics/ │ │ ├── page.tsx

# Overall dashboard │ │ ├── sources/ │ │ │ └── page.tsx # Which job boards

perform best │ │ ├── timeline/ │ │ │ └── page.tsx # Response time trends │ │ └──
keywords/ │ │ └── page.tsx # Successful keywords │ │ │ └── settings/ │ ├──
page.tsx # General settings │ ├── integrations/ │ │ ├── page.tsx # LinkedIn, job
boards │ │ └── chrome-extension/ │ │ └── page.tsx # Extension setup │ └──
export/ │ └── route.ts # Export all data 🚀 Phased Implementation Phase 1: Core
MVP (2-3 weeks) Goal: Replace your spreadsheet with basic tracking

Week 1: Foundation

Database schema (UserProfile, CV, JobApplication)

Basic auth

"Me" profile with raw bio textarea

Simple CV list + create (AI generation with your bio)

Week 2: Job Tracking

Add job form (company, position, JD, salary min/max)

Job board view (list or simple Kanban)

Status updates (Applied → Interviewing → Rejected/Offer)

Basic interview tracking (date, interviewer)

Week 3: PDF Generation & Polish

Connect your existing PDF generator

Link CVs to job applications

Simple dashboard with counts

Match your screenshot's layout

Phase 2: Smart Features (2-3 weeks) Goal: Add the strategic tracking that
provides real value

Week 4: Enhanced Job Details

Salary range tracking

Benefits checklist

Job source tracking (LinkedIn, referral, etc.)

Tags and notes

Week 5: Interview Preparation

Interview scheduler with calendar view

STAR method preparation templates

Questions tracker (asked vs. to ask)

Follow-up reminders

Week 6: Offer Management

JobOffer table

Offer comparison view (side-by-side)

Salary + benefits breakdown

Decision matrix (pros/cons, scoring)

Phase 3: Analytics & Insights (2 weeks) Goal: Help you spot patterns and
optimize

Week 7: Basic Analytics

Response rate by source

Interview rate by CV version

Time-to-response tracking

Status distribution chart (like your screenshot)

Week 8: Advanced Insights

Keyword analysis (which terms get interviews)

Best performing roles/locations

Offer rate by company type

Export functionality

Phase 4: Polish & Extras (1-2 weeks) Goal: Make it feel like a real product for
your portfolio

Week 9: UI/UX Improvements

Drag-drop Kanban board

Mobile responsive design

Dark mode

Keyboard shortcuts

Week 10: Integrations (Optional)

Chrome extension for auto-capture

LinkedIn profile import

Email integration for follow-ups

Calendar sync

🤖 AI Prompt Templates CV Generation typescript const generateCVPrompt = (bio:
string, jobDescription?: string, targetRole?: string) => ` You are an expert
ATS-optimized CV writer. Create a professional CV that will pass automated
screening.

MY BACKGROUND: ${bio}

${jobDescription ? `TARGET JOB DESCRIPTION:
${jobDescription}` : ''}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

Create a CV that:

1. Uses strong action verbs and quantifiable achievements
2. Includes relevant keywords from the job description (if provided)
3. Follows this structure:
   - Professional Summary (2-3 sentences tailored to the role)
   - Core Competencies (key skills as bullet points)
   - Professional Experience (with achievements, not just duties)
   - Education & Certifications
   - Additional Relevant Information

Format in clean
markdown.`Cover Letter Generation
typescript
const generateCoverLetterPrompt = (cv: string, jobDescription: string, company: string, tone: string) =>`
Write a compelling ${tone} cover letter for ${company}.

MY CV: ${cv}

JOB DESCRIPTION: ${jobDescription}

The letter should:

1. Open with enthusiasm for the company and role
2. Highlight 2-3 key achievements from my CV relevant to this role
3. Explain why I'm interested in this specific company
4. Close with a call to action

Keep it professional, concise, and
authentic.`STAR Method Preparation
typescript
const generateStarStories = (bio: string, competency: string) =>`
Based on my experience, create STAR method stories for the competency:
${competency}

MY BACKGROUND: ${bio}

For each story, provide:

- Situation: Context and background
- Task: What needed to be done
- Action: What I specifically did
- Result: The outcome with metrics if possible

Generate 2-3 relevant stories for this
competency.`Job Match Analysis
typescript
const analyzeJobMatch = (cv: string, jobDescription: string) =>`
Analyze how well this CV matches the job description:

CV: ${cv}

JOB DESCRIPTION: ${jobDescription}

Provide:

1. Match score (0-100%)
2. Missing keywords (list)
3. Present keywords (list)
4. Suggested CV improvements
5. Questions to ask about the role
6. Potential talking points for interview 📈 Success Metrics to Track For You
   (User) Time saved vs. manual tracking

Response rate improvement

Interview conversion rate

Offer acceptance rate

Average time from apply to offer

For Your Portfolio Clean, production-ready code

Complex relational data model

AI integration with multiple prompt types

Real-time analytics

PDF generation

Responsive design

🛠️ Tech Stack Recommendations Core Next.js 14+ (App Router)

TypeScript

Tailwind CSS + shadcn/ui

Prisma or Drizzle ORM

PostgreSQL (Vercel Postgres or Supabase)

AI & PDF Vercel AI SDK (for streaming responses)

OpenAI GPT-4 or Claude API

react-pdf or your existing PDF solution

UI Components TanStack Table (for job listings)

dnd-kit (for Kanban drag-drop)

Recharts (for analytics)

React Hook Form + Zod

date-fns

Optional Extras NextAuth.js / Clerk (auth)

Upstash Redis (rate limiting)

Plausible (analytics)

Resend (email follow-ups)

⚠️ Key Decisions & Trade-offs DO Include in MVP Raw bio + AI generation

Job tracking with min/max salary

Linked CVs to applications

Basic interview tracking

Simple analytics

JobOffer table (even if basic)

DEFER to Phase 2/3 Chrome extension

Calendar integration

Email sync

Team features

Mobile app

Public API

📝 Sample Implementation Timeline text Week 1-2: Core MVP ├── Database setup ├──
Auth ├── Me profile ├── CV CRUD + AI generation └── Job CRUD + linking

Week 3-4: Tracking Features ├── Interview management ├── Status board ├──
Company/contacts └── Basic dashboard

Week 5-6: Advanced Features ├── Offer management + comparison ├── STAR
preparation ├── Follow-up reminders └── Enhanced analytics

Week 7-8: Polish & Portfolio ├── UI refinements ├── Performance optimization ├──
Documentation └── Demo video/deployment 🎯 Final Recommendations Start with the
spreadsheet replacement - Get the basic CRUD working first

Add AI generation next - This is your differentiator

Then build the analytics - This provides real value

Polish for portfolio - Make it look professional
