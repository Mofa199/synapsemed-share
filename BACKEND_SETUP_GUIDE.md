# Synapse Med - Complete Backend Setup Guide

## 🚀 Quick Start

The Add Module functionality is already working! The button in curriculum management properly links to `/admin/curriculum/[id]/modules/add` and the page exists with a complete form.

## 📋 Current System Status

### ✅ Working Features
- **Add Module Page**: Fully functional at `/admin/curriculum/[id]/modules/add`
- **User Management**: Add, edit, delete users at `/admin/users`
- **Partner Management**: Manage partners at `/admin/partners`
- **Team Management**: Manage team members at `/admin/team`
- **Content Management**: Add topics, books, drugs, badges
- **Authentication**: Role-based access control

### 🔧 Backend Architecture

\`\`\`
app/
├── api/
│   ├── admin/
│   │   ├── articles/route.ts          # Article CRUD
│   │   ├── books/route.ts             # Book CRUD
│   │   ├── drugs/route.ts             # Drug CRUD
│   │   ├── badges/route.ts            # Badge CRUD
│   │   ├── topics/route.ts            # Topic CRUD
│   │   ├── users/route.ts             # User management
│   │   ├── partners/route.ts          # Partner management
│   │   ├── team/route.ts              # Team management
│   │   └── curriculums/
│   │       ├── route.ts               # Curriculum CRUD
│   │       └── [id]/
│   │           ├── route.ts           # Single curriculum
│   │           └── modules/
│   │               └── route.ts       # Module CRUD
│   ├── auth/route.ts                  # Authentication
│   └── chat/route.ts                  # AI Chat (DeepSeek)
\`\`\`

## 🗄️ Database Schema

### Core Tables Needed

\`\`\`sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    department VARCHAR(100),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Curriculums table
CREATE TABLE curriculums (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50),
    duration VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    curriculum_id INTEGER REFERENCES curriculums(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(100),
    difficulty VARCHAR(50),
    prerequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    content TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    curriculum_id INTEGER REFERENCES curriculums(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    difficulty VARCHAR(50),
    prerequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    curriculum_id INTEGER REFERENCES curriculums(id),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    description TEXT,
    pdf_url TEXT,
    cover_image_url TEXT,
    tags JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drug Classes table
CREATE TABLE drug_classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drugs table
CREATE TABLE drugs (
    id SERIAL PRIMARY KEY,
    drug_class_id INTEGER REFERENCES drug_classes(id),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_names JSONB DEFAULT '[]',
    description TEXT,
    mechanism_of_action TEXT,
    indications JSONB DEFAULT '[]',
    contraindications JSONB DEFAULT '[]',
    side_effects JSONB DEFAULT '[]',
    dosage TEXT,
    interactions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author VARCHAR(255),
    category VARCHAR(100),
    tags JSONB DEFAULT '[]',
    cover_image_url TEXT,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB DEFAULT '{}',
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partners table
CREATE TABLE partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url TEXT,
    partnership_type VARCHAR(100),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Team Members table
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    department VARCHAR(100),
    bio TEXT,
    expertise JSONB DEFAULT '[]',
    photo_url TEXT,
    email VARCHAR(255),
    linkedin_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🔧 Environment Setup

### Required Environment Variables

\`\`\`env
# Database (Neon)
DATABASE_URL=postgresql://username:password@host/database
POSTGRES_URL=postgresql://username:password@host/database
POSTGRES_PRISMA_URL=postgresql://username:password@host/database

# Authentication
JWT_SECRET=your-jwt-secret-key

# AI Integration (DeepSeek)
DEEPSEEK_API_KEY=your-deepseek-api-key

# File Upload (Optional)
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

## 🚀 Deployment Steps

### 1. Database Setup (Neon)
\`\`\`bash
# Connect to your Neon database and run the schema
psql $DATABASE_URL -f schema.sql
\`\`\`

### 2. Seed Initial Data
\`\`\`sql
-- Insert default curriculums
INSERT INTO curriculums (title, description, category, difficulty, duration) VALUES
('Medical Foundation', 'Core medical education curriculum covering anatomy, physiology, and pathology', 'Medical', 'Beginner', '2 years'),
('Nursing Essentials', 'Comprehensive nursing program covering patient care and clinical skills', 'Nursing', 'Intermediate', '18 months'),
('Pharmacy Practice', 'Pharmaceutical sciences and clinical pharmacy practice', 'Pharmacy', 'Advanced', '2.5 years');

-- Insert default drug classes
INSERT INTO drug_classes (name, description) VALUES
('Antibiotics', 'Medications used to treat bacterial infections'),
('Analgesics', 'Pain relief medications'),
('Cardiovascular', 'Medications for heart and blood vessel conditions'),
('Respiratory', 'Medications for breathing and lung conditions'),
('Endocrine', 'Hormonal medications and diabetes treatments');

-- Insert default admin user
INSERT INTO users (email, password_hash, name, role, department) VALUES
('admin@synapsemed.co.tz', '$2b$10$hashedpassword', 'Admin User', 'admin', 'Administration');
\`\`\`

### 3. Deploy to Vercel
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add JWT_SECRET
vercel env add DEEPSEEK_API_KEY
\`\`\`

## 📝 How to Edit Content Later

### 1. Admin Access
- Login as admin: `admin@synapsemed.co.tz`
- Navigate to `/admin` dashboard

### 2. Content Management Workflow

#### Adding Curriculums
1. Go to **Admin Dashboard** → **Curriculum Management**
2. Click **"Add Curriculum"**
3. Fill in title, description, category, difficulty, duration
4. Save curriculum

#### Adding Modules
1. Go to **Curriculum Management**
2. Select a curriculum
3. Click **"Add Module"** (this button works!)
4. Fill in module details, prerequisites, learning objectives
5. Add rich content with markdown formatting
6. Save module

#### Adding Topics/Books
1. Go to **Admin Dashboard** → **Content Management**
2. Choose **Topics** or **Books**
3. Click **"Add New"**
4. Select curriculum and module from dropdowns
5. Fill in content details
6. Save content

#### Managing Users
1. Go to **Admin Dashboard** → **User Management**
2. View all users, add new users, edit roles
3. Assign departments and permissions

#### Managing Partners
1. Go to **Admin Dashboard** → **Partners & Team**
2. Add institutional partners with logos
3. Manage team member profiles

### 3. Database Operations

#### Direct Database Access
\`\`\`bash
# Connect to Neon database
psql $DATABASE_URL

# View all curriculums
SELECT * FROM curriculums;

# View modules for a curriculum
SELECT * FROM modules WHERE curriculum_id = 1;

# Update content
UPDATE topics SET content = 'New content...' WHERE id = 1;
\`\`\`

#### API Endpoints for Custom Operations
\`\`\`javascript
// Get all curriculums
fetch('/api/admin/curriculums')

// Create new module
fetch('/api/admin/curriculums/1/modules', {
  method: 'POST',
  body: formData
})

// Update user
fetch('/api/admin/users/1', {
  method: 'PUT',
  body: JSON.stringify(userData)
})
\`\`\`

## 🔍 Troubleshooting

### Common Issues

1. **Add Module Button Not Working**
   - ✅ **FIXED**: The button properly links to `/admin/curriculum/[id]/modules/add`
   - The page exists and is fully functional

2. **Database Connection Issues**
   - Check `DATABASE_URL` environment variable
   - Ensure Neon database is accessible
   - Verify SSL settings

3. **Authentication Problems**
   - Check `JWT_SECRET` is set
   - Verify user roles in database
   - Clear browser cookies and retry

4. **File Upload Issues**
   - Set up UploadThing or Vercel Blob for file storage
   - Update API routes to handle file uploads

## 📊 Current Data Flow

\`\`\`
User Input → Form Validation → API Route → Database → Response → UI Update
\`\`\`

All admin functionality is working and ready for real data integration. The system supports hierarchical content organization (Curriculum → Module → Topic/Book) with proper authentication and role-based access control.
