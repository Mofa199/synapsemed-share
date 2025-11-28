# PostgreSQL Database Setup Guide for SynapseMed

This guide will help you set up and use the PostgreSQL database for your SynapseMed application.

## Prerequisites

- Node.js 18+
- A PostgreSQL database (Neon recommended)
- Your DATABASE_URL connection string

## 1. Database Configuration

### Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
# Database
DATABASE_URL=\"postgresql://username:password@hostname:port/database?sslmode=require\"

# Authentication
JWT_SECRET=\"your-super-secret-jwt-key-here\"

# AI Services
DEEPSEEK_API_KEY=\"your-deepseek-api-key\"
OPENAI_API_KEY=\"your-openai-api-key\"
```

### Get your DATABASE_URL

If you're using Neon PostgreSQL:
1. Go to your Neon dashboard
2. Select your project
3. Copy the connection string from the \"Connection Details\" section
4. Add it to your `.env.local` file

## 2. Database Setup Steps

### Step 1: Generate Prisma Client

```bash
npm run db:generate
```

### Step 2: Run Database Migration

This creates all the tables in your database:

```bash
npm run db:migrate
```

When prompted, give your migration a descriptive name like \"initial_schema\".

### Step 3: Seed the Database

This populates your database with initial data:

```bash
npm run db:seed
```

This will create:
- Admin user (admin@synapsemed.co.tz / admin123)
- Test student users
- Sample curricula, modules, topics
- Sample articles, books, drugs
- Question banks and study guides
- Achievement badges

## 3. Database Schema Overview

Your database includes the following main entities:

### User Management
- **Users**: Student and admin accounts with roles and progress tracking
- **UserBadges**: Achievement system linking users to earned badges

### Content Structure
- **Curricula**: Medical, Nursing, Pharmacy programs
- **Modules**: Course modules within curricula
- **Topics**: Individual learning topics
- **Articles**: Research articles and publications
- **Books**: Digital textbooks and references

### Drug Information
- **DrugClasses**: Categories of medications
- **Drugs**: Detailed drug information including dosing, side effects

### Learning Resources
- **QuestionBanks**: Collections of practice questions
- **Questions**: Individual questions with answers and explanations
- **StudyGuides**: Comprehensive study materials

### User Interactions
- **Bookmarks**: User-saved content
- **Highlights**: Text highlights with notes
- **Ratings**: User ratings and reviews
- **Progress**: Learning progress tracking
- **ChatMessages**: AI chat history

### Gamification
- **Badges**: Achievement badges
- **Progress tracking**: Completion percentages and time spent

## 4. Using the Database

### In API Routes

```typescript
import { prisma } from '@/lib/prisma'

// Example: Get all published topics
const topics = await prisma.topic.findMany({
  where: { isPublished: true },
  include: {
    curriculum: { select: { name: true } },
    module: { select: { name: true } }
  }
})
```

### Using Database Utilities

```typescript
import { getTopicsByModule, addBookmark, updateProgress } from '@/lib/db-utils'

// Get topics for a specific module
const topics = await getTopicsByModule('module-id')

// Add a bookmark
await addBookmark('user-id', 'TOPIC', 'topic-id')

// Update learning progress
await updateProgress('user-id', 'TOPIC', 'topic-id', 75, 30)
```

## 5. Available Database Scripts

```bash
# Generate Prisma client
npm run db:generate

# Create and apply migration
npm run db:migrate

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (database browser)
npm run db:studio

# Reset database (careful - deletes all data)
npm run db:reset
```

## 6. Database Administration

### Prisma Studio

Launch a web-based database browser:

```bash
npm run db:studio
```

This opens a web interface where you can:
- Browse all tables and data
- Add, edit, and delete records
- Run queries
- View relationships

### Manual SQL Queries

You can also connect directly to your database using any PostgreSQL client with your DATABASE_URL.

## 7. Testing the Database

### Default Admin Login
- Email: admin@synapsemed.co.tz
- Password: admin123

### Default Student Logins
- Medical Student: medical@student.com / student123
- Nursing Student: nursing@student.com / student123

## 8. Database Backup and Security

### Regular Backups
If using Neon, backups are handled automatically. For other providers, set up regular backups.

### Security Best Practices
- Keep your DATABASE_URL secret
- Use environment variables, never commit credentials
- Regularly rotate your JWT_SECRET
- Monitor database access logs

## 9. Troubleshooting

### Common Issues

**Migration Fails:**
- Ensure DATABASE_URL is correct
- Check database connectivity
- Verify database permissions

**Seed Fails:**
- Make sure migration completed successfully
- Check for existing data conflicts
- Verify environment variables

**Connection Issues:**
- Verify DATABASE_URL format
- Check SSL requirements
- Ensure database server is accessible

### Getting Help

- Check Prisma documentation: https://www.prisma.io/docs
- Review database logs
- Use Prisma Studio to inspect data

## 10. Development Workflow

1. **Make Schema Changes**: Edit `prisma/schema.prisma`
2. **Create Migration**: `npm run db:migrate`
3. **Update Database**: Migration applies automatically
4. **Generate Client**: `npm run db:generate` (usually automatic)
5. **Test Changes**: Use your application or Prisma Studio

Your SynapseMed application now has a fully functional PostgreSQL database with comprehensive medical education data structures!