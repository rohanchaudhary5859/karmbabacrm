const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class ClientSegment {
  static async create(segmentData, userId) {
    return await prisma.clientSegment.create({
      data: {
        ...segmentData,
        userId
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.clientSegment.findMany({
      where: {
        userId
      },
      include: {
        clients: true
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.clientSegment.findUnique({
      where: {
        id,
        userId
      },
      include: {
        clients: true
      }
    });
  }
  
  static async update(id, segmentData, userId) {
    return await prisma.clientSegment.update({
      where: {
        id,
        userId
      },
      data: segmentData,
      include: {
        clients: true
      }
    });
  }
  
  static async delete(id, userId) {
    return await prisma.clientSegment.delete({
      where: {
        id,
        userId
      }
    });
  }
  
  static async addClient(segmentId, clientId, userId) {
    return await prisma.clientSegment.update({
      where: {
        id: segmentId,
        userId
      },
      data: {
        clients: {
          connect: { id: clientId }
        }
      },
      include: {
        clients: true
      }
    });
  }
  
  static async removeClient(segmentId, clientId, userId) {
    return await prisma.clientSegment.update({
      where: {
        id: segmentId,
        userId
      },
      data: {
        clients: {
          disconnect: { id: clientId }
        }
      },
      include: {
        clients: true
      }
    });
  }
}

module.exports = ClientSegment;