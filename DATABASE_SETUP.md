# Database Setup Guide

## Overview
This guide will help you connect your Synapse Med application to a real database using Neon (PostgreSQL).

## Prerequisites
- Neon integration already configured in your v0 project
- Environment variables available (DATABASE_URL, etc.)

## Database Schema

### 1. Create Tables

Run these SQL scripts in your Neon database:

\`\`\`sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'student',
  field VARCHAR(50) NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Topics table
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(50),
  duration VARCHAR(50),
  prerequisites TEXT[],
  learning_objectives TEXT[],
  tags TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  author_bio TEXT,
  journal VARCHAR(255),
  category VARCHAR(100),
  abstract TEXT,
  content TEXT NOT NULL,
  keywords TEXT[],
  references TEXT[],
  read_time VARCHAR(50),
  difficulty VARCHAR(50),
  views INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  isbn VARCHAR(20),
  publisher VARCHAR(255),
  publication_year INTEGER,
  category VARCHAR(100),
  description TEXT,
  cover_url TEXT,
  pdf_url TEXT,
  pages INTEGER,
  language VARCHAR(50) DEFAULT 'English',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drugs table
CREATE TABLE drugs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  generic_name VARCHAR(255),
  brand_names TEXT[],
  class VARCHAR(255),
  category VARCHAR(100),
  description TEXT,
  mechanism TEXT,
  indications TEXT[],
  dosage_adult TEXT,
  dosage_pediatric TEXT,
  dosage_elderly TEXT,
  administration_route VARCHAR(100),
  administration_timing VARCHAR(255),
  administration_instructions TEXT,
  contraindications TEXT[],
  warnings TEXT[],
  side_effects_common TEXT[],
  side_effects_serious TEXT[],
  side_effects_rare TEXT[],
  interactions TEXT[],
  monitoring TEXT[],
  storage VARCHAR(255),
  pregnancy VARCHAR(10),
  absorption TEXT,
  distribution TEXT,
  metabolism TEXT,
  elimination TEXT,
  half_life VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Badges table
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  color VARCHAR(50),
  category VARCHAR(100),
  criteria TEXT,
  points_required INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges (many-to-many)
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  badge_id INTEGER REFERENCES badges(id),
  earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, badge_id)
);
\`\`\`

### 2. Update API Routes

Replace the mock data in your API routes with real database queries:

\`\`\`typescript
// Example: app/api/admin/articles/route.ts
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const result = await sql`
      INSERT INTO articles (
        title, author, author_bio, journal, category, 
        abstract, content, keywords, references, 
        read_time, difficulty
      ) VALUES (
        ${data.title}, ${data.author}, ${data.authorBio}, 
        ${data.journal}, ${data.category}, ${data.abstract}, 
        ${data.content}, ${data.keywords.split(',')}, 
        ${data.references.split('\n')}, ${data.readTime}, 
        ${data.difficulty}
      ) RETURNING *
    `
    
    return NextResponse.json({ success: true, article: result[0] })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to add article' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const articles = await sql`SELECT * FROM articles ORDER BY created_at DESC`
    return NextResponse.json({ articles })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to get articles' }, { status: 500 })
  }
}
\`\`\`

### 3. Authentication with Database

Update the auth system to use real database authentication:

\`\`\`typescript
// components/auth-provider.tsx - Update login function
const login = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    
    if (response.ok) {
      const { user } = await response.json()
      setUser(user)
      localStorage.setItem('synapse-user', JSON.stringify(user))
      return true
    }
    return false
  } catch (error) {
    console.error('Login error:', error)
    return false
  }
}
\`\`\`

### 4. Environment Variables

Make sure these are set in your Vercel project:

\`\`\`env
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret_key
BCRYPT_ROUNDS=12
\`\`\`

### 5. Next Steps

1. **Run the SQL scripts** in your Neon database console
2. **Update all API routes** to use real database queries instead of mock data
3. **Implement proper authentication** with password hashing
4. **Add data validation** and error handling
5. **Test all CRUD operations** through the admin interface

### 6. Testing

After setup, you can:
- Add content through the admin interface
- View real data in the magazine and topic pages
- Track user progress and achievements
- Manage all content through the database

The application will now use real data instead of mock data, and all admin features will be fully functional with database persistence.
