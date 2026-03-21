import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTokenFromRequest } from '@/lib/db-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await verifyTokenFromRequest(request)
    const adminRoles = ['SUPER_ADMIN', 'LECTURER', 'EDITOR']
    
    if (!user || !adminRoles.includes(user.role)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Run aggregate queries concurrently where possible
    const [
      totalUsers,
      activeUsers,
      newUsersThisWeek,
      totalBooks,
      totalArticles,
      totalTopics,
      totalVideos,
      totalSimulations,
      totalQuestionBanks,
      totalFlashcardSets,
      totalMagazines,
      totalDrugs,
      progressRows,
      activeChallenges,
      maxLevelObj,
      publishedSimulations,
      totalBadges
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { createdAt: { gte: oneWeekAgo } } }),
      prisma.book.count(),
      prisma.article.count(),
      prisma.topic.count(),
      prisma.video.count(),
      prisma.simulation.count(),
      prisma.questionBank.count(),
      prisma.flashcardSet.count(),
      prisma.magazine.count(),
      prisma.drug.count(),
      prisma.progress.findMany({ select: { completionPercentage: true } }),
      prisma.challenge.count({ where: { isActive: true } }),
      prisma.user.aggregate({ _max: { level: true } }),
      prisma.simulation.count({ where: { isPublished: true } }),
      prisma.badge ? prisma.badge.count() : Promise.resolve(0)
    ]);

    const totalContent = totalBooks + totalArticles + totalTopics + totalVideos + totalSimulations +
                         totalQuestionBanks + totalFlashcardSets + totalMagazines + totalDrugs;

    const completedProgressRows = progressRows.filter(r => r.completionPercentage === 100);
    const completionRate = progressRows.length > 0 
      ? Math.round((completedProgressRows.length / progressRows.length) * 100) 
      : 0;
    
    // Calculate global average completion for simulations/courses
    let totalPct = 0;
    progressRows.forEach(r => totalPct += r.completionPercentage);
    const avgCompletion = progressRows.length > 0 ? (totalPct / progressRows.length).toFixed(1) : "0.0";

    // Approximate views since we don't have a view log yet
    const contentViewsThisWeek = totalContent * 5; // Placeholder for views

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        totalContent,
        completionRate,
        newUsersThisWeek,
        contentViewsThisWeek,
        contentBreakdown: {
          books: totalBooks,
          articles: totalArticles,
          topics: totalTopics,
          videos: totalVideos,
          simulations: totalSimulations,
          questionBanks: totalQuestionBanks,
          flashcardSets: totalFlashcardSets,
          magazines: totalMagazines,
          drugs: totalDrugs
        },
        gamification: {
          badges: totalBadges,
          levels: maxLevelObj._max.level || 1,
          challenges: activeChallenges
        },
        simulations: {
          activeCases: publishedSimulations,
          avgCompletion: parseFloat(avgCompletion)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}