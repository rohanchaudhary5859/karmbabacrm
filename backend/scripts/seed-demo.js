const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding demo data...');
  
  // Ensure admin user exists
  const adminEmail = 'admin@example.com';
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });
  
  if (!admin) {
    const hashed = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashed,
        role: 'ADMIN'
      }
    });
    console.log('Created admin user');
  } else {
    console.log('Admin user exists');
  }
  
  // Create sample clients
  const clientsData = [
    {
      name: 'Pizza Palace',
      email: 'owner@pizzapalace.com',
      phone: '111-222-3333',
      company: 'Pizza Palace',
      address: '123 Main St'
    },
    {
      name: 'Sushi Central',
      email: 'hello@sushicentral.com',
      phone: '222-333-4444',
      company: 'Sushi Central',
      address: '45 Ocean Ave'
    },
    {
      name: 'Burger Barn',
      email: 'contact@burgerbarn.com',
      phone: '333-444-5555',
      company: 'Burger Barn',
      address: '78 Food Blvd'
    }
  ];
  
  const createdClients = [];
  for (const c of clientsData) {
    const client = await prisma.client.upsert({
      where: { email: c.email },
      update: {},
      create: {
        ...c,
        userId: admin.id
      }
    });
    createdClients.push(client);
  }
  
  // Create interactions
  const interactionsData = [
    {
      type: 'CALL',
      notes: 'Initial discovery call',
      clientId: createdClients[0].id
    },
    {
      type: 'EMAIL',
      notes: 'Sent pricing and proposal',
      clientId: createdClients[1].id
    },
    {
      type: 'MEETING',
      notes: 'On-site demo scheduled',
      clientId: createdClients[2].id
    }
  ];
  
  for (const it of interactionsData) {
    await prisma.interaction.create({
      data: {
        ...it,
        userId: admin.id
      }
    });
  }
  
  // Create tasks
  const tasksData = [
    {
      title: 'Follow up with Pizza Palace',
      description: 'Send contract',
      clientId: createdClients[0].id,
      dueDate: new Date(Date.now() + 3*24*3600*1000),
      status: 'PENDING'
    },
    {
      title: 'Prepare demo for Sushi Central',
      description: 'Demo slides',
      clientId: createdClients[1].id,
      dueDate: new Date(Date.now() + 5*24*3600*1000),
      status: 'IN_PROGRESS'
    },
    {
      title: 'Invoice Burger Barn',
      description: 'Send invoice for services',
      clientId: createdClients[2].id,
      dueDate: new Date(Date.now() + 1*24*3600*1000),
      status: 'PENDING'
    }
  ];
  
  for (const t of tasksData) {
    await prisma.task.create({
      data: {
        ...t,
        userId: admin.id
      }
    });
  }
  
  console.log('Demo data seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });