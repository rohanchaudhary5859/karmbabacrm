
const prisma = require('../../prisma/client');
const { runAgent } = require('../../../linkedin_automation/phantombuster/exec_import');

module.exports.importExecutives = async (req, res) => {
  const { keyword, location } = req.body;
  try {
    const phantomRes = await runAgent(keyword, location);
    // phantomRes will contain CSV/json link → fetch & save executives
    // TODO: Parse and save into DB
    return res.json({ success: true, phantomRes });
  } catch (err) {
    console.error("Import Exec Error:", err);
    res.status(500).json({ error: "Failed to fetch executives" });
  }
};

module.exports.sendOutreach = async (req, res) => {
  const { executiveId, message } = req.body;
  try {
    // Save outreach log
    await prisma.executiveOutreachLog.create({
      data: {
        executiveId,
        message,
        status: "SENT",
      },
    });

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to send outreach" });
  }
};
