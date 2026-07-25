import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@synapsemed.com';
  const password = 'password123';
  const name = 'Admin User';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'SUPER_ADMIN',
      isVerified: true,
      password: hashedPassword,
    },
    create: {
      email,
      name,
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      field: 'MEDICAL',
      isVerified: true,
    },
  });

  console.log(`\n\n✅ Admin account created successfully!`);
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${password}\n\n`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
