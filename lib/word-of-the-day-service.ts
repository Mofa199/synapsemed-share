import { Difficulty } from '@prisma/client'
import { prisma } from '@/lib/db-utils';
// Example:
// difficulty: Difficulty.INTERMEDIATE,
// and similarly for other entries


// Word of the Day service without cron (better for serverless)
class WordOfTheDayService {
  private static instance: WordOfTheDayService

  private constructor() {}

  static getInstance(): WordOfTheDayService {
    if (!WordOfTheDayService.instance) {
      WordOfTheDayService.instance = new WordOfTheDayService()
    }
    return WordOfTheDayService.instance
  }

  // Check if we need to rotate and do it (called on API requests)
  async checkAndRotateIfNeeded() {
    try {
      // Get current time in EAT
      const now = new Date()
      const eatOffset = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
      const eatDate = new Date(now.getTime() + eatOffset)
      const today = new Date(eatDate.getFullYear(), eatDate.getMonth(), eatDate.getDate())
      const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

      // Check if there's a word for tomorrow
      const tomorrowWord = await prisma.wordOfTheDay.findFirst({
        where: {
          dateScheduled: {
            gte: tomorrow,
            lt: new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          },
          isActive: true,
        },
      })

      // If no word for tomorrow, create one
      if (!tomorrowWord) {
        console.log('No word scheduled for tomorrow, creating one...')
        return await this.rotateWordOfTheDay()
      }

      return null
    } catch (error) {
      console.error('Error checking word rotation:', error)
      return null
    }
  }

  // Manually trigger word rotation
  async rotateWordOfTheDay() {
    try {
      // Get tomorrow's date in EAT
      const now = new Date()
      const eatOffset = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
      const eatDate = new Date(now.getTime() + eatOffset)
      const tomorrow = new Date(eatDate.getFullYear(), eatDate.getMonth(), eatDate.getDate() + 1)

      // Check if there's already a word scheduled for tomorrow
      const existingWord = await prisma.wordOfTheDay.findFirst({
        where: {
          dateScheduled: tomorrow,
          isActive: true,
        },
      })

      if (existingWord) {
        console.log(`Word already scheduled for ${tomorrow.toDateString()}:`, existingWord.word)
        return existingWord
      }

      // Get a random word that hasn't been used recently (last 30 days)
      const thirtyDaysAgo = new Date(tomorrow.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const recentWords = await prisma.wordOfTheDay.findMany({
        where: {
          dateScheduled: {
            gte: thirtyDaysAgo,
          },
          isActive: true,
        },
        select: { word: true },
      })

      const recentWordList = recentWords.map((w: { word: string }) => w.word.toLowerCase())

      // Get available words not used recently
      const availableWords = await prisma.wordOfTheDay.findMany({
        where: {
          isActive: true,
          word: {
            notIn: recentWordList,
          },
        },
      })

      let selectedWord

      if (availableWords.length > 0) {
        // Select a random word from available words
        const randomIndex = Math.floor(Math.random() * availableWords.length)
        const originalWord = availableWords[randomIndex]

        // Create new entry for tomorrow
        selectedWord = await prisma.wordOfTheDay.create({
          data: {
            word: originalWord.word,
            definition: originalWord.definition,
            pronunciation: originalWord.pronunciation,
            etymology: originalWord.etymology,
            category: originalWord.category,
            difficulty: originalWord.difficulty,
            example: originalWord.example,
            dateScheduled: tomorrow,
            isActive: true,
          },
        })
      } else {
        // If no available words, create a default medical word
        const defaultWords = [
          {
            word: 'Tachycardia',
            definition: 'A rapid heart rate, typically over 100 beats per minute in adults.',
            pronunciation: '/ˌtækɪˈkɑrdiə/',
            category: 'Cardiology',
            difficulty: Difficulty.INTERMEDIATE,
            example: 'The patient presented with tachycardia following the administration of epinephrine.',
          },
          {
            word: 'Bradycardia',
            definition: 'A slow heart rate, typically under 60 beats per minute in adults.',
            pronunciation: '/ˌbreɪdɪˈkɑrdiə/',
            category: 'Cardiology',
            difficulty: Difficulty.INTERMEDIATE,
            example: 'Athletes commonly exhibit bradycardia due to their conditioned cardiovascular system.',
          },
          {
            word: 'Hypertension',
            definition: 'High blood pressure, defined as blood pressure readings consistently above 140/90 mmHg.',
            pronunciation: '/ˌhaɪpərˈtɛnʃən/',
            category: 'Cardiovascular',
            difficulty: Difficulty.BEGINNER,
            example: 'Uncontrolled hypertension can lead to serious complications including stroke and heart disease.',
          },
        ];

        const randomDefault = defaultWords[Math.floor(Math.random() * defaultWords.length)]

        selectedWord = await prisma.wordOfTheDay.create({
          data: {
            ...randomDefault,
            dateScheduled: tomorrow,
            isActive: true,
          },
        })
      }

      console.log(`New word scheduled for ${tomorrow.toDateString()}:`, selectedWord.word)
      return selectedWord

    } catch (error) {
      console.error('Error rotating word of the day:', error)
      throw error
    }
  }

  // Seed initial words for the database
  async seedInitialWords() {
    try {
      const existingCount = await prisma.wordOfTheDay.count()
      if (existingCount > 0) {
        console.log('Word of the Day database already has entries')
        return
      }

      const initialWords = [
        {
          word: 'Myocardial',
          definition: 'Relating to the muscular tissue of the heart (myocardium).',
          pronunciation: '/ˌmaɪoʊˈkɑrdiəl/',
          etymology: 'From Greek myo- (muscle) + kardia (heart)',
          category: 'Cardiology',
          difficulty: Difficulty.INTERMEDIATE,
          example: 'A myocardial infarction occurs when blood flow to part of the heart muscle is blocked.',
        },
        {
          word: 'Pneumonia',
          definition: 'An infection that inflames air sacs in one or both lungs, which may fill with fluid.',
          pronunciation: '/nuˈmoʊniə/',
          etymology: 'From Greek pneumon (lung) + -ia (condition)',
          category: 'Respiratory',
          difficulty: Difficulty.BEGINNER,
          example: 'Bacterial pneumonia is commonly treated with antibiotics.',
        },
        {
          word: 'Auscultation',
          definition: 'The action of listening to sounds from the heart, lungs, or other organs using a stethoscope.',
          pronunciation: '/ˌɔskəlˈteɪʃən/',
          etymology: 'From Latin auscultare (to listen)',
          category: 'Clinical Skills',
          difficulty: Difficulty.INTERMEDIATE,
          example: 'Auscultation revealed a heart murmur in the patient.',
        },
        {
          word: 'Prophylaxis',
          definition: 'Action taken to prevent disease, especially by specified means or against a specified disease.',
          pronunciation: '/ˌproʊfəˈlæksɪs/',
          etymology: 'From Greek prophylaxis (to guard before)',
          category: 'Preventive Medicine',
          difficulty: Difficulty.ADVANCED,
          example: 'Antibiotic prophylaxis was administered before the surgical procedure.',
        },
        {
          word: 'Anemia',
          definition: 'A condition in which you lack enough healthy red blood cells to carry adequate oxygen to tissues.',
          pronunciation: '/əˈnimiə/',
          etymology: 'From Greek an- (without) + haima (blood)',
          category: 'Hematology',
          difficulty: Difficulty.BEGINNER,
          example: 'Iron deficiency anemia is the most common type of anemia worldwide.',
        },
      ]

      const today = new Date()
      const eatOffset = 3 * 60 * 60 * 1000 // 3 hours in milliseconds
      const eatDate = new Date(today.getTime() + eatOffset)

      // Create words starting from today
      for (let i = 0; i < initialWords.length; i++) {
        const scheduleDate = new Date(eatDate.getFullYear(), eatDate.getMonth(), eatDate.getDate() + i)
        
        await prisma.wordOfTheDay.create({
          data: {
            ...initialWords[i],
            dateScheduled: scheduleDate,
            isActive: true,
          },
        })
      }

      console.log(`Seeded ${initialWords.length} initial words of the day`)

    } catch (error) {
      console.error('Error seeding initial words:', error)
      throw error
    }
  }
}

export const wordOfTheDayService = WordOfTheDayService.getInstance()

// Export functions for manual use
export const checkAndRotateIfNeeded = () => wordOfTheDayService.checkAndRotateIfNeeded()
export const rotateWordOfTheDay = () => wordOfTheDayService.rotateWordOfTheDay()
export const seedInitialWords = () => wordOfTheDayService.seedInitialWords()