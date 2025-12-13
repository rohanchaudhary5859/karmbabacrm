const prisma = require('../../prisma/client');

module.exports.getSupplierMetrics = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const metrics = await prisma.supplierMetrics.findUnique({ where: { supplierId } });
    return res.json({ metrics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
};

module.exports.incrementMetric = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { field, amount } = req.body;
    const allowed = ['dailyLeads','monthlyLeads','responseTimeAvg','productViews','positiveFeedback','negativeFeedback'];
    if (!allowed.includes(field)) return res.status(400).json({ error: 'Invalid metric' });
    // simplistic increment/update logic
    let metrics = await prisma.supplierMetrics.findUnique({ where: { supplierId } });
    if (!metrics) {
      metrics = await prisma.supplierMetrics.create({ data: { supplierId, [field]: amount || 1 } });
    } else {
      const updateData = {};
      if (field === 'responseTimeAvg') {
        // naive smoothing: (old + new)/2
        updateData.responseTimeAvg = (metrics.responseTimeAvg + (amount || 0)) / 2;
      } else {
        updateData[field] = (metrics[field] || 0) + (amount || 1);
      }
      metrics = await prisma.supplierMetrics.update({ where: { supplierId }, data: updateData });
    }
    return res.json({ metrics });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to increment metric' });
  }
};

module.exports.startBoost = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const { startDate, endDate, budget } = req.body;
    const boost = await prisma.boostCampaign.create({
      data: { supplierId, startDate: new Date(startDate), endDate: new Date(endDate), budget: parseFloat(budget), status: 'PENDING' }
    });
    return res.json({ boost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to start boost' });
  }
};

module.exports.listBoosts = async (req, res) => {
  try {
    const { supplierId } = req.params;
    const boosts = await prisma.boostCampaign.findMany({ where: { supplierId } });
    return res.json({ boosts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list boosts' });
  }
};
