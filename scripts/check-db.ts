import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking database connection...');
  try {
    // 1. Check connection
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');

    // 2. Check User table
    const userCount = await prisma.user.count();
    console.log(`📊 User count: ${userCount}`);

    // 3. Check Curriculum table
    const curriculumCount = await prisma.curriculum.count();
    console.log(`📊 Curriculum count: ${curriculumCount}`);

    // 4. Check for any super admin
    const superAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });
    console.log(`🔑 Super Admin exists: ${superAdmin ? '✅ Yes (' + superAdmin.email + ')' : '❌ No'}`);

    // 5. Check Flashcards
    const flashcardCount = await prisma.flashcard.count();
    console.log(`📚 Flashcard count: ${flashcardCount}`);

    // 6. Check Topics
    const topicCount = await prisma.topic.count();
    console.log(`📑 Topic count: ${topicCount}`);

    console.log('\n✨ Database health check complete.');
  } catch (error) {
    console.error('❌ Database health check failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
