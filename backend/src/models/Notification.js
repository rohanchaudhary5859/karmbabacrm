const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class Notification {
  static async create(notificationData, userId) {
    return await prisma.notification.create({
      data: {
        ...notificationData,
        userId
      },
      include: {
        user: true
      }
    });
  }
  
  static async findAll(userId) {
    return await prisma.notification.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: true
      }
    });
  }
  
  static async findById(id, userId) {
    return await prisma.notification.findUnique({
      where: {
        id,
        userId
      },
      include: {
        user: true
      }
    });
  }
  
  static async markAsRead(id, userId) {
    return await prisma.notification.update({
      where: {
        id,
        userId
      },
      data: {
        isRead: true
      },
      include: {
        user: true
      }
    });
  }
  
  static async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: {
        isRead: true
      }
    });
  }
  
  static async delete(id, userId) {
    return await prisma.notification.delete({
      where: {
        id,
        userId
      }
    });
  }
  
  static async getUnreadCount(userId) {
    return await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }
}

module.exports = Notification;