
const prisma = require("../prisma/client");

module.exports.createEscrow = async (buyerId, sellerId, amount, currency) => {
    return await prisma.escrow.create({
        data: { buyerId, sellerId, amount: parseFloat(amount), currency, milestone: "CREATED" }
    });
};

module.exports.fundEscrow = async (escrowId) => {
    return await prisma.escrow.update({
        where: { id: escrowId },
        data: { milestone: "FUNDED" }
    });
};

module.exports.releasePayment = async (escrowId) => {
    return await prisma.escrow.update({
        where: { id: escrowId },
        data: { milestone: "RELEASED" }
    });
};

module.exports.raiseDispute = async (escrowId, note) => {
    await prisma.escrowLog.create({ data: { escrowId, action: "DISPUTE", note }});
    return await prisma.escrow.update({
        where: { id: escrowId },
        data: { milestone: "DISPUTED" }
    });
};
