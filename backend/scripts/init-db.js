import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing database...');
  
  // Create a default admin user for testing
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$8K1p/a0dURXAm7QiTRqNa.E3YPWs8UkrpC4hC0wIQhqVJ5m28itgG', // password: admin123
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