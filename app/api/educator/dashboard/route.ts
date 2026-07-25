import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Basic metrics
    const totalLearners = await prisma.user.count({
      where: { role: 'STUDENT' }
    });

    const activeCases = await prisma.simulation.count({
      where: { isPublished: true }
    });

    const totalProgress = await prisma.progress.count({
      where: { resourceType: 'SIMULATION' }
    });

    const completedProgress = await prisma.progress.count({
      where: { resourceType: 'SIMULATION', status: 'COMPLETED' }
    });

    const completionRate = totalProgress > 0 
      ? Math.round((completedProgress / totalProgress) * 100) 
      : 0;

    const totalCompletions = completedProgress;

    const scores = await prisma.progress.findMany({
      where: { resourceType: 'SIMULATION', status: 'COMPLETED' },
      select: { completionPercentage: true }
    });

    const avgScore = scores.length > 0 
      ? Math.round(scores.reduce((acc, curr) => acc + curr.completionPercentage, 0) / scores.length * 10) / 10 
      : 0;

    // Chart Data - Group by Simulation
    const simulations = await prisma.simulation.findMany({
      include: {
        progress: true
      }
    });

    const chartData = simulations.map(sim => {
      const attempts = sim.progress.length;
      const completed = sim.progress.filter(p => p.status === 'COMPLETED');
      const score = completed.length > 0 
        ? Math.round(completed.reduce((acc, curr) => acc + curr.completionPercentage, 0) / completed.length) 
        : 0;
      
      return {
        name: sim.title,
        score,
        attempts
      };
    }).filter(data => data.attempts > 0);

    // Learners
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        progress: {
          where: { resourceType: 'SIMULATION' }
        }
      },
      take: 20
    });

    const learners = students.map(student => {
      const casesAttempted = student.progress.length;
      const casesCompleted = student.progress.filter(p => p.status === 'COMPLETED').length;
      const completedProgs = student.progress.filter(p => p.status === 'COMPLETED');
      const avgFinalDxScore = completedProgs.length > 0 
        ? Math.round(completedProgs.reduce((acc, curr) => acc + curr.completionPercentage, 0) / completedProgs.length)
        : 0;
      
      let status = "Needs Work";
      if (avgFinalDxScore >= 90) status = "Excellent";
      else if (avgFinalDxScore >= 75) status = "Good";
      else if (avgFinalDxScore >= 60) status = "Satisfactory";

      return {
        name: student.name,
        cohort: student.field || 'General',
        casesCompleted,
        casesAttempted,
        avgFinalDxScore,
        status
      };
    });

    return NextResponse.json({
      metrics: {
        totalLearners,
        activeCases,
        completionRate,
        avgScore,
        totalCompletions
      },
      chartData,
      learners
    });
  } catch (error) {
    console.error('Error fetching educator dashboard data:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
