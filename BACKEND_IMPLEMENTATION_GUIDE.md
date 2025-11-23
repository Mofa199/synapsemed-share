# Backend Implementation Guide for Synapse Med

This guide provides detailed instructions on how to implement a real backend for all the functions in the Synapse Med application.

## 🗄️ Database Setup

### 1. Choose Your Database

**Recommended Options:**
- **PostgreSQL** (Recommended for production)
- **MongoDB** (Good for flexible schemas)
- **MySQL** (Traditional relational database)

### 2. Database Schema

#### PostgreSQL Schema Example:

\`\`\`sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'student',
    field VARCHAR(50),
    points INTEGER DEFAULT 0,
    level VARCHAR(50) DEFAULT 'Novice',
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    field VARCHAR(50) NOT NULL,
    difficulty VARCHAR(50),
    duration INTEGER,
    instructor_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modules table
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    order_index INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    course_id UUID REFERENCES courses(id),
    module_id UUID REFERENCES modules(id),
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER,
    completed_at TIMESTAMP
);

-- Badges table
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User badges table
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    isbn VARCHAR(20),
    field VARCHAR(50),
    description TEXT,
    pdf_url TEXT,
    cover_image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Articles table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author VARCHAR(255),
    field VARCHAR(50),
    tags TEXT[],
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drugs table
CREATE TABLE drugs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    generic_name VARCHAR(255),
    brand_names TEXT[],
    drug_class VARCHAR(255),
    mechanism TEXT,
    indications TEXT[],
    contraindications TEXT[],
    side_effects TEXT[],
    dosage TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
\`\`\`

## 🔧 Backend Technology Stack

### Recommended Stack:
1. **Node.js with Express.js** or **Next.js API Routes**
2. **TypeScript** for type safety
3. **Prisma** or **TypeORM** for database ORM
4. **JWT** for authentication
5. **bcrypt** for password hashing
6. **Multer** for file uploads
7. **AWS S3** or **Cloudinary** for file storage

## 🚀 Implementation Steps

### 1. Set up the Database Connection

\`\`\`typescript
// lib/db.ts
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export default pool
\`\`\`

### 2. Implement Authentication

\`\`\`typescript
// lib/auth.ts
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from './db'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export async function verifyToken(token: string): Promise<string | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}
\`\`\`

### 3. Update API Routes

#### Authentication Routes:

\`\`\`typescript
// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const result = await pool.query(
      'SELECT id, name, email, password_hash, role, field, points, level, avatar_url FROM users WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = result.rows[0]
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = generateToken(user.id)

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        field: user.field,
        points: user.points,
        level: user.level,
        avatar: user.avatar_url
      }
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

#### Admin Routes:

\`\`\`typescript
// app/api/admin/books/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId])
    if (userResult.rows[0]?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const result = await pool.query(
      'SELECT * FROM books ORDER BY created_at DESC'
    )

    return NextResponse.json({ books: result.rows })
  } catch (error) {
    console.error('Get books error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId])
    if (userResult.rows[0]?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { title, author, isbn, field, description } = await request.json()

    const result = await pool.query(
      'INSERT INTO books (title, author, isbn, field, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, author, isbn, field, description]
    )

    return NextResponse.json({ book: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error('Create book error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

### 4. File Upload Implementation

\`\`\`typescript
// app/api/upload/avatar/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const data = await request.formData()
    const file: File | null = data.get('avatar') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save file to uploads directory
    const filename = `${userId}-${Date.now()}-${file.name}`
    const path = join(process.cwd(), 'public/uploads/avatars', filename)
    await writeFile(path, buffer)

    const avatarUrl = `/uploads/avatars/${filename}`

    // Update user avatar in database
    await pool.query(
      'UPDATE users SET avatar_url = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [avatarUrl, userId]
    )

    return NextResponse.json({ avatarUrl })
  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

### 5. Search Implementation

\`\`\`typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all'

    if (!query) {
      return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
    }

    const results = {
      books: [],
      articles: [],
      drugs: [],
      courses: []
    }

    if (type === 'all' || type === 'books') {
      const bookResults = await pool.query(
        'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR description ILIKE $1 LIMIT 10',
        [`%${query}%`]
      )
      results.books = bookResults.rows
    }

    if (type === 'all' || type === 'articles') {
      const articleResults = await pool.query(
        'SELECT * FROM articles WHERE title ILIKE $1 OR content ILIKE $1 OR author ILIKE $1 LIMIT 10',
        [`%${query}%`]
      )
      results.articles = articleResults.rows
    }

    if (type === 'all' || type === 'drugs') {
      const drugResults = await pool.query(
        'SELECT * FROM drugs WHERE name ILIKE $1 OR generic_name ILIKE $1 OR drug_class ILIKE $1 LIMIT 10',
        [`%${query}%`]
      )
      results.drugs = drugResults.rows
    }

    if (type === 'all' || type === 'courses') {
      const courseResults = await pool.query(
        'SELECT * FROM courses WHERE title ILIKE $1 OR description ILIKE $1 LIMIT 10',
        [`%${query}%`]
      )
      results.courses = courseResults.rows
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

## 🔐 Security Considerations

1. **Input Validation**: Use libraries like `joi` or `zod` for request validation
2. **Rate Limiting**: Implement rate limiting for API endpoints
3. **CORS**: Configure CORS properly for production
4. **SQL Injection**: Use parameterized queries (already shown above)
5. **File Upload Security**: Validate file types and sizes
6. **Environment Variables**: Never commit sensitive data to version control

## 📊 Analytics Implementation

\`\`\`typescript
// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = await verifyToken(token)
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    // Check if user is admin
    const userResult = await pool.query('SELECT role FROM users WHERE id = $1', [userId])
    if (userResult.rows[0]?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get analytics data
    const [
      totalUsers,
      totalCourses,
      totalBooks,
      activeUsers,
      completionRates
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['student']),
      pool.query('SELECT COUNT(*) as count FROM courses'),
      pool.query('SELECT COUNT(*) as count FROM books'),
      pool.query('SELECT COUNT(DISTINCT user_id) as count FROM user_progress WHERE completed_at > NOW() - INTERVAL \'30 days\''),
      pool.query(`
        SELECT 
          c.field,
          COUNT(DISTINCT up.user_id) as enrolled_users,
          COUNT(CASE WHEN up.completed = true THEN 1 END) as completed_modules,
          COUNT(*) as total_modules
        FROM courses c
        LEFT JOIN modules m ON c.id = m.course_id
        LEFT JOIN user_progress up ON m.id = up.module_id
        GROUP BY c.field
      `)
    ])

    return NextResponse.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      totalCourses: parseInt(totalCourses.rows[0].count),
      totalBooks: parseInt(totalBooks.rows[0].count),
      activeUsers: parseInt(activeUsers.rows[0].count),
      completionRates: completionRates.rows
    })
  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
\`\`\`

## 🚀 Deployment

### 1. Environment Variables for Production:

\`\`\`env
# Database
DATABASE_URL=postgresql://username:password@host:port/database
MONGODB_URI=mongodb://username:password@host:port/database

# Authentication
JWT_SECRET=your-super-secret-jwt-key
NEXTAUTH_SECRET=your-nextauth-secret

# AI Services
DEEPSEEK_API_KEY=your-deepseek-api-key

# File Storage
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
\`\`\`

### 2. Deployment Platforms:

- **Vercel** (Recommended for Next.js)
- **Railway** (Good for full-stack apps)
- **Heroku** (Traditional PaaS)
- **AWS** (Full control)
- **DigitalOcean** (VPS option)

### 3. Database Hosting:

- **Supabase** (PostgreSQL with real-time features)
- **PlanetScale** (MySQL with branching)
- **MongoDB Atlas** (Managed MongoDB)
- **AWS RDS** (Managed relational databases)

## 📝 Next Steps

1. **Set up your chosen database**
2. **Implement authentication system**
3. **Create API routes for all CRUD operations**
4. **Set up file upload system**
5. **Implement search functionality**
6. **Add real-time features with WebSockets**
7. **Set up monitoring and logging**
8. **Deploy to production**

This guide provides a solid foundation for implementing a production-ready backend for your Synapse Med application. Each section can be expanded based on your specific requirements and chosen technology stack.
