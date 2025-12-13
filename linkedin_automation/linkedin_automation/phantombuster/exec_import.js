
/**
 * This script integrates PhantomBuster to fetch LinkedIn executive data.
 * Use PhantomBuster APIs with your agent ID & API key.
 */

const axios = require("axios");
require("dotenv").config();

const API_KEY = process.env.PHANTOMBUSTER_API_KEY;
const AGENT_ID = process.env.PHANTOMBUSTER_AGENT_ID;

async function runAgent(keyword, location) {
  const res = await axios.post(
    `https://api.phantombuster.com/api/v2/agents/launch`,
    {
      id: AGENT_ID,
      argument: { keyword, location },
    },
    {
      headers: { "X-Phantombuster-Key-1": API_KEY },
    }
  );

  return res.data;
}

module.exports = { runAgent };
