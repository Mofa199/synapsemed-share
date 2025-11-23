const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  try {
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 12)
    const admin = await prisma.user.upsert({
      where: { email: 'admin@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'admin@synapsemed.co.tz',
        name: 'Admin User',
        password: adminPassword,
        role: 'SUPER_ADMIN',
        field: 'MEDICAL',
        level: 10,
        points: 1000,
      },
    })
    console.log('✓ Admin user created')

    // Create test student users
    const studentPassword = await bcrypt.hash('student123', 12)
    const medicalStudent = await prisma.user.upsert({
      where: { email: 'medical@student.com' },
      update: {},
      create: {
        email: 'medical@student.com',
        name: 'Medical Student',
        password: studentPassword,
        role: 'STUDENT',
        field: 'MEDICAL',
        level: 3,
        points: 250,
      },
    })

    const nursingStudent = await prisma.user.upsert({
      where: { email: 'nursing@student.com' },
      update: {},
      create: {
        email: 'nursing@student.com',
        name: 'Nursing Student',
        password: studentPassword,
        role: 'STUDENT',
        field: 'NURSING',
        level: 2,
        points: 150,
      },
    })
    console.log('✓ Student users created')

    // Create curricula
    const medicalCurriculum = await prisma.curriculum.upsert({
      where: { id: 'medical-curriculum' },
      update: {},
      create: {
        id: 'medical-curriculum',
        name: 'Medical Curriculum',
        description: 'Comprehensive medical education program',
        field: 'MEDICAL',
      },
    })

    const nursingCurriculum = await prisma.curriculum.upsert({
      where: { id: 'nursing-curriculum' },
      update: {},
      create: {
        id: 'nursing-curriculum',
        name: 'Nursing Curriculum',
        description: 'Professional nursing education program',
        field: 'NURSING',
      },
    })

    const pharmacyCurriculum = await prisma.curriculum.upsert({
      where: { id: 'pharmacy-curriculum' },
      update: {},
      create: {
        id: 'pharmacy-curriculum',
        name: 'Pharmacy Curriculum',
        description: 'Clinical pharmacy education program',
        field: 'PHARMACY',
      },
    })
    console.log('✓ Curricula created')

    // Create modules
    const anatomyModule = await prisma.module.create({
      data: {
        name: 'Anatomy & Physiology',
        description: 'Study of human body structure and function',
        curriculumId: medicalCurriculum.id,
        order: 1,
      },
    })

    const pathologyModule = await prisma.module.create({
      data: {
        name: 'Pathology',
        description: 'Study of disease processes',
        curriculumId: medicalCurriculum.id,
        order: 2,
      },
    })
    console.log('✓ Modules created')

    // Create drug classes
    const cardiovascularDrugs = await prisma.drugClass.create({
      data: {
        name: 'Cardiovascular Drugs',
        description: 'Medications affecting the cardiovascular system',
        category: 'Cardiovascular',
      },
    })

    const antibiotics = await prisma.drugClass.create({
      data: {
        name: 'Antibiotics',
        description: 'Antimicrobial medications',
        category: 'Antimicrobial',
      },
    })
    console.log('✓ Drug classes created')

    // Create sample drugs
    await prisma.drug.createMany({
      data: [
        {
          name: 'Lisinopril',
          genericName: 'Lisinopril',
          brandNames: JSON.stringify(['Prinivil', 'Zestril']),
          drugClassId: cardiovascularDrugs.id,
          description: 'ACE inhibitor used to treat high blood pressure',
          mechanism: 'Inhibits angiotensin-converting enzyme',
          indications: JSON.stringify(['Hypertension', 'Heart failure', 'Post-MI']),
          dosageAdult: '10-40mg once daily',
          administrationRoute: 'Oral',
          contraindications: JSON.stringify(['Pregnancy', 'Angioedema history']),
          warnings: JSON.stringify([]),
          sideEffectsCommon: JSON.stringify(['Dry cough', 'Dizziness', 'Fatigue']),
          sideEffectsSerious: JSON.stringify([]),
          sideEffectsRare: JSON.stringify([]),
          interactions: JSON.stringify([]),
          monitoring: JSON.stringify([]),
          pregnancy: 'D',
          isActive: true,
        },
        {
          name: 'Amoxicillin',
          genericName: 'Amoxicillin',
          brandNames: JSON.stringify(['Amoxil', 'Trimox']),
          drugClassId: antibiotics.id,
          description: 'Beta-lactam antibiotic',
          mechanism: 'Inhibits bacterial cell wall synthesis',
          indications: JSON.stringify(['Respiratory infections', 'UTI', 'Skin infections']),
          dosageAdult: '250-500mg every 8 hours',
          administrationRoute: 'Oral',
          contraindications: JSON.stringify(['Penicillin allergy']),
          warnings: JSON.stringify([]),
          sideEffectsCommon: JSON.stringify(['Nausea', 'Diarrhea', 'Rash']),
          sideEffectsSerious: JSON.stringify([]),
          sideEffectsRare: JSON.stringify([]),
          interactions: JSON.stringify([]),
          monitoring: JSON.stringify([]),
          pregnancy: 'B',
          isActive: true,
        },
      ],
    })
    console.log('✓ Sample drugs created')

    // Create sample topics
    await prisma.topic.createMany({
      data: [
        {
          title: 'Introduction to Cardiology',
          description: 'Basic concepts in cardiovascular medicine',
          content: 'Comprehensive overview of cardiovascular anatomy, physiology, and common pathologies.',
          type: 'ARTICLE',
          difficulty: 'BEGINNER',
          duration: '45 minutes',
          category: 'Cardiology',
          tags: JSON.stringify(['cardiology', 'heart', 'cardiovascular']),
          curriculumId: medicalCurriculum.id,
          moduleId: anatomyModule.id,
          isPublished: true,
        },
        {
          title: 'Heart Failure Management',
          description: 'Clinical approach to heart failure',
          content: 'Detailed discussion of heart failure pathophysiology, diagnosis, and treatment options.',
          type: 'ARTICLE',
          difficulty: 'INTERMEDIATE',
          duration: '60 minutes',
          category: 'Cardiology',
          tags: JSON.stringify(['heart failure', 'treatment', 'management']),
          curriculumId: medicalCurriculum.id,
          moduleId: pathologyModule.id,
          isPublished: true,
        },
      ],
    })
    console.log('✓ Sample topics created')

    // Create sample books
    await prisma.book.createMany({
      data: [
        {
          title: "Gray's Anatomy",
          author: 'Henry Gray',
          isbn: '978-0-443-06684-9',
          publisher: 'Churchill Livingstone',
          publicationYear: 2023,
          edition: '42nd',
          pages: 1562,
          language: 'English',
          format: 'PDF',
          description: "The world's most trusted anatomy textbook",
          category: 'Anatomy',
          tags: JSON.stringify(['anatomy', 'reference', 'textbook']),
          curriculumId: medicalCurriculum.id,
          moduleId: anatomyModule.id,
          isPublished: true,
        },
      ],
    })
    console.log('✓ Sample books created')

    // Create badges
    await prisma.badge.createMany({
      data: [
        {
          name: 'First Steps',
          description: 'Complete your first topic',
          icon: 'trophy',
          color: 'bronze',
          category: 'Achievement',
          criteria: 'Complete 1 topic',
          pointsRequired: 10,
          isActive: true,
        },
        {
          name: 'Knowledge Seeker',
          description: 'Complete 10 topics',
          icon: 'book',
          color: 'silver',
          category: 'Achievement',
          criteria: 'Complete 10 topics',
          pointsRequired: 100,
          isActive: true,
        },
        {
          name: 'Expert Scholar',
          description: 'Complete 50 topics',
          icon: 'graduation-cap',
          color: 'gold',
          category: 'Achievement',
          criteria: 'Complete 50 topics',
          pointsRequired: 500,
          isActive: true,
        },
      ],
    })
    console.log('✓ Achievement badges created')

    // Create sample question banks
    const qb1 = await prisma.questionBank.create({
      data: {
        title: 'Cardiology MCQs',
        description: 'Multiple choice questions on cardiology topics',
        category: 'Cardiology',
        difficulty: 'INTERMEDIATE',
        tags: JSON.stringify(['cardiology', 'mcq', 'exam']),
        isPublished: true,
      },
    })

    // Create sample questions
    await prisma.question.createMany({
      data: [
        {
          questionBankId: qb1.id,
          question: 'What is the most common cause of heart failure?',
          options: JSON.stringify([
            'Coronary artery disease',
            'Hypertension',
            'Valvular disease',
            'Cardiomyopathy'
          ]),
          correctAnswer: 0,
          explanation: 'Coronary artery disease is the most common cause of heart failure.',
          difficulty: 'INTERMEDIATE',
          tags: JSON.stringify(['heart failure', 'cardiology']),
        },
      ],
    })
    console.log('✓ Sample question banks created')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`👤 Admin user: ${admin.email} (password: admin123)`)
    console.log(`🎓 Medical student: ${medicalStudent.email} (password: student123)`)
    console.log(`🏥 Nursing student: ${nursingStudent.email} (password: student123)`)
    console.log(`📚 Curricula: Medical, Nursing, Pharmacy`)
    console.log(`🧬 Modules: Anatomy & Physiology, Pathology`)
    console.log(`💊 Drug classes: Cardiovascular, Antibiotics`)
    console.log(`📖 Sample content: Topics, books, drugs, badges`)

  } catch (error) {
    console.error('❌ Error during seeding:', error)
    throw error
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('\n✅ Database connection closed')
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })