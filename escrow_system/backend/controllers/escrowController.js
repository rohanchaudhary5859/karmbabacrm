
const escrow = require("../services/escrowService");

module.exports.create = async (req,res)=>{
    try{
        const { buyerId, sellerId, amount, currency } = req.body;
        const data = await escrow.createEscrow(buyerId, sellerId, amount, currency);
        res.json(data);
    } catch (e){ res.status(500).json({error:"Create escrow failed"}); }
};

module.exports.fund = async (req,res)=>{
    try{
        const { escrowId } = req.body;
        const data = await escrow.fundEscrow(escrowId);
        res.json(data);
    } catch (e){ res.status(500).json({error:"Fund escrow failed"}); }
};

module.exports.release = async (req,res)=>{
    try{
        const { escrowId } = req.body;
        const data = await escrow.releasePayment(escrowId);
        res.json(data);
    } catch (e){ res.status(500).json({error:"Release payment failed"}); }
};

module.exports.dispute = async (req,res)=>{
    try{
        const { escrowId, note } = req.body;
        const data = await escrow.raiseDispute(escrowId, note);
        res.json(data);
    } catch (e){ res.status(500).json({error:"Dispute failed"}); }
};
