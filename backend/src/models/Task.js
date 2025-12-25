const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Task {
  static async create(taskData, userId) {
    return await prisma.task.create({
      data: {
        ...taskData,
        userId
      },
      include: {
        client: true
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.task.findMany({
      where: {
        userId
      },
      include: {
        client: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  }
  
  static async findByStatus(status, userId) {
    return await prisma.task.findMany({
      where: {
        status,
        userId
      },
      include: {
        client: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.task.findUnique({
      where: {
        id,
        userId
      },
      include: {
        client: true
      }
    });
  }
  
  static async update(id, taskData, userId) {
    return await prisma.task.update({
      where: {
        id,
        userId
      },
      data: taskData,
      include: {
        client: true
      }
    });
  }
  
  static async delete(id, userId) {
    return await prisma.task.delete({
      where: {
        id,
        userId
      }
    });
  }
}

module.exports = Task;