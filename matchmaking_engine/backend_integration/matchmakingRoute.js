
const axios = require("axios");
const express = require("express");
const router = express.Router();

router.post("/get-best", async (req,res)=>{
    try{
        const { lead, suppliers } = req.body;
        const resp = await axios.post("http://localhost:8008/rank", { ...lead, suppliers });
        res.json(resp.data);
    }catch(e){ res.status(500).json({error:"Matchmaking failed"}); }
});

module.exports = router;
