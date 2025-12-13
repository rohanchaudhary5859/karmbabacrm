
const prisma = require('../../prisma/client'); // Assume prisma client exported at this path

// Suggest a manager based on category, location and load
module.exports.suggestManager = async (req, res) => {
  try {
    const { category, location } = req.body;
    // Simple suggestion algorithm: find manager with matching zone and least assignments
    let managers = await prisma.accountManager.findMany({
      include: { assignments: true }
    });

    // filter by zone match if possible
    if (location) managers = managers.filter(m => m.zone === location || !m.zone);

    // sort by assignments count
    managers.sort((a,b)=> (a.assignments?.length || 0) - (b.assignments?.length || 0));

    const suggestion = managers[0] || null;
    return res.json({ suggestion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal error' });
  }
};

// Confirm assignment (admin action)
module.exports.confirmAssignment = async (req, res) => {
  try {
    const { supplierId, managerId } = req.body;
    const assignment = await prisma.supplierAssignment.create({
      data: { supplierId, managerId }
    });
    return res.json({ assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to assign' });
  }
};

module.exports.listManagers = async (req, res) => {
  try {
    const managers = await prisma.accountManager.findMany({ include: { assignments: true } });
    res.json(managers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list' });
  }
};

module.exports.qualifyLead = async (req, res) => {
  try {
    const { leadId, questions, status, qualifiedBy, score } = req.body;
    const record = await prisma.leadQualification.create({
      data: { leadId, questions: JSON.stringify(questions), status, qualifiedBy, score }
    });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save qualification' });
  }
};

module.exports.addFollowUp = async (req, res) => {
  try {
    const { supplierId, managerId, message, nextActionAt } = req.body;
    const fu = await prisma.followUp.create({
      data: { supplierId, managerId, message, nextActionAt, status: 'OPEN' }
    });
    res.json(fu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add followup' });
  }
};

module.exports.listFollowUps = async (req, res) => {
  try {
    const { managerId } = req.params;
    const list = await prisma.followUp.findMany({ where: { managerId, status: 'OPEN' } });
    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list followups' });
  }
};

module.exports.weeklyReport = async (req, res) => {
  try {
    const { supplierId } = req.params;
    // compute a simple report by aggregating performance entries in last 7 days
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7*24*60*60*1000);
    const reports = await prisma.performanceReport.findMany({
      where: { supplierId, periodStart: { gte: weekAgo } }
    });
    res.json({ reports });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
