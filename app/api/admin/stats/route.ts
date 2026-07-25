import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'
import { getServerSession } from '@/lib/server-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const adminRoles: string[] = [UserRole.SUPER_ADMIN, UserRole.LECTURER, UserRole.EDITOR]
    
    if (!session || !session.user.role || !adminRoles.includes(session.user.role)) {
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
      totalBadges,
      totalMnemonics,
      totalQuestionOfTheDay,
      totalExamSimulations
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
      prisma.badge.count(),
      prisma.mnemonic.count(),
      prisma.questionOfTheDay.count(),
      prisma.examSimulation.count()
    ]);

    const totalContent = totalBooks + totalArticles + totalTopics + totalVideos + totalSimulations +
                         totalQuestionBanks + totalFlashcardSets + totalMagazines + totalDrugs + 
                         totalMnemonics + totalQuestionOfTheDay + totalExamSimulations;

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
          drugs: totalDrugs,
          questionOfTheDay: totalQuestionOfTheDay,
          examSimulations: totalExamSimulations
        },
        gamification: {
          badges: totalBadges,
          levels: maxLevelObj._max?.level || 1,
          challenges: activeChallenges,
          mnemonics: totalMnemonics
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