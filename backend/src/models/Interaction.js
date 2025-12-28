const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Interaction {
  static async create(interactionData, userId) {
    return await prisma.interaction.create({
      data: {
        ...interactionData,
        userId
      },
      include: {
        client: true
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.interaction.findMany({
      where: {
        userId
      },
      include: {
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  
  static async findByClient(clientId, userId) {
    return await prisma.interaction.findMany({
      where: {
        clientId,
        userId
      },
      include: {
        client: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.interaction.findFirst({
      where: {
        id,
        userId
      },
      include: {
        client: true
      }
    });
  }
  
  static async update(id, interactionData, userId) {
    const existing = await prisma.interaction.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return await prisma.interaction.update({ where: { id }, data: interactionData, include: { client: true } });
  }
  
  static async delete(id, userId) {
    const existing = await prisma.interaction.findFirst({ where: { id, userId } });
    if (!existing) return null;
    return await prisma.interaction.delete({ where: { id } });
  }
}

module.exports = Interaction;