const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Creating admin user...')

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
    console.log('✓ Admin user created:', admin.email)

    // Create test student users with correct emails
    const studentPassword = await bcrypt.hash('student123', 12)
    const medicalStudent = await prisma.user.upsert({
      where: { email: 'medical@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'medical@synapsemed.co.tz',
        name: 'Medical Student',
        password: studentPassword,
        role: 'STUDENT',
        field: 'MEDICAL',
        level: 3,
        points: 250,
      },
    })

    const nursingStudent = await prisma.user.upsert({
      where: { email: 'nursing@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'nursing@synapsemed.co.tz',
        name: 'Nursing Student',
        password: studentPassword,
        role: 'STUDENT',
        field: 'NURSING',
        level: 2,
        points: 150,
      },
    })

    const pharmacyStudent = await prisma.user.upsert({
      where: { email: 'pharmacy@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'pharmacy@synapsemed.co.tz',
        name: 'Pharmacy Student',
        password: studentPassword,
        role: 'STUDENT',
        field: 'PHARMACY',
        level: 4,
        points: 300,
      },
    })

    console.log('✓ Student users created')

    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`👤 Admin user: ${admin.email} (password: admin123)`)
    console.log(`🎓 Medical student: ${medicalStudent.email} (password: student123)`)
    console.log(`🏥 Nursing student: ${nursingStudent.email} (password: student123)`)
    console.log(`💊 Pharmacy student: ${pharmacyStudent.email} (password: student123)`)

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