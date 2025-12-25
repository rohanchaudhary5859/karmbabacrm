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
    return await prisma.client.findUnique({
      where: {
        id,
        userId
      }
    });
  }
  
  static async update(id, clientData, userId) {
    return await prisma.client.update({
      where: {
        id,
        userId
      },
      data: clientData
    });
  }
  
  static async delete(id, userId) {
    return await prisma.client.delete({
      where: {
        id,
        userId
      }
    });
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