const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class EmailTemplate {
  static async create(templateData, userId) {
    return await prisma.emailTemplate.create({
      data: {
        ...templateData,
        userId
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.emailTemplate.findMany({
      where: {
        userId
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.emailTemplate.findUnique({
      where: {
        id,
        userId
      }
    });
  }
  
  static async update(id, templateData, userId) {
    return await prisma.emailTemplate.update({
      where: {
        id,
        userId
      },
      data: templateData
    });
  }
  
  static async delete(id, userId) {
    return await prisma.emailTemplate.delete({
      where: {
        id,
        userId
      }
    });
  }
  
  static async findByName(name, userId) {
    return await prisma.emailTemplate.findFirst({
      where: {
        name,
        userId
      }
    });
  }
}

module.exports = EmailTemplate;