const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

 export async function createAdminUser() {
  console.log('Creating admin user...')

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create super admin user
    const admin = await prisma.user.upsert({
      where: { email: 'superadmin@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'superadmin@synapsemed.co.tz',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        field: 'MEDICAL',
        level: 10,
        points: 10000,
        isActive: true,
      },
    })

    // Create lecturer user
    const lecturer = await prisma.user.upsert({
      where: { email: 'lecturer@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'lecturer@synapsemed.co.tz',
        name: 'Dr. Sarah Johnson',
        password: hashedPassword,
        role: 'LECTURER',
        field: 'MEDICAL',
        level: 8,
        points: 7500,
        isActive: true,
      },
    })

    // Create editor user
    const editor = await prisma.user.upsert({
      where: { email: 'editor@synapsemed.co.tz' },
      update: {},
      create: {
        email: 'editor@synapsemed.co.tz',
        name: 'Alex Editor',
        password: hashedPassword,
        role: 'EDITOR',
        field: 'MEDICAL',
        level: 7,
        points: 6000,
        isActive: true,
      },
    })

    console.log('✅ Admin users created successfully!')
    console.log('📊 Summary:')
    console.log(`👤 Super Admin: ${admin.email} (password: admin123)`)
    console.log(`🎓 Lecturer: ${lecturer.email} (password: admin123)`)
    console.log(`✏️ Editor: ${editor.email} (password: admin123)`)

  } catch (error) {
    console.error('❌ Error creating admin users:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
 }