const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.globalSearch = async (req, res) => {
  try {
    const { query, type } = req.query;
    const userId = req.user.id;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const searchResults = {};
    
    // Search clients
    if (!type || type === 'clients') {
      searchResults.clients = await prisma.client.findMany({
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
            },
            {
              phone: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        }
      });
    }
    
    // Search interactions
    if (!type || type === 'interactions') {
      searchResults.interactions = await prisma.interaction.findMany({
        where: {
          userId,
          notes: {
            contains: query,
            mode: 'insensitive'
          }
        },
        include: {
          client: true
        }
      });
    }
    
    // Search tasks
    if (!type || type === 'tasks') {
      searchResults.tasks = await prisma.task.findMany({
        where: {
          userId,
          OR: [
            {
              title: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              description: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        include: {
          client: true
        }
      });
    }
    
    res.json({
      success: true,
      results: searchResults
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({
      success: false,
      message: 'Error performing search'
    });
  }
};

exports.advancedClientSearch = async (req, res) => {
  try {
    const {
      name,
      company,
      email,
      phone,
      minInteractions,
      maxInteractions,
      interactionType,
      hasTasks,
      taskStatus
    } = req.query;
    
    const userId = req.user.id;
    
    // Build where clause
    const whereClause = { userId };
    
    if (name) {
      whereClause.name = {
        contains: name,
        mode: 'insensitive'
      };
    }
    
    if (company) {
      whereClause.company = {
        contains: company,
        mode: 'insensitive'
      };
    }
    
    if (email) {
      whereClause.email = {
        contains: email,
        mode: 'insensitive'
      };
    }
    
    if (phone) {
      whereClause.phone = {
        contains: phone,
        mode: 'insensitive'
      };
    }
    
    // Include interactions and tasks for filtering
    const includeClause = {
      interactions: true,
      tasks: true
    };
    
    let clients = await prisma.client.findMany({
      where: whereClause,
      include: includeClause
    });
    
    // Apply interaction filters
    if (minInteractions || maxInteractions || interactionType) {
      clients = clients.filter(client => {
        let interactionCount = client.interactions.length;
        
        if (interactionType) {
          interactionCount = client.interactions.filter(i => i.type === interactionType).length;
        }
        
        if (minInteractions && interactionCount < parseInt(minInteractions)) {
          return false;
        }
        
        if (maxInteractions && interactionCount > parseInt(maxInteractions)) {
          return false;
        }
        
        return true;
      });
    }
    
    // Apply task filters
    if (hasTasks === 'true') {
      clients = clients.filter(client => client.tasks.length > 0);
    } else if (hasTasks === 'false') {
      clients = clients.filter(client => client.tasks.length === 0);
    }
    
    if (taskStatus) {
      clients = clients.filter(client => 
        client.tasks.some(task => task.status === taskStatus)
      );
    }
    
    res.json({
      success: true,
      clients
    });
  } catch (err) {
    console.error('Advanced search error:', err);
    res.status(500).json({
      success: false,
      message: 'Error performing advanced search'
    });
  }
};