import { PrismaClient, UserRole, UserField, Difficulty, ContentType } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting basic database seed...')

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

  console.log('Basic database seeding completed!')
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