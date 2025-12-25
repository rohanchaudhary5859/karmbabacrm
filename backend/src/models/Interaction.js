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
    return await prisma.interaction.findUnique({
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
    return await prisma.interaction.update({
      where: {
        id,
        userId
      },
      data: interactionData,
      include: {
        client: true
      }
    });
  }
  
  static async delete(id, userId) {
    return await prisma.interaction.delete({
      where: {
        id,
        userId
      }
    });
  }
}

module.exports = Interaction;