const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const admins = await prisma.user.findMany({ where: { role: 'SUPER_ADMIN' } });
  
  if (admins.length > 0) {
    const admin = admins[0];
    const newPw = await bcrypt.hash('admin123', 12);
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: newPw }
    });
    console.log("SUCCESS. Admin email is:", admin.email);
  } else {
    console.log("No admins found.");
  }
}
main();
