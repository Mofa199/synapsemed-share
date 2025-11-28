import { PrismaClient, UserRole, UserField, Difficulty, ContentType, BookFormat } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@synapsemed.co.tz' },
    update: {},
    create: {
      email: 'admin@synapsemed.co.tz',
      name: 'Admin User',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      field: UserField.MEDICAL,
      level: 10,
      points: 1000,
    },
  })

  // Create test student users
  const studentPassword = await bcrypt.hash('student123', 12)
  const medicalStudent = await prisma.user.upsert({
    where: { email: 'medical@student.com' },
    update: {},
    create: {
      email: 'medical@student.com',
      name: 'Medical Student',
      password: studentPassword,
      role: UserRole.STUDENT,
      field: UserField.MEDICAL,
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
      role: UserRole.STUDENT,
      field: UserField.NURSING,
      level: 2,
      points: 150,
    },
  })

  // Create curricula
  const medicalCurriculum = await prisma.curriculum.upsert({
    where: { id: 'medical-curriculum' },
    update: {},
    create: {
      id: 'medical-curriculum',
      name: 'Medical Curriculum',
      description: 'Comprehensive medical education program',
      field: UserField.MEDICAL,
    },
  })

  const nursingCurriculum = await prisma.curriculum.upsert({
    where: { id: 'nursing-curriculum' },
    update: {},
    create: {
      id: 'nursing-curriculum',
      name: 'Nursing Curriculum',
      description: 'Professional nursing education program',
      field: UserField.NURSING,
    },
  })

  const pharmacyCurriculum = await prisma.curriculum.upsert({
    where: { id: 'pharmacy-curriculum' },
    update: {},
    create: {
      id: 'pharmacy-curriculum',
      name: 'Pharmacy Curriculum',
      description: 'Clinical pharmacy education program',
      field: UserField.PHARMACY,
    },
  })

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

  const pharmacologyModule = await prisma.module.create({
    data: {
      name: 'Pharmacology',
      description: 'Study of drugs and their effects',
      curriculumId: pharmacyCurriculum.id,
      order: 1,
    },
  })

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
      },
    ],
  })

  // Create sample topics
  await prisma.topic.createMany({
    data: [
      {
        title: 'Introduction to Cardiology',
        description: 'Basic concepts in cardiovascular medicine',
        content: 'Comprehensive overview of cardiovascular anatomy, physiology, and common pathologies.',
        type: ContentType.ARTICLE,
        difficulty: Difficulty.BEGINNER,
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
        type: ContentType.ARTICLE,
        difficulty: Difficulty.INTERMEDIATE,
        duration: '60 minutes',
        category: 'Cardiology',
        tags: JSON.stringify(['heart failure', 'treatment', 'management']),
        curriculumId: medicalCurriculum.id,
        moduleId: pathologyModule.id,
        isPublished: true,
      },
    ],
  })

  // Create sample articles
  await prisma.article.createMany({
    data: [
      {
        title: 'Recent Advances in Cardiology',
        author: 'Dr. Sarah Johnson',
        journal: 'Journal of Medical Innovation',
        abstract: 'This article reviews the latest developments in cardiology treatment and research.',
        content: 'Full article content would go here...',
        keywords: JSON.stringify(['cardiology', 'innovation', 'treatment']),
        references: JSON.stringify(['Smith J. et al. Cardiology Journal 2024']),
        readTime: '15 min',
        difficulty: Difficulty.INTERMEDIATE,
        category: 'Cardiology',
        isPublished: true,
      },
    ],
  })

  // Create sample books
  await prisma.book.createMany({
    data: [
      {
        title: 'Gray\'s Anatomy for Students',
        author: 'Richard Drake',
        isbn: '978-070207702-2',
        publisher: 'Elsevier',
        publicationYear: 2022,
        edition: '4th',
        pages: 1194,
        language: 'English',
        format: BookFormat.PDF,
        description: 'The leading anatomy textbook for medical students.',
        category: 'Anatomy',
        tags: JSON.stringify(['anatomy', 'reference', 'textbook']),
        isPublished: true,
      },
    ],
  })

  // Create sample question banks
  const qb1 = await prisma.questionBank.create({
    data: {
      title: 'Cardiology MCQs',
      description: 'Multiple choice questions on cardiology topics',
      category: 'Cardiology',
      difficulty: Difficulty.INTERMEDIATE,
      totalQuestions: 50,
      estimatedTime: '60 min',
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
        difficulty: Difficulty.INTERMEDIATE,
        tags: JSON.stringify(['heart failure', 'cardiology']),
      },
    ],
  })

  // Create sample study guides
  await prisma.studyGuide.createMany({
    data: [
      {
        title: 'Cardiology Study Guide',
        description: 'Comprehensive study guide for cardiology topics',
        content: 'Detailed study guide content...',
        category: 'Cardiology',
        difficulty: Difficulty.INTERMEDIATE,
        estimatedTime: '4 hours',
        tags: JSON.stringify(['cardiology', 'study guide', 'review']),
        isPublished: true,
      },
    ],
  })

  // Create sample badges
  await prisma.badge.createMany({
    data: [
      {
        name: 'First Steps',
        description: 'Completed your first topic',
        icon: 'footsteps',
        color: 'blue',
        category: 'Milestone',
        criteria: 'Complete any topic',
        pointsRequired: 10,
        isActive: true,
      },
      {
        name: 'Dedicated Learner',
        description: 'Completed 10 topics',
        icon: 'book-open',
        color: 'green',
        category: 'Milestone',
        criteria: 'Complete 10 topics',
        pointsRequired: 100,
        isActive: true,
      },
    ],
  })

  // Create sample partners
  await prisma.partner.createMany({
    data: [
      {
        name: 'Johns Hopkins University',
        description: 'Leading medical institution',
        type: 'UNIVERSITY',
        status: 'ACTIVE',
        contactName: 'Dr. Michael Chen',
        contactEmail: 'mchen@jhu.edu',
        contactPhone: '+1-555-0123',
        studentsCount: 1200,
        partnershipType: 'Academic',
      },
    ],
  })

  // Create sample team members
  await prisma.teamMember.createMany({
    data: [
      {
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@synapsemed.co.tz',
        phone: '+1-555-0198',
        position: 'Chief Medical Officer',
        department: 'MEDICAL_EDUCATION',
        status: 'ACTIVE',
        bio: 'Board-certified cardiologist with 15 years of experience in medical education.',
        expertise: 'Cardiology, Medical Education',
        specialties: JSON.stringify(['Cardiology', 'Medical Education']),
        rating: 4.8,
      },
      {
        name: 'Prof. Robert Wilson',
        email: 'robert.wilson@synapsemed.co.tz',
        phone: '+1-555-0176',
        position: 'Director of Curriculum',
        department: 'CONTENT_DEVELOPMENT',
        status: 'ACTIVE',
        bio: 'Expert in curriculum design and educational technology.',
        expertise: 'Curriculum Development, Assessment',
        specialties: JSON.stringify(['Curriculum Design', 'Assessment']),
        rating: 4.9,
      },
      {
        name: 'Dr. Emily Rodriguez',
        email: 'emily.rodriguez@synapsemed.co.tz',
        phone: '+1-555-0154',
        position: 'Head of Nursing Education',
        department: 'NURSING',
        status: 'ACTIVE',
        bio: 'Experienced nurse educator with focus on clinical practice.',
        expertise: 'Nursing Education, Clinical Practice',
        specialties: JSON.stringify(['Nursing Education', 'Clinical Practice']),
        rating: 4.7,
      },
    ],
  })

  console.log('Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })