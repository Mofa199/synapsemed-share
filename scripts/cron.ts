import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { sendWhatsAppQuiz } from '../lib/whatsapp';

const prisma = new PrismaClient();

console.log('Starting SynapseMed Cron Service...');

// Schedule daily quiz sending at 9:00 AM every day
cron.schedule('0 9 * * *', async () => {
  console.log('Running daily WhatsApp Quiz job...');
  try {
    // 1. Fetch today's quiz
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const quiz = await prisma.questionOfTheDay.findFirst({
      where: {
        date: {
          gte: startOfDay
        }
      },
      include: {
        question: true
      }
    });

    if (!quiz || !quiz.question) {
      console.log('No quiz scheduled for today.');
      return;
    }

    // 2. Fetch all subscribed users (assuming emailSubscription indicates WhatsApp opt-in for now)
    const subscribers = await prisma.emailSubscription.findMany({
      where: { isActive: true }
    });

    console.log(`Sending quiz to ${subscribers.length} subscribers...`);

    // 3. Send WhatsApp message to each subscriber
    for (const sub of subscribers) {
      // In a real scenario, the phone number would be on the user model or subscription model.
      // Here we assume sub has a phone column or we mock it.
      const phone = (sub as any).phone || "0000000000"; 
      
      const options = [
        quiz.question.optionA,
        quiz.question.optionB,
        quiz.question.optionC,
        quiz.question.optionD,
        quiz.question.optionE
      ].filter(Boolean) as string[];

      await sendWhatsAppQuiz(
        phone,
        quiz.question.text,
        options,
        quiz.id
      );
    }

    console.log('Daily quiz job completed successfully.');
  } catch (error) {
    console.error('Error running daily quiz job:', error);
  }
});
