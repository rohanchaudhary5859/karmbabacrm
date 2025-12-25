const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.getClientReport = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all clients for the user
    const clients = await prisma.client.findMany({
      where: { userId },
      include: {
        interactions: true,
        tasks: true
      }
    });
    
    // Calculate metrics
    const totalClients = clients.length;
    const clientsWithInteractions = clients.filter(c => c.interactions.length > 0).length;
    const clientsWithTasks = clients.filter(c => c.tasks.length > 0).length;
    
    // Interaction statistics
    const totalInteractions = clients.reduce((sum, client) => sum + client.interactions.length, 0);
    const interactionTypes = {};
    
    clients.forEach(client => {
      client.interactions.forEach(interaction => {
        interactionTypes[interaction.type] = (interactionTypes[interaction.type] || 0) + 1;
      });
    });
    
    // Task statistics
    const totalTasks = clients.reduce((sum, client) => sum + client.tasks.length, 0);
    const taskStatuses = {
      PENDING: 0,
      IN_PROGRESS: 0,
      COMPLETED: 0
    };
    
    clients.forEach(client => {
      client.tasks.forEach(task => {
        taskStatuses[task.status]++;
      });
    });
    
    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentClients = clients.filter(client => 
      new Date(client.createdAt) > thirtyDaysAgo
    ).length;
    
    const recentInteractions = clients.reduce((sum, client) => {
      return sum + client.interactions.filter(i => 
        new Date(i.createdAt) > thirtyDaysAgo
      ).length;
    }, 0);
    
    const recentTasks = clients.reduce((sum, client) => {
      return sum + client.tasks.filter(t => 
        new Date(t.createdAt) > thirtyDaysAgo
      ).length;
    }, 0);
    
    res.json({
      success: true,
      report: {
        overview: {
          totalClients,
          clientsWithInteractions,
          clientsWithTasks,
          totalInteractions,
          totalTasks
        },
        interactionStats: {
          byType: interactionTypes,
          total: totalInteractions
        },
        taskStats: {
          byStatus: taskStatuses,
          total: totalTasks
        },
        recentActivity: {
          newClients: recentClients,
          interactions: recentInteractions,
          tasks: recentTasks
        }
      }
    });
  } catch (err) {
    console.error('Report error:', err);
    res.status(500).json({
      success: false,
      message: 'Error generating report'
    });
  }
};

exports.getInteractionReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    // Get interactions in date range
    const interactions = await prisma.interaction.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate
        }
      },
      include: {
        client: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
    
    // Group by date
    const interactionsByDate = {};
    interactions.forEach(interaction => {
      const date = interaction.createdAt.toISOString().split('T')[0];
      if (!interactionsByDate[date]) {
        interactionsByDate[date] = {
          total: 0,
          byType: {}
        };
      }
      
      interactionsByDate[date].total++;
      interactionsByDate[date].byType[interaction.type] = 
        (interactionsByDate[date].byType[interaction.type] || 0) + 1;
    });
    
    // Format for charting
    const chartData = Object.keys(interactionsByDate).map(date => ({
      date,
      ...interactionsByDate[date]
    }));
    
    res.json({
      success: true,
      report: {
        period: `${days} days`,
        startDate,
        totalInteractions: interactions.length,
        chartData,
        topClients: getTopClients(interactions)
      }
    });
  } catch (err) {
    console.error('Interaction report error:', err);
    res.status(500).json({
      success: false,
      message: 'Error generating interaction report'
    });
  }
};

exports.getTaskReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;
    
    // Get tasks with optional status filter
    const whereClause = { userId };
    if (status) {
      whereClause.status = status;
    }
    
    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        client: true
      },
      orderBy: {
        dueDate: 'asc'
      }
    });
    
    // Group by status
    const tasksByStatus = {
      PENDING: [],
      IN_PROGRESS: [],
      COMPLETED: []
    };
    
    tasks.forEach(task => {
      tasksByStatus[task.status].push(task);
    });
    
    // Overdue tasks
    const now = new Date();
    const overdueTasks = tasks.filter(task => 
      task.status !== 'COMPLETED' && 
      task.dueDate && 
      new Date(task.dueDate) < now
    );
    
    res.json({
      success: true,
      report: {
        totalTasks: tasks.length,
        byStatus: tasksByStatus,
        overdueTasks: overdueTasks.length,
        topClients: getTopClients(tasks)
      }
    });
  } catch (err) {
    console.error('Task report error:', err);
    res.status(500).json({
      success: false,
      message: 'Error generating task report'
    });
  }
};

// Helper function to get top clients by interaction/task count
function getTopClients(items) {
  const clientCounts = {};
  
  items.forEach(item => {
    const clientId = item.clientId;
    if (clientId) {
      clientCounts[clientId] = {
        count: (clientCounts[clientId]?.count || 0) + 1,
        client: item.client
      };
    }
  });
  
  return Object.values(clientCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({
      client: item.client,
      count: item.count
    }));
}