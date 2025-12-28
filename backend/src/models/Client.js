const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Client {
  static async create(clientData, userId) {
    return await prisma.client.create({
      data: {
        ...clientData,
        userId
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.client.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.client.findFirst({
      where: {
        id,
        userId
      }
    });
  }
  
  static async update(id, clientData, userId) {
    const existing = await prisma.client.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return await prisma.client.update({ where: { id }, data: clientData });
  }
  
  static async delete(id, userId) {
    const existing = await prisma.client.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return await prisma.client.delete({ where: { id } });
  }
  
  static async search(query, userId) {
    return await prisma.client.findMany({
      where: {
        userId,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            company: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    });
  }
}

module.exports = Client;