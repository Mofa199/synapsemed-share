# SynapseMed - Complete Architecture & Features Documentation

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Technology Stack](#technology-stack)
3. [Features Overview](#features-overview)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [File Structure](#file-structure)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer (Browser)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │   Lecturer   │  │    Admin     │      │
│  │  Dashboard   │  │  Dashboard   │  │    Panel     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│              Next.js 15 Application Layer                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  App Router  │  │     API      │  │   Auth       │      │
│  │   (Pages)    │  │   Routes     │  │(NextAuth.js) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Business Logic Layer                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Prisma     │  │   Services   │  │  Middleware  │      │
│  │     ORM      │  │   Layer      │  │   & Utils    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │ File Storage │  │  AI Backend  │      │
│  │   (Neon)     │  │   (Cloud)    │  │  (Python)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
SynapseMed Application
│
├── Frontend (React 19 + Next.js 15)
│   ├── Student Portal
│   │   ├── Dashboard
│   │   ├── Content Library
│   │   ├── Videos
│   │   ├── Concepts & Mnemonics
│   │   ├── Questions Practice
│   │   ├── Simulations
│   │   ├── Learning Paths
│   │   ├── AI Tutor Chat
│   │   └── Planner & Goals
│   │
│   ├── Admin Panel
│   │   ├── Overview Dashboard
│   │   ├── User Management
│   │   ├── Content Management
│   │   ├── Gamification
│   │   ├── Simulation Management
│   │   └── Email & Settings
│   │
│   └── Lecturer Dashboard
│       ├── Courses Management
│       ├── Student Progress
│       ├── Exam Assignments
│       └── Analytics
│
├── Backend (Next.js API Routes)
│   ├── Authentication (/api/auth)
│   ├── User APIs (/api/user)
│   ├── Content APIs (/api/content)
│   ├── Admin APIs (/api/admin)
│   ├── Simulation APIs (/api/simulations)
│   └── AI Integration (/api/ai)
│
├── Database (PostgreSQL + Prisma)
│   ├── User Management
│   ├── Content Storage
│   ├── Progress Tracking
│   ├── Gamification Data
│   └── Analytics Data
│
└── External Services
    ├── AI Backend (Python/FastAPI)
    ├── Google OAuth
    └── Email Service (SMTP)
```

---

## Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.2.4 | React framework with App Router |
| **React** | 19.0.0 | UI component library |
| **TypeScript** | 5.7.3 | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built UI components |
| **Lucide React** | Latest | Icon library |
| **React Hook Form** | Latest | Form management |
| **Zod** | Latest | Schema validation |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js API Routes** | 15.2.4 | RESTful API endpoints |
| **Prisma** | 6.17.1 | ORM for database operations |
| **NextAuth.js** | 4.24.0 | Authentication framework |
| **PostgreSQL** | 14+ | Relational database |
| **bcrypt** | Latest | Password hashing |

### AI & ML Stack

| Technology | Purpose |
|------------|---------|
| **Python** | AI backend language |
| **FastAPI** | Python web framework |
| **LangChain** | LLM orchestration |
| **OpenAI API** | GPT integration |
| **Vector Database** | Embeddings storage |

### Development & Deployment

| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **npm/pnpm** | Package management |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Docker** | Containerization |
| **Vercel** | Deployment platform |

---

## Features Overview

### 🎓 Student Features

#### 1. **Dashboard**
- **Personalized Learning**: Daily streak tracking, XP points, level progression
- **Recent Activity**: Continue watching, recently accessed content
- **Study Goals**: Track daily/weekly targets
- **Spaced Repetition**: Smart review reminders
- **BookMatcher**: AI-powered book recommendations
- **Quick Notes**: Integrated note-taking system

#### 2. **Content Library**
- **Topics**: Browse 1000+ medical topics
- **Articles**: Research papers and clinical articles
- **Books**: Digital textbooks and references
- **Study Guides**: Curated learning materials
- **Search & Filter**: Advanced content discovery
- **Bookmarks**: Save favorite content
- **Progress Tracking**: Per-content completion status

#### 3. **Video Learning**
- **Video Player**: Custom player with playback controls
- **Favorites**: Save important videos
- **Comments & Discussion**: Engage with peers
- **Embedded Quizzes**: Test understanding
- **Transcripts**: Full video transcriptions
- **Progress Tracking**: Watch time and completion
- **Speed Control**: Adjustable playback speed

#### 4. **Concepts & Mnemonics**
- **Concept Library**: 500+ medical concepts
- **Mnemonics Database**: Memory aids for complex topics
- **User-Generated Content**: Submit your own mnemonics
- **Voting System**: Upvote/downvote mnemonics
- **Admin Verification**: Quality-controlled content
- **AI-Generated Mnemonics**: SYNAPSEMED AI creates custom mnemonics

#### 5. **Question Banks**
- **Multiple Practice Modes**: 
  - Timed Mode
  - Tutor Mode (with explanations)
  - Custom Mode
- **Performance Analytics**: Track accuracy, time, weak areas
- **Question Types**: MCQs, True/False, Fill-in-blank
- **Explanations**: Detailed answer explanations
- **Bookmarking**: Flag questions for review
- **Progress History**: Performance over time

#### 6. **Patient Simulations** 🚀 NEW
- **15 Clinical Cases**:
  - Acute Myocardial Infarction (STEMI)
  - Community-Acquired Pneumonia
  - Diabetic Ketoacidosis
  - Acute Appendicitis
  - Anaphylaxis
  - Acute Ischemic Stroke
  - Organophosphate Poisoning
  - Tension Pneumothorax
  - Severe Pneumonia (Pediatric)
  - Congestive Heart Failure
  - Small Bowel Obstruction
  - Postpartum Hemorrhage
  - Ruptured Ectopic Pregnancy
  - Road Traffic Injury
  - Major Depressive Disorder

- **Simulation Features**:
  - **Triage Assessment**: Initial patient evaluation
  - **History Taking**: Chief complaint, HPI, PMH
  - **Physical Examination**: System-by-system assessment
  - **Diagnostics**: Labs, imaging, bedside tests
  - **DxPause**: Differential diagnosis formulation
  - **Management**: Treatment planning
  - **AI Tutor Integration**: Real-time guidance
  - **Performance Scoring**: Detailed feedback
  - **Case Reports**: Final diagnosis with explanations

#### 7. **Exam Simulations**
- **Full-Length Exams**: USMLE, NCLEX-style exams
- **XP & Achievements**: Gamified rewards
- **Timer & Score**: Real exam conditions
- **Detailed Analytics**: Question-by-question breakdown
- **Lecturer Assignments**: Instructor-assigned exams
- **Adaptive Difficulty**: AI-adjusted question selection

#### 8. **Learning Paths**
- **Structured Curricula**: Step-by-step learning
- **Progress Tracking**: Module completion
- **Prerequisites**: Unlock content progressively
- **Certificates**: Completion certificates
- **Recommended Paths**: Based on field (Medical, Nursing, Pharmacy)

#### 9. **AI Tutor (SYNAPSEMED AI)**
- **24/7 Availability**: Always-on AI assistant
- **Context-Aware**: Understands medical terminology
- **Multi-Format Support**: Text, images, diagrams
- **Citation Sources**: Evidence-based responses
- **Chat History**: Persistent conversations
- **Voice Input**: Coming soon

#### 10. **Planner & Goals**
- **Study Goals**: Daily/weekly targets
- **Study Sessions**: Track study time
- **Calendar View**: Visualize study schedule
- **Reminders**: Never miss a study session
- **Analytics**: Study patterns and insights

#### 11. **Chat & Community**
- **Direct Messages**: Peer-to-peer communication
- **Study Groups**: Collaborative learning
- **Channels**: Topic-based discussions
- **File Sharing**: Share notes and resources
- **Moderation**: Safe learning environment

---

### 👨‍🏫 Lecturer Features

#### 1. **Course Management**
- Create and manage courses
- Upload learning materials
- Organize modules and topics
- Set prerequisites

#### 2. **Exam Management**
- Create custom exams
- Assign to specific students
- Set deadlines and attempts
- View submissions

#### 3. **Student Progress Tracking**
- View individual student progress
- Class performance analytics
- Engagement metrics
- Intervention alerts

#### 4. **Content Creation**
- Upload videos with transcripts
- Create quizzes and questions
- Write articles and guides
- Manage simulations

#### 5. **Analytics Dashboard**
- Course completion rates
- Average scores
- Time-on-task metrics
- Popular content

---

### 🔧 Admin Features

#### 1. **Overview Dashboard**
- **Real-time Stats**: Live user count, active sessions
- **Revenue Metrics**: Subscriptions, payments
- **Growth Charts**: User acquisition, retention
- **Quick Actions**: Common admin tasks

#### 2. **User Management**
- **User List**: All registered users
- **Role Management**: Assign STUDENT, LECTURER, EDITOR, ADMIN roles
- **User Details**: View complete profiles
- **Progress Overview**: Per-user analytics
- **Export Users**: CSV/Excel export
- **Bulk Actions**: Activate/deactivate users
- **Search & Filter**: Advanced user search

#### 3. **Content Management**
- **Topics**: Create, edit, delete topics
- **Articles**: Manage research articles
- **Books**: Upload and organize books
- **Videos**: Video library management
- **Question Banks**: Question management
- **Study Guides**: Curated guides
- **Drugs Database**: Pharmacology content
- **Concepts**: Medical concepts library

#### 4. **Gamification System**
- **Badges**: Create achievement badges
- **Levels**: Configure level thresholds
- **XP System**: Define XP rewards
- **Challenges**: Weekly/monthly challenges
- **Leaderboards**: Top performers

#### 5. **Simulation Management**
- **Case Library**: All 15+ simulation cases
- **Create New Cases**: Case builder interface
- **Analytics**: Simulation performance data
- **Educator Dashboard**: Teaching insights
- **Learner View**: Preview simulations

#### 6. **Email Management**
- **Quick Email**: Send to users/groups
- **Templates**: Email templates
- **Campaigns**: Newsletter campaigns
- **Statistics**: Open rates, click rates
- **Scheduled Emails**: Automated messaging

#### 7. **System Settings**
- **General Settings**: Site name, logo, branding
- **Email Configuration**: SMTP settings
- **Authentication**: OAuth providers
- **API Keys**: Third-party integrations
- **Backup & Restore**: Data management

---

## Database Schema

### Core Models

#### User Management
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String
  password     String
  role         UserRole @default(STUDENT)
  field        UserField
  level        Int      @default(1)
  points       Int      @default(0)
  streak       Int      @default(0)
}

enum UserRole {
  SUPER_ADMIN
  LECTURER
  EDITOR
  STUDENT
}

enum UserField {
  MEDICAL
  NURSING
  PHARMACY
}
```

#### Content Models
- **Topic**: Medical topics
- **Article**: Research articles
- **Book**: Digital textbooks
- **Video**: Video lectures
- **QuestionBank**: Question collections
- **StudyGuide**: Study materials
- **Drug**: Pharmacology database

#### Gamification Models
- **Badge**: Achievement badges
- **UserBadge**: User-earned badges
- **XPTransaction**: XP history
- **Achievement**: Unlock conditions

#### Simulation Models
- **ExamSimulation**: Exam metadata
- **ExamQuestion**: Exam questions
- **ExamAttempt**: User attempts
- **ExamAssignment**: Lecturer assignments

#### Progress Tracking
- **Progress**: Content completion
- **Bookmark**: Saved content
- **Rating**: User ratings
- **Highlight**: Text highlights
- **Note**: User notes

#### Video Features
- **VideoFavorite**: Favorite videos
- **VideoComment**: Comments
- **VideoQuiz**: Embedded quizzes
- **VideoProgress**: Watch progress

#### Concepts System
- **Concept**: Medical concepts
- **Mnemonic**: Memory aids
- **ConceptFavorite**: Favorites

#### Study Planning
- **StudyGoal**: Learning goals
- **StudySession**: Study time
- **StudyPlan**: Study schedules

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get session
- `POST /api/auth/signout` - Logout

### User APIs
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/progress` - Get progress
- `GET /api/user/achievements` - Get achievements
- `POST /api/user/xp` - Award XP

### Content APIs
- `GET /api/topics` - List topics
- `GET /api/topics/[id]` - Get topic
- `GET /api/articles` - List articles
- `GET /api/books` - List books
- `GET /api/videos` - List videos
- `POST /api/videos/[id]/favorite` - Favorite video

### Question Bank APIs
- `GET /api/question-banks` - List banks
- `GET /api/question-banks/[id]` - Get bank
- `POST /api/question-banks/[id]/attempt` - Submit answers

### Simulation APIs
- `GET /api/exam-simulations` - List exams
- `GET /api/exam-simulations/[id]` - Get exam
- `POST /api/exam-simulations/[id]/attempt` - Submit exam

### Admin APIs
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/[id]` - Update user
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/analytics` - Get analytics

### AI APIs
- `POST /api/ai/chat` - Chat with AI
- `POST /api/ai/generate-mnemonic` - Generate mnemonic
- `POST /api/ai/explain` - Explain concept

---

## Authentication & Authorization

### Role-Based Access Control (RBAC)

| Role | Access Level |
|------|-------------|
| **SUPER_ADMIN** | Full system access, all permissions |
| **LECTURER** | Course management, student monitoring, content creation |
| **EDITOR** | Content creation and editing |
| **STUDENT** | Learning portal, limited features |

### Protected Routes

```typescript
// Student routes
/student/* - Requires: STUDENT, LECTURER, EDITOR, SUPER_ADMIN

// Lecturer routes  
/lecturer/* - Requires: LECTURER, SUPER_ADMIN

// Admin routes
/admin/* - Requires: SUPER_ADMIN, LECTURER, EDITOR

// Public routes
/, /login, /signup - No authentication required
```

### Middleware Protection

```typescript
export function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  
  // Admin protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const allowedRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    if (!token || !allowedRoles.includes(token.role)) {
      return NextResponse.redirect('/login')
    }
  }
}
```

---

## File Structure

```
synapsemed/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group
│   │   ├── login/
│   │   └── signup/
│   │
│   ├── student/                  # Student portal
│   │   ├── dashboard/
│   │   ├── content/
│   │   ├── videos/
│   │   ├── concepts/
│   │   ├── questions/
│   │   ├── simulations/
│   │   │   ├── triage/          # Patient simulator
│   │   │   ├── learner/         # Learner view
│   │   │   ├── diagnostics/
│   │   │   ├── dxpause/
│   │   │   └── management/
│   │   ├── learning-paths/
│   │   ├── ai-tutor/
│   │   ├── planner/
│   │   └── chat/
│   │
│   ├── admin/                    # Admin panel
│   │   ├── overview/
│   │   ├── users/
│   │   ├── content/
│   │   ├── gamification/
│   │   ├── simulations/
│   │   ├── email/
│   │   └── settings/
│   │
│   ├── lecturer/                 # Lecturer dashboard
│   │   ├── courses/
│   │   ├── students/
│   │   └── analytics/
│   │
│   └── api/                      # API routes
│       ├── auth/
│       ├── user/
│       ├── admin/
│       ├── content/
│       ├── simulations/
│       └── ai/
│
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   ├── layout/                  # Layout components
│   ├── forms/                   # Form components
│   └── shared/                  # Shared components
│
├── lib/                         # Utility libraries
│   ├── db-utils.ts              # Database utilities
│   ├── auth.ts                  # Auth configuration
│   └── utils.ts                 # Helper functions
│
├── prisma/                      # Database
│   ├── schema.prisma            # Database schema
│   ├── migrations/              # Migration files
│   └── seed.ts                  # Seed data
│
├── public/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── videos/
│
├── styles/                      # Global styles
│   └── globals.css
│
├── types/                       # TypeScript types
│   └── index.ts
│
├── .env.local                   # Environment variables
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies
```

---

## Key Features Summary

### ✨ **Total Features: 80+**

#### Student Portal: 50+ features
- Dashboard (10 features)
- Content Library (12 features)
- Videos (8 features)
- Concepts & Mnemonics (6 features)
- Question Banks (8 features)
- Simulations (15 cases)
- Exam Simulations (5 features)
- Learning Paths (4 features)
- AI Tutor (6 features)
- Planner & Goals (5 features)

#### Admin Panel: 30+ features
- User Management (8 features)
- Content Management (10 features)
- Gamification (5 features)
- Simulation Management (4 features)
- Email Management (4 features)
- Analytics (5 features)

#### Lecturer Dashboard: 10+ features
- Course Management (4 features)
- Student Tracking (3 features)
- Exam Management (3 features)

---

## Performance Metrics

- **Page Load Time**: <2s (optimized)
- **API Response**: <200ms average
- **Database Queries**: Optimized with Prisma
- **Caching**: Static assets cached
- **SEO**: Optimized metadata

---

## Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Role-based access control
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection
- ✅ CSRF protection
- ✅ Rate limiting (planned)
- ✅ Input validation (Zod)

---

## Future Enhancements

### Phase 1 (Q1 2025)
- Mobile app (React Native)
- Offline mode
- Advanced analytics
- AI-powered study recommendations

### Phase 2 (Q2 2025)
- Virtual reality simulations
- Peer-to-peer tutoring marketplace
- Integration with medical institutions
- Certificate programs

### Phase 3 (Q3 2025)
- Multi-language support
- Advanced AI features
- Blockchain certificates
- Global leaderboards

---

**Version**: 1.0.0  
**Last Updated**: 2025-01-14  
**Maintainer**: SynapseMed Development Team
