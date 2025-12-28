const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing database...');

  // Create a default admin user for testing (hashed password)
  const bcrypt = require('bcryptjs');
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: hashed,
      role: 'ADMIN'
    }
  });

  console.log('Database initialized successfully');
  console.log('Default admin user created:');
  console.log('Email: admin@example.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });