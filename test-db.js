const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection by counting question banks
    const questionBankCount = await prisma.questionBank.count();
    console.log(`Found ${questionBankCount} question banks`);
    
    // Get all question banks
    const questionBanks = await prisma.questionBank.findMany({
      take: 5,
      include: {
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
    console.log('Question banks:', questionBanks);
    
    // Count other content types
    const topicCount = await prisma.topic.count();
    console.log(`Found ${topicCount} topics`);
    
    const bookCount = await prisma.book.count();
    console.log(`Found ${bookCount} books`);
    
    const videoCount = await prisma.video.count();
    console.log(`Found ${videoCount} videos`);
    
    const drugCount = await prisma.drug.count();
    console.log(`Found ${drugCount} drugs`);
    
    const studyGuideCount = await prisma.studyGuide.count();
    console.log(`Found ${studyGuideCount} study guides`);
    
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();