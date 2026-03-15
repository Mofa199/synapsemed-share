// Conditionally import Prisma client to handle build time
let prisma: any;

try {
  // Attempt to import the Prisma client
  const { prisma: actualPrisma } = require('./prisma');
  prisma = actualPrisma;
} catch (error) {
  // If import fails (during build), create a mock Prisma client
  prisma = new Proxy({}, {
    get(target: any, prop: string) {
      if (prop === '$connect' || prop === '$disconnect' || prop === '$transaction' || prop === '$use') {
        return () => Promise.resolve();
      }
      // Return a function that returns a mock for any model access
      return {
        count: () => Promise.resolve(0),
        findUnique: () => Promise.resolve(null),
        findMany: () => Promise.resolve([]),
        create: (data: any) => Promise.resolve(data),
        update: (data: any) => Promise.resolve(data),
        delete: () => Promise.resolve({}),
        upsert: (data: any) => Promise.resolve(data),
      };
    },
  });
}
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { User, Topic, Article, Book, Drug, QuestionBank, StudyGuide, Partner, TeamMember } from '@prisma/client'

// Authentication utilities
export async function createUser(data: {
  email: string
  name: string
  password: string
  role?: 'SUPER_ADMIN' | 'LECTURER' | 'EDITOR' | 'STUDENT'
  field: 'MEDICAL' | 'NURSING' | 'PHARMACY'
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12)
  
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
      role: data.role || 'STUDENT',
    },
  })
}

export async function validateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  // Return user without password
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

// JWT utilities
export function generateToken(userId: string, role: string) {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      role: string
    }
  } catch {
    return null
  }
}

export async function verifyTokenFromRequest(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    let token: string | undefined

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7)
    } else {
      // Try to get token from cookies
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split('; ').map(c => {
            const [name, ...rest] = c.split('=')
            return [name, rest.join('=')]
          })
        )
        token = cookies.token
      }
    }

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      role: string
    }

    // Get user from database to ensure they still exist and are active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        field: true,
        isActive: true
      }
    })

    if (!user || !user.isActive) {
      return null
    }

    return user
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// User management utilities
export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      field: true,
      level: true,
      points: true,
      streak: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      field: true,
      level: true,
      points: true,
      streak: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      userBadges: {
        include: {
          badge: true,
        },
      },
    },
  })
}

export async function updateUser(id: string, data: any) {
  // Remove undefined values to prevent Prisma errors
  const cleanData = Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  );
  
  return prisma.user.update({
    where: { id },
    data: cleanData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      field: true,
      level: true,
      points: true,
      streak: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
    },
  })
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  })
}

// Analytics utilities
export async function getAnalyticsData() {
  // Get user statistics
  const totalUsers = await prisma.user.count()
  const activeUsers = await prisma.user.count({
    where: { isActive: true }
  })
  
  // Get content statistics
  const totalArticles = await prisma.article.count()
  const totalBooks = await prisma.book.count()
  const totalTopics = await prisma.topic.count()
  const totalDrugs = await prisma.drug.count()
  const totalQuestionBanks = await prisma.questionBank.count()
  const totalStudyGuides = await prisma.studyGuide.count()
  
  // Get completion statistics
  const completedProgress = await prisma.progress.count({
    where: { status: 'COMPLETED' }
  })
  const totalProgress = await prisma.progress.count()
  const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0
  
  // Get average rating
  const ratings = await prisma.rating.findMany({
    select: { rating: true }
  })
  const averageScore = ratings.length > 0 
    ? Math.round(ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / ratings.length * 10) / 10
    : 0
  
  // Get content views (using a placeholder since we don't track views directly)
  const totalViews = totalArticles * 50 + totalBooks * 30 + totalTopics * 40
  
  return {
    overview: {
      totalUsers,
      activeUsers,
      totalCourses: totalTopics,
      completionRate,
      averageScore,
      totalContent: totalArticles + totalBooks + totalTopics + totalDrugs + totalQuestionBanks + totalStudyGuides,
    },
    contentStats: {
      articles: totalArticles,
      books: totalBooks,
      topics: totalTopics,
      drugs: totalDrugs,
      questionBanks: totalQuestionBanks,
      studyGuides: totalStudyGuides,
    },
    // For other data, we'll use mock data for now since we don't have real tracking
    userGrowth: [
      { month: "Jan", users: Math.round(totalUsers * 0.6), active: Math.round(activeUsers * 0.5) },
      { month: "Feb", users: Math.round(totalUsers * 0.7), active: Math.round(activeUsers * 0.6) },
      { month: "Mar", users: Math.round(totalUsers * 0.8), active: Math.round(activeUsers * 0.7) },
      { month: "Apr", users: Math.round(totalUsers * 0.9), active: Math.round(activeUsers * 0.8) },
      { month: "May", users: totalUsers, active: activeUsers },
    ],
    courseProgress: [
      { course: "Anatomy", completed: 85, inProgress: 12, notStarted: 3 },
      { course: "Physiology", completed: 72, inProgress: 18, notStarted: 10 },
      { course: "Pathology", completed: 68, inProgress: 22, notStarted: 10 },
      { course: "Pharmacology", completed: 75, inProgress: 15, notStarted: 10 },
    ],
    topContent: [
      { title: "Cardiovascular System", views: 2450, rating: 4.8 },
      { title: "Respiratory Pathology", views: 2100, rating: 4.7 },
      { title: "Drug Interactions", views: 1890, rating: 4.6 },
      { title: "Cardiac Arrhythmias", views: 1750, rating: 4.9 },
      { title: "Anatomy Basics", views: 1650, rating: 4.5 },
    ],
    recentActivity: [
      { user: "John Doe", action: "Completed", content: "Anatomy Module 1", time: "2 hours ago" },
      { user: "Jane Smith", action: "Started", content: "Pharmacology Quiz", time: "3 hours ago" },
      { user: "Mike Johnson", action: "Earned", content: "Quiz Master Badge", time: "5 hours ago" },
      { user: "Sarah Wilson", action: "Completed", content: "Pathology Article", time: "6 hours ago" },
      { user: "David Brown", action: "Started", content: "Cardiology Course", time: "8 hours ago" },
    ],
    userEngagement: [
      { day: "Mon", sessions: 450, duration: 35 },
      { day: "Tue", sessions: 520, duration: 42 },
      { day: "Wed", sessions: 480, duration: 38 },
      { day: "Thu", sessions: 610, duration: 45 },
      { day: "Fri", sessions: 580, duration: 40 },
      { day: "Sat", sessions: 320, duration: 28 },
      { day: "Sun", sessions: 280, duration: 25 },
    ],
  }
}

// Content utilities
export async function getTopicsByModule(moduleId: string) {
  return prisma.topic.findMany({
    where: { 
      moduleId,
      isPublished: true,
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTopicsByCurriculum(curriculumId: string) {
  return prisma.topic.findMany({
    where: { 
      curriculumId,
      isPublished: true,
    },
    include: {
      module: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPublishedArticles(limit?: number) {
  return prisma.article.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
    include: {
      authorUser: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function getBooksByModule(moduleId: string) {
  return prisma.book.findMany({
    where: { 
      moduleId,
      isPublished: true,
    },
    orderBy: { title: 'asc' },
  })
}

export async function getDrugsByClass(drugClassId: string) {
  return prisma.drug.findMany({
    where: { 
      drugClassId,
      isActive: true,
    },
    orderBy: { name: 'asc' },
    include: {
      drugClass: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  })
}

export async function getQuestionBankWithQuestions(id: string) {
  return prisma.questionBank.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

// Question Bank management utilities
export async function getAllQuestionBanks() {
  return prisma.questionBank.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          questions: true,
        },
      },
    },
  })
}

export async function getQuestionBankById(id: string) {
  return prisma.questionBank.findUnique({
    where: { id },
    include: {
      questions: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function createQuestionBank(data: {
  title: string
  description: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  examType?: string
  category?: string
  timeLimit?: number
  passingScore?: number
  curriculumId?: string
  moduleId?: string
  tags?: string[]
  isPublished?: boolean
}) {
  return prisma.questionBank.create({
    data: {
      title: data.title,
      description: data.description,
      difficulty: data.difficulty,
      category: data.category || '',
      tags: JSON.stringify(data.tags || []),
      isPublished: data.isPublished || false,
    },
  })
}

export async function updateQuestionBank(id: string, data: {
  name?: string
  description?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  examType?: string
  category?: string
  timeLimit?: number
  passingScore?: number
  curriculumId?: string
  moduleId?: string
  tags?: string[]
  isPublished?: boolean
}) {
  const updateData: any = { ...data };
  if (data.tags) {
    updateData.tags = JSON.stringify(data.tags);
  }
  return prisma.questionBank.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteQuestionBank(id: string) {
  return prisma.questionBank.delete({
    where: { id },
  })
}

// Study Guide management utilities
export async function getAllStudyGuides() {
  return prisma.studyGuide.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getStudyGuideById(id: string) {
  return prisma.studyGuide.findUnique({
    where: { id },
  })
}

export async function createStudyGuide(data: {
  title: string
  description: string
  content?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  estimatedTime?: string
  curriculumId?: string
  moduleId?: string
  tags?: string[]
  isPublished?: boolean
}) {
  return prisma.studyGuide.create({
    data: {
      title: data.title,
      description: data.description,
      content: data.content || '',
      difficulty: data.difficulty,
      category: data.category || '',
      estimatedTime: data.estimatedTime,
      tags: JSON.stringify(data.tags || []),
      isPublished: data.isPublished || false,
    },
  })
}

export async function updateStudyGuide(id: string, data: {
  title?: string
  description?: string
  content?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  category?: string
  estimatedTime?: string
  curriculumId?: string
  moduleId?: string
  tags?: string[]
  isPublished?: boolean
}) {
  return prisma.studyGuide.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      content: data.content,
      difficulty: data.difficulty,
      category: data.category,
      estimatedTime: data.estimatedTime,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
      isPublished: data.isPublished,
    },
  })
}

export async function deleteStudyGuide(id: string) {
  return prisma.studyGuide.delete({
    where: { id },
  })
}

// Curriculum management utilities
export async function getAllCurriculums() {
  return prisma.curriculum.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          modules: true,
          topics: true,
        },
      },
    },
  })
}

export async function getCurriculumById(id: string) {
  return prisma.curriculum.findUnique({
    where: { id },
    include: {
      modules: {
        orderBy: { createdAt: 'asc' },
        include: {
          _count: {
            select: {
              topics: true,
            },
          },
        },
      },
      _count: {
        select: {
          modules: true,
          topics: true,
        },
      },
    },
  })
}

export async function createCurriculum(data: {
  name: string
  description: string
  field: 'MEDICAL' | 'NURSING' | 'PHARMACY'
  level?: string
  duration?: string
  isActive?: boolean
}) {
  return prisma.curriculum.create({
    data: {
      ...data,
      isActive: data.isActive || true,
    },
  })
}

export async function updateCurriculum(id: string, data: {
  name?: string
  description?: string
  field?: 'MEDICAL' | 'NURSING' | 'PHARMACY'
  level?: string
  duration?: string
  isActive?: boolean
}) {
  return prisma.curriculum.update({
    where: { id },
    data,
  })
}

export async function deleteCurriculum(id: string) {
  return prisma.curriculum.delete({
    where: { id },
  })
}

// Module management utilities
export async function getAllModules() {
  return prisma.module.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      curriculum: {
        select: {
          name: true,
          field: true,
        },
      },
      _count: {
        select: {
          topics: true,
        },
      },
    },
  })
}

export async function getModuleById(id: string) {
  return prisma.module.findUnique({
    where: { id },
    include: {
      curriculum: {
        select: {
          name: true,
          field: true,
        },
      },
      topics: {
        orderBy: { createdAt: 'asc' },
        where: { isPublished: true },
      },
      _count: {
        select: {
          topics: true,
        },
      },
    },
  })
}

export async function getModulesByCurriculum(curriculumId: string) {
  return prisma.module.findMany({
    where: { curriculumId },
    orderBy: { createdAt: 'asc' },
    include: {
      _count: {
        select: {
          topics: true,
        },
      },
    },
  })
}

export async function createModule(data: {
  name: string
  description: string
  curriculumId: string
  duration?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isActive?: boolean
}) {
  return prisma.module.create({
    data: {
      ...data,
      isActive: data.isActive || true,
    },
  })
}

export async function updateModule(id: string, data: {
  name?: string
  description?: string
  curriculumId?: string
  duration?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isActive?: boolean
}) {
  return prisma.module.update({
    where: { id },
    data,
  })
}

export async function deleteModule(id: string) {
  return prisma.module.delete({
    where: { id },
  })
}

// Drug Class management utilities
export async function getAllDrugClasses() {
  return prisma.drugClass.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          drugs: true,
        },
      },
    },
  })
}

export async function getDrugClassById(id: string) {
  return prisma.drugClass.findUnique({
    where: { id },
    include: {
      drugs: {
        orderBy: { name: 'asc' },
        where: { isActive: true },
      },
      _count: {
        select: {
          drugs: true,
        },
      },
    },
  })
}

export async function createDrugClass(data: {
  name: string
  description?: string
  category: string
  mechanism?: string
}) {
  return prisma.drugClass.create({
    data: {
      ...data,
    },
  })
}

export async function updateDrugClass(id: string, data: {
  name?: string
  description?: string
  category?: string
  mechanism?: string
}) {
  return prisma.drugClass.update({
    where: { id },
    data,
  })
}

export async function deleteDrugClass(id: string) {
  return prisma.drugClass.delete({
    where: { id },
  })
}

// Drug management utilities
export async function getAllDrugs() {
  return prisma.drug.findMany({
    orderBy: { name: 'asc' },
    include: {
      drugClass: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  })
}

export async function getDrugById(id: string) {
  return prisma.drug.findUnique({
    where: { id },
    include: {
      drugClass: {
        select: {
          name: true,
          category: true,
        },
      },
    },
  })
}

export async function createDrug(data: {
  name: string
  genericName?: string
  brandNames?: string[]
  drugClassId: string
  description?: string
  mechanism?: string
  indications?: string[]
  dosageAdult?: string
  dosagePediatric?: string
  dosageElderly?: string
  administrationRoute?: string
  administrationTiming?: string
  administrationInstructions?: string
  contraindications?: string[]
  warnings?: string[]
  sideEffectsCommon?: string[]
  sideEffectsSerious?: string[]
  sideEffectsRare?: string[]
  interactions?: string[]
  monitoring?: string[]
  storage?: string
  pregnancy?: string
  absorption?: string
  distribution?: string
  metabolism?: string
  elimination?: string
  halfLife?: string
  isActive?: boolean
}) {
  return prisma.drug.create({
    data: {
      name: data.name,
      genericName: data.genericName,
      brandNames: JSON.stringify(data.brandNames || []),
      drugClassId: data.drugClassId,
      description: data.description,
      mechanism: data.mechanism,
      indications: JSON.stringify(data.indications || []),
      dosageAdult: data.dosageAdult,
      dosagePediatric: data.dosagePediatric,
      dosageElderly: data.dosageElderly,
      administrationRoute: data.administrationRoute,
      administrationTiming: data.administrationTiming,
      administrationInstructions: data.administrationInstructions,
      contraindications: JSON.stringify(data.contraindications || []),
      warnings: JSON.stringify(data.warnings || []),
      sideEffectsCommon: JSON.stringify(data.sideEffectsCommon || []),
      sideEffectsSerious: JSON.stringify(data.sideEffectsSerious || []),
      sideEffectsRare: JSON.stringify(data.sideEffectsRare || []),
      interactions: JSON.stringify(data.interactions || []),
      monitoring: JSON.stringify(data.monitoring || []),
      storage: data.storage,
      pregnancy: data.pregnancy,
      absorption: data.absorption,
      distribution: data.distribution,
      metabolism: data.metabolism,
      elimination: data.elimination,
      halfLife: data.halfLife,
      isActive: data.isActive || true,
    },
  })
}

export async function updateDrug(id: string, data: any) {
  // Remove undefined values and handle JSON fields properly
  const cleanData: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      // Handle JSON fields
      if (key === 'brandNames' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'indications' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'contraindications' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'warnings' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'sideEffectsCommon' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'sideEffectsSerious' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'sideEffectsRare' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'interactions' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else if (key === 'monitoring' && Array.isArray(value)) {
        cleanData[key] = JSON.stringify(value);
      } else {
        cleanData[key] = value;
      }
    }
  }
  
  // Remove relation fields that can't be updated directly
  if (cleanData.drugClassId !== undefined) {
    delete cleanData.drugClassId;
  }
  
  return prisma.drug.update({
    where: { id },
    data: cleanData,
  })
}

export async function deleteDrug(id: string) {
  return prisma.drug.delete({
    where: { id },
  })
}

// Badge management utilities
export async function getAllBadges() {
  return prisma.badge.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBadgeById(id: string) {
  return prisma.badge.findUnique({
    where: { id },
    include: {
      userBadges: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })
}

export async function createBadge(data: {
  name: string
  description?: string
  icon?: string
  color?: string
  category?: string
  criteria?: string
  pointsRequired?: number
  isActive?: boolean
}) {
  return prisma.badge.create({
    data: {
      ...data,
      isActive: data.isActive || true,
    },
  })
}

export async function updateBadge(id: string, data: {
  name?: string
  description?: string
  icon?: string
  color?: string
  category?: string
  criteria?: string
  pointsRequired?: number
  isActive?: boolean
}) {
  return prisma.badge.update({
    where: { id },
    data,
  })
}

export async function deleteBadge(id: string) {
  return prisma.badge.delete({
    where: { id },
  })
}

// User Badge management utilities
export async function getAllUserBadges() {
  return prisma.userBadge.findMany({
    orderBy: { earnedAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
      badge: {
        select: {
          name: true,
          description: true,
          icon: true,
          color: true,
          category: true,
        },
      },
    },
  })
}

export async function getUserBadgesByUserId(userId: string) {
  return prisma.userBadge.findMany({
    where: { userId },
    orderBy: { earnedAt: 'desc' },
    include: {
      badge: true,
    },
  })
}

export async function awardBadgeToUser(userId: string, badgeId: string) {
  // Check if user already has this badge
  const existingUserBadge = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
  })

  if (existingUserBadge) {
    throw new Error('User already has this badge')
  }

  return prisma.userBadge.create({
    data: {
      userId,
      badgeId,
    },
    include: {
      badge: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function revokeBadgeFromUser(userId: string, badgeId: string) {
  return prisma.userBadge.delete({
    where: {
      userId_badgeId: {
        userId,
        badgeId,
      },
    },
  })
}

export async function deleteUserBadge(id: string) {
  return prisma.userBadge.delete({
    where: { id },
  })
}

// Progress management utilities
export async function getAllProgress() {
  return prisma.progress.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function getProgressById(id: string) {
  return prisma.progress.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function getUserProgress(userId: string) {
  return prisma.progress.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
  })
}

export async function trackProgress(
  userId: string,
  resourceType: 'TOPIC' | 'QUESTION_BANK' | 'STUDY_GUIDE',
  resourceId: string,
  completionPercentage: number,
  timeSpent: number,
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
) {
  const progressData: any = {
    userId,
    resourceType,
    completionPercentage,
    timeSpent,
    lastAccessedAt: new Date(),
    status: status || (completionPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS'),
  }

  if (completionPercentage >= 100) {
    progressData.completedAt = new Date()
  }

  // Set the appropriate resource ID field
  switch (resourceType) {
    case 'TOPIC':
      progressData.topicId = resourceId
      break
    case 'QUESTION_BANK':
      progressData.questionBankId = resourceId
      break
    case 'STUDY_GUIDE':
      progressData.studyGuideId = resourceId
      break
    default:
      throw new Error('Invalid resource type for progress tracking')
  }

  return prisma.progress.upsert({
    where: {
      userId_resourceType_topicId_questionBankId_studyGuideId_flashcardSetId_simulationId: {
        userId,
        resourceType,
        topicId: progressData.topicId || null,
        questionBankId: progressData.questionBankId || null,
        studyGuideId: progressData.studyGuideId || null,
        flashcardSetId: progressData.flashcardSetId || null,
        simulationId: progressData.simulationId || null,
      },
    },
    update: progressData,
    create: progressData,
  })
}

// Ratings management utilities
export async function getAllRatings() {
  return prisma.rating.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function getRatingById(id: string) {
  return prisma.rating.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })
}

// Bookmark management utilities
export async function getAllBookmarks() {
  return prisma.bookmark.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })
}

export async function getUserBookmarks(userId: string) {
  return prisma.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteBookmark(id: string) {
  return prisma.bookmark.delete({
    where: { id },
  })
}

// Highlight management utilities
export async function getAllHighlights() {
  return prisma.highlight.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function getUserHighlights(userId: string) {
  return prisma.highlight.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function deleteHighlight(id: string) {
  return prisma.highlight.delete({
    where: { id },
  })
}

// Chat Message management utilities
export async function getAllChatMessages() {
  return prisma.chatMessage.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          role: true,
        },
      },
    },
  })
}

export async function getChatMessagesByUser(userId: string) {
  return prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
}

export async function createChatMessage(data: {
  userId: string
  message: string
  response?: string
  role?: 'USER' | 'ASSISTANT'
}) {
  return prisma.chatMessage.create({
    data: {
      ...data,
      role: data.role || 'USER',
    },
  })
}

export async function deleteChatMessage(id: string) {
  return prisma.chatMessage.delete({
    where: { id },
  })
}

export async function deleteAllUserMessages(userId: string) {
  return prisma.chatMessage.deleteMany({
    where: { userId },
  })
}

// Question management utilities
export async function getAllQuestions() {
  return prisma.question.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      questionBank: {
        select: {
          title: true,
        },
      },
    },
  })
}

export async function getQuestionById(id: string) {
  return prisma.question.findUnique({
    where: { id },
    include: {
      questionBank: {
        select: {
          title: true,
        },
      },
    },
  })
}

export async function createQuestion(data: {
  questionBankId: string
  question: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY' | 'FILL_BLANK'
  options?: string[]
  correctAnswer: number
  explanation?: string
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  tags?: string[]
}) {
  return prisma.question.create({
    data: {
      ...data,
      options: JSON.stringify(data.options || []),
      tags: JSON.stringify(data.tags || []),
    },
  })
}

export async function updateQuestion(id: string, data: {
  questionBankId?: string
  question?: string
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'ESSAY' | 'FILL_BLANK'
  options?: string[]
  correctAnswer?: number
  explanation?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  tags?: string[]
}) {
  const updateData: any = { ...data };
  if (data.options) {
    updateData.options = JSON.stringify(data.options);
  }
  if (data.tags) {
    updateData.tags = JSON.stringify(data.tags);
  }
  delete updateData.questionBankId; // Cannot update relation field directly
  return prisma.question.update({
    where: { id },
    data: updateData,
  })
}

export async function deleteQuestion(id: string) {
  return prisma.question.delete({
    where: { id },
  })
}

// User interaction utilities
export async function addBookmark(userId: string, resourceType: string, resourceId: string) {
  const bookmarkData: any = {
    userId,
    resourceType,
  }

  // Set the appropriate resource ID field
  switch (resourceType) {
    case 'TOPIC':
      bookmarkData.topicId = resourceId
      break
    case 'ARTICLE':
      bookmarkData.articleId = resourceId
      break
    case 'BOOK':
      bookmarkData.bookId = resourceId
      break
    case 'DRUG':
      bookmarkData.drugId = resourceId
      break
    case 'QUESTION_BANK':
      bookmarkData.questionBankId = resourceId
      break
    case 'STUDY_GUIDE':
      bookmarkData.studyGuideId = resourceId
      break
    default:
      throw new Error('Invalid resource type')
  }

  return prisma.bookmark.create({
    data: bookmarkData,
  })
}

export async function removeBookmark(userId: string, resourceType: string, resourceId: string) {
  const whereClause: any = {
    userId,
    resourceType,
  }

  // Set the appropriate resource ID field
  switch (resourceType) {
    case 'TOPIC':
      whereClause.topicId = resourceId
      break
    case 'ARTICLE':
      whereClause.articleId = resourceId
      break
    case 'BOOK':
      whereClause.bookId = resourceId
      break
    case 'DRUG':
      whereClause.drugId = resourceId
      break
    case 'QUESTION_BANK':
      whereClause.questionBankId = resourceId
      break
    case 'STUDY_GUIDE':
      whereClause.studyGuideId = resourceId
      break
    default:
      throw new Error('Invalid resource type')
  }

  return prisma.bookmark.delete({
    where: whereClause,
  })
}

export async function addRating(
  userId: string, 
  resourceType: string, 
  resourceId: string, 
  rating: number, 
  review?: string
) {
  const ratingData: any = {
    userId,
    resourceType,
    rating,
    review,
  }

  // Set the appropriate resource ID field
  switch (resourceType) {
    case 'TOPIC':
      ratingData.topicId = resourceId
      break
    case 'ARTICLE':
      ratingData.articleId = resourceId
      break
    case 'BOOK':
      ratingData.bookId = resourceId
      break
    case 'DRUG':
      ratingData.drugId = resourceId
      break
    case 'QUESTION_BANK':
      ratingData.questionBankId = resourceId
      break
    case 'STUDY_GUIDE':
      ratingData.studyGuideId = resourceId
      break
    default:
      throw new Error('Invalid resource type')
  }

  return prisma.rating.upsert({
    where: {
      userId_resourceType_topicId_articleId_bookId_drugId_questionBankId_studyGuideId_magazineId_videoId_flashcardSetId_simulationId: {
        userId,
        resourceType,
        topicId: ratingData.topicId || null,
        articleId: ratingData.articleId || null,
        bookId: ratingData.bookId || null,
        drugId: ratingData.drugId || null,
        questionBankId: ratingData.questionBankId || null,
        studyGuideId: ratingData.studyGuideId || null,
        magazineId: ratingData.magazineId || null,
        videoId: ratingData.videoId || null,
        flashcardSetId: ratingData.flashcardSetId || null,
        simulationId: ratingData.simulationId || null,
      },
    },
    update: {
      rating,
      review,
    },
    create: ratingData,
  })
}

export async function updateProgress(
  userId: string,
  resourceType: string,
  resourceId: string,
  completionPercentage: number,
  timeSpent: number,
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
) {
  const progressData: any = {
    userId,
    resourceType,
    completionPercentage,
    timeSpent,
    lastAccessedAt: new Date(),
    status: status || (completionPercentage >= 100 ? 'COMPLETED' : 'IN_PROGRESS'),
  }

  if (completionPercentage >= 100) {
    progressData.completedAt = new Date()
  }

  // Set the appropriate resource ID field
  switch (resourceType) {
    case 'TOPIC':
      progressData.topicId = resourceId
      break
    case 'QUESTION_BANK':
      progressData.questionBankId = resourceId
      break
    case 'STUDY_GUIDE':
      progressData.studyGuideId = resourceId
      break
    default:
      throw new Error('Invalid resource type for progress tracking')
  }

  return prisma.progress.upsert({
    where: {
      userId_resourceType_topicId_questionBankId_studyGuideId_flashcardSetId_simulationId: {
        userId,
        resourceType,
        topicId: progressData.topicId || null,
        questionBankId: progressData.questionBankId || null,
        studyGuideId: progressData.studyGuideId || null,
        flashcardSetId: progressData.flashcardSetId || null,
        simulationId: progressData.simulationId || null,
      },
    },
    update: progressData,
    create: progressData,
  })
}

// Search utilities
export async function searchContent(query: string, filters?: {
  type?: string[]
  difficulty?: ('BEGINNER' | 'INTERMEDIATE' | 'ADVANCED')[]
  category?: string[]
  field?: string[]
}) {
  const searchTerms = query.toLowerCase().split(' ')
  
  const results = {
    topics: [] as any[],
    articles: [] as any[],
    books: [] as any[],
    drugs: [] as any[],
    questionBanks: [] as any[],
    studyGuides: [] as any[],
  }

  // Search topics
  if (!filters?.type || filters.type.includes('topic')) {
    results.topics = await prisma.topic.findMany({
      where: {
        isPublished: true,
        AND: searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { content: { contains: term, mode: 'insensitive' } },
            // For JSON fields, we need to search within the JSON string
            { tags: { contains: term, mode: 'insensitive' } },
          ],
        })),
        ...(filters?.difficulty && { difficulty: { in: filters.difficulty as any } }),
        ...(filters?.category && { category: { in: filters.category } }),
      },
      include: {
        curriculum: { select: { name: true, field: true } },
        module: { select: { name: true } },
      },
      take: 10,
    })
  }

  // Search articles
  if (!filters?.type || filters.type.includes('article')) {
    results.articles = await prisma.article.findMany({
      where: {
        isPublished: true,
        AND: searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { abstract: { contains: term, mode: 'insensitive' } },
            { content: { contains: term, mode: 'insensitive' } },
            // For JSON fields, we need to search within the JSON string
            { keywords: { contains: term, mode: 'insensitive' } },
          ],
        })),
        ...(filters?.difficulty && { difficulty: { in: filters.difficulty as any } }),
        ...(filters?.category && { category: { in: filters.category } }),
      },
      include: {
        authorUser: { select: { name: true } },
      },
      take: 10,
    })
  }

  // Search books
  if (!filters?.type || filters.type.includes('book')) {
    results.books = await prisma.book.findMany({
      where: {
        isPublished: true,
        AND: searchTerms.map(term => ({
          OR: [
            { title: { contains: term, mode: 'insensitive' } },
            { author: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            // For JSON fields, we need to search within the JSON string
            { tags: { contains: term, mode: 'insensitive' } },
          ],
        })),
        ...(filters?.category && { category: { in: filters.category } }),
      },
      include: {
        curriculum: { select: { name: true, field: true } },
        module: { select: { name: true } },
      },
      take: 10,
    })
  }

  // Search drugs
  if (!filters?.type || filters.type.includes('drug')) {
    results.drugs = await prisma.drug.findMany({
      where: {
        isActive: true,
        AND: searchTerms.map(term => ({
          OR: [
            { name: { contains: term, mode: 'insensitive' } },
            { genericName: { contains: term, mode: 'insensitive' } },
            // For JSON fields, we need to search within the JSON string
            { brandNames: { contains: term, mode: 'insensitive' } },
            { description: { contains: term, mode: 'insensitive' } },
            { indications: { contains: term, mode: 'insensitive' } },
          ],
        })),
      },
      include: {
        drugClass: { select: { name: true, category: true } },
      },
      take: 10,
    })
  }

  return results
}

// Partner management utilities
export async function createPartner(data: {
  name: string
  description: string
  type: 'UNIVERSITY' | 'HOSPITAL' | 'PHARMACEUTICAL' | 'ORGANIZATION'
  website?: string
  contactName: string
  contactEmail: string
  contactPhone?: string
  partnershipType?: string
}) {
  return prisma.partner.create({
    data,
  })
}

export async function getAllPartners() {
  return prisma.partner.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPartnerById(id: string) {
  return prisma.partner.findUnique({
    where: { id },
  })
}

export async function updatePartner(id: string, data: any) {
  return prisma.partner.update({
    where: { id },
    data,
  })
}

export async function deletePartner(id: string) {
  return prisma.partner.delete({
    where: { id },
  })
}

// Team management utilities
export async function createTeamMember(data: {
  name: string
  email: string
  phone?: string
  position: string
  department: 'MEDICAL_EDUCATION' | 'CONTENT_DEVELOPMENT' | 'NURSING' | 'PHARMACY' | 'ENGINEERING' | 'DESIGN' | 'ADMINISTRATION'
  bio?: string
  linkedin?: string
  expertise?: string
}) {
  return prisma.teamMember.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      position: data.position,
      department: data.department,
      bio: data.bio,
      linkedin: data.linkedin,
      expertise: data.expertise,
      specialties: JSON.stringify([]),
    },
  })
}

export async function getAllTeamMembers() {
  return prisma.teamMember.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTeamMemberById(id: string) {
  return prisma.teamMember.findUnique({
    where: { id },
  })
}

export async function updateTeamMember(id: string, data: any) {
  return prisma.teamMember.update({
    where: { id },
    data,
  })
}

export async function deleteTeamMember(id: string) {
  return prisma.teamMember.delete({
    where: { id },
  })
}

// Book management utilities
export async function createBook(data: {
  title: string
  author: string
  isbn?: string
  publisher?: string
  publicationYear?: number
  edition?: string
  pages?: number
  language?: string
  format?: 'PDF' | 'EPUB' | 'PHYSICAL'
  description?: string
  coverUrl?: string
  fileUrl?: string
  category?: string
  tags?: string[]
  isPublished?: boolean
  curriculumId?: string
  moduleId?: string
}) {
  return prisma.book.create({
    data: {
      ...data,
      language: data.language || 'English',
      format: data.format || 'PDF',
      tags: JSON.stringify(data.tags || []),
      isPublished: data.isPublished || false,
    },
  })
}

export async function getAllBooks() {
  return prisma.book.findMany({
    include: {
      curriculum: {
        select: {
          name: true,
          field: true,
        },
      },
      module: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getBookById(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: {
      curriculum: {
        select: {
          name: true,
          field: true,
        },
      },
      module: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function updateBook(id: string, data: any) {
  return prisma.book.update({
    where: { id },
    data,
  })
}

export async function deleteBook(id: string) {
  return prisma.book.delete({
    where: { id },
  })
}

// Article management utilities
export async function createArticle(data: {
  title: string
  author: string
  authorId?: string
  authorBio?: string
  journal?: string
  category?: string
  abstract?: string
  content: string
  keywords?: string[]
  references?: string[]
  readTime?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  isPublished?: boolean
  publishedAt?: Date
}) {
  return prisma.article.create({
    data: {
      ...data,
      keywords: JSON.stringify(data.keywords || []),
      references: JSON.stringify(data.references || []),
      difficulty: data.difficulty || 'BEGINNER',
      isPublished: data.isPublished || false,
    },
  })
}

export async function getAllArticles() {
  return prisma.article.findMany({
    include: {
      authorUser: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getArticleById(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: {
      authorUser: {
        select: {
          name: true,
        },
      },
    },
  })
}

export async function updateArticle(id: string, data: any) {
  return prisma.article.update({
    where: { id },
    data,
  })
}

export async function deleteArticle(id: string) {
  return prisma.article.delete({
    where: { id },
  })
}

// Topic management utilities
export async function createTopic(data: {
  title: string
  description: string
  content: string
  type?: 'ARTICLE' | 'VIDEO' | 'INTERACTIVE' | 'QUIZ'
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration?: string
  category?: string
  moduleId?: string
  curriculumId?: string
  tags?: string[]
  isPublished?: boolean
}) {
  return prisma.topic.create({
    data: {
      ...data,
      type: data.type || 'ARTICLE',
      tags: JSON.stringify(data.tags || []),
      isPublished: data.isPublished || false,
    },
  })
}

export async function getAllTopics() {
  return prisma.topic.findMany({
    include: {
      module: {
        select: {
          name: true,
        },
      },
      curriculum: {
        select: {
          name: true,
          field: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTopicById(id: string) {
  return prisma.topic.findUnique({
    where: { id },
    include: {
      module: {
        select: {
          name: true,
        },
      },
      curriculum: {
        select: {
          name: true,
          field: true,
        },
      },
    },
  })
}

export async function updateTopic(id: string, data: any) {
  return prisma.topic.update({
    where: { id },
    data,
  })
}

export async function deleteTopic(id: string) {
  return prisma.topic.delete({
    where: { id },
  })
}

// Statistics utilities
export async function getUserStats(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userBadges: {
        include: {
          badge: true,
        },
      },
      bookmarks: true,
      ratings: true,
      progress: {
        where: {
          status: 'COMPLETED',
        },
      },
    },
  })

  if (!user) throw new Error('User not found')

  const totalProgress = await prisma.progress.count({
    where: { userId },
  })

  const completedProgress = await prisma.progress.count({
    where: { 
      userId,
      status: 'COMPLETED',
    },
  })

  return {
    user: {
      name: user.name,
      email: user.email,
      level: user.level,
      points: user.points,
      streak: user.streak,
      field: user.field,
    },
    stats: {
      badgesEarned: user.userBadges.length,
      bookmarks: user.bookmarks.length,
      ratingsGiven: user.ratings.length,
      totalProgress,
      completedProgress,
      completionRate: totalProgress > 0 ? (completedProgress / totalProgress) * 100 : 0,
    },
    badges: user.userBadges.map((ub: any) => ub.badge),
  }
}