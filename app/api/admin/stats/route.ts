import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { verifyTokenFromRequest } from '@/lib/db-utils'

const prisma = new PrismaClient()

// GET /api/admin/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    if (!user || !['SUPER_ADMIN', 'LECTURER', 'EDITOR'].includes(user.role as string)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    // Get total users count
    const totalUsers = await prisma.user.count()

    // Get active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activeUsers = await prisma.user.count({
      where: {
        lastLoginAt: {
          gte: thirtyDaysAgo
        },
        isActive: true
      }
    })

    // Get new users this week
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    const newUsersThisWeek = await prisma.user.count({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      }
    })

    // Get total content items
    const [articles, books, topics, questionBanks, studyGuides] = await Promise.all([
      prisma.article.count(),
      prisma.book.count(),
      prisma.topic.count(),
      prisma.questionBank.count(),
      prisma.studyGuide.count()
    ])

    const totalContent = articles + books + topics + questionBanks + studyGuides

    // Calculate completion rate
    const totalProgress = await prisma.progress.count()
    const completedProgress = await prisma.progress.count({
      where: {
        status: 'COMPLETED'
      }
    })
    
    const completionRate = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0

    // Simulate content views (in real app, this would come from analytics)
    const contentViewsThisWeek = Math.floor(Math.random() * 2000) + 1000

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalContent,
        completionRate,
        newUsersThisWeek,
        contentViewsThisWeek
      }
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin statistics'
    }, { status: 500 })
  }
}