const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Document {
  static async create(documentData, userId) {
    return await prisma.document.create({
      data: {
        ...documentData,
        userId
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.document.findMany({
      where: {
        userId
      },
      include: {
        client: true
      }
    });
  }
  
  static async findByClient(clientId, userId) {
    return await prisma.document.findMany({
      where: {
        clientId,
        userId
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.document.findUnique({
      where: {
        id,
        userId
      }
    });
  }
  
  static async update(id, documentData, userId) {
    return await prisma.document.update({
      where: {
        id,
        userId
      },
      data: documentData
    });
  }
  
  static async delete(id, userId) {
    return await prisma.document.delete({
      where: {
        id,
        userId
      }
    });
  }
}

module.exports = Document;